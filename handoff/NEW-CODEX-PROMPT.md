# 新电脑 Codex 接管 Prompt

把下面代码块中的内容完整复制为新任务的第一条消息。

```text
你正在接管 Learning 007 仓库。请把这次对话视为一次“恢复工作现场”，不要立即重写内容，也不要根据 README 自行猜测下一任务。

第一步请完成“不修改项目源文件”的接管检查。注意：安装依赖和构建会写入被 Git 忽略的依赖/缓存目录，不属于只读文件系统操作：

1. 定位 Git 根目录，读取根目录 AGENTS.md。
2. 完整读取 handoff/PROJECT-CONTEXT.md、handoff/SOP-INDEX.md、handoff/SKILLS-MANIFEST.md 和 handoff/TRANSFER-CHECKLIST.md。
3. 完整读取 docs/CONTENT-STANDARD.md、docs/TEACHING-WRITING-GUIDE.md、docs/writing-dna/awesome-architecture/学习文章改写SOP.md、docs/writing-dna/awesome-architecture/领域知识库与学习内容建设SOP.md、docs/writing-dna/awesome-architecture/Writing-DNA.md、docs/writing-dna/csdiy-wiki/Writing-DNA.md。
4. 检查 .agents/skills 下的项目 Skills 是否可发现。便携包应有 12 个；公开 Git 克隆只有两个许可明确的写作 Skill属于正常情况。需要使用某个 Skill 时，必须先完整读取它的 SKILL.md 及该任务要求的引用文件。
5. 运行 git status --short、git branch --show-current、git log -1 --oneline --decorate，并核对远端。不要丢弃任何本地修改。
6. 检查 Node/npm 版本；依赖缺失时运行 npm ci。随后运行 npm run check:links、npm run check:content、npm run check:sources 和 npm run build。
7. 不读取、不索取、不回显旧电脑的 Tavily/OpenAI API Key。需要联网研究时，先确认新电脑已经通过环境变量或凭据系统配置自己的 Key。

加载完成后，请先向我做一份简短但具体的接管报告，必须包括：

- 当前仓库路径、分支、HEAD 和工作区是否干净；
- 已加载的项目级指令、SOP 与 Skills；
- 四项检查的真实结果，失败时给出准确原因；
- 你对当前完成范围的理解；
- 明确指出深度学习第一阶段已实现但仍等待人工审阅，不能未经确认直接扩写第二阶段；
- 你认为下一步需要我决定的唯一事项。

工作原则：

- 用户明确要求优先于 Skill 和历史文档。
- 先对齐意图，再整理目录；目录确认后先写一篇样稿，样稿确认后才批量补全。
- 正式课程按阶段推进，每完成一个阶段逐章 review 并写迁移型阶段总结。
- 教学文章必须连贯，专业性来自结构化判断、机制、证据、反例和可验证实践，不来自术语或公式堆叠。
- 不使用固定报告模板，不复制论文段落，不在章末写作者如何参考资料的解释性语言。
- 保持 Vue 3 + TypeScript + CSS 前端；不要把现有实现改写成纯 JavaScript。
- 只报告实际读取、实际运行和实际验证的内容，不把链接登记说成联网核真。
- 未得到我的下一条明确任务前，到接管报告为止，不要自行开始批量修改。
```
