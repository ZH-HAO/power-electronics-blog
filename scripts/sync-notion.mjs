import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import { writeArchive, readArchive } from './notion-archive.mjs';

const root = process.cwd();
const dist = path.join(root, 'dist');
const archiveDir = path.join(root, 'content', 'notion');
const offline = process.argv.includes('--from-repository');
const blockCache = new Map();
const mediaFiles = new Map();
const assetVersion = process.env.GITHUB_SHA?.slice(0, 12) ?? 'local';
const config = JSON.parse(await fs.readFile(path.join(root, 'content/notion-pages.json'), 'utf8'));
const pages = config.pages ?? [];
const trees = config.trees ?? [];
if (!Array.isArray(pages) || !Array.isArray(trees)) throw new Error('Publication config needs pages and trees arrays.');
if (!pages.length && !trees.length) process.exit(0);
const token = process.env.NOTION_TOKEN;
if (!offline && !token) throw new Error('NOTION_TOKEN is required to sync approved Notion content. Use --from-repository to build saved content without a token.');
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const cleanId = id => String(id ?? '').replaceAll('-', '').toLowerCase();
const validId = id => /^[0-9a-f]{32}$/.test(cleanId(id));
const validSlug = slug => /^[a-z][a-z0-9-]*$/.test(slug ?? '');
const entries = new Map();
const slugs = new Set();
const treeRecords = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function notion(endpoint) {
  for (let attempt = 0; attempt < 7; attempt++) {
    const response = await fetch(`https://api.notion.com/v1/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2026-03-11' }
    });
    if (response.ok) return response.json();
    if ((response.status === 429 || response.status >= 500) && attempt < 6) {
      const retry = Number(response.headers.get('retry-after'));
      await delay(Number.isFinite(retry) && retry > 0 ? retry * 1000 : Math.min(1000 * 2 ** attempt, 12000));
      continue;
    }
    const detail = (await response.text()).slice(0, 350);
    throw new Error(`Notion API ${response.status} reading ${endpoint}: ${detail}`);
  }
}

async function children(id) {
  if (blockCache.has(id)) return blockCache.get(id);
  if (offline) throw new Error(`Missing saved child blocks: ${id}`);
  const all = [];
  let cursor;
  do {
    const query = new URLSearchParams({ page_size: '100' });
    if (cursor) query.set('start_cursor', cursor);
    const data = await notion(`blocks/${id}/children?${query}`);
    all.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  blockCache.set(id, all);
  return all;
}

function pageTitle(page) {
  const property = Object.values(page.properties ?? {}).find(value => value.type === 'title');
  return property?.title?.map(part => part.plain_text).join('') || '未命名笔记';
}

function addEntry(id, slug, category, summary, parentId, treeSlug, page, blocks) {
  const key = cleanId(id);
  if (!validId(key) || !validSlug(slug) || slugs.has(slug)) throw new Error(`Invalid or duplicate publication ID/slug: ${id} / ${slug}`);
  slugs.add(slug);
  const entry = { id: key, slug, category, summary, parentId, treeSlug, title: pageTitle(page), updatedAt: page.last_edited_time ?? null, blocks };
  entries.set(key, entry);
  return entry;
}

for (const item of offline ? [] : pages) {
  if (!validId(item.id) || !validSlug(item.slug)) throw new Error('Every approved page needs a valid id and slug.');
  const page = await notion(`pages/${item.id}`);
  addEntry(item.id, item.slug, item.category || 'Notion精选', item.summary, null, null, page, await children(item.id));
}

async function discoverTree(id, tree, parentId = null, depth = 0) {
  if (depth > 12) throw new Error(`Notion page tree is unexpectedly deep near ${id}`);
  const key = cleanId(id);
  if (entries.has(key)) throw new Error(`Notion page ${id} is listed more than once.`);
  const page = await notion(`pages/${id}`);
  const blocks = await children(id);
  const slug = key === cleanId(tree.id) ? tree.slug : tree.slugOverrides?.[key] || `${tree.slug}-${key.slice(-12)}`;
  const entry = addEntry(id, slug, tree.category || '图论', key === cleanId(tree.id) ? tree.summary : '', parentId, tree.slug, page, blocks);
  treeRecords.push(entry);
  for (const block of blocks) {
    if (block.type === 'child_page') await discoverTree(block.id, tree, key, depth + 1);
    if (block.type === 'child_database') throw new Error(`Child database ${block.id} needs an explicit publishing rule.`);
  }
}
for (const tree of offline ? [] : trees) {
  if (!validId(tree.id) || !validSlug(tree.slug)) throw new Error('Every approved tree needs a valid id and slug.');
  await discoverTree(tree.id, tree);
}
if (offline) {
  const saved = await readArchive(archiveDir, config);
  for (const entry of saved.entries) {
    entries.set(entry.id, entry);
    if (entry.treeSlug) treeRecords.push(entry);
  }
  for (const [id, blocks] of Object.entries(saved.children)) blockCache.set(id, blocks);
}

function publicHref(href) {
  if (offline && typeof href === 'string' && [...entries.values()].some(entry => href === `${entry.slug}.html`)) return href;
  if (!href || !/^https?:\/\//.test(href)) return null;
  try {
    const url = new URL(href);
    if (url.hostname === 'notion.so' || url.hostname.endsWith('.notion.so') || url.hostname === 'app.notion.com' || url.hostname === 'www.notion.so') {
      const id = url.pathname.match(/([0-9a-f]{32})(?:$|\/)/i)?.[1];
      const target = id && entries.get(cleanId(id));
      return target ? `${target.slug}.html` : null;
    }
    return href;
  } catch {
    return null;
  }
}
function richText(items = []) {
  return items.map(item => {
    let value = item.type === 'equation'
      ? `<span class="inline-equation">\\(${escapeHtml(item.equation.expression)}\\)</span>`
      : escapeHtml(item.plain_text ?? item.text?.content ?? '');
    const a = item.annotations ?? {};
    if (a.code) value = `<code>${value}</code>`;
    if (a.bold) value = `<strong>${value}</strong>`;
    if (a.italic) value = `<em>${value}</em>`;
    if (a.strikethrough) value = `<s>${value}</s>`;
    const href = publicHref(item.href ?? item.text?.link?.url);
    return href ? `<a href="${escapeHtml(href)}">${value}</a>` : value;
  }).join('');
}

async function saveMedia(block, kind, slug) {
  const value = block[kind] ?? {};
  if (offline) {
    const name = value.local;
    if (!name || path.basename(name) !== name) throw new Error(`Invalid saved media path in ${block.id}`);
    const directory = path.join(dist, 'notion', 'assets');
    await fs.mkdir(directory, { recursive: true });
    await fs.copyFile(path.join(archiveDir, 'assets', name), path.join(directory, name));
    return `assets/${name}`;
  }
  const source = value.file?.url ?? value.external?.url ?? value.url;
  if (!source) throw new Error(`${kind} ${block.id} has no downloadable URL.`);
  const { data, contentType } = await downloadMedia(source);
  const type = contentType.split(';')[0].toLowerCase();
  const ext = ({
    'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp',
    'image/gif': 'gif', 'image/svg+xml': 'svg', 'application/pdf': 'pdf',
    'video/mp4': 'mp4', 'audio/mpeg': 'mp3'
  })[type] || (kind === 'pdf' ? 'pdf' : kind === 'image' ? 'png' : path.extname(new URL(source).pathname).slice(1).toLowerCase());
  if (!/^[a-z0-9]{2,5}$/.test(ext)) throw new Error(`Unknown ${kind} file type ${type} in ${block.id}`);
  const name = `${slug}-${cleanId(block.id)}.${ext}`;
  const directory = path.join(dist, 'notion', 'assets');
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(path.join(directory, name), data);
  if (data.length >= 95 * 1024 * 1024) throw new Error(`Attachment too large for Git: ${name}`);
  const archiveAssets = path.join(archiveDir, 'assets');
  await fs.mkdir(archiveAssets, { recursive: true });
  await fs.writeFile(path.join(archiveAssets, name), data);
  mediaFiles.set(block.id, name);
  return `assets/${name}`;
}

function downloadMedia(source, redirects = 0) {
  if (redirects > 5) return Promise.reject(new Error('Too many media redirects.'));
  return new Promise((resolve, reject) => {
    const url = new URL(source);
    const client = url.protocol === 'https:' ? https : url.protocol === 'http:' ? http : null;
    if (!client) return reject(new Error(`Unsupported media URL protocol: ${url.protocol}`));
    const request = client.get(url, response => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
        response.resume();
        resolve(downloadMedia(new URL(response.headers.location, url).href, redirects + 1));
        return;
      }
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error(`Media download HTTP ${response.statusCode}: ${url.hostname}`));
        return;
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({
        data: Buffer.concat(chunks),
        contentType: response.headers['content-type'] ?? ''
      }));
      response.on('error', reject);
    });
    request.setTimeout(60000, () => request.destroy(new Error('Media download timed out.')));
    request.on('error', reject);
  });
}

async function renderBlock(block, entry) {
  const value = block[block.type] ?? {};
  const caption = richText(value.caption);
  let html = '';
  switch (block.type) {
    case 'paragraph': html = `<p>${richText(value.rich_text)}</p>`; break;
    case 'heading_1': case 'heading_2': case 'heading_3': case 'heading_4': case 'heading_5': case 'heading_6': {
      const level = Number(block.type.slice(-1));
      const tag = `h${Math.max(2, level)}`;
      html = `<${tag} id="h-${cleanId(block.id)}">${richText(value.rich_text)}</${tag}>`;
      break;
    }
    case 'bulleted_list_item': html = `<ul><li>${richText(value.rich_text)}</li></ul>`; break;
    case 'numbered_list_item': html = `<ol><li>${richText(value.rich_text)}</li></ol>`; break;
    case 'quote': html = `<blockquote>${richText(value.rich_text)}</blockquote>`; break;
    case 'callout': html = `<aside class="note">${richText(value.rich_text)}</aside>`; break;
    case 'code': html = `<pre><code>${escapeHtml(value.rich_text?.map(x => x.plain_text).join('') ?? '')}</code></pre>`; break;
    case 'equation': html = `<div class="formula">\\[${escapeHtml(value.expression)}\\]</div>`; break;
    case 'divider': html = '<hr>'; break;
    case 'image': {
      const src = await saveMedia(block, 'image', entry.slug);
      html = `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(value.caption?.map(x => x.plain_text).join('') ?? '')}" loading="lazy"><figcaption>${caption}</figcaption></figure>`;
      break;
    }
    case 'pdf': case 'file': {
      const src = await saveMedia(block, block.type, entry.slug);
      const label = value.name || value.caption?.map(x => x.plain_text).join('') || (block.type === 'pdf' ? '打开 PDF' : '下载附件');
      html = `<p class="file-link"><a href="${escapeHtml(src)}" target="_blank" rel="noopener">↗ ${escapeHtml(label)}</a>${caption && caption !== escapeHtml(label) ? `<span>${caption}</span>` : ''}</p>`;
      break;
    }
    case 'video': case 'audio': {
      const src = await saveMedia(block, block.type, entry.slug);
      html = block.type === 'video'
        ? `<figure><video controls preload="none" src="${escapeHtml(src)}"></video><figcaption>${caption}</figcaption></figure>`
        : `<figure><audio controls preload="none" src="${escapeHtml(src)}"></audio><figcaption>${caption}</figcaption></figure>`;
      break;
    }
    case 'bookmark': case 'embed': case 'link_preview': {
      const url = value.url;
      if (value.local || url && /[?&]X-Amz-(?:Signature|Credential)=/i.test(url)) {
        const src = await saveMedia(block, block.type, entry.slug);
        html = `<p class="file-link"><a href="${escapeHtml(src)}" target="_blank" rel="noopener">↗ 打开嵌入内容</a></p>`;
        break;
      }
      const href = publicHref(url);
      html = href ? `<p><a href="${escapeHtml(href)}">${escapeHtml(url)}</a></p>` : `<p>${escapeHtml(url ?? '')}</p>`;
      break;
    }
    case 'table': {
      const rows = await children(block.id);
      if (!rows.every(row => row.type === 'table_row')) throw new Error(`Unexpected table child in ${block.id}`);
      html = `<div class="article-table"><table><tbody>${rows.map((row, rowIndex) =>
        `<tr>${row.table_row.cells.map((cell, cellIndex) => {
          const header = (rowIndex === 0 && value.has_column_header) || (cellIndex === 0 && value.has_row_header);
          const tag = header ? 'th' : 'td';
          return `<${tag}${header ? ` scope="${rowIndex === 0 && value.has_column_header ? 'col' : 'row'}"` : ''}>${richText(cell)}</${tag}>`;
        }).join('')}</tr>`).join('')}</tbody></table></div>`;
      return html;
    }
    case 'table_of_contents': {
      const headings = entry.blocks.filter(b => /^heading_/.test(b.type));
      html = `<nav class="inline-toc" aria-label="本页目录"><strong>本页目录</strong><ul>${headings.map(h =>
        `<li><a href="#h-${cleanId(h.id)}">${richText(h[h.type].rich_text)}</a></li>`).join('')}</ul></nav>`;
      break;
    }
    case 'child_page': {
      const child = entries.get(cleanId(block.id));
      if (!child) throw new Error(`Child page ${block.id} was not discovered.`);
      html = `<p class="child-link"><a href="${escapeHtml(child.slug)}.html">↗ ${escapeHtml(child.title)}</a></p>`;
      break;
    }
    case 'link_to_page': {
      const child = entries.get(cleanId(value.page_id));
      html = child ? `<p class="child-link"><a href="${escapeHtml(child.slug)}.html">↗ ${escapeHtml(child.title)}</a></p>` : '';
      break;
    }
    case 'toggle': html = `<details><summary>${richText(value.rich_text)}</summary>`; break;
    case 'column_list': html = '<div class="notion-columns">'; break;
    case 'column': html = '<div class="notion-column">'; break;
    case 'synced_block': html = ''; break;
    default: throw new Error(`Unsupported Notion block type ${block.type} in ${block.id}; publication stopped.`);
  }
  if (block.has_children && !['child_page', 'child_database', 'table', 'table_of_contents'].includes(block.type)) {
    html += await renderBlocks(await children(block.id), entry);
  }
  if (block.type === 'toggle') html += '</details>';
  if (block.type === 'column_list' || block.type === 'column') html += '</div>';
  return html;
}
async function renderBlocks(blocks, entry) {
  const parts = [];
  for (const block of blocks) parts.push(await renderBlock(block, entry));
  return parts.join('\n');
}

