# 任务相关 Skills

Skills 位于仓库根目录 `.agents/skills/`。便携包包含下列 12 个快照；公开仓库只包含许可明确的前两个。每个快照保留 `SKILL.md` 及任务需要的引用、脚本和资产，Git 元数据不随快照复制。

| Skill | 分发范围 | 来源 / 版本证据 | 本项目中的作用 | 外部依赖 |
|---|---|---|---|---|
| `writing-dna-skill` | 公开仓库 + 便携包 | MIT；`larashero3-dotcom/writing-dna-skill`，`aa986673…` | 从完整原稿提炼写作 DNA | 完整语料 |
| `human-writing` | 公开仓库 + 便携包 | MIT；快照版本 `1.1.0` | 中文长文改写与机械痕迹检查 | 可选 Python |
| `structured-learning` | 仅私人便携包 | 本地快照，未附完整分发来源/许可证 | 设计可验证的领域学习路线 | 无强制服务 |
| `project-sdlc` | 仅私人便携包 | 本地快照，未附完整分发来源/许可证 | 工程实现、测试和发布审查 | 无强制服务 |
| `tavily-cli` | 仅私人便携包 | 本地快照，未附完整分发来源/许可证 | Tavily 命令入口与通用边界 | Tavily CLI / Key |
| `tavily-search` | 仅私人便携包 | 同上 | 搜索候选教材、论文和官方来源 | Tavily Key |
| `tavily-extract` | 仅私人便携包 | 同上 | 提取已知 URL 正文 | Tavily Key |
| `tavily-map` | 仅私人便携包 | 同上 | 发现网站 URL 结构 | Tavily Key |
| `tavily-crawl` | 仅私人便携包 | 同上 | 在确认边界内采集多页语料 | Tavily Key |
| `tavily-research` | 仅私人便携包 | 同上 | 大范围候选搜集和冲突证据 | Tavily Key |
| `tavily-dynamic-search` | 仅私人便携包 | 同上 | 隔离上下文的批量检索 | Tavily Key |
| `tavily-best-practices` | 仅私人便携包 | 同上 | Tavily 集成、重试与结果治理 | Tavily SDK/CLI |

## 安装与发现

这些 Skill 在便携包中采用仓库级位置，正常情况下无需复制到用户目录。只使用公开克隆时会看到两个许可明确的 Skill，这是预期行为。请从仓库根目录启动 Codex。若应有的 Skill 未出现：

1. 确认 `.agents/skills/<skill-name>/SKILL.md` 存在；
2. 重启 Codex；
3. 检查是否有同名用户 Skill 造成选择歧义；
4. 用 `$skill-name` 显式调用。

不要把旧电脑的 `~/.codex/config.toml`、登录凭据或整个用户目录复制进仓库。系统自带的 `openai-docs`、`skill-creator` 等 Skills 由新电脑的 Codex 安装提供，不在本包重复分发。

Tavily 快照使用较多 Bash、`python3`、`jq` 和 `/tmp` 写法。Windows 上优先从 WSL / Git Bash 运行；若只使用 PowerShell，先安装兼容 CLI 并按任务把命令等价改写，不要机械执行 Unix 安装管道。
