import fs from 'node:fs/promises';
import path from 'node:path';

const json = value => `${JSON.stringify(value, null, 2)}\n`;
const mediaKinds = new Set(['image', 'pdf', 'file', 'video', 'audio']);
const html = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const mdEscape = text => String(text ?? '').replace(/([\\`*_[\]<>])/g, '\\$1');
const markdownHref = href => href?.replace(/\.html(?=#|$)/, '.md');

// Store only content used by the publisher. API user metadata and expiring file URLs
// must never become part of the public repository.
export async function writeArchive({ archiveDir, entries, blockCache, mediaFiles, config, publicHref }) {
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const rich = items => (items ?? []).map(item => {
    const result = { type: item.type === 'equation' ? 'equation' : 'text', plain_text: item.plain_text ?? item.text?.content ?? '' };
    if (item.annotations) result.annotations = item.annotations;
    if (item.type === 'equation') result.equation = { expression: item.equation.expression };
    const href = publicHref(item.href ?? item.text?.link?.url);
    if (href) result.href = href;
    return result;
  });
  const block = original => {
    const { id, type, has_children = false } = original;
    const source = original[type] ?? {};
    const data = {};
    for (const key of ['rich_text', 'caption']) if (source[key]) data[key] = rich(source[key]);
    for (const key of ['expression', 'language', 'checked', 'has_column_header', 'has_row_header', 'title']) {
      if (source[key] !== undefined) data[key] = source[key];
    }
    if (source.cells) data.cells = source.cells.map(rich);
    if (source.url && !mediaFiles.has(id)) data.url = publicHref(source.url);
    if (type === 'link_to_page' && byId.has(source.page_id?.replaceAll('-', ''))) data.page_id = source.page_id;
    if (mediaKinds.has(type) || mediaFiles.has(id)) {
      data.local = mediaFiles.get(id);
      if (!data.local) throw new Error(`Missing downloaded attachment ${id}`);
      if (source.name) data.name = source.name;
    }
    return { id, type, has_children, [type]: data };
  };
  const savedEntries = entries.map(({ blocks, ...entry }) => ({ ...entry, blocks: blocks.map(block) }));
  const savedChildren = Object.fromEntries([...blockCache].sort(([a], [b]) => a.localeCompare(b)).map(([id, blocks]) => [id, blocks.map(block)]));
  const snapshot = { version: 1, publicationConfig: config, entries: savedEntries, children: savedChildren };
  await fs.mkdir(archiveDir, { recursive: true });
  for (const entry of savedEntries) {
    const content = `# ${entry.title}\n\n> 专栏：${entry.category} · Notion 最后编辑：${entry.updatedAt ?? '未记录'}\n>\n> 来源：https://www.notion.so/${entry.id}\n\n${markdownBlocks(entry.blocks, snapshot)}\n`;
    await fs.writeFile(path.join(archiveDir, `${entry.slug}.md`), content);
  }
  const manifest = {
    version: 1,
    pages: savedEntries.map(({ id, slug, title, category, parentId, treeSlug, updatedAt }) => ({ id, slug, title, category, parentId, treeSlug, updatedAt, file: `${slug}.md` })),
    assets: [...mediaFiles.values()].sort()
  };
  // Remove only obsolete files inside the generated archive, after a complete export.
  const allowed = new Set(['snapshot.json', 'manifest.json', 'README.md', 'assets', ...savedEntries.map(entry => `${entry.slug}.md`)]);
  for (const name of await fs.readdir(archiveDir)) {
    if (!allowed.has(name)) await fs.rm(path.join(archiveDir, name), { force: true });
  }
  const assetDir = path.join(archiveDir, 'assets');
  await fs.mkdir(assetDir, { recursive: true });
  const keptAssets = new Set(manifest.assets);
  for (const name of await fs.readdir(assetDir)) if (!keptAssets.has(name)) await fs.unlink(path.join(assetDir, name));
  await fs.writeFile(path.join(archiveDir, 'snapshot.json'), json(snapshot));
  await fs.writeFile(path.join(archiveDir, 'manifest.json'), json(manifest));
  const sections = config.trees.map(tree => `## ${tree.category}\n\n${savedEntries.filter(entry => entry.treeSlug === tree.slug).map(entry => `- [${entry.title}](${entry.slug}.md)`).join('\n')}`).join('\n\n');
  await fs.writeFile(path.join(archiveDir, 'README.md'), `# Notion 笔记归档\n\n这里保存获准公开的 Notion 笔记及附件。请在 Notion 中编辑正文，同步时会更新这些生成文件。\n\nMarkdown 用于直接阅读；snapshot.json 保留网页构建所需的结构；assets/ 保存图片和附件。\n\n${sections}\n`);
  console.log(`Archived ${savedEntries.length} Markdown notes and ${manifest.assets.length} attachments.`);
}

export async function readArchive(archiveDir, config) {
  const snapshot = JSON.parse(await fs.readFile(path.join(archiveDir, 'snapshot.json'), 'utf8'));
  if (snapshot.version !== 1) throw new Error('Unsupported Notion archive version.');
  if (JSON.stringify(snapshot.publicationConfig) !== JSON.stringify(config)) throw new Error('Publication scope changed: sync Notion before rebuilding saved content.');
  return snapshot;
}

function markdownBlocks(blocks, snapshot, tableCell = false) {
  const rich = items => (items ?? []).map(item => {
    if (item.type === 'equation') return `$${item.equation.expression}$`;
    let text = mdEscape(item.plain_text);
    const a = item.annotations ?? {};
    if (a.code) {
      const raw = item.plain_text ?? '';
      const fence = '`'.repeat(Math.max(0, ...(raw.match(/`+/g) ?? []).map(x => x.length)) + 1);
      text = `${fence} ${raw} ${fence}`;
    }
    if (a.bold) text = `**${text}**`;
    if (a.italic) text = `*${text}*`;
    if (a.strikethrough) text = `~~${text}~~`;
    return item.href ? `[${text}](<${markdownHref(item.href)}>)` : text;
  }).join('');
  const indent = text => text.split('\n').map(line => `    ${line}`).join('\n');
  let number = 0;
  return blocks.map(block => {
    const value = block[block.type] ?? {};
    const caption = rich(value.caption);
    const childBlocks = block.has_children && !['child_page', 'table_of_contents'].includes(block.type)
      ? snapshot.children[block.id] ?? [] : [];
    const nested = childBlocks.length ? markdownBlocks(childBlocks, snapshot) : '';
    if (block.type !== 'numbered_list_item') number = 0;
    let result;
    switch (block.type) {
      case 'paragraph': result = rich(value.rich_text); break;
      case 'heading_1': case 'heading_2': case 'heading_3': case 'heading_4': case 'heading_5': case 'heading_6':
        result = `${'#'.repeat(Math.min(6, Number(block.type.slice(-1)) + 1))} ${rich(value.rich_text)}`; break;
      case 'bulleted_list_item': return `- ${rich(value.rich_text)}${nested ? `\n${indent(nested)}` : ''}`;
      case 'numbered_list_item': return `${++number}. ${rich(value.rich_text)}${nested ? `\n${indent(nested)}` : ''}`;
      case 'quote': case 'callout': return `${rich(value.rich_text)}${nested ? `\n\n${nested}` : ''}`.split('\n').map(line => `> ${line}`).join('\n');
      case 'code': {
        const raw = (value.rich_text ?? []).map(item => item.plain_text).join('');
        const fence = '`'.repeat(Math.max(2, ...(raw.match(/`+/g) ?? []).map(x => x.length)) + 1);
        const language = /^[a-z0-9+#.-]+$/i.test(value.language) ? value.language : '';
        result = `${fence}${language}\n${raw}\n${fence}`;
        break;
      }
      case 'equation': result = `$$\n${value.expression}\n$$`; break;
      case 'divider': result = '---'; break;
      case 'image': result = `![${(value.caption ?? []).map(item => mdEscape(item.plain_text)).join('')}](assets/${value.local})${caption ? `\n\n${caption}` : ''}`; break;
      case 'pdf': case 'file': case 'video': case 'audio': result = `[${mdEscape(value.name || '打开附件')}](assets/${value.local})${caption ? `\n\n${caption}` : ''}`; break;
      case 'bookmark': case 'embed': case 'link_preview': result = value.local ? `[打开嵌入内容](assets/${value.local})` : value.url ? `[${mdEscape(value.url)}](<${markdownHref(value.url)}>)` : ''; break;
      case 'child_page': case 'link_to_page': {
        const id = (block.type === 'child_page' ? block.id : value.page_id)?.replaceAll('-', '');
        const child = snapshot.entries.find(entry => entry.id === id);
        return child ? `[${mdEscape(child.title)}](${child.slug}.md)` : '';
      }
      case 'table': {
        // HTML tables retain Notion's optional row/column headers and multiline cells.
        return `<table>\n${childBlocks.map((row, ri) => `<tr>${row.table_row.cells.map((cell, ci) => {
          const tag = ri === 0 && value.has_column_header || ci === 0 && value.has_row_header ? 'th' : 'td';
          const content = cell.map(item => {
            if (item.type === 'equation') return `$${html(item.equation.expression)}$`;
            const text = html(item.plain_text).replaceAll('\n', '<br>');
            return item.href ? `<a href="${html(markdownHref(item.href))}">${text}</a>` : text;
          }).join('');
          return `<${tag}>${content}</${tag}>`;
        }).join('')}</tr>`).join('\n')}\n</table>`;
      }
      case 'toggle': return `**${rich(value.rich_text)}**${nested ? `\n\n${nested}` : ''}`;
      case 'table_of_contents': return '<!-- 目录由各级标题表示 -->';
      case 'column_list': case 'column': case 'synced_block': return nested;
      case 'table_row': return ''; // handled by the parent table
      default: throw new Error(`Markdown export does not support ${block.type}.`);
    }
    return `${result}${nested ? `\n\n${nested}` : ''}`;
  }).join(tableCell ? '<br>' : '\n\n');
}
