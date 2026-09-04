import { aiLearningNodeCount, aiNodeIdsForPage } from "./ai-learning-nodes.ts";

export interface AgentFrontierChapter {
  text: string;
  link: string;
  ids: string[];
  stage: 1 | 2 | 3 | 4 | 5;
  stageTitle: string;
  question: string;
  papers: string[];
  outcome: string;
  stageReview?: {
    text: string;
    link: string;
  };
}

export const agentFrontierCutoff = "2026-09-03";

export const agentFrontierRoadmap = {
  text: "五阶段学习路线",
  link: "/frontier/agents/roadmap",
};

export const agentFrontierChapters: AgentFrontierChapter[] = [
  {
    text: "01 · Agent 到底是什么：系统边界与研究范式",
    link: "/frontier/agents/01-paradigm",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/01-paradigm"),
    stage: 1,
    stageTitle: "系统边界与可验证规划",
    question: "怎样把模型能力、Agent scaffold 与运行环境分开讨论？",
    papers: ["LATS", "Building Effective Agents", "Agentic Automata Learning"],
    outcome: "Agent 系统边界图、POMDP/控制环解释与最小基线",
  },
  {
    text: "02 · 推理、规划、反思与 Test-time Search",
    link: "/frontier/agents/02-reasoning-planning",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/02-reasoning-planning"),
    stage: 1,
    stageTitle: "系统边界与可验证规划",
    question: "反思、树搜索和世界模型分别在什么条件下真的有用？",
    papers: ["LATS", "Devil's Advocate", "ARC-AGI-3"],
    outcome: "带状态验证、预算和回退的规划器对照实验",
    stageReview: { text: "阶段一总结 · 从系统边界到受预算约束的规划", link: "/frontier/agents/stage-1-review" },
  },
  {
    text: "03 · Tool Use、MCP 与有状态交互",
    link: "/frontier/agents/03-tools-protocols",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/03-tools-protocols"),
    stage: 2,
    stageTitle: "工具协议与长时状态",
    question: "工具定义、协议和环境状态怎样共同决定 Agent 可靠性？",
    papers: ["ToolSandbox", "tau-bench", "MCP Specification"],
    outcome: "类型化工具契约、状态差分验收与协议威胁模型",
  },
  {
    text: "04 · Memory、Context Engineering 与长时状态",
    link: "/frontier/agents/04-memory-context",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/04-memory-context"),
    stage: 2,
    stageTitle: "工具协议与长时状态",
    question: "记忆何时应写入、检索、压缩、修订或完全不进入上下文？",
    papers: ["MemGPT", "Mem0", "Harness the Memory"],
    outcome: "记忆生命周期、介质路由器与遗忘/冲突评测",
    stageReview: { text: "阶段二总结 · 从工具契约到可撤销记忆", link: "/frontier/agents/stage-2-review" },
  },
  {
    text: "05 · Web、GUI 与 Computer-use Agent",
    link: "/frontier/agents/05-computer-use",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/05-computer-use"),
    stage: 3,
    stageTitle: "界面行动与代码变更",
    question: "截图、可访问性树、结构化动作和远程沙箱怎样取舍？",
    papers: ["OSWorld", "Computer-Using Agent", "HANDBOOK.md"],
    outcome: "可复位桌面环境、执行式评分和高风险动作审批",
  },
  {
    text: "06 · Coding Agent 与长程软件工程",
    link: "/frontier/agents/06-coding-agents",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/06-coding-agents"),
    stage: 3,
    stageTitle: "界面行动与代码变更",
    question: "模型、ACI、定位流程、测试环境和算力限制各贡献多少？",
    papers: ["SWE-bench", "SWE-agent", "Agentless", "SWE-Lancer"],
    outcome: "可复现 coding-agent harness 与 Agent/Agentless 消融",
    stageReview: { text: "阶段三总结 · 从界面行动到可审阅代码变更", link: "/frontier/agents/stage-3-review" },
  },
  {
    text: "07 · Deep Research 与 Multi-agent",
    link: "/frontier/agents/07-research-multi-agent",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/07-research-multi-agent"),
    stage: 4,
    stageTitle: "研究协作与轨迹学习",
    question: "什么时候并行研究带来覆盖增益，什么时候只是把成本放大？",
    papers: ["GAIA", "BrowseComp", "Deep Research", "Anthropic Research"],
    outcome: "证据账本、并行研究拓扑与 single-agent 对照",
  },
  {
    text: "08 · Agent Learning、RL 与自我改进",
    link: "/frontier/agents/08-agent-learning",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/08-agent-learning"),
    stage: 4,
    stageTitle: "研究协作与轨迹学习",
    question: "怎样把稀疏任务结果归因到长轨迹中的可训练决策？",
    papers: ["SICA", "Agent Lightning", "Agent² RL-Bench"],
    outcome: "轨迹数据模型、信用分配实验与不可回归门禁",
    stageReview: { text: "阶段四总结 · 从并行研究到受证据约束的学习", link: "/frontier/agents/stage-4-review" },
  },
  {
    text: "09 · Agent Evaluation：从排行榜到因果测量",
    link: "/frontier/agents/09-evaluation",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/09-evaluation"),
    stage: 5,
    stageTitle: "评测与安全治理",
    question: "怎样区分模型能力、scaffold、Judge、环境波动和基础设施噪声？",
    papers: ["Agent-Diff", "UniACE", "AgentJudgeBench"],
    outcome: "分层指标、置信区间、错误归因和可复现实验卡",
  },
  {
    text: "10 · Agent Safety、权限与可控自治",
    link: "/frontier/agents/10-safety-governance",
    ids: aiNodeIdsForPage("frontier", "/frontier/agents/10-safety-governance"),
    stage: 5,
    stageTitle: "评测与安全治理",
    question: "当不可信内容能影响高权限动作时，怎样缩小爆炸半径？",
    papers: ["AgentDojo", "GPT-6 Astra System Card", "Adaptive Adversaries"],
    outcome: "信任边界、能力令牌、注入测试与人类审批策略",
    stageReview: { text: "阶段五总结 · 用评测与安全决定自治边界", link: "/frontier/agents/stage-5-review" },
  },
];

export const agentFrontierNodeCount = aiLearningNodeCount("frontier");

export function agentFrontierSidebar() {
  return [
    {
      text: "Agent 前沿强化",
      items: [
        { text: "专题总览与近期队列", link: "/frontier/agents/" },
        agentFrontierRoadmap,
      ],
    },
    {
      text: `${agentFrontierNodeCount} 个强化节点`,
      items: [
        ...agentFrontierChapters.flatMap(({ text, link, stageReview }) => [
          { text, link },
          ...(stageReview ? [stageReview] : []),
        ]),
        { text: "Agent 前沿总结 · 用证据决定自治", link: "/frontier/agents/summary" },
      ],
    },
  ];
}
