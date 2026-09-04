import { domains } from "./curriculum";
import { advancedDomains } from "./advanced-curriculum";
import { agentFrontierChapters, agentFrontierRoadmap } from "./agent-frontier";
import { learningFieldBySlug } from "./field-curriculum";

type SidebarItem = {
  text: string;
  link?: string;
  collapsed?: boolean;
  items?: SidebarItem[];
};

const guideItems: SidebarItem[] = [
  { text: "学习系统说明", link: "/guide/" },
  { text: "15 题起点诊断", link: "/guide/diagnostic" },
  { text: "12 周最小路线", link: "/guide/plan" },
  { text: "AI 编码协作", link: "/guide/ai-coding" },
  { text: "怎样判断掌握", link: "/guide/mastery" },
  { text: "每周复盘与恢复", link: "/guide/review" },
];

const caseItems: SidebarItem[] = [
  { text: "案例总览", link: "/cases/" },
  { text: "01 · 个人任务板", link: "/cases/01-task-board" },
  { text: "02 · 多租户任务运行器", link: "/cases/02-task-runner" },
  { text: "03 · 可引用知识助手", link: "/cases/03-rag-assistant" },
  { text: "04 · 有审批的工具 Agent", link: "/cases/04-tool-agent" },
  { text: "05 · AI 代码审查流水线", link: "/cases/05-code-review" },
  { text: "06 · 学习证据系统", link: "/cases/06-learning-system" },
];

const templateItems: SidebarItem[] = [
  { text: "架构模板总览", link: "/templates/" },
  { text: "需求与约束画布", link: "/templates/requirements" },
  { text: "C4 与数据流", link: "/templates/system-map" },
  { text: "API 与数据契约", link: "/templates/contracts" },
  { text: "测试与发布策略", link: "/templates/delivery" },
  { text: "ADR 架构决策记录", link: "/templates/adr" },
  { text: "Agent 安全边界", link: "/templates/agent-safety" },
];

const learningEntry: SidebarItem = {
  text: "学习",
  items: [
    { text: "学习首页", link: "/learn/" },
    { text: "学习方法", collapsed: true, items: guideItems },
    { text: "知识全景", link: "/map/" },
    { text: "项目案例", collapsed: true, items: caseItems },
    { text: "架构模板", collapsed: true, items: templateItems },
    { text: "正式学习", link: "/learn/formal/" },
  ],
};

const topicChoices: SidebarItem = {
  text: "按专题选择",
  items: [
    { text: "软件与系统工程", link: "/domains/software/" },
    { text: "质量与生产交付", link: "/domains/quality/" },
    { text: "AI 应用与 Agent", link: "/domains/ai/" },
    { text: "模型学习", link: "/fields/machine-learning/" },
    { text: "物理 AI", link: "/fields/low-altitude/" },
  ],
};

const domainModule = (key: "software" | "quality" | "ai", label: string): SidebarItem => {
  const domain = domains.find((item) => item.key === key)!;
  return {
    text: label,
    collapsed: false,
    items: [
      { text: "专题总览", link: `/domains/${key}/` },
      { text: "学习路线", link: `/domains/${key}/roadmap` },
      ...domain.chapters.flatMap(({ text, link, stageReview }) => [
        { text, link },
        ...(stageReview ? [stageReview] : []),
      ]),
      ...(domain.summary ? [domain.summary] : []),
    ],
  };
};

const advancedModule = (key: "software" | "quality" | "ai", label: string): SidebarItem => {
  const domain = advancedDomains.find((item) => item.key === key)!;
  return {
    text: label,
    collapsed: true,
    items: [
      { text: "进阶总览", link: `/advanced/${key}/` },
      ...(domain.roadmap ? [domain.roadmap] : []),
      ...domain.chapters.flatMap(({ text, link, stageReview }) => [
        { text, link },
        ...(stageReview ? [stageReview] : []),
      ]),
      ...(domain.summary ? [domain.summary] : []),
    ],
  };
};

