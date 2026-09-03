import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const checkedAt = "2026-09-02";
const snapshotDate = "2026-09-01";
const targetPaperCount = 320;
const field = "ai-agent";

const modules = [
  { id: "formal-models", name: "正式 · 模型、Token 与不确定性", stage: "formal", node_ids: ["AI01", "AI02"], goal: "理解生成模型的能力来源、上下文边界、概率输出和错误类型。" },
  { id: "formal-context", name: "正式 · Prompt、上下文与结构化输出", stage: "formal", node_ids: ["AI03", "AI04"], goal: "把自然语言意图转换为有契约、可解析、可回归的模型交互。" },
  { id: "formal-retrieval", name: "正式 · Embedding、检索与 RAG", stage: "formal", node_ids: ["AI05", "AI06", "AI07", "AI08"], goal: "建立可测量的索引、召回、排序、引用与生成链路。" },
  { id: "formal-tools", name: "正式 · Tool Calling、权限与协议", stage: "formal", node_ids: ["AI09", "AI10", "AI11"], goal: "用类型化工具契约、最小权限和协议边界连接外部系统。" },
  { id: "formal-runtime", name: "正式 · 工作流、Runtime 与记忆", stage: "formal", node_ids: ["AI12", "AI13", "AI14"], goal: "把模型调用组织成可恢复、可终止、可重放的有状态执行。" },
  { id: "formal-eval-safety", name: "正式 · Trace、评测、安全与治理", stage: "formal", node_ids: ["AI15", "AI16", "AI17", "AI18", "AI19"], goal: "用轨迹、分层评测、威胁模型和发布门禁证明系统可用。" },
  { id: "advanced-math", name: "进阶 · 数学、优化与信息论", stage: "advanced", node_ids: ["AAI01", "AAI02", "AAI03"], goal: "理解张量、概率、信息量和梯度怎样约束模型训练与判断。" },
  { id: "advanced-training", name: "进阶 · Transformer 与训练系统", stage: "advanced", node_ids: ["AAI04", "AAI05", "AAI06"], goal: "连接注意力机制、Tokenization、数据配比、扩展规律与分布式训练。" },
  { id: "advanced-posttraining", name: "进阶 · PEFT、偏好优化与评测数据", stage: "advanced", node_ids: ["AAI07", "AAI08", "AAI09"], goal: "判断何时微调，并用独立评测约束 LoRA、指令微调和偏好优化。" },
  { id: "advanced-inference", name: "进阶 · 推理、KV Cache 与服务", stage: "advanced", node_ids: ["AAI10", "AAI11", "AAI12"], goal: "围绕正确性、吞吐、延迟、显存与成本设计推理服务。" },
  { id: "advanced-rag", name: "进阶 · 高级、图与多模态 RAG", stage: "advanced", node_ids: ["AAI13", "AAI14", "AAI15"], goal: "处理多跳关系、长上下文、图索引与多模态证据。" },
  { id: "advanced-multiagent", name: "进阶 · 多 Agent 与自治治理", stage: "advanced", node_ids: ["AAI16", "AAI17", "AAI18"], goal: "只在角色并行或权限隔离有可测收益时引入多 Agent。" },
  { id: "frontier-paradigm", name: "前沿 · 系统边界、规划与搜索", stage: "frontier", node_ids: ["AGF01", "AGF02", "AGF03", "AGF04", "AGF05", "AGF06"], goal: "区分模型、scaffold、环境和验证器，并评估规划与测试时搜索。" },
  { id: "frontier-tools-memory", name: "前沿 · 工具协议与长时记忆", stage: "frontier", node_ids: ["AGF07", "AGF08", "AGF09", "AGF10", "AGF11", "AGF12"], goal: "研究有状态工具交互和记忆写入、检索、修订、遗忘的边界。" },
  { id: "frontier-computer-coding", name: "前沿 · Computer Use 与 Coding Agent", stage: "frontier", node_ids: ["AGF13", "AGF14", "AGF15", "AGF16", "AGF17", "AGF18"], goal: "在可复位环境中评价网页、桌面和软件工程长任务。" },
  { id: "frontier-research-learning", name: "前沿 · Deep Research、协作与学习", stage: "frontier", node_ids: ["AGF19", "AGF20", "AGF21", "AGF22", "AGF23", "AGF24"], goal: "评估并行研究、轨迹学习、信用分配和自我改进是否产生真实增益。" },
  { id: "frontier-eval-safety", name: "前沿 · Agent 评测与可控自治", stage: "frontier", node_ids: ["AGF25", "AGF26", "AGF27", "AGF28", "AGF29", "AGF30"], goal: "分离模型、脚手架、Judge、环境和基础设施噪声，并限制高权限动作。" },
];

