import { aiLearningNodeCount, aiNodeIdsForPage } from "./ai-learning-nodes.ts";

export type AdvancedDomainKey = "software" | "quality" | "ai";

export interface AdvancedChapter {
  text: string;
  link: string;
  ids: string[];
  prerequisite: string;
  hardPrerequisite?: string;
  recommendedPrerequisite?: string;
  unlockEvidence?: string;
  unlock: string;
  outcome: string;
  stageReview?: {
    text: string;
    link: string;
  };
}

export interface AdvancedDomain {
  key: AdvancedDomainKey;
  title: string;
  short: string;
  count: number;
  accent: string;
  chapters: AdvancedChapter[];
  roadmap?: {
    text: string;
    link: string;
  };
  summary?: {
    text: string;
    link: string;
  };
}

export const advancedDomains: AdvancedDomain[] = [
  {
    key: "software",
    title: "软件与系统工程 · 可选进阶",
    short: "从性能证据到分布式架构演进",
    count: aiLearningNodeCount("advanced"),
    accent: "#256f68",
    chapters: [
      { text: "01 · 性能模型、基准与 Profiling", link: "/advanced/software/01-performance", ids: ["ASW01", "ASW02", "ASW03"], prerequisite: "SW04—07、Q12", unlock: "延迟、吞吐、CPU 或内存已成为真实瓶颈", outcome: "性能预算、可复现实验与火焰图证据" },
      { text: "02 · 编译器、运行时、GC 与 JIT", link: "/advanced/software/02-runtime-compiler", ids: ["ASW04", "ASW05", "ASW06"], prerequisite: "SW01—06、ASW01—03", unlock: "运行时停顿、编译产物或语言边界影响产品", outcome: "从源码到机器执行的因果解释与测量" },
      { text: "03 · Linux 内核、eBPF 与高性能网络", link: "/advanced/software/03-kernel-ebpf", ids: ["ASW07", "ASW08", "ASW09"], prerequisite: "SW05—07、ASW01—03", unlock: "用户态日志无法解释系统调用、调度或网络瓶颈", outcome: "低侵入观测、系统调用路径与网络剖析" },
      { text: "04 · 分布式故障、一致性与 Raft", link: "/advanced/software/04-distributed-consensus", ids: ["ASW10", "ASW11", "ASW12"], prerequisite: "SW06、SW11、SW13、Q13—14", unlock: "系统出现多副本、选主、跨节点写入或网络分区", outcome: "明确故障模型并验证共识安全性" },
      { text: "05 · 分布式存储、流处理与跨系统事务", link: "/advanced/software/05-storage-streaming", ids: ["ASW13", "ASW14", "ASW15"], prerequisite: "SW10—13、ASW10—12", unlock: "单库/普通队列无法满足吞吐、重放或一致性", outcome: "分区、背压、重放与补偿的可恢复设计" },
      { text: "06 · 服务边界、事件架构与演进", link: "/advanced/software/06-architecture-evolution", ids: ["ASW16", "ASW17", "ASW18"], prerequisite: "SW12—16、Q10—14", unlock: "团队边界、独立伸缩或审计需求值得承担分布式复杂度", outcome: "有退出策略的服务拆分与事件演进 ADR" },
    ],
  },
  {
    key: "quality",
    title: "软件质量与生产交付 · 可选进阶",
    short: "从容器编排到平台与韧性治理",
    count: 18,
    accent: "#b26900",
    chapters: [
      { text: "01 · Kubernetes 工作负载、网络与存储", link: "/advanced/quality/01-kubernetes-core", ids: ["AQ01", "AQ02", "AQ03"], prerequisite: "Q09—14、SW07—11", unlock: "多个服务的部署、发现、伸缩和状态管理已持续耗时", outcome: "可探测、可滚动、可持久化的最小工作负载" },
      { text: "02 · 调度、扩缩、RBAC 与集群安全", link: "/advanced/quality/02-kubernetes-operations", ids: ["AQ04", "AQ05", "AQ06"], prerequisite: "AQ01—03、Q13—15", unlock: "共享集群出现资源争用、权限或容量风险", outcome: "有资源边界、最小权限与扩缩证据的集群策略" },
      { text: "03 · IaC、GitOps、策略与漂移", link: "/advanced/quality/03-iac-gitops", ids: ["AQ07", "AQ08", "AQ09"], prerequisite: "Q08—11、Q15", unlock: "环境配置不可复现、不可审计或经常漂移", outcome: "可审阅 plan、持续调和与受控例外" },
      { text: "04 · 负载、Profiling、容量与排队", link: "/advanced/quality/04-performance-capacity", ids: ["AQ10", "AQ11", "AQ12"], prerequisite: "Q12—14、ASW01—03", unlock: "p95/p99、饱和或基础设施成本成为约束", outcome: "负载模型、饱和点和容量预算" },
      { text: "05 · Chaos、Game Day 与错误预算治理", link: "/advanced/quality/05-chaos-sre", ids: ["AQ13", "AQ14", "AQ15"], prerequisite: "Q12—14、AQ10—12", unlock: "已有可观测性和恢复手段，需要验证未知故障", outcome: "受控实验、恢复演练与基于预算的发布决策" },
      { text: "06 · 多区域容灾、平台工程与供应链", link: "/advanced/quality/06-platform-resilience", ids: ["AQ16", "AQ17", "AQ18"], prerequisite: "Q10—16、AQ07—15", unlock: "单区域风险、多团队重复劳动或供应链控制成为组织瓶颈", outcome: "可演练容灾、最小可行平台与策略化供应链" },
    ],
  },
  {
    key: "ai",
    title: "AI 应用与 Agent 系统 · 可选进阶",
    short: "从模型原理到自托管与多 Agent 治理",
    count: 18,
    accent: "#6b66c8",
    chapters: [
      { text: "01 · 线性代数、概率、信息论与优化", link: "/advanced/ai/01-math-optimization", ids: aiNodeIdsForPage("advanced", "/advanced/ai/01-math-optimization"), prerequisite: "AI01—02、基础代数与 Python", unlock: "需要理解训练、论文结论或模型评估边界", outcome: "用张量、概率与梯度解释模型行为" },
      { text: "02 · Transformer、Tokenization 与训练系统", link: "/advanced/ai/02-transformer-training", ids: aiNodeIdsForPage("advanced", "/advanced/ai/02-transformer-training"), prerequisite: "AAI01—03、AI01—04", unlock: "模型结构、数据或训练资源影响产品决策", outcome: "解释注意力、数据管线和分布式训练约束", stageReview: { text: "阶段一总结 · 从表示判断到训练证据", link: "/advanced/ai/stage-1-review" } },
      { text: "03 · PEFT/LoRA、偏好优化与评测数据", link: "/advanced/ai/03-finetuning", ids: aiNodeIdsForPage("advanced", "/advanced/ai/03-finetuning"), prerequisite: "AAI01—06、AI15—17", unlock: "Prompt/RAG 基线不足且已有稳定任务、数据和指标", outcome: "可回退的微调实验与独立评测" },
      { text: "04 · 推理系统、KV Cache、量化与服务", link: "/advanced/ai/04-inference", ids: aiNodeIdsForPage("advanced", "/advanced/ai/04-inference"), prerequisite: "AAI04—09、Q12—14", unlock: "自托管吞吐、显存、延迟或成本决定可行性", outcome: "有正确性回归的推理优化与容量计划", stageReview: { text: "阶段二总结 · 从适配实验到可服务模型", link: "/advanced/ai/stage-2-review" } },
      { text: "05 · Advanced RAG、GraphRAG 与多模态检索", link: "/advanced/ai/05-advanced-rag", ids: aiNodeIdsForPage("advanced", "/advanced/ai/05-advanced-rag"), prerequisite: "AI05—08", hardPrerequisite: "版本化语料、普通混合检索基线、必要证据集与分层检索错误账本", recommendedPrerequisite: "AAI10—12 的服务容量与正确性回归；AI15—17 的评测主张与 Trace", unlock: "普通混合检索基线无法解决多跳关系或多模态证据", unlockEvidence: "逐题失败稳定集中在多跳依赖或页面/多模态结构，且增加 top-k、重排或修正基础解析仍不能找齐必要证据", outcome: "分层检索评测、图索引与可引用多模态证据" },
      { text: "06 · 多 Agent、协调协议与自治治理", link: "/advanced/ai/06-multi-agent", ids: aiNodeIdsForPage("advanced", "/advanced/ai/06-multi-agent"), prerequisite: "AAI13—15、AI09—19", hardPrerequisite: "单 Agent 或固定工作流基线、类型化工具与权限边界、可复位 Runtime、任务级评测和总预算", recommendedPrerequisite: "Q12—15 的可观测性与生产门禁；一份可追溯证据账本", unlock: "角色并行或独立权限相对单工作流有可测收益", unlockEvidence: "至少两条分支可独立开始，或权限必须隔离；同预算 pilot 显示覆盖、时延或风险中至少一项净改善", outcome: "有预算、终止条件、审计与对照实验的多 Agent 系统", stageReview: { text: "阶段三总结 · 复杂检索与协作是否值得", link: "/advanced/ai/stage-3-review" } },
    ],
    roadmap: { text: "三阶段进阶路线", link: "/advanced/ai/roadmap" },
    summary: { text: "AI 进阶总结 · 用瓶颈选择复杂度", link: "/advanced/ai/summary" },
  },
];

export const totalAdvancedNodeCount = advancedDomains.reduce((sum, domain) => sum + domain.count, 0);

export function advancedSidebar(key: AdvancedDomainKey) {
  const domain = advancedDomains.find((item) => item.key === key)!;
  return [
    { text: "进阶入口", items: [
      { text: "三类进阶总览", link: "/advanced/" },
      { text: "本类知识地图", link: `/advanced/${key}/` },
    ] },
    { text: `${domain.count} 个可选节点`, items: [
      ...domain.chapters.flatMap(({ text, link, stageReview }) => [
        { text, link },
        ...(stageReview ? [stageReview] : []),
      ]),
      ...(domain.summary ? [domain.summary] : []),
    ] },
  ];
}
