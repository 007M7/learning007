export type AILearningTrack = "core" | "advanced" | "frontier";

export interface AILearningNodeDefinition {
  id: string;
  title: string;
  judgment: string;
  artifact: string;
  section: string;
}

export interface AILearningNodeChapterContract {
  track: AILearningTrack;
  chapterTitle: string;
  link: string;
  nodes: readonly AILearningNodeDefinition[];
}

export interface AILearningNodeContract extends AILearningNodeDefinition {
  track: AILearningTrack;
  chapterTitle: string;
  link: string;
}

// This is the semantic contract for the three AI learning routes.  A node is
// not complete merely because its ID appears in navigation: it must name a
// decision the learner can make, an artifact that exposes that decision, and
// the exact section in which the idea is taught.
export const aiLearningNodeChapters = [
  {
    track: "core",
    chapterTitle: "01 · 模型、Token、Context 与不确定性",
    link: "/domains/ai/01-models",
    nodes: [
      {
        id: "AI01",
        title: "Token 概率生成与采样边界",
        judgment: "语言模型生成的是条件分布中的下一步候选；一次流畅回答不能单独证明事实正确或行为稳定。",
        artifact: "同一问题在固定版本、不同解码设置下的逐次输出与差异记录",
        section: "AI01 · 从 Token 走到一句回答",
      },
      {
        id: "AI02",
        title: "Context 工作现场与变量归因",
        judgment: "模型能力、输入上下文、外部知识和输出约束必须分开改变，才能把失败归到可处理的位置。",
        artifact: "包含任务切片、上下文版本、运行参数和失败归因的模型行为剖面",
        section: "AI02 · Context 是一次调用的工作现场",
      },
    ],
  },
  {
    track: "core",
    chapterTitle: "02 · 结构化输出、Prompt 与上下文工程",
    link: "/domains/ai/02-context",
    nodes: [
      {
        id: "AI03",
        title: "结构状态与语义双重验证",
        judgment: "Schema 只能证明输出形状合法；证据、适用范围和跨字段关系还要由确定性语义规则审理。",
        artifact: "可执行 JSON Schema、语义验证器、三种合法业务状态及坏输出样例",
        section: "AI03 · 先把三种结果写进 Schema",
      },
      {
        id: "AI04",
        title: "版本化模型调用合同",
        judgment: "Prompt 只是调用合同的一部分；可信输入、模型参数、失败处理与接受条件必须共同版本化。",
        artifact: "绑定输入、Prompt、模型、参数、验证器和回退路径的调用合同与回归集",
        section: "AI04 · Prompt 只是合同的一部分",
      },
    ],
  },
  {
    track: "core",
    chapterTitle: "03 · Embedding、RAG 与检索评测",
    link: "/domains/ai/03-rag",
    nodes: [
      {
        id: "AI05",
        title: "答案资格与必要证据集合",
        judgment: "知识答案只有在来源有效、用户可见且必要证据齐全时才有资格生成；相关片段不等于充分证据。",
        artifact: "按问题标注来源版本、权限和必要证据集合的答案资格表",
        section: "先规定什么样的答案有资格出现",
      },
      {
        id: "AI06",
        title: "版本化语料摄取与切分",
        judgment: "解析、切分、元数据、Embedding 和索引都是可失效的决定，任何一层变化都应产生可追踪的新语料版本。",
        artifact: "含来源哈希、生效期、ACL、切分规则与索引版本的语料清单",
        section: "一份文档进入索引前，要先经历五次决定",
      },
      {
        id: "AI07",
        title: "候选召回、混合检索与重排",
        judgment: "向量相似度只负责生成候选；词法召回、过滤和重排要围绕真实失败切片比较，而不能替代证据审理。",
        artifact: "稀疏、稠密、混合与重排方案的逐题候选集合和同预算对照",
        section: "相似度只能负责找候选",
      },
      {
        id: "AI08",
        title: "检索—生成分层评测与错误账本",
        judgment: "总正确率会混淆缺文档、漏召回、错排序和越界生成；修复动作必须由逐题错误层决定。",
        artifact: "记录证据完整率、引用支持、拒答和错误责任层的检索评测报告",
        section: "一张错误账本比一个总分更有用",
      },
    ],
  },
  {
    track: "core",
    chapterTitle: "04 · Tool Calling、权限与 MCP",
    link: "/domains/ai/04-tools-mcp",
    nodes: [
      {
        id: "AI09",
        title: "窄工具合同与能力边界",
        judgment: "模型只能提出结构化动作；工具名称、参数、前置条件和允许状态差分共同限定实际能力。",
        artifact: "把宽泛操作拆成窄动作的工具 Schema、前置条件和允许差分表",
        section: "工具名称已经决定了能力边界",
      },
      {
        id: "AI10",
        title: "服务端身份、授权与批准快照",
        judgment: "身份不能由模型填写，批准也不能被解释成长期授权；执行前必须重新核对主体、对象、范围和时效。",
        artifact: "绑定主体、资源、动作、对象、版本与有效期的授权和批准记录",
        section: "身份不能由模型填写",
      },
      {
        id: "AI11",
        title: "幂等提交与未知结果确认",
        judgment: "网络超时只表示结果未知；写操作必须用幂等键和状态查询确认事实，不能把重试当恢复。",
        artifact: "覆盖重复请求、回执丢失、并发变化与越权输入的工具网关回归集",
        section: "超时以后，系统处于“未知”，不是“失败”",
      },
    ],
  },
  {
    track: "core",
    chapterTitle: "05 · 工作流、Agent Runtime 与记忆",
    link: "/domains/ai/05-agent-runtime",
    nodes: [
      {
        id: "AI12",
        title: "确定工作流与 Agent 边界",
        judgment: "能够枚举的规则、路由和审批应留在确定程序中，只有确需根据新观察选择路径的部分才交给 Agent。",
        artifact: "标出确定步骤、模型决策点、人工接管和退出条件的执行流程图",
        section: "先把确定的部分拿回程序里",
      },
      {
        id: "AI13",
        title: "可恢复 Runtime 与副作用一致性",
        judgment: "长任务必须把状态、租约、尝试次数和副作用提交写入外部事实源，崩溃后才能继续而不重复行动。",
        artifact: "含状态机、事件日志、幂等提交、租约接管与取消路径的可恢复运行记录",
        section: "Runtime 保存的不是聊天，而是一份正在履行的合同",
      },
      {
        id: "AI14",
        title: "记忆生命周期与数据责任",
        judgment: "记忆不是无限聊天历史；写入、召回、修订和删除都要保留来源、作用域、有效期与授权边界。",
        artifact: "区分工作状态、情节和语义信息的记忆政策及删除验证日志",
        section: "记忆从“以后可能有用”变成一项数据责任",
      },
    ],
  },
  {
    track: "core",
    chapterTitle: "06 · Trace、评测与生产指标",
    link: "/domains/ai/06-evals-safety",
    nodes: [
      {
        id: "AI15",
        title: "可证伪质量主张与失败地图",
        judgment: "“回答更好”必须拆成任务切片、指标、风险和代价均可失败的主张，评测集应从真实错误地图生长。",
        artifact: "将质量主张、任务切片、失败类型和发布门槛连接起来的评测设计卡",
        section: "先把“可靠”拆成五个能够失败的主张",
      },
      {
        id: "AI16",
        title: "端到端 Trace 与评分校准",
        judgment: "最终答案相同不代表过程等价；Trace 要连接证据、工具、权限和终态，自动 Judge 还须先与人工标准校准。",
        artifact: "可从结果回放到输入版本、检索、调用、工具和评分依据的逐次 Trace",
        section: "Trace 要能解释一次结果是怎样形成的",
      },
      {
        id: "AI18",
        title: "生产指标与渐进发布门禁",
        judgment: "Shadow 和 Canary 用于检验真实分布，不会取消离线安全线；任何退化都要能触发停止和版本回滚。",
        artifact: "绑定质量、风险、成本、延迟、人工升级率和回滚条件的发布卡",
        section: "Shadow 和 Canary 把评测带进真实流量，但不取消门槛",
      },
    ],
  },
  {
    track: "core",
    chapterTitle: "07 · 安全验证、治理与事故响应",
    link: "/domains/ai/07-safety-governance",
    nodes: [
      {
        id: "AI17",
        title: "资产—信任边界—后果威胁模型",
        judgment: "安全测试应沿数据、权限和副作用的完整能力路径组织；模型拒绝某句提示不能证明系统安全。",
        artifact: "从受保护资产、攻击入口、信任跨越到最坏后果的威胁模型和攻击集",
        section: "威胁模型把一句注入追到实际后果",
      },
      {
        id: "AI19",
        title: "风险所有权、停止权与事故学习",
        judgment: "治理必须明确谁接受风险、谁能停止系统，以及事故怎样转成新的门禁；审批表本身不承担责任。",
        artifact: "包含责任人、能力上限、kill switch、处置顺序和回归项的治理决定单",
        section: "治理的交付物是一张责任清楚的决定",
      },
    ],
  },
  {
    track: "advanced",
    chapterTitle: "01 · 线性代数、概率、信息论与优化",
    link: "/advanced/ai/01-math-optimization",
    nodes: [
      {
        id: "AAI01",
        title: "向量表示与可比较性边界",
        judgment: "向量空间预先决定哪些差异能被模型看见；相似度高只表示当前表示接近，不证明语义支持。",
        artifact: "带正例、矛盾例和表示消融的向量相似度对照表",
        section: "向量先规定模型能够比较什么",
      },
      {
        id: "AAI02",
        title: "概率校准与决策阈值",
        judgment: "归一化分数不自动具有频率含义；只有独立校准和明确错误代价，才允许概率影响行动阈值。",
        artifact: "可靠性图、分切片校准误差和错误代价驱动的阈值记录",
        section: "分数经过归一化也不自动成为可信概率",
      },
      {
        id: "AAI03",
        title: "损失、梯度与优化归因",
        judgment: "损失下降只证明参数响应了当前目标与数据；有限差分、隐藏负例和决策指标共同决定改进是否成立。",
        artifact: "含手算、有限差分、单变量更新和隐藏切片结果的可重放优化实验",
        section: "交叉熵让自信的错误付出更大代价",
      },
    ],
  },
  {
    track: "advanced",
    chapterTitle: "02 · Transformer、Tokenization 与训练系统",
    link: "/advanced/ai/02-transformer-training",
    nodes: [
      {
        id: "AAI04",
        title: "Attention 信息流与 Mask",
        judgment: "注意力权重是当前参数和输入下的信息路由，不是词义解释；Mask 与后续层必须进入因果核对。",
        artifact: "三 Token 手算、形状断言、遮挡与换位变式组成的 attention 对照表",
        section: "三个 Token 足以看见 attention 的数据流",
      },
      {
        id: "AAI05",
        title: "Tokenizer 边界与训练数据谱系",
        judgment: "分词、截断和数据版本会改变模型实际见到的样本；训练结论必须追溯到来源、许可与覆盖范围。",
        artifact: "锁定 revision 的 tokenizer 切片审计和可删除的训练数据谱系清单",
        section: "Tokenizer 决定一次实验的最小单位",
      },
      {
        id: "AAI06",
        title: "训练资源账与可恢复扩展",
        judgment: "参数文件大小不是训练显存；先用可恢复单卡 pilot 测量状态、activation 与有效吞吐，再决定是否分布式。",
        artifact: "显存分项、有效 tokens/s、隐藏损失、checkpoint 恢复与扩展效率记录",
        section: "110M 参数不是显存账的总数",
      },
    ],
  },
  {
    track: "advanced",
    chapterTitle: "03 · PEFT/LoRA、偏好优化与评测数据",
    link: "/advanced/ai/03-finetuning",
    nodes: [
      {
        id: "AAI07",
        title: "微调资格与冻结基线",
        judgment: "只有稳定行为错误在 Prompt、RAG 和工具基线下仍存在，且任务与独立测试已冻结，改权重才有资格进入候选。",
        artifact: "Base、Prompt、RAG 与训练候选共享门禁的适配审理卡",
        section: "在第一次训练前冻结审理规则",
      },
      {
        id: "AAI08",
        title: "LoRA、SFT 与偏好信号边界",
        judgment: "LoRA 减少可训练增量，不减少数据和发布责任；SFT 学目标输出，偏好优化学习相对选择，二者都不是事实库。",
        artifact: "绑定 base digest、目标模块、数据目的、SFT/DPO rubric 与参数量的 adapter 清单",
        section: "LoRA 变小的是可训练增量，不是全部风险",
      },
      {
        id: "AAI09",
        title: "泄漏、回归与可撤销发布",
        judgment: "训练数据、评测集和在线流量必须隔离；候选只有通过独立回归并能按版本撤销，才可进入小流量验证。",
        artifact: "数据切分哈希、逐样本盲测、回归结果、release card 与实际回退日志",
        section: "把泄漏、回归和撤销写进训练计划",
      },
    ],
  },
  {
    track: "advanced",
    chapterTitle: "04 · 推理系统、KV Cache、量化与服务",
    link: "/advanced/ai/04-inference",
    nodes: [
      {
        id: "AAI10",
        title: "Prefill、Decode 与 KV 状态",
        judgment: "同一请求的 prefill 和 decode 具有不同资源形态，KV cache 随序列和并发增长，必须纳入容量而非视为免费加速。",
        artifact: "请求分段时延、KV 容量估算与实测峰值互相校准的服务剖面",
        section: "Prefill 和 decode 使用同一模型却不是同一种工作",
      },
      {
        id: "AAI11",
        title: "批处理、量化与正确性调整 Goodput",
        judgment: "批量和量化都是服务政策变化；只有在正确性门禁内按真实 SLO 完成的请求才能计入有效吞吐。",
        artifact: "相同模型与请求分布下的 batching、精度、TTFT、TPOT 和 goodput 对照",
        section: "Batching 是调度政策，不是一个越大越好的整数",
      },
      {
        id: "AAI12",
        title: "负载回放、容量门禁与回滚",
        judgment: "平均吞吐不能代表生产可行；突发、长尾、OOM 和质量回归都要在版本化发布演练中触发降级或回退。",
        artifact: "容量曲线、故障注入、版本绑定、canary 指标和回滚核对单",
        section: "三轮实验把速度改动拉回质量门禁",
      },
    ],
  },
  {
    track: "advanced",
    chapterTitle: "05 · Advanced RAG、GraphRAG 与多模态检索",
    link: "/advanced/ai/05-advanced-rag",
    nodes: [
      {
        id: "AAI13",
        title: "多跳依赖与来源可逆图",
        judgment: "只有后一步确实依赖前一步实体的失败才需要多跳；图中的每条关系必须能撤回原始来源，不能自造证据。",
        artifact: "带依赖子问题、实体消歧、source_root 和派生链的最小证据图",
        section: "先把“多跳”写成可检查的依赖",
      },
      {
        id: "AAI14",
        title: "版面与多模态证据定位",
        judgment: "表格、图像和脚注的空间关系不能无损压成文本串；检索结果必须保留页面坐标与原件复核入口。",
        artifact: "含表头、单元格、脚注、页面区域和 ACL 的视觉证据索引",
        section: "一张表不能被压成一串相邻的词",
      },
      {
        id: "AAI15",
        title: "复杂检索路由与分层采用审理",
        judgment: "图或视觉路线只服务被基线确认的失败切片；必要证据完整率、拒答和每成功题成本共同决定采用范围。",
        artifact: "基础检索与复杂候选的逐题完整性、成本、错误层和退出 ADR",
        section: "分层结果决定复杂路线只服务哪些题",
      },
    ],
  },
  {
    track: "advanced",
    chapterTitle: "06 · 多 Agent、协调协议与自治治理",
    link: "/advanced/ai/06-multi-agent",
    nodes: [
      {
        id: "AAI16",
        title: "任务依赖图与协调拓扑",
        judgment: "只有可独立开始的分支或必须隔离的权限域才值得拆分；拓扑应服从依赖图而不是角色想象。",
        artifact: "标出所有权、依赖、合并条件和退出条件的任务 DAG 与拓扑 ADR",
        section: "拓扑要跟着依赖图走",
      },
      {
        id: "AAI17",
        title: "共享状态、证据祖先与执行权限",
        judgment: "消息只通知，共享状态才裁决；多个报告若同源仍是一份证据，权限隔离也必须在执行点重验。",
        artifact: "类型化共享板、来源祖先图、租约事件和最小权限矩阵",
        section: "消息只负责通知，共享板才负责裁决",
      },
      {
        id: "AAI18",
        title: "同预算净收益与故障合并",
        judgment: "多 Agent 必须在相同总预算下改善覆盖、墙钟或风险，扣除重复和协调后无净收益就保留简单基线。",
        artifact: "单工作流、单 Agent 与多 Agent 的逐任务配对结果、预算账和拒绝或采用记录",
        section: "同一预算下，复杂方案只赢了一类任务",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "01 · Agent 到底是什么：系统边界与研究范式",
    link: "/frontier/agents/01-paradigm",
    nodes: [
      {
        id: "AGF01",
        title: "自治复杂度阶梯与反事实",
        judgment: "先用单次调用和固定工作流做反事实；只有路径必须随新观察改变时，Agent 的循环复杂度才可能必要。",
        artifact: "single-call、workflow 与 Agent 的同任务同预算复杂度 ADR",
        section: "先把三种实现摆在同一张桌上",
      },
      {
        id: "AGF02",
        title: "观察—状态—动作—环境控制环",
        judgment: "模型只是提出动作的策略组件；环境状态与验证器必须独立记录，才能解释运行怎样改变现实。",
        artifact: "含观察、隐藏状态、动作、反馈和终态的 Agent 系统边界图",
        section: "这次运行里谁知道什么",
      },
      {
        id: "AGF03",
        title: "预算、停止与正常拒绝",
        judgment: "终止条件和资源预算必须早于第一次行动；证据或权限不足时拒绝是合格终态，不是模型失败。",
        artifact: "限定权限、预算、停止原因、人工接管和拒绝分支的运行契约",
        section: "终止与预算要早于第一次行动",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "02 · 推理、规划、反思与 Test-time Search",
    link: "/frontier/agents/02-reasoning-planning",
    nodes: [
      {
        id: "AGF04",
        title: "可执行计划与状态前置",
        judgment: "计划节点必须声明前置状态、预期变化和验收方式；自然语言清单只有在环境反馈后仍成立才可继续。",
        artifact: "把目标拆成前置、动作、预期差分和验证器的可执行计划表",
        section: "一张清单怎样变成可执行计划",
      },
      {
        id: "AGF05",
        title: "反馈分类与可验证恢复",
        judgment: "工具回执不等于环境事实；超时、拒绝、冲突和未知结果要进入不同恢复路径，不能统一重试。",
        artifact: "按失败类型连接确认查询、补偿、重规划与停止的恢复矩阵",
        section: "失败以后先辨认发生了什么",
      },
      {
        id: "AGF06",
        title: "反思、受限搜索与预算归因",
        judgment: "反思必须绑定可观察失败，搜索分支必须隔离预算并以外部验证合并；更长推理本身不是收益。",
        artifact: "固定流程、ReAct、反思与搜索四种方案的同预算逐任务对照",
        section: "反思只有绑定失败证据才会留下",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "03 · Tool Use、MCP 与有状态交互",
    link: "/frontier/agents/03-tools-protocols",
    nodes: [
      {
        id: "AGF07",
        title: "自然语言意图到类型化工具合同",
        judgment: "工具合同要把对象、前置状态、允许变化和错误压成可检查字段；函数描述不能代替业务约束。",
        artifact: "含输入 Schema、资源边界、前置条件和错误语义的窄工具定义",
        section: "工具合同把自然语言意图压到可检查字段",
      },
      {
        id: "AGF08",
        title: "状态差分、幂等与未知结果",
        judgment: "完成由允许状态差分证明，回执丢失必须保留未知；查询真实状态后才能提交、重试或补偿。",
        artifact: "覆盖成功、重复、超时、迟到回执和并发冲突的状态交易测试包",
        section: "回执丢失时，未知结果必须保持未知",
      },
      {
        id: "AGF09",
        title: "MCP 互操作与业务授权分层",
        judgment: "协议发现和连接只解决互操作；当前主体是否有权对当前对象执行动作，仍须由服务端独立裁决。",
        artifact: "区分协议会话、身份令牌、业务批准和最终状态的网关威胁模型",
        section: "能发现工具，不代表当前任务有业务权力",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "04 · Memory、Context Engineering 与长时状态",
    link: "/frontier/agents/04-memory-context",
    nodes: [
      {
        id: "AGF10",
        title: "工作状态、Context 与长期记忆分层",
        judgment: "不同时间尺度应落在不同介质；context 是一次运行的有限视图，不能兼任事实库、权限库和历史账本。",
        artifact: "将 working state、context、episodic、semantic 分开的状态介质路由图",
        section: "四个位置承担不同时间尺度",
      },
      {
        id: "AGF11",
        title: "记忆写入、召回与冲突审理",
        judgment: "相关不等于可用；写入和召回都要检查来源、主体、用途、时效，冲突不能由最后写入者自动获胜。",
        artifact: "带来源、作用域、TTL、权威级别和冲突状态的记忆记录与召回理由",
        section: "写入门先问这条内容值不值得留下",
      },
      {
        id: "AGF12",
        title: "遗忘链路与行动级记忆评测",
        judgment: "删除必须穿透原始记录、索引、缓存和摘要；记忆评测还要观察召回是否导致正确行动而非只看命中。",
        artifact: "删除传播回执、冲突/过期攻击集和记忆到行动的联合评测报告",
        section: "遗忘是一条可验证的数据流",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "05 · Web、GUI 与 Computer-use Agent",
    link: "/frontier/agents/05-computer-use",
    nodes: [
      {
        id: "AGF13",
        title: "多模态界面观察与元素定位",
        judgment: "像素、可访问性树、DOM 和结构化状态各有盲区；动作必须绑定最新观察与稳定业务对象。",
        artifact: "比较四类观察、定位置信与过期条件的界面观察契约",
        section: "同一个按钮在四种观察里不是同一个对象",
      },
      {
        id: "AGF14",
        title: "动作门与允许/禁止状态差分",
        judgment: "点击成功不是任务完成；每次界面行动须经过意图、风险和状态门，并由允许变化与禁止变化共同验收。",
        artifact: "动作预览、批准记录、允许差分、禁止差分和终态查询组成的执行凭证",
        section: "一次界面动作要连续过三道门",
      },
      {
        id: "AGF15",
        title: "界面漂移、风险分级与业务恢复",
        judgment: "观察一旦过期就应重新定位，高风险动作必须升级人工；浏览器返回不能撤销已经提交的业务副作用。",
        artifact: "可复位沙箱中的旧观察拒绝、风险审批、未知结果对账和补偿日志",
        section: "风险等级决定 Agent 能走到哪一步",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "06 · Coding Agent 与长程软件工程",
    link: "/frontier/agents/06-coding-agents",
    nodes: [
      {
        id: "AGF16",
        title: "仓库证据图与可证伪 Issue",
        judgment: "Coding Agent 应按调用关系读取最小相关上下文；issue 必须写成能被失败测试和外部合同证伪的变更任务。",
        artifact: "基于基线失败、调用链、所有者和受影响契约的仓库证据图",
        section: "先把仓库读成证据图，不把它塞满上下文",
      },
      {
        id: "AGF17",
        title: "根因定位、最小补丁与并发不变量",
        judgment: "先复现再定位，只修改能解释失败的最小范围；幂等与并发正确性要找到唯一生效点而非增加重试。",
        artifact: "根因假设、失败测试、最小 diff、并发断言和反例运行记录",
        section: "变更计划应该能被一个失败测试证伪",
      },
      {
        id: "AGF18",
        title: "分层验证、沙箱与拒绝合并",
        judgment: "绿色测试不能证明补丁可合并；验证须从根因扩到契约与回归，并记录权限、环境、未验证项和停止理由。",
        artifact: "含测试层级、命令退出码、沙箱权限、禁止变化和审阅结论的补丁证据包",
        section: "验证从根因向外扩",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "07 · Deep Research 与 Multi-agent",
    link: "/frontier/agents/07-research-multi-agent",
    nodes: [
      {
        id: "AGF19",
        title: "可决策主张与证据账本",
        judgment: "研究任务先拆成可由证据回答的主张；每项结论要保留支持、反证、适用范围和未知，而不是只给引用数量。",
        artifact: "逐主张记录来源祖先、支持/冲突、缺口与结论状态的证据账本",
        section: "先把决定拆成能被证据回答的主张",
      },
      {
        id: "AGF20",
        title: "承诺覆盖与证据祖先去重",
        judgment: "覆盖率按预先承诺的主张与范围计算；多个派生报告若共享来源祖先，不能按独立观察重复计票。",
        artifact: "主张覆盖矩阵、source_root 祖先图、重复来源与未知项清单",
        section: "搜到多少要按承诺范围计算",
      },
      {
        id: "AGF21",
        title: "研究并行拓扑与净增量",
        judgment: "只有互不等待的分支才可能并行；质量或墙钟收益必须扣除重复、协调、人工合并和额外计算成本。",
        artifact: "固定流程、单 Agent 与多 Agent 的同预算研究对照及采用 ADR",
        section: "只有互不等待的分支值得并行",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "08 · Agent Learning、RL 与自我改进",
    link: "/frontier/agents/08-agent-learning",
    nodes: [
      {
        id: "AGF22",
        title: "版本化任务、轨迹与验证器",
        judgment: "轨迹只有绑定任务、策略、环境、预算和验证器版本才能成为学习数据；成功摘要不能替代逐步运行事实。",
        artifact: "含观察、决策、动作、结果、终止和版本父链的可重放轨迹 Schema",
        section: "把一次运行写成可重放轨迹",
      },
      {
        id: "AGF23",
        title: "结果奖励、步骤归因与策略偏差",
        judgment: "最终奖励不能凭空分给中间步骤；不可见步骤保持未知，旧策略日志对新动作的覆盖缺口必须显式保留。",
        artifact: "结果/过程信号分离、归因置信、错误层和离策略覆盖的训练数据报告",
        section: "结果奖励先回答整条轨迹有没有完成",
      },
      {
        id: "AGF24",
        title: "可回退学习层与奖励防投机",
        judgment: "先选择最小可撤销干预，训练端不得继承生产权力；候选要通过 held-out 与安全回归后才进入 shadow。",
        artifact: "坏奖励攻击、候选父链、未见任务回归、权限隔离与回退 ADR",
        section: "选择最小且可回退的学习层",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "09 · Agent Evaluation：从排行榜到因果测量",
    link: "/frontier/agents/09-evaluation",
    nodes: [
      {
        id: "AGF25",
        title: "版本化候选与评测因素分解",
        judgment: "Agent 得分同时受模型、scaffold、环境、Judge 和基础设施影响；候选必须密封配置，才能归因一次改动。",
        artifact: "绑定任务、模型、脚手架、环境、裁判、预算与制品摘要的实验清单",
        section: "候选先停在密封门外",
      },
      {
        id: "AGF26",
        title: "任务配对、嵌套重复与状态验收",
        judgment: "同任务基线/候选配对后再做运行重复；统计单位仍是任务，基础设施无效和最终状态必须独立报告。",
        artifact: "逐任务逐臂终态、重复运行、无效率、置信区间与错误归因实验卡",
        section: "最终状态先回答钱有没有动",
      },
      {
        id: "AGF27",
        title: "Judge 校准与可验收发布声明",
        judgment: "自动 Judge 要在盲标校准集上证明适用范围；发布声明还须写明对象、门槛、排除项和持续监测。",
        artifact: "Judge 混淆矩阵、分支专用证据、声明验收表和线上监测候选",
        section: "Judge 先通过自己的校准集",
      },
    ],
  },
  {
    track: "frontier",
    chapterTitle: "10 · Agent Safety、权限与可控自治",
    link: "/frontier/agents/10-safety-governance",
    nodes: [
      {
        id: "AGF28",
        title: "不可信内容与能力令牌",
        judgment: "外部内容只能提供事实候选，不能生成权限；令牌必须绑定主体、委派链、会话、资源、动作、对象和时效。",
        artifact: "端到端信任边界图、最小能力令牌和当前授权校验用例",
        section: "不可信内容只能提供事实候选",
      },
      {
        id: "AGF29",
        title: "提交前裁决、人工批准与沙箱",
        judgment: "所有写动作都在执行点重验，人工批准只覆盖眼前快照；沙箱和网络出口用于限制一次失误的爆炸半径。",
        artifact: "绑定提案摘要、批准版本、nonce 状态、执行回执和出口策略的提交凭证",
        section: "所有写动作都在提交前再裁决",
      },
      {
        id: "AGF30",
        title: "停止恢复、能力链红队与持续治理",
        judgment: "停止后先查真实状态再恢复；红队必须沿完整能力链推进，事故与近失事件应进入新的回归和自治边界。",
        artifact: "覆盖注入、越权、未知提交、撤销批准和恢复的红队案卷与发布卡",
        section: "停止以后先查账，再决定恢复",
      },
    ],
  },
] as const satisfies readonly AILearningNodeChapterContract[];

export const aiLearningNodes: AILearningNodeContract[] = aiLearningNodeChapters.flatMap((chapter) =>
  chapter.nodes.map((node) => ({
    ...node,
    track: chapter.track,
    chapterTitle: chapter.chapterTitle,
    link: chapter.link,
  })),
);

export function aiNodesForPage(track: AILearningTrack, link: string): AILearningNodeContract[] {
  return aiLearningNodes.filter((node) => node.track === track && node.link === link);
}

export function aiNodeIdsForPage(track: AILearningTrack, link: string): string[] {
  const nodes = aiNodesForPage(track, link);
  if (!nodes.length) throw new Error(`Missing AI learning-node contract for ${track}:${link}`);
  return nodes.map((node) => node.id);
}

export function aiLearningNodeCount(track: AILearningTrack): number {
  return aiLearningNodes.filter((node) => node.track === track).length;
}
