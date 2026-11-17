# 开关之间｜电力电子学习手记

这是博客的公开源码。`dist/` 是 GitHub Pages 发布目录，包含首页、学习路线和三篇入门文章。

## 发布

推送到 `main` 后，`.github/workflows/deploy.yml` 会将 `dist/` 发布到 GitHub Pages。也可以从 Actions 页面手动运行。GitHub Pages 上的网页面向所有人公开。

## 与 Notion 的关系

Notion 是学习与写作工作区，博客是公开内容。只有明确列入发布清单的页面才会进入博客；不要把整个「电力电子学习」页面树自动导出。现有三篇博客文章是站点源码中的独立内容，不代表 Notion 原文已公开。

下一步的 Notion 单向同步将使用只读连接，在构建时抓取选定页面并生成静态文章。连接令牌必须放在 GitHub Actions Secret 中，不要写入仓库或浏览器脚本。启用前需确定公开页面清单，并为该连接授权对应的 Notion 页面。

