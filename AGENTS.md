# Learning 007 项目级协作说明

开始任何实质工作前，先阅读：

1. `handoff/PROJECT-CONTEXT.md`
2. `handoff/SOP-INDEX.md`
3. `docs/CONTENT-STANDARD.md`
4. `docs/TEACHING-WRITING-GUIDE.md`

本仓库面向非计算机专业学习者建设高密度、可验证的中文技术课程。正文必须让读者沿一条完整推理链理解“是什么、为什么、怎么做、何时失效”，不能批量套固定标题，也不能把论文摘录、术语解释或公式堆叠冒充教学。

工作约束：

- 先与用户对齐专题边界，再整理教材与论文目录；目录经审阅后只写一篇样稿，样稿确认后才批量扩展。
- 正式学习内容按阶段推进；每完成一个阶段，逐章复核并撰写阶段总结。未经用户审阅，不跨阶段大规模改写。
- 保持 VitePress + Vue 3 + TypeScript + CSS。`.mjs` 只用于构建、生成和验证，不把浏览器前端改成 JavaScript。
- 论文、教材、标准和法规只支持其实际覆盖的判断；记录版本、日期、用途和外推边界。
- 不提交 API Key、登录令牌、用户目录配置、`node_modules`、构建产物或机器缓存。
- 保留用户和其他任务的现有改动。修改后至少运行 `npm run check:links`、`npm run check:content`、`npm run check:sources`；完整交付运行 `npm run verify`。

如果这是新电脑上的首次接管，请完整执行 `handoff/NEW-CODEX-PROMPT.md` 中的提示，而不是从 README 猜测当前任务。