const fieldModule = (slug: string, label?: string): SidebarItem => {
  const field = learningFieldBySlug[slug];
  const stages = [...new Set(field.chapters.map((chapter) => chapter.stage))];
  const items: SidebarItem[] = [
    { text: "专题总览", link: `/fields/${slug}/` },
    { text: "完整学习路线", link: `/fields/${slug}/roadmap` },
    { text: "证据账本", link: `/fields/${slug}/evidence` },
    ...(field.fieldSummary ? [field.fieldSummary] : []),
  ];

  stages.forEach((stage, stageIndex) => {
    items.push(
      ...field.chapters
        .filter((chapter) => chapter.stage === stage)
        .map(({ text, link }) => ({ text: `[阶段 ${stageIndex + 1}] ${text}`, link })),
      ...(field.stageSummaries ?? [])
        .filter((summary) => summary.stage === stage)
        .map(({ text, link }) => ({ text, link })),
    );
  });

  return { text: label ?? field.shortTitle, collapsed: true, items };
};

const agentModule: SidebarItem = {
  text: "Agent 前沿",
  collapsed: true,
  items: [
    { text: "专题总览", link: "/frontier/agents/" },
    agentFrontierRoadmap,
    ...agentFrontierChapters.flatMap(({ text, link, stageReview }) => [
      { text, link },
      ...(stageReview ? [stageReview] : []),
    ]),
    { text: "Agent 前沿总结 · 用证据决定自治", link: "/frontier/agents/summary" },
  ],
};

export const learningHubSidebar = (): SidebarItem[] => [learningEntry, topicChoices];

export const softwareLearningSidebar = (): SidebarItem[] => [
  learningEntry,
  { text: "软件与系统工程", items: [domainModule("software", "核心学习 · 16 节点"), advancedModule("software", "软件进阶 · 18 节点")] },
  topicChoices,
];

export const qualityLearningSidebar = (): SidebarItem[] => [
  learningEntry,
  { text: "质量与生产交付", items: [domainModule("quality", "核心学习 · 16 节点"), advancedModule("quality", "交付进阶 · 18 节点")] },
  topicChoices,
];

export const aiLearningSidebar = (): SidebarItem[] => [
  learningEntry,
  {
    text: "AI 应用与 Agent",
    items: [
      domainModule("ai", "核心学习 · 19 节点 / 7 章"),
      advancedModule("ai", "AI 进阶 · 18 节点"),
      agentModule,
      fieldModule("ai-product", "AI 产品经理 · 正式学习"),
    ],
  },
  topicChoices,
];

export const modelLearningSidebar = (): SidebarItem[] => [
  learningEntry,
  {
    text: "模型学习",
    items: [
      fieldModule("machine-learning", "机器学习 · 正式学习"),
      fieldModule("deep-learning", "深度学习 · 正式学习"),
      fieldModule("nlp", "NLP · 正式学习"),
    ],
  },
  topicChoices,
];

export const physicalLearningSidebar = (): SidebarItem[] => [
  learningEntry,
  {
    text: "物理 AI",
    items: [
      fieldModule("low-altitude", "低空智能 · 正式学习"),
      fieldModule("robotics", "机器人 · 正式学习"),
    ],
  },
  topicChoices,
];

