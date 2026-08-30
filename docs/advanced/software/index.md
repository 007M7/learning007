# 软件与系统工程 · 可选进阶

> 一句话点题：当“代码能跑”不再是问题，真正昂贵的是解释它为什么慢、为什么在多节点下分叉，以及怎样在不失控的前提下演进。

## 什么时候进入这条路线

先修不是看完 SW01—SW16，而是已经能为一个真实系统画请求/数据流、写出契约和状态边界，并用测试或观测证明问题。若你的系统仍是单实例、低流量、普通 CRUD，模块化单体和托管数据库通常比这里的大多数技术更合适。

## 知识地图

<AdvancedMap domain="software" />

## 六个专题怎样选择

| 你看到的事实 | 先进入 | 暂时不要跳到 |
|---|---|---|
| p95/p99 恶化，但不知道时间花在哪里 | 01 性能模型与 Profiling | 直接换语言、加机器 |
| GC 停顿、JIT 预热或二进制体积影响业务 | 02 编译器与运行时 | 从头造编译器 |
| 应用日志解释不了调度、I/O 或网络抖动 | 03 内核、eBPF 与网络 | 修改内核源码 |
| 有复制、选主、跨节点写入和网络分区 | 04 分布式故障与 Raft | 把 CAP 当数据库选型口诀 |
| 需要分区吞吐、重放、背压或跨系统补偿 | 05 存储、流与事务 | 追求传输层“绝对 exactly-once” |
| 团队所有权/隔离要求真的超过单体能力 | 06 服务边界与演进 | 一开始就全面微服务化 |

## 最小贯穿项目

使用“可恢复任务运行器”：API 接受任务，worker 执行，事件记录状态，用户可取消和重试。核心版使用单数据库和一个 worker；进阶过程中只在证据触发时引入 profiler、复制日志、事件流或服务拆分。每次升级都必须保留旧方案对照和退出路径。

::: warning 这条路线的刹车
如果你不能写出当前 p95、故障模型、一致性要求或团队边界，就还没有足够信息做进阶选型。先补观测与约束，不用技术名词替代问题定义。
:::

[从性能模型开始 →](/advanced/software/01-performance)

<div class="source-note">主要来源入口（核验于 2026-08-31）：<a href="https://docs.kernel.org/">Linux Kernel Documentation</a>、<a href="https://llvm.org/docs/">LLVM Documentation</a>、<a href="https://raft.github.io/raft.pdf">Raft 论文</a>、<a href="https://kafka.apache.org/documentation/">Apache Kafka Documentation</a>。边界与章节映射见<a href="../../sources/software">软件来源目录</a>。</div>