const articleDir = path.join(dist, 'notion');
// Rebuild generated directories so removed pages and attachments do not remain online.
await fs.rm(articleDir, { recursive: true, force: true });
await fs.mkdir(articleDir, { recursive: true });
const dateLabel = iso => iso ? new Intl.DateTimeFormat('zh-CN', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date(iso)) : '未记录日期';
const header = (prefix, active) => `<header class="topbar"><div class="shell topbar-inner"><a class="brand" href="${prefix}index.html" aria-label="ZH-HAO 学习手记首页"><span class="brand-mark">ZH</span><span>ZH-HAO <span class="brand-slash">/</span> learning-notes</span></a><a class="header-github" href="https://github.com/ZH-HAO" target="_blank" rel="noopener">GitHub 主页 ↗</a></div></header><nav class="tabbar" aria-label="主要栏目"><div class="shell tab-inner"><a class="tab${active ? '' : ' active'}" href="${prefix}index.html"${active ? '' : ' aria-current="page"'}>◫ <span>概览</span></a>${trees.map(tree => `<a class="tab${active === tree.slug ? ' active' : ''}" href="${prefix}${escapeHtml(tree.slug)}/index.html"${active === tree.slug ? ' aria-current="page"' : ''}>${tree.slug === 'power-electronics' ? '⌁' : '◇'} <span>${escapeHtml(tree.category)}</span></a>`).join('')}</div></nav>`;
const footer = `<footer class="footer"><div class="shell footer-inner"><span>© 2026 ZH-HAO · 学习手记</span><span>电力电子 · 图论</span></div></footer>`;
for (const entry of entries.values()) {
  const body = await renderBlocks(entry.blocks, entry);
  const description = escapeHtml(entry.summary || `${entry.title}｜学习笔记`);
  const categoryLink = entry.treeSlug ? `../${entry.treeSlug}/index.html` : '../index.html';
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f8fa"><meta name="description" content="${description}"><title>${escapeHtml(entry.title)} · ZH-HAO 学习手记</title><link rel="icon" href="../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../style.css?v=${assetVersion}"><script defer src="../app.js?v=${assetVersion}"></script><script defer src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js"></script></head><body><div class="reading-progress"></div>${header('../', entry.treeSlug)}<main class="shell article-main"><div class="breadcrumbs"><a href="../index.html">概览</a><span>/</span><a href="${categoryLink}">${escapeHtml(entry.category)}</a><span>/</span><span>${escapeHtml(entry.title)}</span></div><div class="article-heading"><span class="file-pill">▤ Notion 笔记</span><h1>${escapeHtml(entry.title)}</h1><div class="article-info"><span>${escapeHtml(entry.category)}</span><span>最后更新：${escapeHtml(dateLabel(entry.updatedAt))}</span></div></div><article class="article-body">${body}</article><div class="article-bottom"><a href="${categoryLink}">← 返回${escapeHtml(entry.category)}专栏</a></div></main>${footer}</body></html>`;
  await fs.writeFile(path.join(articleDir, `${entry.slug}.html`), html);
  console.log(`Built ${entry.slug}: ${entry.title}`);
}

for (const tree of trees) {
  const section = treeRecords.filter(entry => entry.treeSlug === tree.slug);
  const sectionDir = path.join(dist, tree.slug);
  await fs.mkdir(sectionDir, { recursive: true });
  const rootEntry = section.find(entry => !entry.parentId);
  if (!rootEntry) throw new Error(`No root page was found for ${tree.slug}`);
  const itemHtml = entry => {
    const kids = section.filter(child => child.parentId === entry.id);
    return `<li><a class="tree-row" href="../notion/${escapeHtml(entry.slug)}.html"><span class="tree-main"><span class="tree-icon">${kids.length ? '▣' : '▤'}</span><span>${escapeHtml(entry.title)}</span></span><time datetime="${escapeHtml(entry.updatedAt?.slice(0, 10) ?? '')}">${escapeHtml(dateLabel(entry.updatedAt))}</time></a>${kids.length ? `<ul>${kids.map(itemHtml).join('')}</ul>` : ''}</li>`;
  };
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f6f8fa"><meta name="description" content="${escapeHtml(tree.summary)}"><title>${escapeHtml(tree.category)} · ZH-HAO 学习手记</title><link rel="icon" href="../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../style.css?v=${assetVersion}"><script defer src="../app.js?v=${assetVersion}"></script></head><body>${header('../', tree.slug)}<main class="shell hub-main"><div class="breadcrumbs"><a href="../index.html">概览</a><span>/</span><span>${escapeHtml(tree.category)}</span></div><div class="repo-heading"><div class="repo-title"><span class="repo-icon">${tree.slug === 'power-electronics' ? '⌁' : '◇'}</span><span>ZH-HAO <span class="repo-divider">/</span> <strong>${escapeHtml(tree.category)}</strong></span><span class="public-badge">公开</span></div><p>${escapeHtml(tree.summary)}</p><div class="repo-facts"><span>${section.length} 篇笔记</span><span>·</span><span>来源：Notion「${escapeHtml(rootEntry.title)}」</span></div></div><div class="directory-panel"><div class="directory-toolbar"><span>▣ 专栏目录</span><span>${section.length} 个页面</span></div><ul class="file-tree">${itemHtml(rootEntry)}</ul></div></main>${footer}</body></html>`;
  await fs.writeFile(path.join(sectionDir, 'index.html'), html);
}

