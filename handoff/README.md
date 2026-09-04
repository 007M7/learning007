# Learning 007 跨电脑交接包

这份目录用于把仓库状态、写作方法、任务边界和 Codex 工作方式交给另一台电脑。它不能迁移旧任务的隐藏上下文，但能让新任务通过可审计文件恢复足够完整的工作现场。

## 最推荐的迁移方式

若要把本次任务涉及的 12 个 Skill 一起带走，优先使用便携压缩包。它是完整交接版本。

新电脑联网且只需要仓库、SOP、接管 Prompt 与两个许可明确的写作 Skill 时，也可以直接克隆远端：

```powershell
git clone https://github.com/007M7/learning007.git
Set-Location learning007
npm ci
npm run verify
```

然后在 Codex 中打开仓库根目录，把 `NEW-CODEX-PROMPT.md` 的完整内容作为第一条消息发送。

公开仓库的 `.agents/skills/` 只包含 `human-writing` 与 `writing-dna-skill`。其余 10 个本地 Skill 因快照没有完整的再分发许可证或来源版本证明，只收入私人便携包，不发布到公开 GitHub。Codex 支持从仓库根目录的 `.agents/skills` 发现项目 Skills；如果新安装后未出现在 Skill 列表，重启 Codex。

## 无网或直接复制

便携压缩包包含完整 Git 仓库副本、12 个任务相关 Skill、SOP 和接管 Prompt，因此保留提交历史和远端信息，但排除了：

- `node_modules/`
- VitePress 的 `dist/` 与 `cache/`
- `knowledge-base/cache/`
- `.env*`、API Key、登录凭据和 Codex 用户配置

解压后先运行：

```powershell
Set-Location <解压后的 learning007 目录>
powershell -ExecutionPolicy Bypass -File handoff/verify-handoff.ps1 -InstallDependencies -RequirePortableSkills
```

## 本目录的阅读顺序

1. `PROJECT-CONTEXT.md`：当前完成度、待审阅项和不能丢失的用户偏好。
2. `SOP-INDEX.md`：知识库与教学文章的权威流程入口。
3. `SKILLS-MANIFEST.md`：随仓库携带的 Skills、触发条件和外部依赖。
4. `TRANSFER-CHECKLIST.md`：旧电脑和新电脑各自要完成的检查。
5. `NEW-CODEX-PROMPT.md`：新任务直接粘贴的接管提示。
6. `MANIFEST.json`：机器可读的交接范围与验证基线。

## 不能通过复制自动迁移的内容

- Codex 登录状态、GitHub 凭据和浏览器会话；
- 旧任务的完整消息历史与系统级上下文；
- Tavily、OpenAI 等 API Key；
- 用户目录中的全局 Codex 配置、插件和系统 Skills；
- 被 `.gitignore` 排除的研究缓存。

这些内容需要在新电脑单独登录或配置。不要为了“省事”把旧电脑整个 `.codex`、浏览器配置或凭据目录压进交接包。

Tavily Skills 的现有快照以 Bash/Unix 命令为主。在 Windows 上请使用 WSL 或 Git Bash；也可以在 PowerShell 中先用 `uv tool install tavily-cli` 安装 CLI，再按新电脑自己的凭据方式登录。不要复制旧 Key。