const bookReviews: SidebarItem[] = [
  { text: "统计学习导论", link: "/knowledge-base/reviews/machine-learning/islr" },
  { text: "理解机器学习", link: "/knowledge-base/reviews/machine-learning/understanding-ml" },
  { text: "机器学习数学", link: "/knowledge-base/reviews/machine-learning/mathematics-ml" },
  { text: "概率机器学习入门", link: "/knowledge-base/reviews/machine-learning/probml-intro" },
  { text: "概率机器学习进阶", link: "/knowledge-base/reviews/machine-learning/probml-advanced" },
  { text: "公平与机器学习", link: "/knowledge-base/reviews/machine-learning/fairness-ml" },
  { text: "因果推断", link: "/knowledge-base/reviews/machine-learning/causal-what-if" },
  { text: "可解释机器学习", link: "/knowledge-base/reviews/machine-learning/interpretable-ml" },
  { text: "深度学习", link: "/knowledge-base/reviews/machine-learning/deep-learning" },
  { text: "高斯过程", link: "/knowledge-base/reviews/machine-learning/gpml" },
  { text: "凸优化", link: "/knowledge-base/reviews/machine-learning/convex-optimization" },
  { text: "数据科学基础", link: "/knowledge-base/reviews/machine-learning/foundations-data-science" },
  { text: "动手学深度学习", link: "/knowledge-base/reviews/machine-learning/d2l" },
];

const deepLearningBookReviews: SidebarItem[] = [
  { text: "深度学习", link: "/knowledge-base/reviews/deep-learning/deep-learning-book" },
  { text: "动手学深度学习", link: "/knowledge-base/reviews/machine-learning/d2l" },
  { text: "理解深度学习", link: "/knowledge-base/reviews/ai-agent/understanding-deep-learning" },
  { text: "神经网络与深度学习", link: "/knowledge-base/reviews/deep-learning/neural-networks-deep-learning" },
  { text: "几何深度学习", link: "/knowledge-base/reviews/ai-agent/geometric-deep-learning" },
  { text: "概率机器学习导论", link: "/knowledge-base/reviews/machine-learning/probml-intro" },
  { text: "概率机器学习进阶", link: "/knowledge-base/reviews/machine-learning/probml-advanced" },
  { text: "机器学习数学", link: "/knowledge-base/reviews/machine-learning/mathematics-ml" },
  { text: "语音与语言处理第三版", link: "/knowledge-base/reviews/nlp/slp3" },
  { text: "深度学习小书", link: "/knowledge-base/reviews/ai-agent/little-book-deep-learning" },
  { text: "深度学习理论原理", link: "/knowledge-base/reviews/deep-learning/principles-dl-theory" },
  { text: "深度学习的数学工程", link: "/knowledge-base/reviews/deep-learning/mathematical-engineering-dl" },
  { text: "物理驱动的深度学习", link: "/knowledge-base/reviews/deep-learning/physics-based-dl" },
  { text: "机器学习系统", link: "/knowledge-base/reviews/ai-product/ml-systems" },
  { text: "深度学习调参手册", link: "/knowledge-base/reviews/deep-learning/tuning-playbook" },
  { text: "大语言模型基础", link: "/knowledge-base/reviews/ai-agent/foundations-llm" },
  { text: "深度学习理论", link: "/knowledge-base/reviews/deep-learning/deep-learning-theory" },
  { text: "面向程序员的 fastai 与 PyTorch 深度学习", link: "/knowledge-base/reviews/deep-learning/fastbook" },
];

const nlpBookReviews: SidebarItem[] = [
  { text: "语音与语言处理（第三版）", link: "/knowledge-base/reviews/nlp/slp3" },
  { text: "Python 自然语言处理", link: "/knowledge-base/reviews/ai-agent/nltk-book" },
  { text: "信息检索导论", link: "/knowledge-base/reviews/ai-agent/ir-book" },
  { text: "用 R 进行文本挖掘", link: "/knowledge-base/reviews/nlp/tidy-text-mining" },
  { text: "R 语言文本监督学习", link: "/knowledge-base/reviews/nlp/supervised-ml-text" },
  { text: "大语言模型基础", link: "/knowledge-base/reviews/ai-agent/foundations-llm" },
  { text: "自然语言处理：神经网络与大语言模型", link: "/knowledge-base/reviews/ai-agent/niutrans-nlp" },
  { text: "自然语言处理神经网络模型入门", link: "/knowledge-base/reviews/ai-agent/neural-nlp-primer" },
  { text: "搜索引擎与信息检索实践", link: "/knowledge-base/reviews/nlp/search-engines" },
  { text: "大规模数据挖掘", link: "/knowledge-base/reviews/nlp/mining-massive-datasets" },
  { text: "人人都能理解的机器翻译", link: "/knowledge-base/reviews/nlp/mt-for-everyone" },
  { text: "语言学家的 Unicode 实用手册", link: "/knowledge-base/reviews/nlp/unicode-cookbook" },
  { text: "自然语言处理中的多词表达", link: "/knowledge-base/reviews/nlp/multiword-expressions" },
  { text: "语境中的指称表达生成", link: "/knowledge-base/reviews/nlp/referring-expression" },
  { text: "通用依存关系标注指南", link: "/knowledge-base/reviews/nlp/universal-dependencies" },
];