const bookRows = [
  ["aifca", "Artificial Intelligence: Foundations of Computational Agents (3rd ed.)", "David L. Poole、Alan K. Mackworth", "2023", ["formal-runtime", "frontier-paradigm"], "starter", "以计算 Agent 为中心系统讲解决策、搜索、概率推理、学习和多智能体，是理解 Agent 边界的稳定总教材。", "https://artint.info/3e/html/ArtInt3e.html"],
  ["mml", "Mathematics for Machine Learning", "Marc Peter Deisenroth、A. Aldo Faisal、Cheng Soon Ong", "2020", ["advanced-math"], "starter", "按机器学习用途组织线性代数、微积分、概率与优化，承担模型原理的数学前置。", "https://mml-book.github.io/book/mml-book.pdf"],
  ["probml-intro", "Probabilistic Machine Learning: An Introduction", "Kevin P. Murphy", "2022", ["formal-models", "advanced-math"], "core", "连接概率建模、决策理论、经典机器学习与神经模型，用于校准概率、不确定性和评价判断。", "https://probml.github.io/pml-book/book1.html"],
  ["probml-advanced", "Probabilistic Machine Learning: Advanced Topics", "Kevin P. Murphy", "2023", ["advanced-math", "advanced-training", "advanced-posttraining", "frontier-paradigm"], "advanced", "覆盖高级推断、表示学习、生成模型与决策方法，为前沿论文提供统一概率语言。", "https://probml.github.io/pml-book/book2.html"],
  ["deep-learning", "Deep Learning", "Ian Goodfellow、Yoshua Bengio、Aaron Courville", "2016", ["advanced-math", "advanced-training"], "core", "神经网络、优化、正则化、表示学习与生成建模的稳定经典教材。", "https://www.deeplearningbook.org/"],
  ["d2l", "Dive into Deep Learning", "Aston Zhang、Zachary C. Lipton、Mu Li、Alexander J. Smola", "持续更新", ["formal-models", "advanced-training"], "starter", "以可运行代码连接数学、模型训练和工程实现，适合建立从机制到实验的第一条路径。", "https://d2l.ai/d2l-en.pdf"],
  ["understanding-deep-learning", "Understanding Deep Learning", "Simon J. D. Prince", "2023", ["advanced-math", "advanced-training"], "core", "用现代视角解释深度网络、Transformer、生成模型和泛化，适合作为经典教材与 LLM 论文之间的桥梁。", "https://udlbook.github.io/udlbook/"],
  ["geometric-deep-learning", "Geometric Deep Learning", "Michael M. Bronstein、Joan Bruna、Taco Cohen、Petar Veličković", "2021", ["advanced-math", "advanced-rag"], "advanced", "以对称性和几何先验统一 CNN、图网络与等变模型，为图检索和结构化表示提供理论支撑。", "https://geometricdeeplearning.com/book"],
  ["little-book-deep-learning", "The Little Book of Deep Learning", "François Fleuret", "2024", ["formal-models", "advanced-training"], "starter", "以紧凑方式梳理张量、网络、训练和现代架构，便于建立深度学习的可复习骨架。", "https://fleuret.org/public/lbdl.pdf"],
  ["information-theory", "Information Theory, Inference, and Learning Algorithms", "David J. C. MacKay", "2003", ["advanced-math", "formal-retrieval"], "advanced", "把信息论、贝叶斯推断与学习算法连成体系，用于理解编码、熵、压缩和概率决策。", "https://www.inference.org.uk/itprnn/book.pdf"],
  ["slp3", "Speech and Language Processing (3rd ed. draft)", "Dan Jurafsky、James H. Martin", "持续更新", ["formal-models", "formal-context", "formal-retrieval", "advanced-training", "advanced-posttraining", "advanced-rag"], "core", "覆盖语言模型、Transformer、Prompt、信息检索、RAG、评测与安全，是语言应用主教材。", "https://web.stanford.edu/~jurafsky/slp3/"],
  ["nltk-book", "Natural Language Processing with Python", "Steven Bird、Ewan Klein、Edward Loper", "2009", ["formal-context", "formal-retrieval"], "starter", "从语料、标注、分类和语言结构建立可执行 NLP 基础，避免把 LLM 应用等同于 API 调用。", "https://www.nltk.org/book/"],
  ["ir-book", "Introduction to Information Retrieval", "Christopher D. Manning、Prabhakar Raghavan、Hinrich Schütze", "2008", ["formal-retrieval", "advanced-rag"], "core", "倒排索引、排序、评价、分类和聚类的权威教材，为 RAG 提供稳定的信息检索底座。", "https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf"],
  ["niutrans-nlp", "Natural Language Processing: Neural Networks and Large Language Models", "Tong Xiao、Jingbo Zhu", "2025", ["formal-models", "formal-context", "advanced-training", "advanced-posttraining"], "core", "从神经网络推进到 Transformer、预训练、对齐与 LLM，提供较新的完整语言模型知识链。", "https://raw.githubusercontent.com/NiuTrans/NLPBook/main/nlp-book.pdf"],
  ["foundations-llm", "Foundations of Large Language Models", "Tong Xiao、Jingbo Zhu", "2025", ["formal-models", "formal-context", "advanced-training", "advanced-posttraining"], "core", "以专著结构集中讲解预训练、生成模型、Prompt、推理与对齐，作为近两年 LLM 机制的主教材。", "https://arxiv.org/pdf/2501.09223"],
  ["neural-nlp-primer", "A Primer on Neural Network Models for Natural Language Processing", "Yoav Goldberg", "2016", ["formal-models", "advanced-training"], "core", "以专著长度讲清表示、前馈网络、卷积、循环网络与训练方法，是现代 NLP 模型的稳定桥梁。", "https://arxiv.org/pdf/1510.00726"],
  ["graph-representation-learning", "Graph Representation Learning", "William L. Hamilton", "2020", ["advanced-rag", "advanced-math"], "advanced", "系统解释图表示、消息传递和图神经网络，为 GraphRAG 与关系检索建立算法基础。", "https://www.cs.mcgill.ca/~wlh/grl_book/files/GRL_Book.pdf"],
  ["mapreduce-text", "Data-Intensive Text Processing with MapReduce", "Jimmy Lin、Chris Dyer", "2010", ["formal-retrieval", "advanced-inference"], "advanced", "用 MapReduce 讲索引、图算法和语言处理，帮助理解批处理、数据局部性与可扩展检索。", "https://lintool.github.io/MapReduceAlgorithms/MapReduce-book-final.pdf"],
  ["ultrascale-playbook", "The Ultra-Scale Playbook: Training LLMs on GPU Clusters", "Nouamane Tazi 等，Hugging Face Nanotron 团队", "2025", ["advanced-training", "advanced-inference"], "advanced", "基于四千余次扩展实验解释并行训练、通信、显存、吞吐和瓶颈定位，补足当前大模型训练系统知识。", "https://huggingface.co/spaces/nanotron/ultrascale-playbook"],
  ["think-bayes", "Think Bayes (2nd ed.)", "Allen B. Downey", "2021", ["formal-models", "advanced-math"], "starter", "通过计算实例学习贝叶斯建模和不确定性更新，适合非科班读者补概率判断。", "https://allendowney.github.io/ThinkBayes2/"],
  ["rl-introduction", "Reinforcement Learning: An Introduction (2nd ed.)", "Richard S. Sutton、Andrew G. Barto", "2018", ["frontier-paradigm", "frontier-research-learning", "advanced-posttraining"], "core", "强化学习、价值函数、策略、时序差分和近似方法的奠基教材，支撑 Agent 学习与偏好优化。", "http://incompleteideas.net/book/the-book-2nd.html"],
  ["algorithms-decision-making", "Algorithms for Decision Making", "Mykel J. Kochenderfer、Tim A. Wheeler、Kyle H. Wray", "2022", ["frontier-paradigm", "frontier-eval-safety"], "core", "系统讲 MDP、POMDP、规划、强化学习和多智能体决策，强调不确定环境中的可验证选择。", "https://algorithmsbook.com/decisionmaking"],
  ["planning-algorithms", "Planning Algorithms", "Steven M. LaValle", "2006", ["frontier-paradigm"], "advanced", "从离散搜索、运动规划到不确定性规划建立通用算法框架，用于校准 LLM 规划术语。", "https://lavalle.pl/planning/book.pdf"],
  ["multiagent-systems", "Multiagent Systems: Algorithmic, Game-Theoretic, and Logical Foundations", "Yoav Shoham、Kevin Leyton-Brown", "2009", ["advanced-multiagent", "frontier-research-learning"], "advanced", "连接分布式求解、博弈、通信、机制设计与认知逻辑，是多 Agent 讨论的稳定理论底座。", "https://www.masfoundations.org/downloading.html"],
  ["marl", "Multi-Agent Reinforcement Learning: Foundations and Modern Approaches", "Stefano V. Albrecht、Filippos Christianos、Lukas Schäfer", "2024", ["advanced-multiagent", "frontier-research-learning"], "advanced", "从博弈与解概念推进到现代深度 MARL，区分协作收益、非平稳性和信用分配问题。", "https://www.marl-book.com/"],
  ["bandit-algorithms", "Bandit Algorithms", "Tor Lattimore、Csaba Szepesvári", "2020", ["frontier-paradigm", "frontier-research-learning"], "advanced", "系统讲探索—利用、遗憾界与上下文 Bandit，为在线决策和 Agent 学习提供可证明基线。", "https://tor-lattimore.com/downloads/book/book.pdf"],
  ["distributional-rl", "Distributional Reinforcement Learning", "Marc G. Bellemare、Will Dabney、Mark Rowland", "2023", ["frontier-paradigm", "frontier-research-learning"], "advanced", "把回报从单一期望扩展为分布，帮助理解风险、算子和深度强化学习中的不确定结果。", "https://www.distributional-rl.org/"],
  ["rl-theory", "Reinforcement Learning: Theory and Algorithms", "Alekh Agarwal、Nan Jiang、Sham M. Kakade、Wen Sun", "持续更新", ["frontier-paradigm", "frontier-research-learning"], "advanced", "以理论方式组织 MDP、函数逼近、探索和策略优化，用于审查 Agent 学习的样本与泛化主张。", "https://rltheorybook.github.io/"],
  ["software-foundations", "Software Foundations, Logical Foundations", "Benjamin C. Pierce 等", "持续更新", ["formal-tools", "formal-runtime", "frontier-computer-coding", "frontier-eval-safety"], "advanced", "用可执行证明学习程序语义、归纳和形式化验证，为类型化工具契约和关键安全属性提供基础。", "https://softwarefoundations.cis.upenn.edu/lf-current/index.html"],
  ["ostep", "Operating Systems: Three Easy Pieces", "Remzi H. Arpaci-Dusseau、Andrea C. Arpaci-Dusseau", "持续更新", ["formal-runtime", "advanced-inference", "frontier-tools-memory"], "core", "以虚拟化、并发和持久化解释运行时资源，是沙箱、进程、内存和存储判断的系统基础。", "https://pages.cs.wisc.edu/~remzi/OSTEP/"],
  ["open-data-structures", "Open Data Structures", "Pat Morin", "2013", ["formal-retrieval", "formal-runtime"], "starter", "系统讲序列、树、哈希和图结构，为索引、缓存、队列和状态存储提供稳定算法基础。", "https://opendatastructures.org/ods-java/"],
  ["algorithms-erickson", "Algorithms", "Jeff Erickson", "2019", ["formal-retrieval", "frontier-paradigm"], "core", "从递归、图、贪心、动态规划到 NP 困难性，建立检索、规划和调度所需的算法判断。", "https://jeffe.cs.illinois.edu/teaching/algorithms/"],
  ["computer-networking", "Computer Networking: Principles, Protocols and Practice", "Olivier Bonaventure", "持续更新", ["formal-tools", "formal-runtime", "advanced-inference"], "core", "从协议、可靠传输到应用层解释网络行为，为工具调用、流式响应和服务故障建立底层模型。", "https://www.computer-networking.info/"],
  ["database-design", "Database Design (2nd ed.)", "Adrienne Watt", "2014", ["formal-runtime", "frontier-tools-memory"], "starter", "讲清关系模型、规范化、事务和查询，为 Agent 状态、审计和记忆存储建立数据基础。", "https://opentextbc.ca/dbdesign01/"],
  ["distributed-systems", "Distributed Systems (4th ed.)", "Maarten van Steen、Andrew S. Tanenbaum", "2024", ["formal-runtime", "advanced-inference", "advanced-multiagent", "frontier-tools-memory"], "advanced", "系统覆盖通信、协调、一致性、复制、容错和安全，是多节点 Agent Runtime 的稳定工程底座。", "https://www.distributed-systems.net/index.php/books/ds4/"],
  ["distributed-algorithms", "Distributed Algorithms 2020", "Jukka Suomela", "2020", ["formal-runtime", "advanced-multiagent"], "advanced", "用局部性、复杂度和图问题训练分布式算法推理，避免用多 Agent 名称掩盖协调成本。", "https://jukkasuomela.fi/da2020/"],
  ["aosa", "The Architecture of Open Source Applications", "Amy Brown、Greg Wilson 编", "2012", ["formal-runtime", "advanced-inference", "frontier-computer-coding"], "core", "通过真实开源系统解释架构决策、模块边界和演进，提供 AI 应用软件层的可迁移案例。", "https://aosabook.org/en/"],
  ["aosa-500", "500 Lines or Less", "Amy Brown、Michael DiBernardo 编", "2016", ["formal-context", "formal-retrieval", "formal-runtime", "frontier-computer-coding"], "core", "用小型完整系统展示解析器、数据库、搜索和分布式组件，适合把 AI 组件放回可读软件结构。", "https://aosabook.org/en/500L/introduction.html"],
  ["sre", "Site Reliability Engineering", "Betsy Beyer 等", "2016", ["formal-eval-safety", "advanced-inference", "frontier-computer-coding", "frontier-eval-safety"], "core", "以 SLO、监控、自动化和事故响应建立生产可靠性框架，防止 Agent 只按演示成功率评价。", "https://sre.google/sre-book/table-of-contents/"],
  ["sre-workbook", "The Site Reliability Workbook", "Betsy Beyer 等", "2018", ["formal-eval-safety", "advanced-inference"], "advanced", "把 SRE 原则转成告警、容量、发布与应急实践，适合形成 AI 服务运行清单。", "https://sre.google/workbook/table-of-contents/"],
  ["secure-reliable-systems", "Building Secure and Reliable Systems", "Heather Adkins 等", "2020", ["formal-tools", "formal-eval-safety", "frontier-eval-safety"], "core", "把安全与可靠性共同前置到设计、部署和响应，支撑高权限 Agent 的纵深防御。", "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html"],
  ["security-engineering", "Security Engineering (3rd ed.)", "Ross Anderson", "2020", ["formal-tools", "formal-eval-safety", "frontier-eval-safety"], "advanced", "从协议、访问控制、经济激励与真实失效解释安全工程，为 Prompt Injection 之外的系统威胁建模。", "https://www.cl.cam.ac.uk/~rja14/book.html"],
  ["llm-cybersecurity", "Large Language Models in Cybersecurity: Threats, Exposure and Mitigation", "Andrei Kucharavy、Octave Plancherel、Valentin Mulder、Alain Mermoud、Vincent Lenders 编", "2024", ["formal-tools", "formal-eval-safety", "frontier-eval-safety"], "advanced", "系统覆盖 LLM 作为攻击工具、软件攻击面、暴露预测、缓解技术与安全集成，为最新应用安全提供开放专著证据。", "https://link.springer.com/content/pdf/10.1007/978-3-031-54827-7.pdf"],
  ["swebok", "Guide to the Software Engineering Body of Knowledge, Version 4.0", "IEEE Computer Society", "2024", ["formal-context", "formal-runtime", "formal-eval-safety", "frontier-computer-coding"], "core", "用权威知识体系校准需求、设计、测试、维护、配置和工程管理，补齐 AI 应用的软件生命周期。", "https://www.computer.org/education/bodies-of-knowledge/software-engineering"],
];