const collections = trees.map(tree => {
  const count = treeRecords.filter(entry => entry.treeSlug === tree.slug).length;
  const topicClass = tree.slug === 'power-electronics' ? 'power' : 'graph';
  return `<a class="repo-card" href="${escapeHtml(tree.slug)}/index.html"><div class="repo-card-head"><span class="repo-icon">${topicClass === 'power' ? '⌁' : '◇'}</span><span class="repo-name">${escapeHtml(tree.category)}</span><span class="public-badge">公开</span></div><p>${escapeHtml(tree.summary)}</p><div class="repo-card-foot"><span class="topic-dot ${topicClass}"></span>${escapeHtml(tree.category)} <span>·</span> ${count} 篇笔记</div></a>`;
}).join('');
const featureText = {
  'single-inductor-model': 'Buck、Boost 与反相 Buck-Boost 的统一分析',
  'dual-inductor-model': '双电感结构的基本理论与工作过程',
  'graph-symbols': '常用记号、术语与公式速查',
  'graph-summary': '第一至七章的概念、定理与推论'
};
const featured = Object.entries(featureText).map(([slug, summary]) => {
  const entry = [...entries.values()].find(item => item.slug === slug);
  if (!entry) return '';
  return `<a class="repo-card note-card" href="notion/${escapeHtml(entry.slug)}.html"><div class="repo-card-head"><span class="repo-icon">▤</span><span class="repo-name">${escapeHtml(entry.title)}</span></div><p>${escapeHtml(summary)}</p><div class="repo-card-foot"><span class="topic-dot ${entry.treeSlug === 'power-electronics' ? 'power' : 'graph'}"></span>${escapeHtml(entry.category)} <span>·</span> ${escapeHtml(dateLabel(entry.updatedAt))}</div></a>`;
}).join('');
const recent = [...entries.values()].filter(entry => entry.parentId).sort((a, b) =>
  String(b.updatedAt ?? '').localeCompare(String(a.updatedAt ?? ''))).slice(0, 6).map(entry =>
    `<a class="recent-row" href="notion/${escapeHtml(entry.slug)}.html"><span class="recent-title"><span class="tree-icon">▤</span>${escapeHtml(entry.title)}<small>${escapeHtml(entry.category)}</small></span><time datetime="${escapeHtml(entry.updatedAt?.slice(0, 10) ?? '')}">${escapeHtml(dateLabel(entry.updatedAt))}</time></a>`
  ).join('');
