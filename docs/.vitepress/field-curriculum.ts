export interface FieldChapter {
  text: string;
  link: string;
  ids: string[];
  question: string;
  sources: string[];
  outcome: string;
}

export interface LearningField {
  slug: string;
  title: string;
  shortTitle: string;
  prefix: string;
  color: string;
  promise: string;
  project: string;
  chapters: FieldChapter[];
}

const chapter = (
  base: string,
  order: number,
  slug: string,
  text: string,
  ids: string[],
  question: string,
  sources: string[],
  outcome: string,
): FieldChapter => ({
  text: `${String(order).padStart(2, "0")} · ${text}`,
  link: `/fields/${base}/${String(order).padStart(2, "0")}-${slug}`,
  ids,
  question,
  sources,
  outcome,
});

export const fieldEvidenceCutoff = "2026-08-30";

export const learningFields: LearningField[] = [
  {
    slug: "machine-learning",
    title: "机器学习",
    shortTitle: "机器学习",
    prefix: "MLF",
    color: "#176b87",
    promise: "从可证伪的问题定义出发，掌握数据、模型、泛化、因果、不确定性和生产闭环，而不是只会调包。",
    project: "一套能解释数据切分、基线、校准、偏移、因果边界与上线监控的风险预测系统。",
    chapters: [
      chapter("machine-learning", 1, "problem-statistical-learning", "问题形式化与统计学习", ["MLF01", "MLF02", "MLF03"], "怎样把业务愿望变成可学习、可评估且不泄漏的统计问题？", ["ERM/泛化理论", "No Free Lunch", "Model Cards"], "问题定义卡、损失—决策映射与最小基线"),
      chapter("machine-learning", 2, "data-splits-leakage", "数据生成、切分与泄漏", ["MLF04", "MLF05", "MLF06"], "训练集看似很大时，为什么测试结果仍可能完全失真？", ["Datasheets", "WILDS", "Leakage-aware Benchmark 2026"], "数据谱系、时间/群组切分与泄漏审计"),
      chapter("machine-learning", 3, "linear-probabilistic", "线性模型与概率预测", ["MLF07", "MLF08", "MLF09"], "线性模型怎样同时承担基线、解释器与概率决策器？", ["GLM", "Maximum Likelihood", "Calibration"], "可解释概率模型、校准曲线与阈值策略"),
      chapter("machine-learning", 4, "trees-boosting", "决策树、集成与梯度提升", ["MLF10", "MLF11", "MLF12"], "树模型为什么仍是表格数据的强基线，何时又会失败？", ["Random Forests", "XGBoost", "CatBoost"], "Boosting 消融、特征重要性反例与延迟报告"),
      chapter("machine-learning", 5, "representation-kernels", "表示、距离、核与降维", ["MLF13", "MLF14", "MLF15"], "距离和相似度的选择如何偷偷定义模型眼中的世界？", ["SVM", "Kernel Trick", "UMAP"], "距离度量实验、核方法基线与降维保真报告"),
      chapter("machine-learning", 6, "optimization-regularization", "优化、正则化与超参数", ["MLF16", "MLF17", "MLF18"], "训练误差下降为何不等于决策质量提升？", ["Bias–Variance", "Bayesian Optimization", "Nested CV"], "学习曲线、正则路径与无泄漏调参协议"),
      chapter("machine-learning", 7, "automl-tabular-foundation", "AutoML 与表格基础模型", ["MLF19", "MLF20", "MLF21"], "预训练表格模型何时替代调参，何时仍输给树与领域特征？", ["Auto-sklearn", "TabPFN v2", "BeyondArena 2026"], "GBDT/AutoML/TabPFN 公平对照与选择门禁"),
      chapter("machine-learning", 8, "causal-experimentation", "因果推断与实验", ["MLF22", "MLF23", "MLF24"], "预测谁会购买与干预谁会因此购买为什么是两类问题？", ["Double ML", "Causal Chambers", "CausalBench"], "DAG、识别假设、A/B 与异质处理效应报告"),
      chapter("machine-learning", 9, "uncertainty-robustness", "不确定性、公平与鲁棒性", ["MLF25", "MLF26", "MLF27"], "准确率相同时，怎样判断哪个模型更值得被信任？", ["Conformal Prediction", "NIST AI RMF", "TFM Uncertainty 2026"], "覆盖率、群体误差、偏移压力测试与拒绝策略"),
      chapter("machine-learning", 10, "production-ml", "生产机器学习与持续评测", ["MLF28", "MLF29", "MLF30"], "模型上线以后，什么证据能证明它仍在解决原问题？", ["ML Test Score", "Data Cascades", "AI RMF"], "版本化特征/模型/阈值、漂移监控和回滚演练"),
    ],
  },
  {
    slug: "deep-learning",
    title: "深度学习",
    shortTitle: "深度学习",
    prefix: "DLF",
    color: "#6f42c1",
    promise: "从张量与反向传播一路追到基础模型、生成模型、推理扩展和高效部署，始终保留算力与实验边界。",
    project: "训练并评估一个可复现的小型多模态模型，交付数据、训练、消融、推理和安全报告。",
    chapters: [
      chapter("deep-learning", 1, "tensors-autodiff", "张量、计算图与自动微分", ["DLF01", "DLF02", "DLF03"], "神经网络训练究竟在计算什么，梯度为什么会错？", ["Backpropagation", "Autodiff", "Gradient Checking"], "手算反传、数值梯度检查与计算图剖析"),
      chapter("deep-learning", 2, "optimization-dynamics", "优化动力学与稳定训练", ["DLF04", "DLF05", "DLF06"], "SGD、Adam、初始化和归一化怎样共同决定训练轨迹？", ["AdamW", "BatchNorm", "μP"], "优化器/批量/学习率消融与损失尖峰诊断"),
      chapter("deep-learning", 3, "cnn-vision", "卷积、视觉骨干与归纳偏置", ["DLF07", "DLF08", "DLF09"], "局部性、平移等变与全局注意力之间如何取舍？", ["ResNet", "ViT", "ConvNeXt"], "CNN/ViT 数据规模对照与特征可视化"),
      chapter("deep-learning", 4, "sequence-transformer-ssm", "序列建模、Transformer 与 SSM", ["DLF10", "DLF11", "DLF12"], "注意力的二次复杂度是否意味着 Transformer 必然被替代？", ["Attention Is All You Need", "FlashAttention", "Mamba"], "Attention/SSM 的质量、吞吐和记忆对照"),
      chapter("deep-learning", 5, "pretraining-scaling-data", "预训练、数据与缩放定律", ["DLF13", "DLF14", "DLF15"], "增加参数、数据与计算时，收益和风险分别如何缩放？", ["Chinchilla", "Llama 3", "DeepSeek-V3"], "算力预算、数据配比、缩放拟合与训练卡"),
      chapter("deep-learning", 6, "foundation-posttraining", "基础模型与后训练", ["DLF16", "DLF17", "DLF18"], "SFT、偏好优化与强化学习分别改变了什么分布？", ["InstructGPT", "DPO", "DeepSeek-R1"], "SFT/DPO/RL 目标函数与行为回归集"),
      chapter("deep-learning", 7, "generative-models", "自回归、扩散与 Flow Matching", ["DLF19", "DLF20", "DLF21"], "不同生成范式怎样表示概率路径、速度与控制性？", ["DDPM", "DiT", "Flow Matching", "Transition Matching"], "三类生成目标推导与采样速度/质量对照"),
      chapter("deep-learning", 8, "multimodal-world-models", "多模态与世界模型", ["DLF22", "DLF23", "DLF24"], "对齐文本、图像、视频和动作时，共享表示真正保留了什么？", ["CLIP", "Flamingo", "World Models 2026"], "对比学习、跨模态 grounding 与预测一致性评测"),
      chapter("deep-learning", 9, "efficient-inference", "稀疏化、量化与高效推理", ["DLF25", "DLF26", "DLF27"], "模型参数少、激活少与实际延迟低为何不是同义词？", ["LoRA", "GPTQ", "MoE", "Speculative Decoding"], "显存—吞吐—延迟—质量 Pareto 曲线"),
      chapter("deep-learning", 10, "frontier-evaluation-safety", "前沿评测、解释与安全", ["DLF28", "DLF29", "DLF30"], "当基准被污染、Judge 有偏且模型会适应测试时，如何测量进步？", ["HELM", "Model Cards", "Selective Underfitting 2026"], "数据污染审计、独立评测与能力/风险模型卡"),
    ],
  },
  {
    slug: "nlp",
    title: "自然语言处理（NLP）",
    shortTitle: "NLP",
    prefix: "NLPF",
    color: "#a34b12",
    promise: "把语言现象、数据标注、表示学习、生成、跨语言与真实交互重新连成一条线，不把 NLP 缩成调用大模型。",
    project: "一个中文优先、可追溯、可拒答、跨语言可评测的领域文本理解与生成系统。",
    chapters: [
      chapter("nlp", 1, "language-tasks-data", "语言、任务与语料", ["NLPF01", "NLPF02", "NLPF03"], "自然语言的歧义、语境和社会性怎样改变数据定义？", ["NLP Task Taxonomy", "Data Statements", "Responsible NLP Checklist"], "任务本体、标注指南与分歧建模"),
      chapter("nlp", 2, "tokenization-morphology", "分词、形态与开放词汇", ["NLPF04", "NLPF05", "NLPF06"], "Tokenizer 为什么会系统性改变不同语言的成本与能力？", ["BPE", "SentencePiece", "Byte Latent Transformer"], "中英混合 tokenizer 审计与 byte/token 对照"),
      chapter("nlp", 3, "semantics-embeddings", "分布语义、向量与检索", ["NLPF07", "NLPF08", "NLPF09"], "相似度能代表哪些语义，不能代表哪些事实关系？", ["word2vec", "BERT", "Sentence-BERT"], "词义、句义、领域漂移与 hard-negative 实验"),
      chapter("nlp", 4, "sequence-encoders-decoders", "序列、编码器与解码器", ["NLPF10", "NLPF11", "NLPF12"], "为什么分类、抽取和生成需要不同的信息流约束？", ["BiLSTM-CRF", "BERT", "T5", "ModernBERT"], "encoder/decoder/encoder-decoder 选择与基线"),
      chapter("nlp", 5, "pretraining-adaptation", "语言模型预训练与适配", ["NLPF13", "NLPF14", "NLPF15"], "预训练目标、提示、微调和偏好数据分别改变什么？", ["GPT-3", "T5", "DPO"], "零样本、检索、PEFT 和全量微调阶梯实验"),
      chapter("nlp", 6, "understanding-structured-output", "分类、抽取与结构化语言", ["NLPF16", "NLPF17", "NLPF18"], "怎样让模型输出可校验实体、关系、事件和标签，而非漂亮段落？", ["CoNLL", "Universal Dependencies", "Structured Generation"], "schema、边界匹配、校验器与错误本体"),
      chapter("nlp", 7, "generation-dialogue-translation", "生成、对话、摘要与翻译", ["NLPF19", "NLPF20", "NLPF21"], "流畅度、忠实度、覆盖率和交互成功为什么会互相冲突？", ["ROUGE", "COMET", "TransGraph 2026"], "多指标生成评测与文档级一致性检查"),
      chapter("nlp", 8, "multilingual-cultural", "多语言、低资源与文化语境", ["NLPF22", "NLPF23", "NLPF24"], "声称支持一种语言与真正服务该语言社区差在哪里？", ["FLORES", "MuBench 2026", "LocQA 2026"], "跨语言对齐、混语、文化偏差与社区验证"),
      chapter("nlp", 9, "long-context-retrieval", "长上下文、检索与知识边界", ["NLPF25", "NLPF26", "NLPF27"], "可放入百万 Token 是否等于能够稳定利用它们？", ["Lost in the Middle", "RAG", "MLRBench 2026"], "位置/长度/语言压力测试与证据覆盖率"),
      chapter("nlp", 10, "factuality-evaluation", "事实性、评价器与生产治理", ["NLPF28", "NLPF29", "NLPF30"], "自动指标、LLM Judge 与人评何时会共同给出错误结论？", ["FactScore", "FactBench", "Verify with Caution", "FaStFact"], "claim—evidence 账本、Judge 校准与线上回归集"),
    ],
  },
  {
    slug: "ai-product",
    title: "AI 产品经理",
    shortTitle: "AI 产品",
    prefix: "AIPM",
    color: "#b13c5a",
    promise: "把模型演示转化为问题选择、评测合同、可信交互、单位经济、治理和持续学习的产品系统。",
    project: "从机会访谈到灰度上线，交付一个有离线评测、在线指标、风险登记和退出机制的 AI 产品。",
    chapters: [
      chapter("ai-product", 1, "problem-opportunity", "问题发现与机会判断", ["AIPM01", "AIPM02", "AIPM03"], "什么问题值得用 AI，什么问题只是被模型演示诱导？", ["Jobs-to-be-Done", "AI Index 2026", "Economic Index 2026"], "机会树、任务频率/价值/风险与非 AI 基线"),
      chapter("ai-product", 2, "users-workflows", "用户研究与工作流建模", ["AIPM04", "AIPM05", "AIPM06"], "用户说想要助手时，真正需要改善的是哪段工作与责任？", ["Contextual Inquiry", "Human-AI Interaction", "Expertise Returns 2026"], "角色—任务—例外—交接服务蓝图"),
      chapter("ai-product", 3, "capability-architecture", "能力边界与方案选型", ["AIPM07", "AIPM08", "AIPM09"], "Prompt、RAG、工作流、Agent、微调应按什么证据升级？", ["Building Effective Agents", "MCP", "Model Cards"], "复杂度阶梯、能力矩阵和 build/buy 决策"),
      chapter("ai-product", 4, "eval-contract", "评测合同与数据飞轮", ["AIPM10", "AIPM11", "AIPM12"], "怎样把“回答好”变成能驱动迭代的任务集和评分规则？", ["OpenAI Evals", "GDPval", "NIST TEVV"], "黄金集、rubric、切片指标与失败本体"),
      chapter("ai-product", 5, "prototype-experiment", "原型、实验与需求收敛", ["AIPM13", "AIPM14", "AIPM15"], "如何用最小原型验证风险最高的假设，而非堆功能？", ["Wizard of Oz", "A/B Testing", "Sequential Testing"], "风险优先原型、实验设计和停止规则"),
      chapter("ai-product", 6, "ux-trust-control", "AI UX、信任与人机控制", ["AIPM16", "AIPM17", "AIPM18"], "不确定、等待、纠错、拒绝和人工接管应该怎样呈现？", ["PAIR Guidebook", "Human-AI Collaboration", "AI Skill RCT 2026"], "信任校准、可撤销动作和接管体验"),
      chapter("ai-product", 7, "metrics-economics", "指标、成本与单位经济", ["AIPM19", "AIPM20", "AIPM21"], "Token 成本下降时，为什么产品毛利和用户价值仍可能恶化？", ["AI Index 2026", "Economic Index", "Cost-aware Evals"], "North Star、质量—成本—延迟 Pareto 与容量模型"),
      chapter("ai-product", 8, "safety-privacy-governance", "安全、隐私与治理", ["AIPM22", "AIPM23", "AIPM24"], "谁能批准模型接触哪些数据、做哪些动作、承担什么后果？", ["NIST AI RMF", "ISO 42001", "EU AI Act 2026"], "风险登记、影响评估、权限和审计控制"),
      chapter("ai-product", 9, "delivery-operations", "交付、运营与持续改进", ["AIPM25", "AIPM26", "AIPM27"], "模型、提示、数据和政策同时变化时怎样安全发布？", ["ML Test Score", "Incident Response", "Trustworthy Agents 2026"], "灰度门禁、反馈分流、事故与回滚 SOP"),
      chapter("ai-product", 10, "strategy-moat-organization", "战略、护城河与组织能力", ["AIPM28", "AIPM29", "AIPM30"], "模型能力快速商品化后，什么才会形成可持续复利？", ["AI Index 2026", "Economic Index", "Agentic Coding Expertise"], "专有工作流、评测资产、数据权利与组织学习飞轮"),
    ],
  },
  {
    slug: "low-altitude",
    title: "物理 AI · 低空智能",
    shortTitle: "低空智能",
    prefix: "LAF",
    color: "#16784f",
    promise: "把飞行器、感知导航、控制、通信、空域服务、适航和商业运行视为同一个安全关键系统。",
    project: "一个从任务设计、飞行仿真到风险评估、运行识别和 UTM/UOM 接口的低空巡检数字样机。",
    chapters: [
      chapter("low-altitude", 1, "system-regulation", "低空系统边界与监管框架", ["LAF01", "LAF02", "LAF03"], "低空经济为什么不是“无人机＋几个 AI 模型”？", ["无人驾驶航空器飞行管理暂行条例", "民用航空法 2026", "ICAO UTM"], "航空器—运营人—空域—服务—监管责任图"),
      chapter("low-altitude", 2, "flight-aerodynamics", "飞行原理、气象与性能包线", ["LAF04", "LAF05", "LAF06"], "升力、推力、风场和载荷怎样限制算法能做的动作？", ["FAA Pilot Handbook", "NASA AAM", "Performance Envelope"], "六自由度模型、气象边界和能量余度"),
      chapter("low-altitude", 3, "vehicle-propulsion", "UAV/eVTOL 构型、推进与能源", ["LAF07", "LAF08", "LAF09"], "多旋翼、固定翼和倾转/动力提升构型如何改变安全与经济性？", ["NASA RAVEN", "Powered-lift Rules", "Battery Safety"], "任务—构型—推进—冗余 trade-off"),
      chapter("low-altitude", 4, "sensing-perception", "机载传感、环境感知与探测避让", ["LAF10", "LAF11", "LAF12"], "相机、雷达、LiDAR 与 ADS-B 的盲区怎样组合而非互相替代？", ["Detect and Avoid", "Active Perception", "GB 42590"], "传感器覆盖图、感知 ODD 与误检/漏检预算"),
      chapter("low-altitude", 5, "localization-navigation", "定位、导航与状态估计", ["LAF13", "LAF14", "LAF15"], "GNSS 受扰、城市峡谷和高速机动时怎样维持可观测状态？", ["EKF", "Visual-Inertial Odometry", "GNSS Resilience"], "多传感融合、协方差门禁与失效降级"),
      chapter("low-altitude", 6, "control-planning", "飞控、轨迹规划与自主决策", ["LAF16", "LAF17", "LAF18"], "学习策略怎样与可验证控制器、地理围栏和应急逻辑共存？", ["PID/LQR", "NMPC", "NASA AVIATE"], "分层飞控、可达集、应急着陆与 HIL 测试"),
      chapter("low-altitude", 7, "c2-network-utm", "C2 通信、运行识别与低空交通管理", ["LAF19", "LAF20", "LAF21"], "高密度 BVLOS 运行需要交换哪些意图、身份、约束和冲突信息？", ["GB 46750", "GB/T 47575-2026", "ICAO UTM", "U-space"], "C2 链路预算、Remote ID 与 UOM/USS 状态机"),
      chapter("low-altitude", 8, "fleet-infrastructure", "起降设施、机队与运行体系", ["LAF22", "LAF23", "LAF24"], "单架飞得起来为什么不等于机队能可靠运营？", ["FAA Vertiports", "NASA HDV", "Fleet Management"], "航线容量、充换电、维修和地面保障模型"),
      chapter("low-altitude", 9, "swarm-digital-twin", "集群、自主协同与数字孪生", ["LAF25", "LAF26", "LAF27"], "多机协同何时增加任务能力，何时放大通信与碰撞风险？", ["Multi-agent Planning", "Digital Twin", "SORA"], "协同拓扑、仿真证据与故障注入"),
      chapter("low-altitude", 10, "airworthiness-safety-business", "适航、安全论证与场景商业化", ["LAF28", "LAF29", "LAF30"], "怎样从 Demo 走到可批准、可保险、可持续的低空运营？", ["AC-21-AA-2026-47", "低空标准体系 2025", "NASA AAM Autonomy"], "ConOps、危险分析、安全案例和单位航次经济"),
    ],
  },
  {
    slug: "robotics",
    title: "物理 AI · 机器人",
    shortTitle: "机器人",
    prefix: "RBF",
    color: "#8a4f14",
    promise: "把机械本体、状态估计、控制、规划、学习、VLA 与物理安全连接起来，拒绝只看机器人演示视频。",
    project: "一个能在仿真与真实/半实物环境间复现的移动操作机器人任务，包含安全壳、数据与评测报告。",
    chapters: [
      chapter("robotics", 1, "embodiment-system", "机器人系统、具身与任务闭环", ["RBF01", "RBF02", "RBF03"], "同一个“收拾桌面”目标怎样落到本体、环境、动作和验收？", ["Sense-Plan-Act", "Embodied AI", "NIST Test Methods"], "任务/本体/环境/安全系统边界与基线"),
      chapter("robotics", 2, "kinematics-dynamics", "坐标、运动学与动力学", ["RBF04", "RBF05", "RBF06"], "末端位置、关节速度、力矩与接触之间怎样转换？", ["Denavit-Hartenberg", "Rigid Body Dynamics", "Lie Groups"], "正逆运动学、Jacobian 奇异性和动力学仿真"),
      chapter("robotics", 3, "control-trajectory", "控制、轨迹优化与接触", ["RBF07", "RBF08", "RBF09"], "位置控制、力控制、MPC 与 whole-body control 各约束什么？", ["Impedance Control", "MPC", "Whole-body Control"], "轨迹跟踪、接触稳定与约束违例报告"),
      chapter("robotics", 4, "perception-state", "感知、三维表示与状态估计", ["RBF10", "RBF11", "RBF12"], "二维识别准确为什么不足以支持安全抓取和移动？", ["PointNet", "3D Gaussian Splatting", "Foundation Vision"], "标定、深度/位姿不确定性与遮挡压力测试"),
      chapter("robotics", 5, "slam-navigation", "SLAM、导航与移动自主", ["RBF13", "RBF14", "RBF15"], "地图、定位、规划和控制的误差如何沿闭环传播？", ["ORB-SLAM3", "Nav2", "Active SLAM"], "可复位导航基准、闭环检测和恢复策略"),
      chapter("robotics", 6, "manipulation-grasping", "抓取、操作与灵巧手", ["RBF16", "RBF17", "RBF18"], "抓住物体、稳定接触和完成语义任务为何是三个层次？", ["GraspNet", "Diffusion Policy", "ALOHA"], "抓取候选、接触反馈与长程操作拆解"),
      chapter("robotics", 7, "imitation-rl", "模仿学习、强化学习与数据", ["RBF19", "RBF20", "RBF21"], "遥操作示范、离线数据、仿真奖励和在线探索怎样组合？", ["Behavior Cloning", "ACT", "Offline RL"], "数据覆盖、策略学习与分布外恢复实验"),
      chapter("robotics", 8, "vla-foundation", "VLA 与机器人基础模型", ["RBF22", "RBF23", "RBF24"], "语言和互联网知识进入动作策略后，泛化究竟来自哪里？", ["RT-2", "OpenVLA", "π0.5", "Gemini Robotics 2"], "VLA/模块化基线、跨本体适配与语义泛化"),
      chapter("robotics", 9, "world-model-sim2real", "世界模型、合成数据与 Sim2Real", ["RBF25", "RBF26", "RBF27"], "视觉逼真的生成世界何时仍会在物理上欺骗策略？", ["PAIWorld", "ABot-PhysWorld", "Xiaomi-Robotics-U0"], "动力学随机化、三维一致性与真实回放评测"),
      chapter("robotics", 10, "safety-hri-deployment", "安全、人机协作与部署", ["RBF28", "RBF29", "RBF30"], "任务成功但过程危险时，机器人应当如何被评价和拦截？", ["ISO 10218:2025", "ForesightSafety-VLA", "Same Weights Different Robot"], "危险分析、独立安全控制器、过程风险与验收"),
    ],
  },
];

export const learningFieldBySlug = Object.fromEntries(learningFields.map((field) => [field.slug, field])) as Record<string, LearningField>;
export const fieldChapterCount = learningFields.reduce((sum, field) => sum + field.chapters.length, 0);
export const fieldNodeCount = learningFields.reduce((sum, field) => sum + field.chapters.flatMap((item) => item.ids).length, 0);

export function fieldSidebar(slug: string) {
  const field = learningFieldBySlug[slug];
  if (!field) return [];
  return [
    {
      text: field.title,
      items: [
        { text: "领域总览与近期队列", link: `/fields/${slug}/` },
        { text: "学习路线与知识图谱", link: `/fields/${slug}/roadmap` },
        { text: "证据账本与更新规则", link: `/fields/${slug}/evidence` },
      ],
    },
    {
      text: `${field.chapters.length * 3} 个知识节点`,
      items: field.chapters.map(({ text, link }) => ({ text, link })),
    },
  ];
}
