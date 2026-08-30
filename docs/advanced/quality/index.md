# 软件质量与生产交付 · 可选进阶

> 一句话点题：生产交付的进阶不是工具更多，而是让环境、容量、故障和组织协作都变成可声明、可观测、可演练的系统。

## 什么时候进入这条路线

当单服务容器＋托管平台已经稳定交付，就不必为了“云原生”迁移。只有多个工作负载的发布、资源、权限或故障域开始重复消耗团队，编排和平台化才可能回本。进入前至少要有 CI/CD、基本遥测、回滚和事故复盘。

## 知识地图

<AdvancedMap domain="quality" />

## 先按故障选专题

| 反复发生的故障/摩擦 | 先进入 | 你要交付的证据 |
|---|---|---|
| 服务发现、滚动发布、探针和状态数据混乱 | 01 Kubernetes 核心 | 一个可滚动且故障可见的工作负载 |
| 集群资源争用、扩缩抖动、越权 | 02 Kubernetes 运维 | requests/limits、RBAC 与扩缩实验 |
| 手工环境漂移，变更无法审阅 | 03 IaC 与 GitOps | plan、调和、漂移检测和受控例外 |
| 尾延迟或成本无法预测 | 04 性能与容量 | 负载模型、饱和点、容量预算 |
| 恢复方案从未在故障中证明 | 05 Chaos 与 SRE | 有停止条件的 Game Day 和修复闭环 |
| 区域风险/团队重复/供应链成为组织约束 | 06 平台与韧性 | 容灾演练、最小平台产品和策略门禁 |

## 最小贯穿项目

把任务运行器部署到一个本地或临时集群。先只有 Deployment、Service 和数据库依赖；随后根据观测逐步加入资源边界、自动扩缩、声明式环境、故障实验和平台模板。不要在一个实验中同时改编排、数据库、网络和代码，否则无法归因。

::: tip 推荐实验纪律
每次实验固定版本、负载和数据集；先记录基线，再只改变一个变量；保留原始指标和失败日志。结论必须写成“在这些条件下”，不写成绝对规律。
:::

[从 Kubernetes 核心开始 →](/advanced/quality/01-kubernetes-core)

<div class="source-note">主要来源入口（核验于 2026-08-31）：<a href="https://kubernetes.io/docs/home/">Kubernetes Documentation</a>、<a href="https://developer.hashicorp.com/terraform/docs">Terraform Documentation</a>、<a href="https://opengitops.dev/">OpenGitOps</a>、<a href="https://sre.google/workbook/table-of-contents/">Google SRE Workbook</a>、<a href="https://principlesofchaos.org/">Principles of Chaos Engineering</a>。边界见<a href="../../sources/quality">质量来源目录</a>。</div>