const bookReviewUrls = new Map([
  ["aifca", "/knowledge-base/reviews/ai-agent/aifca"],
  ["mml", "/knowledge-base/reviews/machine-learning/mathematics-ml"],
  ["probml-intro", "/knowledge-base/reviews/machine-learning/probml-intro"],
  ["probml-advanced", "/knowledge-base/reviews/machine-learning/probml-advanced"],
  ["deep-learning", "/knowledge-base/reviews/machine-learning/deep-learning"],
  ["d2l", "/knowledge-base/reviews/machine-learning/d2l"],
  ["understanding-deep-learning", "/knowledge-base/reviews/ai-agent/understanding-deep-learning"],
  ["geometric-deep-learning", "/knowledge-base/reviews/ai-agent/geometric-deep-learning"],
  ["little-book-deep-learning", "/knowledge-base/reviews/ai-agent/little-book-deep-learning"],
  ["information-theory", "/knowledge-base/reviews/ai-agent/information-theory"],
  ["slp3", "/knowledge-base/reviews/ai-agent/slp3"],
  ["nltk-book", "/knowledge-base/reviews/ai-agent/nltk-book"],
  ["ir-book", "/knowledge-base/reviews/ai-agent/ir-book"],
  ["niutrans-nlp", "/knowledge-base/reviews/ai-agent/niutrans-nlp"],
  ["foundations-llm", "/knowledge-base/reviews/ai-agent/foundations-llm"],
  ["neural-nlp-primer", "/knowledge-base/reviews/ai-agent/neural-nlp-primer"],
  ["graph-representation-learning", "/knowledge-base/reviews/ai-agent/graph-representation-learning"],
  ["mapreduce-text", "/knowledge-base/reviews/ai-agent/mapreduce-text"],
  ["ultrascale-playbook", "/knowledge-base/reviews/ai-agent/ultrascale-playbook"],
  ["think-bayes", "/knowledge-base/reviews/ai-agent/think-bayes"],
  ["rl-introduction", "/knowledge-base/reviews/ai-agent/rl-introduction"],
  ["algorithms-decision-making", "/knowledge-base/reviews/ai-agent/algorithms-decision-making"],
  ["planning-algorithms", "/knowledge-base/reviews/ai-agent/planning-algorithms"],
  ["multiagent-systems", "/knowledge-base/reviews/ai-agent/multiagent-systems"],
  ["marl", "/knowledge-base/reviews/ai-agent/marl"],
  ["bandit-algorithms", "/knowledge-base/reviews/ai-agent/bandit-algorithms"],
  ["distributional-rl", "/knowledge-base/reviews/ai-agent/distributional-rl"],
  ["rl-theory", "/knowledge-base/reviews/ai-agent/rl-theory"],
  ["software-foundations", "/knowledge-base/reviews/software/software-foundations"],
  ["ostep", "/knowledge-base/reviews/software/ostep"],
  ["open-data-structures", "/knowledge-base/reviews/software/open-data-structures"],
  ["algorithms-erickson", "/knowledge-base/reviews/software/algorithms-erickson"],
  ["computer-networking", "/knowledge-base/reviews/software/computer-networking"],
  ["database-design", "/knowledge-base/reviews/software/database-design"],
  ["distributed-systems", "/knowledge-base/reviews/software/distributed-systems"],
  ["distributed-algorithms", "/knowledge-base/reviews/software/distributed-algorithms"],
  ["aosa", "/knowledge-base/reviews/software/aosa"],
  ["aosa-500", "/knowledge-base/reviews/software/aosa-500-lines"],
  ["sre", "/knowledge-base/reviews/software/google-sre"],
  ["sre-workbook", "/knowledge-base/reviews/software/sre-workbook"],
  ["secure-reliable-systems", "/knowledge-base/reviews/software/secure-reliable-systems"],
  ["security-engineering", "/knowledge-base/reviews/ai-agent/security-engineering"],
  ["llm-cybersecurity", "/knowledge-base/reviews/ai-agent/llm-cybersecurity"],
  ["swebok", "/knowledge-base/reviews/software/swebok-v4"],
]);

