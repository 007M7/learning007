# 软件与系统工程来源目录

核验日：2026-08-31。优先读本站章节建立问题地图，遇到版本/边界再进入原文。

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [Python 官方文档](https://docs.python.org/3/) | 当前 3.14.7；页面 2026-08-30 更新 | SW01—03 | 查语言准确语义；课程例子不要求只用 Python |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | 活文档；当前导航含 TS 6.0 | SW02、SW08—09 | 静态类型不能替代运行时输入验证 |
| [Pro Git](https://git-scm.com/book/en/v2) | 2nd Edition，社区持续勘误 | SW03 | 工作区/暂存/提交/分支心智模型 |
| [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) | v1.10，2023-11 | SW05—06 | 开放教材；本站只选进程、内存、并发、持久化 |
| [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) | 活文档 | SW07—09 | 入门解释；规范争议回到 RFC |
| [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) | Internet Standard，2022 | SW07、SW09 | HTTP 方法、状态与语义权威来源 |
| [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) | v3.2.0，2025-09-19 | SW09、Q05 | 描述接口形状；业务规则仍需额外说明/测试 |
| [PostgreSQL Current Docs](https://www.postgresql.org/docs/current/) | 当前 18.6 | SW10—13 | SQL、约束、事务、索引和迁移的具体语义 |
| [C4 model](https://c4model.com/) | 作者维护的活网站 | SW12、SW15—16 | 软件架构沟通模型，不是部署技术 |
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | 官方项目活文档 | SW14、Q15 | 应用安全验证要求；需按场景选级别 |

## 可选进阶来源

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [Linux Kernel Documentation](https://docs.kernel.org/) | 活文档；官方说明仍持续完善 | ASW07—09 | 内核、tracing、故障注入与用户态 API；按目标内核版本验证 |
| [eBPF Docs](https://docs.ebpf.io/) | 活文档 | ASW08—09 | verifier、program types、maps/helpers；生产探针仍需权限/开销治理 |
| [LLVM Documentation](https://llvm.org/docs/) | 页面 2026-08-30 更新；导航含 24.0.0git release notes | ASW04—06 | IR、优化、JIT、profiling 与 GC；不要求从零造编译器 |
| [Raft 论文](https://raft.github.io/raft.pdf) | 扩展版，2014-05-20 | ASW10—12 | crash/partition 下复制状态机共识；不覆盖 Byzantine 与业务幂等 |
| [MIT 6.5840](https://pdos.csail.mit.edu/6.824/) | 官方课程站 | ASW10—15 | 分布式系统实验与论文路径；按问题选读，不作为主线前置 |
| [Apache Kafka Documentation](https://kafka.apache.org/documentation/) | 官方活文档 | ASW13—15 | 分区日志、producer/consumer/streams；exactly-once 只在定义边界内理解 |
| [Istio Documentation](https://istio.io/latest/docs/) | latest 活文档 | ASW16—18 | service mesh 流量、安全、观测；不替代业务幂等/边界设计 |
| [Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) | 作者维护文章 | ASW18 | 渐进替换思路；迁移仍需数据核对与回退 |

## 阅读顺序

非科班学习者不应从规范第一页顺读。推荐：本站例子 → 在官方文档查一个具体问题 → 回项目验证 → 把结论与版本写进 ADR/测试。RFC、数据库隔离和语言边界遇到争议时才深入原文。

## 易过时项

语言当前版本、PostgreSQL current、OpenAPI latest、浏览器、内核、LLVM、Kafka 与 Istio 按季度复核；HTTP/Raft 核心论文与 OSTEP 概念相对稳定。课程不把某个前端框架列为通识必修，因为框架替换速度高于 DOM、HTTP、状态和契约等底层模型。
