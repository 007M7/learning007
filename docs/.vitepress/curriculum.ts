import { aiLearningNodeCount, aiNodeIdsForPage } from "./ai-learning-nodes.ts";

export type LessonLevel = "core" | "project" | "advanced";

export interface Chapter {
  text: string;
  link: string;
  ids: string[];
  level?: LessonLevel;
  stageReview?: {
    text: string;
    link: string;
  };
}

export interface Domain {
  key: "software" | "quality" | "ai";
  title: string;
  short: string;
  count: number;
  chapters: Chapter[];
  summary?: {
    text: string;
    link: string;
  };
}

export const domains: Domain[] = [
  {
    key: "software",
    title: "软件与系统工程",
    short: "从代码执行到架构决策",
    count: 16,
    chapters: [
      { text: "01 · 程序、类型、模块与 Git", link: "/domains/software/01-programming", ids: ["SW01", "SW02", "SW03"] },
      { text: "02 · 数据结构、操作系统与并发", link: "/domains/software/02-runtime", ids: ["SW04", "SW05", "SW06"] },
      { text: "03 · 网络、浏览器与 API", link: "/domains/software/03-web-api", ids: ["SW07", "SW08", "SW09"] },
      { text: "04 · SQL、事务、索引与迁移", link: "/domains/software/04-data", ids: ["SW10", "SW11"] },
      { text: "05 · 分层、状态机与幂等", link: "/domains/software/05-design", ids: ["SW12", "SW13"] },
      { text: "06 · 权限、质量属性与架构决策", link: "/domains/software/06-architecture", ids: ["SW14", "SW15", "SW16"] },
    ],
  },
  {
    key: "quality",
    title: "软件质量与生产交付",
    short: "从验收标准到故障恢复",
    count: 16,
    chapters: [
      { text: "01 · 需求、风险与测试策略", link: "/domains/quality/01-strategy", ids: ["Q01", "Q02"] },
      { text: "02 · 单元、集成、契约与端到端测试", link: "/domains/quality/02-testing", ids: ["Q03", "Q04", "Q05", "Q06"] },
      { text: "03 · 静态检查、制品与容器", link: "/domains/quality/03-build", ids: ["Q07", "Q08", "Q09"] },
      { text: "04 · CI/CD、迁移、发布与回滚", link: "/domains/quality/04-delivery", ids: ["Q10", "Q11"] },
      { text: "05 · 可观测性、SLO 与故障恢复", link: "/domains/quality/05-operations", ids: ["Q12", "Q13", "Q14"] },
      { text: "06 · 安全供应链与生产验收", link: "/domains/quality/06-production", ids: ["Q15", "Q16"] },
    ],
  },
  {
    key: "ai",
    title: "AI 应用与 Agent 系统",
    short: "从模型调用到可治理 Agent",
    count: aiLearningNodeCount("core"),
    chapters: [
      { text: "01 · 模型、Token、Context 与不确定性", link: "/domains/ai/01-models", ids: aiNodeIdsForPage("core", "/domains/ai/01-models") },
      {
        text: "02 · 结构化输出、Prompt 与上下文工程",
        link: "/domains/ai/02-context",
        ids: aiNodeIdsForPage("core", "/domains/ai/02-context"),
        stageReview: { text: "阶段一总结 · 从模型行为到可靠调用", link: "/domains/ai/stage-1-review" },
      },
      { text: "03 · Embedding、RAG 与检索评测", link: "/domains/ai/03-rag", ids: aiNodeIdsForPage("core", "/domains/ai/03-rag") },
      {
        text: "04 · Tool Calling、权限与 MCP",
        link: "/domains/ai/04-tools-mcp",
        ids: aiNodeIdsForPage("core", "/domains/ai/04-tools-mcp"),
        stageReview: { text: "阶段二总结 · 证据与行动共用一条审计链", link: "/domains/ai/stage-2-review" },
      },
      { text: "05 · 工作流、Agent Runtime 与记忆", link: "/domains/ai/05-agent-runtime", ids: aiNodeIdsForPage("core", "/domains/ai/05-agent-runtime") },
      {
        text: "06 · Trace、评测与生产指标",
        link: "/domains/ai/06-evals-safety",
        ids: aiNodeIdsForPage("core", "/domains/ai/06-evals-safety"),
      },
      {
        text: "07 · 安全验证、治理与事故响应",
        link: "/domains/ai/07-safety-governance",
        ids: aiNodeIdsForPage("core", "/domains/ai/07-safety-governance"),
        stageReview: { text: "阶段三总结 · 从可恢复到可放行", link: "/domains/ai/stage-3-review" },
      },
    ],
    summary: { text: "核心学习总结 · 把 AI 能力变成系统证据", link: "/domains/ai/summary" },
  },
];

export const totalNodeCount = domains.reduce((sum, domain) => sum + domain.count, 0);

export function domainSidebar(key: Domain["key"]) {
  const domain = domains.find((item) => item.key === key)!;
  return [
    { text: "领域入口", items: [
      { text: "领域总览", link: `/domains/${key}/` },
      { text: "学习路线", link: `/domains/${key}/roadmap` },
    ] },
    {
      text: `${domain.count} 个知识节点`,
      items: [
        ...domain.chapters.flatMap(({ text, link, stageReview }) => [
          { text, link },
          ...(stageReview ? [stageReview] : []),
        ]),
        ...(domain.summary ? [domain.summary] : []),
      ],
    },
  ];
}