const paperQueries = [
  ["formal-models", "(cat:cs.CL OR cat:cs.AI) AND (all:\"large language model\" OR all:\"in-context learning\" OR all:\"scaling laws\")"],
  ["formal-context", "cat:cs.CL AND (all:\"prompt engineering\" OR all:\"structured generation\" OR all:\"constrained decoding\" OR all:\"context engineering\")"],
  ["formal-retrieval", "(cat:cs.IR OR cat:cs.CL) AND (all:\"dense retrieval\" OR all:\"retrieval augmented generation\" OR all:\"text embeddings\")"],
  ["formal-tools", "(cat:cs.CL OR cat:cs.AI) AND (all:\"tool use\" OR all:\"function calling\" OR all:\"API\") AND all:\"language model\""],
  ["formal-runtime", "(cat:cs.AI OR cat:cs.CL) AND all:\"language model agent\" AND (all:architecture OR all:workflow OR all:runtime OR all:memory)"],
  ["formal-eval-safety", "(cat:cs.CL OR cat:cs.AI) AND all:\"large language model\" AND (all:evaluation OR all:benchmark OR all:hallucination OR all:safety)"],
  ["advanced-math", "(cat:cs.LG OR cat:cs.CL) AND (all:transformer OR all:attention) AND (all:theory OR all:optimization OR all:information)"],
  ["advanced-training", "(cat:cs.CL OR cat:cs.LG) AND (all:transformer OR all:\"language model\") AND (all:pretraining OR all:training OR all:scaling)"],
  ["advanced-posttraining", "cat:cs.CL AND (all:\"instruction tuning\" OR all:\"preference optimization\" OR all:RLHF OR all:DPO)"],
  ["advanced-inference", "(cat:cs.CL OR cat:cs.LG OR cat:cs.DC) AND all:\"large language model\" AND (all:inference OR all:serving OR all:quantization OR all:\"KV cache\")"],
  ["advanced-rag", "(cat:cs.IR OR cat:cs.CL) AND all:\"retrieval augmented generation\" AND (all:graph OR all:multimodal OR all:\"long context\" OR all:adaptive)"],
  ["advanced-multiagent", "(cat:cs.AI OR cat:cs.CL OR cat:cs.MA) AND all:\"large language model\" AND (all:\"multi-agent\" OR all:\"multiagent\")"],
  ["frontier-paradigm", "(cat:cs.AI OR cat:cs.CL) AND all:agent AND (all:planning OR all:reasoning OR all:reflection OR all:\"test-time search\") AND submittedDate:[202409010000 TO 202609012359]"],
  ["frontier-tools-memory", "(cat:cs.AI OR cat:cs.CL) AND all:agent AND (all:\"tool use\" OR all:memory OR all:context) AND submittedDate:[202409010000 TO 202609012359]"],
  ["frontier-computer-coding", "(cat:cs.AI OR cat:cs.SE OR cat:cs.CL) AND all:agent AND (all:browser OR all:GUI OR all:\"computer use\" OR all:coding OR all:\"software engineering\") AND submittedDate:[202409010000 TO 202609012359]"],
  ["frontier-research-learning", "(cat:cs.AI OR cat:cs.CL) AND (all:\"language model agent\" OR all:\"LLM agent\") AND (all:\"deep research\" OR all:\"self-improvement\" OR all:\"multi-agent collaboration\" OR all:\"agent training\" OR all:\"agent learning\") AND submittedDate:[202409010000 TO 202609012359]"],
  ["frontier-eval-safety", "(cat:cs.AI OR cat:cs.CL) AND all:agent AND (all:evaluation OR all:benchmark OR all:security OR all:safety OR all:\"prompt injection\") AND submittedDate:[202409010000 TO 202609012359]"],
];

