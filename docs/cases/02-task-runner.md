# 案例 02 · 多租户任务运行器

<div class="lesson-meta"><span>核心主线</span><span>软件 16 节点</span><span>质量 16 节点</span></div>

## 需求与质量场景

工作区成员提交最长 30 分钟的任务，查看进度、取消、下载产物。重复提交不得重复副作用；工作区严格隔离。当 worker 崩溃，2 分钟内接管，任务不丢，重复步骤由幂等保护。p95 创建响应低于 500ms（不等待任务完成）。

## 容器与数据流

```text
Web → API → PostgreSQL (runs, steps, outbox, artifacts metadata)
              ↓同一事务
          Outbox Publisher → Queue → Worker → Object Storage
Web ← GET/SSE ← API ← events/status ←────────┘
```

API 认证后从身份得到 `workspace_id`，查询永远带租户条件。创建以 `(workspace_id, idempotency_key)` 唯一。worker 使用有期限租约；状态和事件同事务；产物先写对象存储再以校验和登记。

## 状态与失败

`queued → leased → running → succeeded/failed`；取消写 `cancel_requested`，worker 在检查点转 `cancelled`。超时、用户取消、永久业务错误、可重试依赖错误分别记录。队列至少一次，Step 有稳定执行键。

## 发布与运行

API/worker 同一代码制品可不同进程伸缩。CI 跑状态、并发、数据库、契约测试并构建一次镜像。指标：队列年龄、运行成功率、lease 过期、重复抑制、p95 Step 时间；日志/trace 串 `workspace_id/run_id/step_id`（不作高基数指标标签）。恢复演练包含杀 worker 和从备份恢复。

<DecisionCard title="先上 Kafka、Kubernetes 和微服务吗？" prompt="未来可能每天百万任务，但现在每天 100 个，团队 2 人。" answer="先以 Postgres＋可靠队列/worker 的模块化单体验证状态、幂等和观测。定义触发器：队列吞吐、隔离、独立发布或团队所有权达到阈值再演进。提前引入复杂平台会增加故障面，却不自动修复业务一致性。" />

## 交付证据

需求画布、C4/数据流、OpenAPI、状态表、Schema/迁移、并发测试、镜像 digest、CI、仪表盘、Runbook、恢复演练和至少两份 ADR（异步任务、outbox）。

## 你的变化任务

某些任务必须在客户私有网络执行。比较自托管 runner、轮询与反向连接；写出认证、网络、升级、租约和离线恢复的新约束。