const aiProductBookReviews: SidebarItem[] = [
  { text: "人与 AI 指南", link: "/knowledge-base/reviews/ai-product/pair-guidebook" },
  { text: "AI 产品经理手册（2026）", link: "/knowledge-base/reviews/ai-product/ai-product-manager-handbook-2026" },
  { text: "塑造：交付真正重要的工作", link: "/knowledge-base/reviews/ai-product/shape-up" },
  { text: "以人为本设计实践指南", link: "/knowledge-base/reviews/ai-product/field-guide-hcd" },
  { text: "战略产品管理", link: "/knowledge-base/reviews/ai-product/strategic-product-management" },
  { text: "技术产品管理", link: "/knowledge-base/reviews/ai-product/technical-product-management" },
  { text: "成功的产品上市", link: "/knowledge-base/reviews/ai-product/successful-go-to-market" },
  { text: "真正的创业实践手册", link: "/knowledge-base/reviews/ai-product/real-startup-book" },
  { text: "产品发现实战手册", link: "/knowledge-base/reviews/ai-product/product-discovery-playbook" },
  { text: "精益服务创建手册", link: "/knowledge-base/reviews/ai-product/lean-service-creation" },
  { text: "用户体验与人工智能", link: "/knowledge-base/reviews/ai-product/user-experience-ai" },
  { text: "AI 测量科学", link: "/knowledge-base/reviews/ai-product/ai-measurement-science" },
];

