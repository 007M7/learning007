# 04 · 负载、Profiling、容量与排队

> 一句话点题：容量工程不是“机器 CPU 到 80% 就扩容”，而是把需求分布、服务时间、瓶颈和故障余量变成模型，再用负载实验校准。

<div class="lesson-meta"><span>AQ10—AQ12</span><span>可选进阶</span><span>预计 7 × 45 分钟</span><span>前置：Q12—14、ASW01—03</span></div>

## 解锁与跳过

p95/p99、饱和、成本或大促容量成为产品约束时解锁。无真实负载/SLO 时先补观测，不从压测工具选型开始。

## 本章可观察目标

你能把业务需求转为到达模型与 workload mix；能设计基线/阶跃/尖峰/浸泡/故障负载；能用排队与瓶颈资源计算容量；能给出 N+1/区域故障/增长/发布余量与过载保护。

## AQ10 · Workload model 决定测试是否像现实

写清：请求类型比例、数据大小/冷热/租户分布、到达率与 burst、并发、会话、依赖、读写比、时间段。平均 100 RPS 可能是稳定 100，也可能每分钟 6 秒 1000；容量不同。

```mermaid
flowchart LR
  D[Business demand] --> W[Workload model]
  W --> L[Load experiments]
  L --> B[Bottleneck evidence]
  B --> C[Capacity model]
  C --> F[Failure + growth margin]
  F --> V[Validation and overload policy]
```

测试层次：单请求 profile；稳定基线；step 找拐点；spike 看恢复；soak 暴露泄漏/队列；failure-load 验证少一个实例/依赖慢。开环负载更能保持到达压力；闭环容易 coordinated omission。压测客户端也可能先饱和，要监控生成端。

## AQ11 · Profiling 与瓶颈法则

四大资源 CPU、内存、磁盘、网络，加锁/连接池/外部配额。使用率不是排队本身：看 run queue、throttling、GC、I/O latency/queue、连接等待、thread pool queue、依赖 rate limit。

Amdahl：只能优化占总时间一部分的路径；Universal Scalability Law 提醒并发增加后 contention/coherency 会让吞吐停止甚至下降。模型不是精确预言，用于识别假设，再用实验校准。

## AQ12 · 容量包含故障和变化余量

若单副本在 SLO 内稳定 80 RPS，正常峰值 400，最低 5 副本只是无余量。要考虑一副本/一个 zone 故障、发布 surge、增长、估计误差和冷启动。例如跨 3 zone 需容一个 zone：若均分，剩余 2/3 容量必须承受峰值，因此正常总能力至少约峰值 1.5 倍，再加增长/突发。

```text
需求峰值 × 增长 × 故障因子 × 安全余量
÷ 单副本在 SLO 下可持续能力
= 最低可用副本（再验证下游总容量）
```

容量不是只扩应用。DB connections、队列分区、外部 API quotas、缓存带宽和 NAT 端口都可能更先到顶。过载时排队/限流/优先级/降级，保护核心请求；无限接收只会把失败变成长延迟。

## 贯穿案例：大促按平均值配容量

日均 50 RPS、峰值 600 持续 10 分钟；团队按平均配 2 副本，每副本 SLO 内 60 RPS。HPA 冷启动 2 分钟，队列瞬间积压，恢复一小时。改进：基于事件预扩 12+副本；保留 zone 故障余量到 18；入口优先级/限流；DB 总连接预算；step/spike 模拟并验证缩容不会二次积压。数字是项目示例，实际用实测替换。

## 会死在哪里

- 用日均配峰值；保留时间分布。
- load generator 饱和；双端监控。
- 闭环隐藏延迟；开环/校正 omission。
- 单副本能力线性乘；验证 contention/下游。
- CPU 低判有容量；可能 I/O/配额饱和。
- 只算正常无故障/发布余量。
- 压测无数据隔离/清理，污染生产。

## 与 AI 协作模板

```text
请生成容量调查而非拍脑袋实例数：
- 从业务写 workload mix、峰值/burst/增长/数据分布；
- 设计 baseline/step/spike/soak/failure-load 和开闭环；
- 逐资源列使用、饱和/等待和下游配额；
- 估算正常、zone故障、发布、冷启动和增长余量；
- 验证副本扩张后的数据库/队列/外部总容量；
- 写过载限流/优先级/降级和停止压测条件。
```

## 练习：写一份容量计划

对任务运行器生成三类任务/冷热数据；做 step 找 SLO 拐点、spike 看扩容、soak 30—60min；少一个副本/让依赖慢；记录每资源等待。建立简化模型预测实例数，再用实验比较误差；输出正常/故障/发布容量与过载策略。

## 常见误区

RPS 一个数字；平均延迟；闭环万能；单机结果线性扩展；CPU=容量；HPA 替代预估；无限队列吸收峰值；压测只看系统没报错；容量计划不含下游/故障。

<Quiz question="单副本稳定 80 RPS，峰值 400 RPS，是否 5 副本就足够生产？" :options="['一定足够', '只是无故障理论最低，还需故障/发布/增长和下游余量', '只需 1 副本']" :answer="1" explanation="生产容量必须包含故障和变化余量，且扩展未必线性。" />

## 本章小结

- Workload model 包含比例、数据、到达与 burst，平均值不足以配容量。
- 不同负载实验回答稳态、拐点、尖峰、泄漏和故障问题。
- Profiling 找瓶颈，排队/竞争解释尾延迟与非线性扩展。
- 容量包含故障、发布、冷启动、增长和误差余量。
- 过载保护比无限接收重要，并必须考虑所有下游。

<EvidenceTracker lesson="advanced-quality-04-performance-capacity" />

## 本章完成标准

交付可复现 workload/五类实验/资源瓶颈；容量模型经实测校准，包含故障和下游；过载策略能保护核心 SLO。最近平均至少 7/10。

<div class="source-note">主要来源（核验于 2026-08-31）：Google SRE 的 <a href="https://sre.google/sre-book/handling-overload/">Handling Overload</a> 与 <a href="https://sre.google/workbook/non-abstract-design/">Non-Abstract Large System Design</a>。容量数字必须来自目标系统实测。</div>