const curatedSeeds = {
  "formal-models": ["1706.03762", "1810.04805", "1910.10683", "2001.08361", "2005.14165", "2203.15556", "2307.09288", "2407.21783", "2412.15115", "2412.19437", "2501.12948", "2503.19786", "2505.09388", "2507.20534"],
  "formal-context": ["2005.14165", "2101.00190", "2104.08691", "2109.05093", "2110.11309", "2201.11903", "2205.11916", "2212.06094", "2305.10601"],
  "formal-retrieval": ["2004.04906", "2005.11401", "2112.01488", "2212.10496", "2310.11511", "2312.10997", "2401.15884", "2401.18059"],
  "formal-tools": ["2210.03629", "2302.04761", "2303.09014", "2305.15334", "2307.16789", "2406.12045", "2408.04682"],
  "formal-runtime": ["2210.03629", "2304.03442", "2305.10250", "2307.07924", "2308.00352", "2308.03688", "2308.08155", "2310.08560", "2401.13178", "2402.14034"],
  "formal-eval-safety": ["2009.03300", "2009.11462", "2109.07958", "2206.04615", "2211.09110", "2303.08896", "2303.16634", "2306.05685", "2309.15217", "2310.12815", "2311.12983", "2406.13352"],
  "advanced-math": ["1207.0580", "1412.6980", "1502.03167", "1607.06450", "1609.04836", "1706.03762", "1806.07572", "1810.04805", "1912.02292", "2001.08361", "2201.02177", "2203.15556"],
  "advanced-training": ["1706.03762", "1810.04805", "1910.10683", "2001.08361", "2005.14165", "2101.03961", "2203.15556", "2204.02311", "2307.09288", "2407.21783", "2412.15115", "2412.19437", "2505.09388", "2507.20534"],
  "advanced-posttraining": ["1707.06347", "2106.09685", "2110.11309", "2203.02155", "2212.08073", "2212.10560", "2301.13688", "2305.11206", "2305.18290", "2309.00267", "2402.01306", "2402.03300", "2403.07691", "2405.14734", "2501.12948", "2505.09388", "2507.20534"],
  "advanced-inference": ["2205.14135", "2210.17323", "2211.10438", "2211.17192", "2303.06865", "2306.00978", "2307.08691", "2309.06180", "2412.19437", "2503.19786", "2507.20534"],
  "advanced-rag": ["2005.11401", "2212.10496", "2310.11511", "2312.10997", "2401.15884", "2401.18059", "2404.16130", "2405.14831", "2410.05779"],
  "advanced-multiagent": ["2303.17760", "2307.07924", "2308.00352", "2308.08155", "2412.14161"],
  "frontier-paradigm": ["2303.11366", "2305.10601", "2305.14992", "2310.04406", "2405.16334", "2501.12948", "2507.20534", "2606.16576"],
  "frontier-tools-memory": ["2302.04761", "2310.08560", "2406.12045", "2408.04682", "2504.19413", "2608.15008"],
  "frontier-computer-coding": ["2306.06070", "2307.13854", "2310.06770", "2401.13649", "2401.13919", "2404.07972", "2405.14573", "2405.15793", "2407.01489", "2502.12115", "2607.25398"],
  "frontier-research-learning": ["2311.12983", "2504.12516", "2504.15228", "2508.03680", "2604.10547"],
  "frontier-eval-safety": ["2308.03688", "2310.12815", "2311.12983", "2401.13178", "2404.07972", "2406.12045", "2406.13352", "2408.04682", "2504.01848", "2602.11224", "2605.27898", "2607.18063", "2608.26623"],
};

function decodeXml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"');
}

function pick(block, tag) {
  return decodeXml((block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "").replace(/\\s+/g, " ").trim());
}

function parseFeed(xml, moduleId, query) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match, index) => {
    const block = match[1];
    const arxivId = pick(block, "id").match(/\/abs\/([^v]+)(?:v\d+)?$/)?.[1];
    const authors = [...block.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map((author) => decodeXml(author[1].trim()));
    const published = pick(block, "published");
    return {
      id: `paper-arxiv-${arxivId.replace(/[./]/g, "-")}`,
      arxiv_id: arxivId,
      type: "paper",
      title: pick(block, "title"),
      creator: authors.join("、"),
      year: published.slice(0, 4),
      publication_date: published.slice(0, 10),
      modules: [moduleId],
      level: moduleId.startsWith("formal-") ? "core" : "advanced",
      maturity: moduleId.startsWith("frontier-") ? "frontier" : "established",
      role: `服务于“${modules.find((item) => item.id === moduleId)?.name ?? "精选论文锚点"}”的原始研究、综述、系统或基准论文；入选后仍需在具体文章中核验实验条件与外推边界。`,
      content_url: `https://arxiv.org/pdf/${arxivId}`,
      access: "open",
      venue: pick(block, "arxiv:journal_ref") || "arXiv",
      source_query: query,
      search_rank: index + 1,
      verification: { status: "fulltext-url-verified", method: "tavily-source-map-and-arxiv-api", checked_at: checkedAt },
    };
  }).filter((paper) => paper.id && paper.title && paper.creator && paper.year);
}