const aiAgentBookReviews: SidebarItem[] = [
  { text: "人工智能与计算智能体基础", link: "/knowledge-base/reviews/ai-agent/aifca" },
  { text: "机器学习数学", link: "/knowledge-base/reviews/machine-learning/mathematics-ml" },
  { text: "概率机器学习导论", link: "/knowledge-base/reviews/machine-learning/probml-intro" },
  { text: "概率机器学习进阶", link: "/knowledge-base/reviews/machine-learning/probml-advanced" },
  { text: "深度学习", link: "/knowledge-base/reviews/machine-learning/deep-learning" },
  { text: "动手学深度学习", link: "/knowledge-base/reviews/machine-learning/d2l" },
  { text: "理解深度学习", link: "/knowledge-base/reviews/ai-agent/understanding-deep-learning" },
  { text: "几何深度学习", link: "/knowledge-base/reviews/ai-agent/geometric-deep-learning" },
  { text: "深度学习小书", link: "/knowledge-base/reviews/ai-agent/little-book-deep-learning" },
  { text: "信息论、推断与学习算法", link: "/knowledge-base/reviews/ai-agent/information-theory" },
  { text: "语音与语言处理第三版", link: "/knowledge-base/reviews/ai-agent/slp3" },
  { text: "Python 自然语言处理", link: "/knowledge-base/reviews/ai-agent/nltk-book" },
  { text: "信息检索导论", link: "/knowledge-base/reviews/ai-agent/ir-book" },
  { text: "自然语言处理神经网络与大语言模型", link: "/knowledge-base/reviews/ai-agent/niutrans-nlp" },
  { text: "大语言模型基础", link: "/knowledge-base/reviews/ai-agent/foundations-llm" },
  { text: "自然语言处理神经网络模型入门", link: "/knowledge-base/reviews/ai-agent/neural-nlp-primer" },
  { text: "图表示学习", link: "/knowledge-base/reviews/ai-agent/graph-representation-learning" },
  { text: "用 MapReduce 处理数据密集型文本", link: "/knowledge-base/reviews/ai-agent/mapreduce-text" },
  { text: "超大规模语言模型训练实践手册", link: "/knowledge-base/reviews/ai-agent/ultrascale-playbook" },
  { text: "贝叶斯思维第二版", link: "/knowledge-base/reviews/ai-agent/think-bayes" },
  { text: "强化学习导论第二版", link: "/knowledge-base/reviews/ai-agent/rl-introduction" },
  { text: "决策算法", link: "/knowledge-base/reviews/ai-agent/algorithms-decision-making" },
  { text: "规划算法", link: "/knowledge-base/reviews/ai-agent/planning-algorithms" },
  { text: "多智能体系统算法博弈与逻辑基础", link: "/knowledge-base/reviews/ai-agent/multiagent-systems" },
  { text: "多智能体强化学习", link: "/knowledge-base/reviews/ai-agent/marl" },
  { text: "多臂老虎机算法", link: "/knowledge-base/reviews/ai-agent/bandit-algorithms" },
  { text: "分布强化学习", link: "/knowledge-base/reviews/ai-agent/distributional-rl" },
  { text: "强化学习理论与算法", link: "/knowledge-base/reviews/ai-agent/rl-theory" },
  { text: "软件基础", link: "/knowledge-base/reviews/software/software-foundations" },
  { text: "操作系统三部曲", link: "/knowledge-base/reviews/software/ostep" },
  { text: "开放数据结构", link: "/knowledge-base/reviews/software/open-data-structures" },
  { text: "算法", link: "/knowledge-base/reviews/software/algorithms-erickson" },
  { text: "计算机网络", link: "/knowledge-base/reviews/software/computer-networking" },
  { text: "数据库设计", link: "/knowledge-base/reviews/software/database-design" },
  { text: "分布式系统", link: "/knowledge-base/reviews/software/distributed-systems" },
  { text: "分布式算法", link: "/knowledge-base/reviews/software/distributed-algorithms" },
  { text: "开源应用架构", link: "/knowledge-base/reviews/software/aosa" },
  { text: "五百行以内", link: "/knowledge-base/reviews/software/aosa-500-lines" },
  { text: "站点可靠性工程", link: "/knowledge-base/reviews/software/google-sre" },
  { text: "站点可靠性工作手册", link: "/knowledge-base/reviews/software/sre-workbook" },
  { text: "构建安全可靠的系统", link: "/knowledge-base/reviews/software/secure-reliable-systems" },
  { text: "安全工程第三版", link: "/knowledge-base/reviews/ai-agent/security-engineering" },
  { text: "网络安全中的大语言模型", link: "/knowledge-base/reviews/ai-agent/llm-cybersecurity" },
  { text: "软件工程知识体系第四版", link: "/knowledge-base/reviews/software/swebok-v4" },
];

