# 开关之间｜学习笔记

公开博客：https://zh-hao.github.io/power-electronics-blog/

图论目录：https://zh-hao.github.io/power-electronics-blog/graph-theory/

## 发布

推送到 `main` 后，GitHub Actions 从 Notion 读取已批准的内容，生成静态网页并发布到 GitHub Pages。也可在仓库的 **Actions → Publish blog to GitHub Pages → Run workflow** 手动同步。Notion 中的修改不会自动触发 GitHub Actions。

## Notion 内容范围

`content/notion-pages.json` 的 `pages` 列出单独公开的笔记。`trees` 列出获准整体公开的页面树。目前仅「图论」顶层页面及其全部子页面自动进入公开博客，包括以后在该页面树中新建的子页面。其他 Notion 页面不会因为名称包含“图论”而被纳入。移出「图论」页面树的页面在下次构建时会退出目录；若曾公开，其旧网址和被下载的附件可能仍保留在搜索引擎或第三方缓存。

图片、PDF 等附件在构建时复制到静态站点。站内 Notion 页面链接会改写为公开文章链接；指向未批准页面的 Notion 链接不显示为可点击链接。遇到尚未支持的块类型，构建会失败，避免悄悄遗漏正文。

连接令牌只放在 GitHub Actions Repository Secret `NOTION_TOKEN` 中，不要提交到仓库。Notion 内部连接需要“读取内容”权限，并获得对应页面的访问权。GitHub Pages 是公开网站。

