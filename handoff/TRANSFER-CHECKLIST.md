# 跨电脑迁移检查清单

## 旧电脑

- [ ] `git status --short` 没有未说明的修改。
- [ ] `git push origin main` 已成功。
- [ ] `npm run verify` 已通过。
- [ ] 私人交接包含 12 个 Skill；公开仓库只含两个许可明确的 Skill。
- [ ] 交接包没有 `node_modules`、构建缓存、`.env`、API Key 或登录凭据。
- [ ] 记录压缩包 SHA-256，并把压缩包和校验值一起复制。

## 新电脑

- [ ] 安装 Git、Node.js `>=22.13.0` 和 npm。
- [ ] 选择克隆远端或解压便携包，不把两份工作区混用。
- [ ] 从仓库根目录打开 Codex，确认根目录 `AGENTS.md` 被发现。
- [ ] 确认 `.agents/skills/` 中的项目 Skills 可见。
- [ ] 单独登录 GitHub；不要复制旧凭据文件。
- [ ] 如需 Tavily，单独配置新的或轮换后的 `TAVILY_API_KEY`，不写入仓库。
- [ ] 运行 `npm ci`。
- [ ] 运行 `npm run verify`。
- [ ] 运行 `npm run dev -- --host 127.0.0.1`，打开首页和当前待审阅页面。
- [ ] 把 `NEW-CODEX-PROMPT.md` 完整粘贴给新任务。
- [ ] 新 Codex 的首次回复应包含提交、工作区、检查结果、已读 SOP 和待审阅项。

## 接管失败时先检查

1. 路径是否真的位于 Git 仓库根目录；
2. `git rev-parse --show-toplevel` 是否指向当前文件夹；
3. Node 版本是否满足 `package.json`；
4. `npm ci` 是否完整成功；
5. Skill 是否缺少引用文件或脚本；
6. 是否误把旧 `docs/.vitepress/dist` 当成源文件；
7. 是否在没有用户确认时继续了批量内容生成。