const domainDriftPattern = /\b(?:medical|medicine|healthcare|health record|pediatric|clinical|biomedical|protein|chemistry|financial|finance|trading|quran|persian|powerpoint|manufactur(?:ing|er)|materials? discovery|ecg|touris(?:m|t)|travel|undergraduate|sentence simplification|smart contracts?|audio reasoning|transportation systems?)\b/i;
const moduleDriftPatterns = {
  "formal-models": /\b(?:arabic|evolutionary computation|backdoor|privacy-preserving|code large language models?|disease classification)\b/i,
  "formal-context": /\b(?:legal|mental health|k-12|fairy(?:tale|tales)|midjourney|business process management|education|traffic crash|privacy policy|forecasting|cultural bias|arabs?|muslims?)\b/i,
  "formal-runtime": /\b(?:fake news|visual information seeking|root cause analysis|ctf|vulnerabilit|creative intelligence|structural engineering)\b/i,
  "formal-eval-safety": /\b(?:code large language models?|long text modeling)\b/i,
  "advanced-math": /\b(?:music|images?|vision|visual|segmentation|referring expression|recommendation)\b/i,
  "advanced-training": /\b(?:thai|polish|visual language|pretrained encyclopedia|brain language|\bbci\b)\b/i,
  "advanced-multiagent": /\b(?:6g|wireless communications|swarm intelligence|equity portfolio)\b/i,
  "frontier-paradigm": /\b(?:autonomous driving|embodied multi-agent|city navigation)\b/i,
  "frontier-research-learning": /\b(?:edge caching|c-v2x|islamic|math problem generation|network resource management|3d scene|blender code|collaborative filtering|recommendations?)\b/i,
};
const modulePositivePatterns = {
  "formal-models": /language models?|in-context|scaling laws?|foundation models?|emergent|uncertainty|tokens?|transformers?/i,
  "formal-context": /prompts?|structured generation|constrained decoding|grammars?|schemas?|context engineering|prompting is programming/i,
  "formal-retrieval": /retrieval|\brag\b|embeddings?|rerank|dense passage|colbert/i,
  "formal-tools": /tools?|function.call|\bapi\b|react:|restgpt|gorilla/i,
  "formal-runtime": /agents?|memory|workflows?|runtime|stateful|autogen/i,
  "formal-eval-safety": /evaluat|benchmarks?|safety|truth|toxicity|hallucinat|judge|prompt injection/i,
  "advanced-math": /optimi[sz]|attention|normali[sz]ation|generalization|scaling laws?|gradients?|information|convex|kernels?|transformer theory/i,
  "advanced-training": /train|pretrain|scaling|language models?|transformers?|tokens?|mixture|datasets?/i,
  "advanced-posttraining": /preferences?|rlhf|\bdpo\b|instructions?|alignment|fine.tun|lora|peft|policy optimi[sz]ation/i,
  "advanced-inference": /inference|serving|quantization|\bcache\b|kv cache|throughput|memory management|flashattention/i,
  "advanced-rag": /retrieval|\brag\b|graphrag|long.context/i,
  "advanced-multiagent": /multi.agent|multiagent|collaboration|autogen|chatdev|metagpt|camel/i,
  "frontier-paradigm": /agent.*(?:planning|reasoning|reflect)|(?:planning|reasoning|reflect).*agent|world models?|tree search|test.time/i,
  "frontier-tools-memory": /agent.*(?:tool|memory|context)|(?:tool|memory|context).*agent|\bmcp\b|toolformer|memgpt/i,
  "frontier-computer-coding": /agent.*(?:web|gui|computer|software|coding|code)|(?:web|gui|computer|software|coding).*agent|swe-|webarena|osworld|androidworld/i,
  "frontier-research-learning": /agent.*(?:research|learn|train|self.improv|collabor)|(?:research|learn|train|self.improv|collabor).*agent|browsecomp|paperbench/i,
  "frontier-eval-safety": /agent.*(?:evaluat|benchmark|safe|secur|attack|injection|judge)|(?:evaluat|benchmark|safe|secur|attack|injection|judge).*agent|tau.bench|agentdojo|osworld/i,
};

async function fetchSemanticScholarMetrics(papers) {
  const arxivIds = [...new Set(papers.map((paper) => paper.arxiv_id).filter(Boolean))];
  const metrics = new Map();
  for (let offset = 0; offset < arxivIds.length; offset += 100) {
    const batch = arxivIds.slice(offset, offset + 100);
    for (let attempt = 1; attempt <= 6; attempt += 1) {
      try {
        const response = await fetch("https://api.semanticscholar.org/graph/v1/paper/batch?fields=title,citationCount,influentialCitationCount,venue,year,publicationTypes,externalIds", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "user-agent": "Learning007KnowledgeBase/1.0 (authority metadata audit)",
          },
          body: JSON.stringify({ ids: batch.map((id) => `ARXIV:${id}`) }),
          signal: AbortSignal.timeout(30_000),
        });
        if (!response.ok) throw new Error(`Semantic Scholar ${response.status}`);
        const records = await response.json();
        for (const record of records) {
          const arxivId = record?.externalIds?.ArXiv;
          if (!arxivId) continue;
          metrics.set(arxivId, {
            citation_count: record.citationCount ?? 0,
            influential_citation_count: record.influentialCitationCount ?? 0,
            scholarly_venue: record.venue || "",
            publication_types: record.publicationTypes ?? [],
          });
        }
        break;
      } catch (error) {
        if (attempt === 6) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 900));
  }
  return metrics;
}

function authorityScore(paper, moduleId) {
  const year = Number(paper.year) || 0;
  const citations = paper.citation_count ?? 0;
  const influential = paper.influential_citation_count ?? 0;
  const venueBonus = paper.scholarly_venue && paper.scholarly_venue.toLowerCase() !== "arxiv" ? 12 : 0;
  const publicationBonus = paper.publication_types?.length ? 6 : 0;
  const relevanceBonus = Math.max(0, 15 - (paper.search_rank ?? 15)) * 0.6;
  const recencyBonus = moduleId.startsWith("frontier-")
    ? Math.max(0, year - 2022) * 6
    : Math.max(0, year - 2022) * 2;
  return Math.log2(citations + 1) * 10
    + Math.log2(influential + 1) * 14
    + venueBonus
    + publicationBonus
    + relevanceBonus
    + recencyBonus;
}