function chinaDay(value) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(value)).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
const editCounts = new Map();
for (const entry of entries.values()) {
  if (!entry.updatedAt) continue;
  const day = chinaDay(entry.updatedAt);
  editCounts.set(day, (editCounts.get(day) ?? 0) + 1);
}
const dayMs = 24 * 60 * 60 * 1000;
const today = new Date(`${chinaDay(new Date())}T00:00:00Z`);
const firstDay = today.getTime() - 363 * dayMs;
const activity = `<div class="activity-chart"><div class="activity-weekdays"><span>一</span><span>三</span><span>五</span></div><div class="activity-grid">${Array.from({ length: 52 }, (_, week) =>
  `<div class="activity-week">${Array.from({ length: 7 }, (_, day) => {
    const date = new Date(firstDay + (week * 7 + day) * dayMs).toISOString().slice(0, 10);
    const count = editCounts.get(date) ?? 0;
    const level = count === 0 ? 0 : count === 1 ? 1 : count <= 3 ? 2 : 3;
    return `<span class="activity-day level-${level}" title="${date} · ${count} 篇笔记的最后编辑日期" aria-label="${date}：${count} 篇"></span>`;
  }).join('')}</div>`).join('')}</div></div>`;
const homePath = path.join(dist, 'index.html');
let home = await fs.readFile(homePath, 'utf8');
function replaceSlot(name, html) {
  const start = `<!-- ${name}_START -->`;
  const end = `<!-- ${name}_END -->`;
  if (!home.includes(start) || !home.includes(end)) throw new Error(`Homepage slot ${name} not found.`);
  home = home.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}${html}${end}`);
}
replaceSlot('PROFILE_STATS', `<strong>${trees.length}</strong> 个专栏 · <strong>${entries.size}</strong> 篇笔记`);
replaceSlot('COLLECTIONS', collections);
replaceSlot('FEATURED', featured);
replaceSlot('ACTIVITY', activity);
replaceSlot('RECENT', recent);
home = home.replaceAll('__ASSET_VERSION__', assetVersion);
await fs.writeFile(homePath, home);
if (!offline) await writeArchive({ archiveDir, entries: [...entries.values()], blockCache, mediaFiles, config, publicHref });
console.log(`Published ${entries.size} approved Notion pages across ${trees.length} sections.`);