const softwareBookReviews: SidebarItem[] = [
  { text: "软件基础与程序证明", link: "/knowledge-base/reviews/software/software-foundations" },
  { text: "手搓解释器", link: "/knowledge-base/reviews/software/crafting-interpreters" },
  { text: "Rust 程序设计语言", link: "/knowledge-base/reviews/software/rust-book" },
  { text: "操作系统导论", link: "/knowledge-base/reviews/software/ostep" },
  { text: "深入理解计算机系统实践", link: "/knowledge-base/reviews/software/dive-into-systems" },
  { text: "开放数据结构", link: "/knowledge-base/reviews/software/open-data-structures" },
  { text: "算法设计", link: "/knowledge-base/reviews/software/algorithms-erickson" },
  { text: "计算机网络原理、协议与实践", link: "/knowledge-base/reviews/software/computer-networking" },
  { text: "数据库设计", link: "/knowledge-base/reviews/software/database-design" },
  { text: "分布式系统第四版", link: "/knowledge-base/reviews/software/distributed-systems" },
  { text: "分布式算法 2020", link: "/knowledge-base/reviews/software/distributed-algorithms" },
  { text: "开源应用架构", link: "/knowledge-base/reviews/software/aosa" },
  { text: "五百行以内", link: "/knowledge-base/reviews/software/aosa-500-lines" },
  { text: "网站可靠性工程", link: "/knowledge-base/reviews/software/google-sre" },
  { text: "网站可靠性工程工作手册", link: "/knowledge-base/reviews/software/sre-workbook" },
  { text: "构建安全可靠系统", link: "/knowledge-base/reviews/software/secure-reliable-systems" },
  { text: "Pro Git 第二版", link: "/knowledge-base/reviews/software/pro-git" },
  { text: "软件工程知识体系第四版", link: "/knowledge-base/reviews/software/swebok-v4" },
];

const qualityBookReviews: SidebarItem[] = [
  { text: "软件工程知识体系第四版", link: "/knowledge-base/reviews/quality/swebok-v4" },
  { text: "ISTQB 基础级测试大纲", link: "/knowledge-base/reviews/quality/istqb-ctfl" },
  { text: "ISTQB 高级测试分析师大纲", link: "/knowledge-base/reviews/quality/istqb-test-analyst" },
  { text: "ISTQB 测试自动化工程大纲", link: "/knowledge-base/reviews/quality/istqb-test-automation" },
  { text: "ISTQB 高级测试管理大纲", link: "/knowledge-base/reviews/quality/istqb-test-management" },
  { text: "NASA 软件工程手册", link: "/knowledge-base/reviews/quality/nasa-software" },
  { text: "NASA 系统工程手册", link: "/knowledge-base/reviews/quality/nasa-systems" },
  { text: "pytest 文档", link: "/knowledge-base/reviews/quality/pytest" },
  { text: "Playwright 文档", link: "/knowledge-base/reviews/quality/playwright" },
  { text: "Hypothesis 文档", link: "/knowledge-base/reviews/quality/hypothesis" },
  { text: "Pact 契约测试文档", link: "/knowledge-base/reviews/quality/pact" },
  { text: "OpenAPI 规范", link: "/knowledge-base/reviews/quality/openapi" },
  { text: "语义化版本规范", link: "/knowledge-base/reviews/quality/semver" },
  { text: "可复现构建文档", link: "/knowledge-base/reviews/quality/reproducible-builds" },
  { text: "Docker Build 文档", link: "/knowledge-base/reviews/quality/docker-build" },
  { text: "GitHub Actions 文档", link: "/knowledge-base/reviews/quality/github-actions" },
  { text: "Google 网站可靠性工程", link: "/knowledge-base/reviews/quality/google-sre" },
  { text: "网站可靠性工程工作手册", link: "/knowledge-base/reviews/quality/sre-workbook" },
  { text: "构建安全可靠系统", link: "/knowledge-base/reviews/quality/secure-reliable" },
  { text: "OpenTelemetry 文档与规范", link: "/knowledge-base/reviews/quality/opentelemetry" },
  { text: "Prometheus 文档", link: "/knowledge-base/reviews/quality/prometheus" },
  { text: "NIST 风险评估指南", link: "/knowledge-base/reviews/quality/nist-risk" },
  { text: "NIST 安全软件开发框架", link: "/knowledge-base/reviews/quality/nist-ssdf" },
  { text: "NIST 事件响应建议", link: "/knowledge-base/reviews/quality/nist-incident" },
  { text: "NIST 信息系统应急规划指南", link: "/knowledge-base/reviews/quality/nist-contingency" },
  { text: "NIST 应用容器安全指南", link: "/knowledge-base/reviews/quality/nist-container" },
  { text: "OWASP Web 安全测试指南", link: "/knowledge-base/reviews/quality/owasp-wstg" },
  { text: "OWASP 应用安全验证标准", link: "/knowledge-base/reviews/quality/owasp-asvs" },
  { text: "SLSA 供应链安全规范", link: "/knowledge-base/reviews/quality/slsa" },
  { text: "in-toto 供应链证明规范", link: "/knowledge-base/reviews/quality/in-toto" },
  { text: "软件更新框架规范", link: "/knowledge-base/reviews/quality/tuf" },
  { text: "SPDX 3.0 规范", link: "/knowledge-base/reviews/quality/spdx" },
  { text: "CycloneDX 规范", link: "/knowledge-base/reviews/quality/cyclonedx" },
  { text: "Kubernetes 官方文档", link: "/knowledge-base/reviews/quality/kubernetes" },
  { text: "Kubernetes 安全检查清单", link: "/knowledge-base/reviews/quality/kubernetes-security" },
  { text: "云原生安全白皮书第二版", link: "/knowledge-base/reviews/quality/cloud-native-security" },
  { text: "OpenGitOps 原则", link: "/knowledge-base/reviews/quality/opengitops" },
  { text: "Terraform 文档", link: "/knowledge-base/reviews/quality/terraform" },
  { text: "Argo CD 文档", link: "/knowledge-base/reviews/quality/argocd" },
  { text: "混沌工程原则", link: "/knowledge-base/reviews/quality/principles-chaos" },
  { text: "CNCF 平台白皮书", link: "/knowledge-base/reviews/quality/cncf-platforms" },
  { text: "平台工程成熟度模型", link: "/knowledge-base/reviews/quality/platform-maturity" },
];

