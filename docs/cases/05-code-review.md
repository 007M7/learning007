# 案例 05 · AI 代码审查流水线

<div class="lesson-meta"><span>进阶工程项目</span><span>SW03/09/15</span><span>Q01—Q16</span><span>AI03/09/15—18</span></div>

## 需求与非目标

Pull Request 创建后，系统读取 diff、仓库规则与有限上下文，运行确定性检查，再由模型提出带文件/行号、严重度和证据的评论。第一版只建议，不自动合并、不自动部署、不把私有代码用于未批准的数据处理。

## 流水线

```text
PR event → scope/auth → checkout immutable SHA in sandbox
         → format/type/test/security → structured findings
         → context selector (diff + referenced symbols + repo rules)
         → model review schema → dedupe/confidence/policy → PR comments
```

Webhook 验签并幂等；checkout 固定 SHA。来自仓库的注释、README 和测试名都是不可信内容，不能改变工具权限。执行测试在无生产凭证、网络受限、资源受限的沙箱。评论工具只能写当前 PR，不能 push。

## 结果契约

每个 finding 包含 `rule/category/severity/file/start/end/explanation/evidence/suggested_fix/confidence`。服务端验证文件和行号属于 diff，去重同一根因，低置信或纯风格结果折叠。安全问题避免公开泄漏利用细节。

## 评测

从历史已确认缺陷和无缺陷变更建立盲测集，衡量召回、精确率、严重度、无效评论率和开发者采纳/误报隐藏率；按语言和风险分桶。模型升级先影子运行。确定性 lint 结果不应再让模型重述。

<DecisionCard title="让 Agent 自动修复并 push 到 PR？" prompt="建议已经很准，想进一步省时间。" answer="先把修复作为独立、明确用户触发的动作：展示 patch，只允许 PR 分支，运行全部门禁，提交可追溯，禁止改 CI/权限/密钥文件或要求额外确认。审查建议准确不等于自动变更安全。" />

## 生产证据

Webhook 重放测试、沙箱逃逸/网络测试、权限最小化、已知缺陷评测、模型/Prompt 版本、成本和队列 SLO、评论撤回/反馈、供应商数据保留审查。

## 你的变化任务

支持大型单仓库。设计增量上下文、符号索引、变更影响图、缓存失效和每 PR 预算；说明何时拒绝完整审查而只运行确定性门。
