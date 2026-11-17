# ZH-HAO｜学习手记

公开博客：https://zh-hao.github.io/power-electronics-blog/ 。首页采用个人资料、置顶专栏和最近更新的布局；正文仅来自已授权的 Notion 页面树。

电力电子目录：https://zh-hao.github.io/power-electronics-blog/power-electronics/

图论目录：https://zh-hao.github.io/power-electronics-blog/graph-theory/

## 发布

流程：**Notion 编辑 → 同步 Markdown 和附件到仓库 → 自动提交变更 → 从仓库内容构建 → GitHub Pages 发布**。

推送到 `main` 后会执行一次同步。日常更新：打开 [Actions → Publish blog to GitHub Pages](https://github.com/ZH-HAO/power-electronics-blog/actions/workflows/deploy.yml)，点击 **Run workflow → Run workflow**，保留 `sync_notion` 勾选。完成后，正文和附件会出现在 [content/notion/](content/notion/README.md)，有变化才创建 Git 提交。Notion 中的修改不会自行触发 GitHub Actions；当前没有定时任务或 webhook。

`content/notion/` 中每个页面都有可直接阅读的 `.md` 文件，`assets/` 保存实际图片、PDF 等附件，`manifest.json` 记录目录和来源，`snapshot.json` 保存网页构建所需的结构。原有文章网址不变。请在 Notion 中修改正文，这些生成文件会在下次同步时覆盖；Git 历史保留先前版本。文件不保存 API 用户资料、令牌或附件的临时下载链接。单个附件须小于 95 MiB。

同步后的离线构建不需要 Notion 令牌：

```sh
node scripts/sync-notion.mjs --from-repository
```

也可以在 **Run workflow** 中取消勾选 `sync_notion`，只从仓库归档重新发布。发布范围配置改变后，须先重新同步。测试命令：`node --test scripts/notion-archive.test.mjs`。

工作流使用仓库自带的 `GITHUB_TOKEN` 提交笔记，并在同一次运行中部署，不需要新增 GitHub 私人令牌。机器人提交不会触发另一次 `push` 工作流，避免循环同步。若仓库后续启用禁止机器人推送的分支规则，提交步骤会明确失败，不会继续发布。

## Notion 内容范围

`content/notion-pages.json` 只列出两个获准公开的页面树：「电力电子学习」与「图论」。首页只有这两个 Notion 专栏，不再包含静态演示文章。页面树中的所有子页面会在下一次发布时进入对应专栏；树外的 Notion 内容不会发布。移出这两棵页面树的页面在下次构建时会退出目录；若曾公开，其旧网址和附件可能仍保留在搜索引擎或第三方缓存。

图片、PDF 等附件在构建时复制到静态站点。站内 Notion 页面链接会改写为公开文章链接；指向未批准页面的 Notion 链接不显示为可点击链接。遇到尚未支持的块类型，构建会失败，避免悄悄遗漏正文。

连接令牌只放在 GitHub Actions Repository Secret `NOTION_TOKEN` 中，不要提交到仓库。Notion 内部连接需要“读取内容”权限，并获得对应页面的访问权。GitHub Pages 是公开网站。
