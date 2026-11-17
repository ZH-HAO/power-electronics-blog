import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const config = JSON.parse(await fs.readFile(path.join(root, 'content/notion-pages.json'), 'utf8'));
const pages = config.pages;
if (!Array.isArray(pages)) throw new Error('content/notion-pages.json must contain a pages array.');
if (pages.length === 0) {
  console.log('No Notion pages approved for publication; keeping the current static articles.');
  process.exit(0);
}
const token = process.env.NOTION_TOKEN;
if (!token) throw new Error('NOTION_TOKEN is required when approved pages are listed.');
const slugs = new Set();
for (const page of pages) {
  if (!/^[0-9a-f-]{32,36}$/i.test(page.id ?? '')) throw new Error('Each page needs a Notion page ID.');
  if (!/^[a-z][a-z0-9-]*$/.test(page.slug ?? '') || slugs.has(page.slug)) throw new Error('Each page needs a unique lowercase ASCII slug.');
  slugs.add(page.slug);
}

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function notion(endpoint) {
  const response = await fetch(`https://api.notion.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2026-03-11' }
  });
  if (!response.ok) throw new Error(`Notion API ${response.status} while reading ${endpoint}`);
  return response.json();
}
async function children(id) {
  const all = [];
  let cursor;
  do {
    const query = new URLSearchParams({ page_size: '100' });
    if (cursor) query.set('start_cursor', cursor);
    const data = await notion(`blocks/${id}/children?${query}`);
    all.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return all;
}
function richText(items = []) {
  return items.map(item => {
    let content = item.type === 'equation' ? `<span class="inline-equation">\\(${escapeHtml(item.equation.expression)}\\)</span>` : escapeHtml(item.plain_text ?? item.text?.content ?? '');
    const a = item.annotations ?? {};
    if (a.code) content = `<code>${content}</code>`;
    if (a.bold) content = `<strong>${content}</strong>`;
    if (a.italic) content = `<em>${content}</em>`;
    if (a.strikethrough) content = `<s>${content}</s>`;
    const href = item.href ?? item.text?.link?.url;
    if (href && /^https?:\/\//.test(href)) content = `<a href="${escapeHtml(href)}">${content}</a>`;
    return content;
  }).join('');
}
async function imageHtml(block, slug) {
  const data = block.image;
  let src = data.external?.url;
  if (data.file?.url) {
    const response = await fetch(data.file.url);
    if (!response.ok) throw new Error(`Unable to download image ${block.id}`);
    const type = response.headers.get('content-type')?.split(';')[0] ?? '';
    const ext = ({'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif','image/svg+xml':'svg'})[type];
    if (!ext) throw new Error(`Unsupported image type ${type} in ${block.id}`);
    const assetDir = path.join(dist, 'notion', 'assets');
    await fs.mkdir(assetDir, { recursive: true });
    const filename = `${slug}-${block.id}.${ext}`;
    await fs.writeFile(path.join(assetDir, filename), Buffer.from(await response.arrayBuffer()));
    src = `assets/${filename}`;
  }
  if (!src) throw new Error(`Image ${block.id} has no usable URL.`);
  return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(data.caption?.map(x=>x.plain_text).join('') ?? '')}" loading="lazy"><figcaption>${richText(data.caption)}</figcaption></figure>`;
}
async function renderBlock(block, slug) {
  const value = block[block.type] ?? {};
  let html;
  switch (block.type) {
    case 'paragraph': html = `<p>${richText(value.rich_text)}</p>`; break;
    case 'heading_1': html = `<h2>${richText(value.rich_text)}</h2>`; break;
    case 'heading_2': html = `<h2>${richText(value.rich_text)}</h2>`; break;
    case 'heading_3': html = `<h3>${richText(value.rich_text)}</h3>`; break;
    case 'bulleted_list_item': html = `<ul><li>${richText(value.rich_text)}</li></ul>`; break;
    case 'numbered_list_item': html = `<ol><li>${richText(value.rich_text)}</li></ol>`; break;
    case 'quote': html = `<blockquote>${richText(value.rich_text)}</blockquote>`; break;
    case 'callout': html = `<aside class="note">${richText(value.rich_text)}</aside>`; break;
    case 'code': html = `<pre><code>${escapeHtml(value.rich_text?.map(x=>x.plain_text).join('') ?? '')}</code></pre>`; break;
    case 'equation': html = `<div class="formula">\\[${escapeHtml(value.expression)}\\]</div>`; break;
    case 'divider': html = '<hr>'; break;
    case 'image': html = await imageHtml(block, slug); break;
    case 'table': {
      const rows = await children(block.id);
      if (!rows.every(row => row.type === 'table_row')) throw new Error(`Unexpected table child in ${block.id}`);
      const rowHtml = rows.map((row, rowIndex) => {
        const cells = row.table_row.cells.map((cell, cellIndex) => {
          const isHeader = (rowIndex === 0 && value.has_column_header) || (cellIndex === 0 && value.has_row_header);
          const tag = isHeader ? 'th' : 'td';
          const scope = isHeader ? ` scope="${rowIndex === 0 && value.has_column_header ? 'col' : 'row'}"` : '';
          return `<${tag}${scope}>${richText(cell)}</${tag}>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div class="article-table"><table><tbody>${rowHtml}</tbody></table></div>`;
    }
    case 'child_page': case 'child_database': return ''; // Approval is per page, never recursive.
    default: throw new Error(`Unsupported Notion block type ${block.type} in ${block.id}; publication stopped.`);
  }
  if (block.has_children) {
    const nested = await renderBlocks(await children(block.id), slug);
    html += nested;
  }
  return html;
}
async function renderBlocks(blocks, slug) {
  return (await Promise.all(blocks.map(block => renderBlock(block, slug)))).join('\n');
}
function pageTitle(page) {
  const title = Object.values(page.properties ?? {}).find(property => property.type === 'title');
  return title?.title?.map(part => part.plain_text).join('') || '未命名笔记';
}
const cards = [];
await fs.mkdir(path.join(dist, 'notion'), { recursive: true });
for (const entry of pages) {
  const page = await notion(`pages/${entry.id}`);
  const title = pageTitle(page);
  const body = await renderBlocks(await children(entry.id), entry.slug);
  const description = escapeHtml(entry.summary || `${title}｜开关之间`);
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${description}"><title>${escapeHtml(title)}｜开关之间</title><link rel="stylesheet" href="../style.css"><script defer src="../app.js"></script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js"></script></head><body><div class="reading-progress"></div><header class="site-header"><div class="shell nav-wrap"><a class="logo" href="../index.html"><span class="logo-mark">∿</span><span>开关之间<small>POWER ELECTRONICS NOTES</small></span></a><nav class="nav-links"><a href="../index.html#articles">文章</a><a href="../index.html#roadmap">学习路线</a><a href="../index.html#about">关于</a></nav></div></header><main class="shell"><div class="article-hero"><a class="back" href="../index.html#articles">← 返回所有笔记</a><div class="eyebrow" style="margin-top:35px">NOTION / 已选公开笔记</div><h1>${escapeHtml(title)}</h1><p>${description}</p><div class="meta"><span>来源：经选择的 Notion 页面</span></div></div><div class="article-layout"><article class="article-body">${body}</article></div></main><footer class="site-footer"><div class="shell foot-wrap"><p>© 2026 WAYNEY · 开关之间</p><a href="../index.html">返回首页 ↑</a></div></footer></body></html>`;
  await fs.writeFile(path.join(dist, 'notion', `${entry.slug}.html`), html);
  cards.push(`<a class="card" href="notion/${escapeHtml(entry.slug)}.html" data-category="Notion精选" data-title="${escapeHtml(title)}"><div class="card-num"><span>NOTION / 已选公开</span><span>Notion精选</span></div><h3>${escapeHtml(title)}</h3><p>${description}</p><div class="card-foot"><span>来自 Notion</span><span>阅读全文 ↗</span></div></a>`);
}
const homePath = path.join(dist, 'index.html');
const home = await fs.readFile(homePath, 'utf8');
const start = '<!-- NOTION_POSTS_START -->';
const end = '<!-- NOTION_POSTS_END -->';
const marker = `${start}${cards.join('')}${end}`;
const updated = home.includes(start)
  ? home.replace(new RegExp(`${start}[\\s\\S]*?${end}`), marker)
  : home.replace('<p class="empty" hidden>', `${marker}<p class="empty" hidden>`);
if (updated === home && !home.includes(start)) throw new Error('Homepage insertion point not found.');
await fs.writeFile(homePath, updated);
console.log(`Built ${pages.length} approved Notion article(s).`);

