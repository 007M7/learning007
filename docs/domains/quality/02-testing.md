# 02 · 单元、集成、契约与端到端测试

<div class="lesson-meta"><span>Q03—Q06</span><span>必修核心</span><span>预计 4 × 50 分钟</span><span>前置：Q01—Q02</span></div>

## 本章可观察目标

你能为同一功能选择四类测试边界；写出稳定断言、可控测试数据和失败可诊断的端到端测试。

## Q03 · 单元测试：保护稳定规则

单元不是“一个函数”，而是隔离外部不确定性的最小行为边界。测试名称表达条件与结果，采用 Arrange—Act—Assert；对等价类和边界参数化。只 mock 真正越过进程/时间/随机/网络的端口，不要 mock 被测对象内部每个调用。

```python
def test_running_run_cannot_start_again():
    run = Run(status="running")
    with pytest.raises(InvalidTransition):
        run.start()
```

## Q04 · 集成测试：验证真实边界

ORM 模拟器无法证明 SQL、约束、事务和索引在目标数据库工作。关键数据路径使用同版本真实数据库；每个测试独立数据，清理策略明确。第三方 API 可在少量沙箱测试之外用本地 fake server，验证超时、错误体和重试。

## Q05 · 契约测试

契约测试检查提供者与消费者对请求/响应、事件或工具 Schema 的共同理解。OpenAPI/JSON Schema 可以验证形状，但还要测试业务语义、兼容性和错误码。兼容演进通常先加可选字段；删除/改名需要弃用窗口。

## Q06 · 端到端与可访问性

端到端测试覆盖极少数高价值旅程：真实浏览器、已部署服务和真实依赖组合。使用角色/label 等用户可见定位器，不依赖易变 CSS；等待可观察条件，不写固定睡眠；失败保留截图、视频、网络和 trace。

```text
大量：领域规则单元测试
适量：数据库/队列/合同集成测试
少量：登录 → 创建任务 → 查看完成的 E2E
持续：生产指标、合成检查与恢复演练
```

可访问性不是最后加的插件：键盘可操作、语义结构、焦点顺序、表单标签和错误提示同时改善测试稳定性。

<DecisionCard title="测试应该连真实模型 API 吗？" prompt="AI 摘要功能需要在 CI 中稳定验证，同时又要发现模型升级退化。" answer="分层：常规 CI 用录制/fake 响应验证控制流、Schema、超时和错误处理；独立、受预算控制的在线评测调用真实模型，使用固定数据集比较质量、成本和延迟。不要让每次单元测试依赖随机外部模型。" />

## 练习：同一需求的四层证据

为“取消正在运行的任务”各写一项：状态机单元测试、数据库并发集成测试、API 契约测试、浏览器 E2E。说明每层能发现什么、不能发现什么。

常见误区：断言实现细节；全量 mock 数据库；测试共享账号互相污染；固定等待 3 秒；E2E 数量过多又无法诊断；只测成功响应。

<EvidenceTracker lesson="quality-02-testing" />

## 本章完成标准

提交四层测试并故意制造一个失败，证明报告能定位原因；重复运行 10 次无随机失败。能解释每个 mock 的边界与删除它的条件。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://docs.pytest.org/en/stable/">pytest 9.x 文档</a>、<a href="https://playwright.dev/docs/intro">Playwright 官方文档</a>、<a href="https://spec.openapis.org/oas/latest.html">OpenAPI 3.2.0</a>。</div>
