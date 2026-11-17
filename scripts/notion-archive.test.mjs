import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { writeArchive, readArchive } from './notion-archive.mjs';

test('archive preserves notes, nested content, local attachments and offline rebuilds without leaking API metadata', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'notion-archive-'));
  try {
    const archiveDir = path.join(root, 'content/notion');
    await fs.mkdir(path.join(archiveDir, 'assets'), { recursive: true });
    await fs.writeFile(path.join(archiveDir, 'assets/image.png'), Buffer.from([1, 2, 3]));
    await fs.writeFile(path.join(archiveDir, 'assets/interactive.html'), '<h1>Interactive</h1>');
    await fs.writeFile(path.join(archiveDir, 'assets/stale.png'), 'old');
    await fs.writeFile(path.join(archiveDir, 'removed.md'), 'old note');
    const rich = text => [{ type: 'text', plain_text: text, text: { content: text } }];
    const blocks = [
      { id: 'p', type: 'paragraph', paragraph: { rich_text: [...rich('正文'), { ...rich('另一篇')[0], href: 'https://www.notion.so/child' }, { ...rich('未授权链接')[0], href: 'https://www.notion.so/private' }] }, created_by: { id: 'PRIVATE_USER' } },
      { id: 'i', type: 'image', image: { file: { url: 'https://example.com/file?X-Amz-Signature=SECRET' }, caption: rich('配图') } },
      { id: 'embed', type: 'embed', embed: { url: 'https://example.com/interactive.html?X-Amz-Signature=SECRET' } },
      { id: 't', type: 'toggle', has_children: true, toggle: { rich_text: rich('推导') } },
      { id: 'table', type: 'table', has_children: true, table: { has_column_header: true } },
      { id: 'child', type: 'child_page', child_page: { title: '子页' } }
    ];
    const child = { id: 'child', slug: 'child', title: '子页', category: '图论', parentId: 'root', treeSlug: 'graph-theory', updatedAt: '2026-11-17T00:00:00Z', blocks: [] };
    const entry = { ...child, id: 'root', slug: 'graph-theory', title: '图论', parentId: null, blocks };
    const blockCache = new Map([
      ['root', blocks], ['child', []],
      ['t', [{ id: 'e', type: 'equation', equation: { expression: 'V_o = D V_i' } }]],
      ['table', [{ id: 'row', type: 'table_row', table_row: { cells: [rich('符号'), rich('解释')] } }]]
    ]);
    const config = { pages: [], trees: [{ id: 'root', slug: 'graph-theory', category: '图论', summary: '学习笔记' }] };
    const args = { archiveDir, entries: [entry, child], blockCache, mediaFiles: new Map([['i', 'image.png'], ['embed', 'interactive.html']]), config, publicHref: href => href === 'https://www.notion.so/child' ? 'child.html' : null };
    await writeArchive(args);
    const first = await fs.readFile(path.join(archiveDir, 'snapshot.json'), 'utf8');
    assert.doesNotMatch(first, /PRIVATE_USER|X-Amz|SECRET|notion\.so\/private/);
    const markdown = await fs.readFile(path.join(archiveDir, 'graph-theory.md'), 'utf8');
    assert.match(markdown, /\[另一篇\]\(<child\.md>\)/);
    assert.match(markdown, /\$\$\nV_o = D V_i\n\$\$/);
    assert.match(markdown, /<th>符号<\/th>/);
    assert.match(markdown, /assets\/image\.png/);
    assert.match(markdown, /\[子页\]\(child\.md\)/);
    await assert.rejects(fs.access(path.join(archiveDir, 'removed.md')));
    await assert.rejects(fs.access(path.join(archiveDir, 'assets/stale.png')));
    await writeArchive(args);
    assert.equal(await fs.readFile(path.join(archiveDir, 'snapshot.json'), 'utf8'), first, 'unchanged sync must be deterministic');
    await assert.rejects(readArchive(archiveDir, { pages: [], trees: [] }), /scope changed/);
    await fs.mkdir(path.join(root, 'dist/notion/assets'), { recursive: true });
    await fs.writeFile(path.join(root, 'dist/notion/removed.html'), 'old page');
    await fs.writeFile(path.join(root, 'dist/notion/assets/old.png'), 'old attachment');
    await fs.writeFile(path.join(root, 'content/notion-pages.json'), JSON.stringify(config));
    await fs.writeFile(path.join(root, 'dist/index.html'), ['PROFILE_STATS', 'COLLECTIONS', 'FEATURED', 'ACTIVITY', 'RECENT'].map(slot => `<!-- ${slot}_START --><!-- ${slot}_END -->`).join('\n'));
    const env = { ...process.env };
    delete env.NOTION_TOKEN;
    const build = spawnSync(process.execPath, [fileURLToPath(new URL('./sync-notion.mjs', import.meta.url)), '--from-repository'], { cwd: root, env, encoding: 'utf8' });
    assert.equal(build.status, 0, build.stderr || build.stdout);
    const output = await fs.readFile(path.join(root, 'dist/notion/graph-theory.html'), 'utf8');
    assert.match(output, /V_o = D V_i/);
    assert.match(output, /child\.html/);
    assert.match(output, /<a href="child.html">另一篇<\/a>/);
    assert.match(output, /href="assets\/interactive.html"/);
    assert.equal(await fs.readFile(path.join(root, 'dist/notion/assets/interactive.html'), 'utf8'), '<h1>Interactive</h1>');
    assert.deepEqual(await fs.readFile(path.join(root, 'dist/notion/assets/image.png')), Buffer.from([1, 2, 3]));
    await assert.rejects(fs.access(path.join(root, 'dist/notion/removed.html')));
    await assert.rejects(fs.access(path.join(root, 'dist/notion/assets/old.png')));
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