export const knowledgeBaseSidebar = (): SidebarItem[] => [
  {
    text: "知识库",
    items: [
      { text: "知识库首页", link: "/knowledge-base/" },
      { text: "来源治理规则", link: "/sources/" },
    ],
  },
  {
    text: "软件与系统工程",
    items: [
      { text: "教材与论文目录", link: "/knowledge-base/software" },
      {
        text: "教材阅读综述",
        collapsed: true,
        items: softwareBookReviews,
      },
    ],
  },
  {
    text: "质量与生产交付",
    items: [
      { text: "教材与论文目录", link: "/knowledge-base/quality" },
      {
        text: "教材阅读综述",
        collapsed: true,
        items: qualityBookReviews,
      },
    ],
  },
  {
    text: "AI 应用与 Agent",
    items: [
      { text: "教材与论文目录", link: "/knowledge-base/ai-agent" },
      {
        text: "教材阅读综述",
        collapsed: true,
        items: aiAgentBookReviews,
      },
      {
        text: "AI 产品经理",
        collapsed: true,
        items: [
          { text: "教材与论文目录", link: "/knowledge-base/ai-product" },
          {
            text: "教材阅读综述",
            collapsed: true,
            items: aiProductBookReviews,
          },
        ],
      },
    ],
  },
  {
    text: "模型学习",
    items: [
      { text: "专题知识库", link: "/knowledge-base/model-learning" },
      {
        text: "机器学习",
        collapsed: true,
        items: [
          { text: "教材与论文目录", link: "/knowledge-base/machine-learning" },
          {
            text: "教材阅读综述",
            collapsed: true,
            items: bookReviews,
          },
        ],
      },
      {
        text: "深度学习",
        collapsed: true,
        items: [
          { text: "教材与论文目录", link: "/knowledge-base/deep-learning" },
          {
            text: "教材阅读综述",
            collapsed: true,
            items: deepLearningBookReviews,
          },
        ],
      },
      {
        text: "NLP",
        collapsed: true,
        items: [
          { text: "教材与论文目录", link: "/knowledge-base/nlp" },
          {
            text: "教材阅读综述",
            collapsed: true,
            items: nlpBookReviews,
          },
        ],
      },
    ],
  },
  {
    text: "物理 AI",
    items: [
      { text: "专题知识库", link: "/knowledge-base/physical-ai" },
    ],
  },
];
