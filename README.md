# 开关之间｜电力电子学习手记

这是博客的公开源码。`dist/` 是 GitHub Pages 发布目录，包含首页、学习路线和三篇入门文章。

## 发布

推送到 `main` 后，`.github/workflows/deploy.yml` 会将 `dist/` 发布到 GitHub Pages。也可以从 Actions 页面手动运行。GitHub Pages 上的网页面向所有人公开。

## 与 Notion 的关系

Notion 是学习与写作工作区，博客是公开内容。只有明确列入发布清单的页面才会进入博客；不要把整个「电力电子学习」页面树自动导出。现有三篇博客文章是站点源码中的独立内容，不代表 Notion 原文已公开。

`scripts/sync-notion.mjs` 已接入发布流程，但 `content/notion-pages.json` 的清单目前为空，所以不会读取或公开任何 Notion 页面。启用时，逐条填写已决定公开的页面 ID、英文 slug 和摘要，例如 `{ "id": "页面 ID", "slug": "buck-notes", "summary": "文章摘要" }`。脚本只读取清单上的页面，不自动导出子页面；遇到无法可靠转换的块类型会停止发布。

同步使用 Notion 只读连接，在构建时抓取选定页面并生成静态文章。连接令牌必须存入 GitHub Actions Secret `NOTION_TOKEN`，不能写入仓库或浏览器脚本。还需在 Notion 中将对应页面单独授权给该连接。当前未创建连接、未设置令牌、未授权页面，也未添加定时同步。