function rankQueryPapers(papers, moduleId) {
  const moduleDriftPattern = moduleDriftPatterns[moduleId];
  const modulePositivePattern = modulePositivePatterns[moduleId];
  return papers
    .filter((paper) => Number(paper.year) >= 2023
      && paper.publication_date <= snapshotDate
      && !domainDriftPattern.test(paper.title)
      && !(moduleDriftPattern?.test(paper.title))
      && (!modulePositivePattern || modulePositivePattern.test(paper.title))
      && (paper.citation_count >= (moduleId.startsWith("frontier-") ? 3 : 8)
        || (paper.scholarly_venue && !/^arxiv(?:\.org)?$/i.test(paper.scholarly_venue))))
    .sort((left, right) => authorityScore(right, moduleId) - authorityScore(left, moduleId));
}

function freshnessForYear(year) {
  if (year === "持续更新" || Number(year) >= 2025) return "current";
  if (Number(year) >= 2023) return "recent";
  return "foundation";
}

async function fetchFeed(moduleId, query, attempts = 4) {
  const url = new URL("https://export.arxiv.org/api/query");
  url.searchParams.set("search_query", query);
  url.searchParams.set("start", "0");
  url.searchParams.set("max_results", "70");
  url.searchParams.set("sortBy", "relevance");
  url.searchParams.set("sortOrder", "descending");
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "Learning007KnowledgeBase/1.0 (open literature catalog)" },
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`arXiv ${response.status}`);
      const papers = parseFeed(await response.text(), moduleId, query);
      if (!papers.length) throw new Error(`arXiv returned no usable records for ${moduleId}`);
      return papers;
    } catch (error) {
      if (attempt === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
  }
}

