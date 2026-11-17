# ZH-HAO｜学习手记

公开博客：https://zh-hao.github.io/power-electronics-blog/ 。首页采用个人资料、置顶专栏和最近更新的布局；正文仅来自已授权的 Notion 页面树。

电力电子目录：https://zh-hao.github.io/power-electronics-blog/power-electronics/

图论目录：https://zh-hao.github.io/power-electronics-blog/graph-theory/

## 发布

推送到 `main` 后，GitHub Actions 从 Notion 读取已批准的内容，生成静态网页并发布到 GitHub Pages。也可在仓库的 **Actions → Publish blog to GitHub Pages → Run workflow** 手动同步。Notion 中的修改不会自动触发 GitHub Actions。

## Notion 内容范围

`content/notion-pages.json` 只列出两个获准公开的页面树：「电力电子学习」与「图论」。首页只有这两个 Notion 专栏，不再包含静态演示文章。页面树中的所有子页面会在下一次发布时进入对应专栏；树外的 Notion 内容不会发布。移出这两棵页面树的页面在下次构建时会退出目录；若曾公开，其旧网址和附件可能仍保留在搜索引擎或第三方缓存。

图片、PDF 等附件在构建时复制到静态站点。站内 Notion 页面链接会改写为公开文章链接；指向未批准页面的 Notion 链接不显示为可点击链接。遇到尚未支持的块类型，构建会失败，避免悄悄遗漏正文。

连接令牌只放在 GitHub Actions Repository Secret `NOTION_TOKEN` 中，不要提交到仓库。Notion 内部连接需要“读取内容”权限，并获得对应页面的访问权。GitHub Pages 是公开网站。

