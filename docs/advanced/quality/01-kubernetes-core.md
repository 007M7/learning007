# 01 · Kubernetes 工作负载、网络与存储

> 一句话点题：Kubernetes 不是“会自动让系统高可用”的部署工具，而是一个持续把声明状态调和为实际状态的分布式控制系统；你仍要定义健康、数据和故障语义。

<div class="lesson-meta"><span>AQ01—AQ03</span><span>可选进阶</span><span>预计 8 × 45 分钟</span><span>前置：Q09—14、SW07—11</span></div>

## 解锁与跳过

多个工作负载的调度、发现、滚动发布、资源隔离或状态管理已持续成为负担时解锁。一个小服务部署在 PaaS 已足够，就不要为了简历增加集群运维。

## 本章可观察目标

你能解释 desired/observed state、API Server、controller、scheduler、kubelet；能选择 Pod/Deployment/StatefulSet/Job；能走通 Service/DNS/Ingress/Gateway 网络；能设计 Config/Secret、PV/PVC、探针和滚动发布。

## AQ01 · 核心是调和循环

你提交 Deployment 声明 3 replicas；API Server 持久化；controller 观察差异并创建 ReplicaSet/Pods；scheduler 为未绑定 Pod 选节点；kubelet 拉镜像启动容器并汇报状态。它是最终调和，不是一次命令脚本。

```mermaid
flowchart LR
  Y[Desired YAML/API] --> A[API Server]
  A --> C[Controllers]
  C --> P[Pods pending]
  P --> S[Scheduler binds node]
  S --> K[Kubelet / runtime]
  K --> O[Observed status]
  O --> C
```

Pod 是共享网络/卷的最小调度单元，通常短命；Deployment 管无状态滚动副本；StatefulSet 提供稳定身份/有序管理但不自动让数据库正确；Job/CronJob 处理完成型工作。不要手工创建裸 Pod，它消失后无人补。

readiness 决定是否接流量，liveness 用于检测无法自愈的卡死，startup 给慢启动保护。liveness 依赖数据库会在数据库抖动时重启所有应用；readiness 过严又可能将全部端点摘除。探针只能表达当前容器状态，不能替代端到端 SLO。

## AQ02 · 网络是虚拟地址、端点与策略

每 Pod 有集群网络地址但会变化；Service 提供稳定虚拟地址与 DNS，转发到 ready endpoints。Ingress 是历史 HTTP 入口抽象，Gateway API 提供更表达化角色/路由；具体行为依 controller 实现。ClusterIP/NodePort/LoadBalancer 解决暴露层次不同。

请求路径：外部 LB→Gateway/Ingress→Service→Pod。排查按 DNS、route、Service selector、EndpointSlice、NetworkPolicy、Pod port/readiness 分层。Service 存在不代表后端 ready。

NetworkPolicy 通常由 CNI 实现；没有支持的 CNI，写了策略也可能无效。默认拒绝再按流量开放；同时考虑 DNS、观测和外部依赖。mTLS/Service Mesh 是下一层，不是 Service 自动能力。

## AQ03 · 状态与配置有独立生命周期

ConfigMap/Secret 注入配置；Secret 只是专用 API 对象，默认并不等于端到端加密/安全，仍需 etcd at-rest、RBAC、外部密钥/轮换和避免环境/日志泄漏。

Volume 属于 Pod 生命周期；PV 表示存储资源，PVC 是请求，StorageClass 动态供应。StatefulSet 的稳定 PVC 不保证跨区复制、备份、一致性和恢复。数据库是否放 K8s 要看团队能否承担 operator、存储故障、升级和恢复；托管数据库常更合适。

滚动发布同时存在新旧 Pod，API/schema/配置必须兼容。`maxUnavailable/maxSurge`、readiness 和 PodDisruptionBudget 影响可用副本，但 PDB 只约束自愿驱逐，不挡节点硬故障。

## 贯穿案例：滚动发布把所有流量送给未预热 Pod

新 Pod 进程已启动，liveness/readiness 都只检查 `/health=200`，但连接池/模型缓存要 40 秒。滚动时旧 Pod 逐步删除，新 Pod 立刻接流量，p99 爆炸。修复：startup/readiness 检查真正接流量条件；preStop＋terminationGracePeriod 停接后排空；rolling 参数保持容量；SLO 驱动 canary。不要把 readiness 写成永远成功的形式检查。

## 会死在哪里

- YAML apply 成功等于应用健康；看 status/events/endpoints/SLO。
- 裸 Pod；用 controller。
- liveness 检查外部依赖导致重启风暴。
- Service selector 错但对象正常；查 EndpointSlice。
- Secret 当保险箱；加密/RBAC/轮换/日志治理。
- StatefulSet 等于数据库高可用；存储和一致性另设计。
- 无优雅终止，滚动中断在途任务。

## 与 AI 协作模板

```text
请按 Kubernetes 调和模型设计部署：
- 选择 Deployment/StatefulSet/Job 并说明生命周期；
- 画入口→Gateway/Ingress→Service→Endpoint→Pod 与 DNS/Policy；
- 定义 startup/readiness/liveness 的真实语义和失败副作用；
- 写 Config/Secret 版本、轮换和敏感信息边界；
- 写 PV/PVC 的备份、区域、恢复而不把 StatefulSet 当 HA；
- 给滚动发布容量、优雅终止、兼容与验证步骤。
```

## 练习：部署可滚动任务 API

在本地集群部署 API＋模拟 worker：3 副本、Service、配置、Secret、readiness/startup、资源请求；制造 selector 错、readiness 失败、节点/Pod 删除；观察 controller 修复和 endpoints；滚动新版本时发持续流量，验证无 5xx/在途丢失。对数据库只使用外部/模拟服务并写恢复边界。

## 常见误区

K8s 自动高可用；Pod 是服务器；Service 保存连接状态；Ingress 行为跨实现完全一致；Secret 天然安全；StatefulSet 自动复制；探针越严格越好；delete Pod 等于重启按钮；PDB 挡所有故障。

<Quiz question="Deployment 有 3 个 Running Pod，但 Service 无后端，优先检查什么？" :options="['增加集群节点', 'Service selector、Pod labels、readiness 与 EndpointSlice', '重新创建 namespace']" :answer="1" explanation="Running 不等于 ready/被 Service 选中；端点链路是直接证据。" />

## 本章小结

- Kubernetes 通过 API 声明、controller、scheduler 和 kubelet持续调和状态。
- workload controller 管生命周期；Pod 短命，不是固定服务器。
- Service/DNS/入口/Endpoint/Policy 构成网络路径，逐层排查。
- 配置、密钥和持久存储各有独立安全/恢复生命周期。
- 探针、滚动参数和优雅终止必须表达真实接流量能力。

<EvidenceTracker lesson="advanced-quality-01-kubernetes-core" />

## 本章完成标准

部署并解释最小工作负载；注入网络/探针/Pod 故障；持续流量滚动无丢失；能说清 Secret 和 StatefulSet 没有替你保证什么。最近平均至少 7/10。

<div class="source-note">主要来源（核验于 2026-08-31）：<a href="https://kubernetes.io/docs/home/">Kubernetes Documentation</a>；当前站点列 v1.37 与历史版本。具体 API/特性按目标集群版本核对，不依赖 latest 记忆。</div>