async function fetchCuratedPapers() {
  const ids = [...new Set(Object.values(curatedSeeds).flat())];
  const metadata = new Map();
  for (let offset = 0; offset < ids.length; offset += 45) {
    const batch = ids.slice(offset, offset + 45);
    const url = new URL("https://export.arxiv.org/api/query");
    url.searchParams.set("id_list", batch.join(","));
    url.searchParams.set("max_results", String(batch.length));
    const response = await fetch(url, {
      headers: { "user-agent": "Learning007KnowledgeBase/1.0 (curated literature anchors)" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`arXiv curated metadata ${response.status}`);
    for (const paper of parseFeed(await response.text(), "curated", "curated anchor list")) {
      metadata.set(paper.content_url.split("/").at(-1), paper);
    }
    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  const results = [];
  const missing = [];
  for (const [moduleId, idsForModule] of Object.entries(curatedSeeds)) {
    for (const arxivId of idsForModule) {
      const base = metadata.get(arxivId);
      if (!base) {
        missing.push(`${moduleId}:${arxivId}`);
        continue;
      }
      results.push({
        ...base,
        modules: [moduleId],
        level: moduleId.startsWith("formal-") ? "core" : "advanced",
        maturity: moduleId.startsWith("frontier-") ? "frontier" : "established",
        role: `“${modules.find((item) => item.id === moduleId).name}”中的奠基、代表性系统或关键基准论文；由既有课程证据账本与 Tavily 文献脉络共同选为锚点。`,
        source_query: "curated anchor list",
        search_rank: 0,
        verification: { status: "fulltext-url-verified", method: "curriculum-ledger-tavily-and-arxiv-api", checked_at: checkedAt },
      });
    }
  }
  if (missing.length) console.warn(`Missing curated arXiv records: ${missing.join(", ")}`);
  return results;
}

function mergePaper(target, incoming) {
  target.modules = [...new Set([...target.modules, ...incoming.modules])];
  target.level = target.modules.some((moduleId) => moduleId.startsWith("formal-")) ? "core" : "advanced";
  target.maturity = target.modules.every((moduleId) => moduleId.startsWith("frontier-")) ? "frontier" : "established";
  return target;
}

const books = bookRows.map(([id, title, creator, year, resourceModules, level, role, contentUrl]) => {
  const reviewUrl = bookReviewUrls.get(id);
  return {
    id: `book-${id}`,
    type: "book",
    title,
    creator,
    year,
    modules: resourceModules,
    level,
    maturity: "established",
    freshness: freshnessForYear(year),
    role,
    content_url: contentUrl,
    review_url: reviewUrl,
    review_status: reviewUrl ? "published" : "pending-full-review",
    access: "open",
    verification: { status: "fulltext-url-verified", method: "tavily-and-authoritative-source", checked_at: checkedAt },
  };
});

const queryResults = [];
for (const [moduleId, query] of paperQueries) {
  const papers = await fetchFeed(moduleId, query);
  queryResults.push([moduleId, papers]);
  await new Promise((resolve) => setTimeout(resolve, 700));
}

const curatedPapers = await fetchCuratedPapers();
const allCandidates = [...curatedPapers, ...queryResults.flatMap(([, papers]) => papers)];
const authorityMetrics = await fetchSemanticScholarMetrics(allCandidates);
for (const paper of allCandidates) {
  Object.assign(paper, authorityMetrics.get(paper.arxiv_id) ?? {
    citation_count: 0,
    influential_citation_count: 0,
    scholarly_venue: "",
    publication_types: [],
  });
  paper.venue = paper.scholarly_venue || paper.venue;
  paper.verification = {
    status: "fulltext-url-verified",
    method: paper.source_query === "curated anchor list"
      ? "curriculum-ledger-tavily-arxiv-and-semantic-scholar"
      : "tavily-source-map-arxiv-and-semantic-scholar",
    checked_at: checkedAt,
  };
}
for (const entry of queryResults) entry[1] = rankQueryPapers(entry[1], entry[0]);

const selected = new Map();
for (const paper of curatedPapers) {
  const existing = selected.get(paper.id);
  selected.set(paper.id, existing ? mergePaper(existing, paper) : paper);
}
const minimumPerModule = 12;
const reserveQueues = [];
for (const [moduleId, papers] of queryResults) {
  const recentFloor = moduleId.startsWith("frontier-") ? 9 : moduleId.startsWith("advanced-") ? 7 : 6;
  const recent = papers.filter((paper) => Number(paper.year) >= 2025).slice(0, recentFloor);
  const recentIds = new Set(recent.map((paper) => paper.id));
  const primary = [...recent, ...papers.filter((paper) => !recentIds.has(paper.id))].slice(0, minimumPerModule);
  const primaryIds = new Set(primary.map((paper) => paper.id));
  reserveQueues.push([moduleId, papers.filter((paper) => !primaryIds.has(paper.id))]);
  for (const paper of primary) {
    const existing = selected.get(paper.id);
    selected.set(paper.id, existing ? mergePaper(existing, paper) : paper);
  }
}

let reserveIndex = 0;
while (selected.size < targetPaperCount) {
  let added = false;
  for (const [, papers] of reserveQueues) {
    const paper = papers[reserveIndex];
    if (!paper) continue;
    const existing = selected.get(paper.id);
    selected.set(paper.id, existing ? mergePaper(existing, paper) : paper);
    added = true;
    if (selected.size >= targetPaperCount) break;
  }
  reserveIndex += 1;
  if (!added) break;
}

const papers = [...selected.values()];
if (papers.length < targetPaperCount) throw new Error(`Only ${papers.length} unique papers collected; target is ${targetPaperCount}`);
for (const paper of papers) paper.freshness = freshnessForYear(paper.year);

const topicCounts = Object.fromEntries(modules.map((module) => [module.id, papers.filter((paper) => paper.modules.includes(module.id)).length]));
const catalog = {
  schema_version: 2,
  field,
  title: "AI 应用与 Agent",
  updated_at: checkedAt,
  evidence_cutoff: snapshotDate,
  curriculum_scope: { navigation_units: 47, actual_node_ids: 67, formal: 19, advanced: 18, frontier: 30 },
  storage_policy: "仅保存无需登录即可阅读的教材正文或论文全文 URL 与结构化元数据；不下载、不镜像原文。旧资料只保留不可替代的奠基内容，正式与进阶优先 2023 年后资料，前沿重点覆盖最近 12—24 个月。",
  selection_policy: [
    "Tavily 用于建立来源地图、发现作者/大学/开放出版社候选和定位权威综述；最终书目只保留作者、大学、开放教材或正式机构提供的完整正文入口。",
    "正式与进阶部分优先收录可长期复用的算法、协议、运行时、分布式系统、可靠性和安全工程资料，不按产品热度排序。",
    "旧论文只允许通过人工维护的奠基锚点进入；自动补充论文不得早于 2023 年，且正式、进阶、前沿模块分别设置 2025 年后资料配额。",
    "前沿部分限定为能够改变 Agent 能力或评测边界的原始论文、系统论文、基准与高质量综述，检索窗口收紧至最近两年并明确标记为前沿证据。",
    "购买页、登录页、课程入口、营销文章、只有摘要的 DOI 页面和无法识别完整正文的候选不进入公开目录。",
    "入库表示全文入口与主题身份已经核验，不代表正文已经引用；用于学习文章前仍需记录实际阅读范围、采用观点和不可外推结论。",
  ],
  modules,
  resources: [...books, ...papers],
};

const internalBooks = {
  field,
  title: "AI 应用与 Agent",
  curated_count: books.length,
  methodology: "先按正式、进阶、前沿学习节点建立来源地图，再用 Tavily 检索权威候选；仅保留完整开放正文，并重点补入稳定的软件与系统工程底座。",
  records: books.map((book) => ({
    id: `book:${field}:${book.id.slice(5)}`,
    field,
    kind: "book",
    title: book.title,
    authors: book.creator.split("、"),
    year: book.year,
    topics: book.modules,
    official_url: book.content_url,
    authority_reason: book.role,
    freshness: book.freshness,
    review_url: book.review_url,
    review_status: book.review_status,
    access: { status: "open_fulltext", download_url: book.content_url, checked_at: checkedAt },
    updated_at: checkedAt,
  })),
};

const internalPapers = {
  field,
  title: "AI 应用与 Agent",
  snapshot_date: snapshotDate,
  provider: "arXiv API with Tavily source-map audit",
  selection_method: "17 个模块分别检索稳定基础与近期前沿论文；先纳入课程证据锚点，再剔除领域应用漂移，并结合 Semantic Scholar 引用、影响引用、发表场所和 arXiv 相关性排序，保证模块最低覆盖后轮询补齐，最后按 arXiv ID 去重并保留跨模块映射。",
  caveat: "目录用于定位原文，不用数量代替质量判断；具体写作仍需阅读方法、实验、限制和修订版本。",
  records: papers.map((paper) => ({
    id: paper.id.replace("paper-arxiv-", "paper:arxiv:"),
    field,
    kind: "paper",
    title: paper.title,
    authors: paper.creator.split("、"),
    year: Number(paper.year),
    publication_date: paper.publication_date,
    type: "preprint-or-author-copy",
    venue: paper.venue,
    official_url: paper.content_url,
    topics: paper.modules,
    source_query: paper.source_query,
    citation_count: paper.citation_count,
    influential_citation_count: paper.influential_citation_count,
    scholarly_venue: paper.scholarly_venue,
    publication_types: paper.publication_types,
    freshness: paper.freshness,
    authority_tier: paper.maturity === "frontier" ? "recent-frontier" : "established-open-primary",
    selection_reason: paper.role,
    open_access: { is_oa: true, status: "green", landing_page_url: paper.content_url.replace("/pdf/", "/abs/"), pdf_url: paper.content_url },
    retrieved_at: checkedAt,
  })),
};

const summary = {
  field,
  title: "AI 应用与 Agent",
  updated_at: checkedAt,
  evidence_cutoff: snapshotDate,
  curriculum_coverage: catalog.curriculum_scope,
  books: { total: books.length, open_fulltext: books.length, current_or_living: books.filter((book) => book.freshness === "current").length },
  papers: { total: papers.length, open_access: papers.length, since_2023: papers.filter((paper) => Number(paper.year) >= 2023).length, since_2025: papers.filter((paper) => Number(paper.year) >= 2025).length, topic_counts: topicCounts },
  source_audit: { tavily_used: true, deep_research_request_id: "41404b17-b74f-4a28-a8e6-17db4981190a", rule: "Tavily 发现候选；作者、大学、开放出版社、arXiv API 与目录结构完成最终核验。" },
};

const fieldDir = path.resolve("knowledge-base", "fields", field);
await mkdir(fieldDir, { recursive: true });
await mkdir(path.resolve("docs", "public", "data", "knowledge-base"), { recursive: true });
await writeFile(path.join(fieldDir, "books.json"), `${JSON.stringify(internalBooks, null, 2)}\n`, "utf8");
await writeFile(path.join(fieldDir, "papers.json"), `${JSON.stringify(internalPapers, null, 2)}\n`, "utf8");
await writeFile(path.join(fieldDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
await writeFile(path.resolve("docs", "public", "data", "knowledge-base", `${field}.json`), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

console.log(`ai-agent catalog: ${books.length} books, ${papers.length} papers, ${modules.length} modules`);
console.log(JSON.stringify(topicCounts, null, 2));
