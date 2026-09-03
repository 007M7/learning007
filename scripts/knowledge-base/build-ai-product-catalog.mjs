import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const checkedAt = "2026-09-02";
const publicOutput = path.resolve("docs/public/data/knowledge-base/ai-product.json");
const sourceDir = path.resolve("knowledge-base/fields/ai-product");

const modules = [
  { id: "problem-discovery", name: "问题发现与价值判断", goal: "识别值得用 AI 解决的用户任务，并把价值、风险与证据写成可证伪假设。" },
  { id: "workflow", name: "工作流与人机分工", goal: "设计人、模型、工具和审核节点之间的分工，而不是只画一个聊天框。" },
  { id: "capability-architecture", name: "能力边界与产品架构", goal: "理解模型、检索、工具、记忆和 Agent 的能力边界，完成任务—能力匹配。" },
  { id: "evaluation", name: "评测合同与质量门槛", goal: "把模糊的“效果好”改写为任务集、指标、切片、人工评审与发布门槛。" },
  { id: "experimentation", name: "实验、指标与因果", goal: "连接离线评测、在线实验、护栏指标和因果判断，避免把相关性当成产品价值。" },
  { id: "ux-trust", name: "交互、信任与可控性", goal: "通过期望管理、解释、纠错、确认和降级机制校准用户依赖。" },
  { id: "operations", name: "上线运营与学习闭环", goal: "治理数据反馈、监控、版本、事故和成本，让产品在真实使用中持续可控。" },
  { id: "governance", name: "治理、责任与合规", goal: "用风险分级、影响评估、系统卡和责任边界把原则转成产品动作。" },
  { id: "economics", name: "商业价值与组织采用", goal: "判断采用率、生产率、单位经济和组织改变，而不是只计算模型调用费用。" },
  { id: "strategy-organization", name: "产品战略与组织能力", goal: "判断自建或采购、能力积累、责任归属和组织准备度如何影响 AI 产品成败。" },
  { id: "generative-ai", name: "生成式 AI 产品设计", goal: "处理开放式输出、共创、Copilot、生成式界面和 Agent 产品特有的设计问题。" },
];

const books = [
  {
    id: "book-pair-guidebook", title: "People + AI Guidebook", creator: "Google PAIR", year: "持续更新",
    modules: ["problem-discovery", "workflow", "ux-trust"], level: "starter",
    role: "沿用户需求、数据、心智模型、解释、反馈和失败恢复，建立人本 AI 产品设计的完整判断顺序。",
    content_url: "https://pair.withgoogle.com/guidebook-v2/", resource_class: "systematic-handbook",
    access_proof: "Google PAIR 官方完整在线正文，六章、工作表与设计模式均可直接阅读。",
    review_url: "/knowledge-base/reviews/ai-product/pair-guidebook",
  },
  {
    id: "book-ai-product-manager-handbook-2026", title: "AI Product Manager Handbook 2026", creator: "IdeaPlan", year: "2026",
    modules: ["capability-architecture", "evaluation", "ux-trust", "economics", "operations", "strategy-organization"], level: "starter",
    role: "用十二章串起 AI 适用性、PRD、评测、UX、战略、经济性、监控和组织规模化。",
    content_url: "https://www.ideaplan.io/reports/ai-pm-handbook.pdf", resource_class: "open-textbook",
    access_proof: "出版方公开的完整 PDF，可直接读取十二章正文，无需登录或邮箱解锁。",
    review_url: "/knowledge-base/reviews/ai-product/ai-product-manager-handbook-2026",
  },
  {
    id: "book-shape-up", title: "Shape Up: Stop Running in Circles and Ship Work that Matters", creator: "Ryan Singer / Basecamp", year: "2019",
    modules: ["problem-discovery", "workflow", "operations", "strategy-organization"], level: "core",
    role: "从塑形、下注到交付建立固定时间、可变范围、风险预处理和项目责任制。",
    content_url: "https://basecamp.com/shapeup", resource_class: "open-textbook",
    access_proof: "Basecamp 官方完整在线书稿，含十五章、附录和术语表。",
    review_url: "/knowledge-base/reviews/ai-product/shape-up",
  },
  {
    id: "book-field-guide-hcd", title: "The Field Guide to Human-Centered Design", creator: "IDEO.org", year: "2015",
    modules: ["problem-discovery", "workflow", "ux-trust", "experimentation"], level: "starter",
    role: "通过灵感、构思和实施三个阶段以及 57 种方法，系统训练用户研究、共创、原型和验证。",
    content_url: "https://swchi.org/wp-content/uploads/2020/10/THE-FIELD-GUIDE-TO-HCD-from-IDEO.org_.pdf", resource_class: "open-textbook",
    access_proof: "完整 192 页 PDF；原书以 CC BY-NC-ND 3.0 发布，当前入口保留完整版权与许可页。",
    review_url: "/knowledge-base/reviews/ai-product/field-guide-hcd",
  },
  {
    id: "book-strategic-product-management", title: "Strategic Product Management", creator: "Frank Lemser / proProduktmanagement", year: "2025 更新",
    modules: ["problem-discovery", "economics", "strategy-organization"], level: "core",
    role: "从市场访谈与事实分析出发，逐步形成产品战略、商业计划、路线图和跨部门决策依据。",
    content_url: "https://www.pro-productmanagement.com/images/downloads/strategic-product-management-book-open-product-management-workflow.pdf", resource_class: "open-textbook",
    access_proof: "作者机构提供的完整教材 PDF，标注 CC BY-SA 4.0 与 2025 年更新时间。",
    review_url: "/knowledge-base/reviews/ai-product/strategic-product-management",
  },
  {
    id: "book-technical-product-management", title: "Technical Product Management", creator: "Frank Lemser / proProduktmanagement", year: "持续更新",
    modules: ["workflow", "capability-architecture", "evaluation", "operations"], level: "core",
    role: "系统讲解技术产品团队、需求表达、优先级、工作包、成本估算、KPI 与原型验证。",
    content_url: "https://www.pro-productmanagement.com/images/downloads/technical-product-management-book-open-product-management-workflow.pdf", resource_class: "open-textbook",
    access_proof: "作者机构提供的完整教材 PDF，可直接打开，无需购买或登录。",
    review_url: "/knowledge-base/reviews/ai-product/technical-product-management",
  },
  {
    id: "book-successful-go-to-market", title: "Successful Go-to-Market", creator: "Frank Lemser / proProduktmanagement", year: "持续更新",
    modules: ["experimentation", "economics", "strategy-organization"], level: "core",
    role: "把定位、营销与销售协同、上市计划、收入预测和资源使用组织成可重复的上市流程。",
    content_url: "https://www.pro-productmanagement.com/images/downloads/successfull-go-to-market-book-open-product-management-workflow.pdf", resource_class: "open-textbook",
    access_proof: "作者机构提供的完整教材 PDF，可直接打开，无需购买或登录。",
    review_url: "/knowledge-base/reviews/ai-product/successful-go-to-market",
  },
  {
    id: "book-real-startup-book", title: "The Real Startup Book", creator: "Tristan Kromer 等 / Kromatic", year: "2026 第二版",
    modules: ["problem-discovery", "experimentation", "workflow", "generative-ai"], level: "core",
    role: "用六十余种现场方法连接问题发现、市场实验、产品实验、原型、优先级与 AI 辅助研究。",
    content_url: "https://kromatic.com/real-startup-book/", resource_class: "open-textbook",
    access_proof: "作者团队公开的完整在线第二版，可沿目录连续阅读全部方法与附录。",
    review_url: "/knowledge-base/reviews/ai-product/real-startup-book",
  },
  {
    id: "book-product-discovery-playbook", title: "The Product Discovery Playbook", creator: "Productboard", year: "2021",
    modules: ["problem-discovery", "workflow", "experimentation"], level: "starter",
    role: "围绕持续理解用户、问题优先级、验证和证据管理建立产品发现的系统实践路径。",
    content_url: "https://www.productboard.com/wp-content/uploads/2021/03/The-Product-Discovery-Playbook.pdf", resource_class: "systematic-handbook",
    access_proof: "Productboard 官方域直接提供的完整 PDF，无需登录。",
    review_url: "/knowledge-base/reviews/ai-product/product-discovery-playbook",
  },
  {
    id: "book-lean-service-creation", title: "Lean Service Creation Handbook", creator: "Futurice", year: "持续更新",
    modules: ["problem-discovery", "workflow", "experimentation", "strategy-organization"], level: "core",
    role: "把设计思维、精益创业和敏捷开发组合为从洞察、价值主张到原型与商业验证的完整服务创建流程。",
    content_url: "https://futurice.github.io/lean-service-creation-kit", resource_class: "systematic-handbook",
    access_proof: "Futurice 官方 GitHub Pages 提供完整开放方法库、画布与使用说明。",
    review_url: "/knowledge-base/reviews/ai-product/lean-service-creation",
  },
  {
    id: "book-user-experience-ai", title: "User Experience + Artificial Intelligence: Assessing the Qualities of AI-infused Systems", creator: "Davide Spallazzo / Martina Sciannamè / Mauro Ceconello", year: "2025",
    modules: ["ux-trust", "evaluation", "workflow"], level: "advanced",
    role: "从 AI 系统的体验质量出发，系统建立 AIXE 评价方法并展示其验证与产品应用。",
    content_url: "https://link.springer.com/content/pdf/10.1007/978-3-031-77521-5.pdf", resource_class: "open-textbook",
    access_proof: "Springer 明确标记为 Open Access Book，107 页 PDF 与 EPUB 均可直接下载。",
    review_url: "/knowledge-base/reviews/ai-product/user-experience-ai",
  },
  {
    id: "book-ai-measurement-science", title: "AI Measurement Science", creator: "Sang T. Truong / Sanmi Koyejo / Stanford AIMSLab", year: "2026",
    modules: ["evaluation", "capability-architecture", "experimentation", "governance"], level: "advanced",
    role: "从效度、数据、模型、可靠性和效率建立 AI 评测科学，并延伸到 Agent、监督和评价生态。",
    content_url: "https://aimslab.stanford.edu/textbook", resource_class: "open-textbook",
    access_proof: "Stanford AIMSLab 官方完整在线教材，含顺序章节、交互代码、数据集和课程项目。",
    review_url: "/knowledge-base/reviews/ai-product/ai-measurement-science",
  },
].map((book) => ({
  ...book,
  type: "book",
  access: "open",
  review_status: book.review_url ? "published" : "pending-full-review",
  verification: { status: "fulltext-url-verified", method: "tavily-search-extract-and-manual-curriculum-audit", checked_at: checkedAt },
}));

// 每组十篇。候选先由 Tavily 在 arXiv 官方域内检索，再按题名相关性、方法价值与模块覆盖人工筛选。
const arxivGroups = {
  "problem-discovery": ["2301.12243", "2304.12241", "2402.07933", "2507.15885", "2104.03483", "2605.00280", "2509.12752", "2605.00282", "2112.07467", "2412.07045"],
  workflow: ["2403.04931", "2404.12056", "2509.19152", "2604.07121", "2509.20666", "2501.10909", "2602.01481", "2602.15865", "2407.19098", "2604.18096"],
  "capability-architecture": ["2502.09670", "2506.01793", "2304.08354", "2211.09110", "2302.04761", "2305.15334", "2307.16789", "2308.03688", "2311.12983", "2401.13178"],
  evaluation: ["2408.13338", "2508.15361", "2508.18646", "2504.18838", "2309.07462", "2505.08253", "2410.12857", "2507.21504", "2506.11094", "2406.13990"],
  experimentation: ["2212.11366", "2212.08771", "2312.10624", "2604.16671", "2504.09723", "2510.03468", "2211.03262", "2402.03915", "2308.04929", "2502.08763"],
  "ux-trust": ["2511.16769", "2509.23497", "2603.18895", "2501.16627", "2605.18036", "2402.07632", "2410.20067", "2509.08010", "2502.13321", "2604.05658"],
  operations: ["2504.16789", "2406.09737", "2311.12019", "2503.15577", "2205.02302", "2604.16371", "1606.03966", "2201.00162", "2502.13011", "2403.16795"],
  governance: ["2508.18919", "2502.13294", "2408.12047", "2312.06153", "2506.02071", "2509.20394", "2506.23949", "2601.22424", "2407.17374", "2601.13122"],
  economics: ["2506.00532", "2604.18849", "2304.11771", "2608.15550", "2504.11436", "2510.12049", "2502.13281", "2608.11626", "2505.14588", "2410.18334"],
  "generative-ai": ["2301.05578", "2411.02662", "2501.13145", "2507.17774", "2505.15049", "2602.05299", "2510.23324", "2509.12491", "2405.01543", "2312.14231"],
};

const groupRoles = {
  "problem-discovery": "用于判断 AI 机会、利益相关者价值、设计约束与人本发现方法。",
  workflow: "用于设计混合主动、人机协作、任务分解、控制权和工作流边界。",
  "capability-architecture": "用于理解基础模型、工具调用和 Agent 的能力边界及产品架构。",
  evaluation: "用于建立基础模型、LLM 与 Agent 的评测方法、基准边界和质量合同。",
  experimentation: "用于设计在线对照实验、指标敏感度、干扰控制和连续实验体系。",
  "ux-trust": "用于研究信任校准、适当依赖、解释方式和高风险人机决策。",
  operations: "用于治理 MLOps、技术债、生产监控、版本演进和组织协作。",
  governance: "用于建立责任治理、影响评估、系统卡、审计与风险管理机制。",
  economics: "用于判断生成式 AI 的采用、生产率、组织结构与真实商业价值。",
  "generative-ai": "用于设计生成式界面、Copilot、共创工作流与新型产品交互。",
};

const manualPapers = [
  ["human-ai-guidelines", "Guidelines for Human-AI Interaction", "Saleema Amershi 等", "2019", ["workflow", "ux-trust"], "提出覆盖初始、交互、失败和长期适应的十八条人机交互设计准则。", "https://www.microsoft.com/en-us/research/uploads/prod/2019/01/Guidelines-for-Human-AI-Interaction-camera-ready.pdf"],
  ["model-cards", "Model Cards for Model Reporting", "Margaret Mitchell 等", "2019", ["governance", "evaluation"], "用模型用途、性能切片、限制和伦理考虑建立对外沟通契约。", "https://arxiv.org/pdf/1810.03993"],
  ["datasheets", "Datasheets for Datasets", "Timnit Gebru 等", "2021", ["governance", "operations"], "用数据动机、组成、采集、处理、使用和维护问题治理数据生命周期。", "https://arxiv.org/pdf/1803.09010"],
  ["hidden-debt", "Hidden Technical Debt in Machine Learning Systems", "D. Sculley 等", "2015", ["operations", "capability-architecture"], "揭示数据依赖、反馈回路、纠缠和配置债务如何改变产品成本。", "https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf"],
  ["ml-test-score", "The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction", "Eric Breck 等", "2017", ["evaluation", "operations"], "用数据、模型、基础设施和监控测试评估生产准备度。", "https://storage.googleapis.com/gweb-research2023-media/pubtools/4156.pdf"],
  ["data-cascades", "Data Cascades in High-Stakes AI", "Nithya Sambasivan 等", "2021", ["problem-discovery", "operations", "governance"], "说明早期数据问题如何在组织和产品生命周期中累积为下游伤害。", "https://arxiv.org/pdf/2011.03395"],
];

function decodeXml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
}

function pick(block, tag) {
  return decodeXml((block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "").replace(/\s+/g, " ").trim());
}

async function fetchArxivMetadata(ids) {
  const result = {};
  for (let offset = 0; offset < ids.length; offset += 40) {
    const batch = ids.slice(offset, offset + 40);
    const url = `https://export.arxiv.org/api/query?id_list=${batch.join(",")}&max_results=${batch.length}`;
    const response = await fetch(url, { headers: { "user-agent": "learning007-ai-product-catalog/1.0" } });
    if (!response.ok) throw new Error(`arXiv API ${response.status}`);
    const xml = await response.text();
    for (const match of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      const block = match[1];
      const id = pick(block, "id").match(/\/abs\/(\d{4}\.\d{4,5})/)?.[1];
      const authors = [...block.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map((author) => decodeXml(author[1].trim()));
      result[id] = { title: pick(block, "title"), authors, creator: authors.join("、"), year: pick(block, "published").slice(0, 4) };
    }
  }
  return result;
}

const ids = [...new Set(Object.values(arxivGroups).flat())];
const metadata = await fetchArxivMetadata(ids);
const arxivPapers = Object.entries(arxivGroups).flatMap(([group, groupIds]) => groupIds.map((arxivId) => {
  const paper = metadata[arxivId];
  if (!paper?.title || !paper?.creator || !paper?.year) throw new Error(`Missing arXiv metadata for ${arxivId}`);
  return {
    id: `paper-arxiv-${arxivId.replace(".", "-")}`,
    type: "paper",
    title: paper.title,
    creator: `${paper.authors.slice(0, 8).join("、")}${paper.authors.length > 8 ? " 等" : ""}`,
    year: paper.year,
    modules: group === "economics" ? [group, "strategy-organization"] : [group],
    level: Number(paper.year) >= 2023 ? "advanced" : "core",
    role: groupRoles[group],
    content_url: `https://arxiv.org/pdf/${arxivId}`,
    access: "open",
    verification: { status: "fulltext-url-verified", method: "tavily-arxiv-search-and-arxiv-api", checked_at: checkedAt },
  };
}));

const paperResources = [
  ...manualPapers.map(([id, title, creator, year, resourceModules, role, contentUrl]) => ({
    id: `paper-${id}`,
    type: "paper",
    title,
    creator,
    year,
    modules: resourceModules,
    level: "core",
    role,
    content_url: contentUrl,
    access: "open",
    verification: { status: "fulltext-url-verified", method: "tavily-and-official-source", checked_at: checkedAt },
  })),
  ...arxivPapers,
];

const catalog = {
  schema_version: 2,
  field: "ai-product",
  title: "AI 产品经理",
  updated_at: checkedAt,
  storage_policy: "只保存无需购买、无需登录即可连续阅读的系统教材、完整实践手册和论文全文 URL；不下载、不镜像原文。",
  selection_policy: [
    "先按 AI 产品经理的实际决策链建立十个模块，再确定每个模块需要什么证据，而不是按热度堆链接。",
    "教材必须承担连续教学任务，并覆盖课程主线中的一组相邻决策；标准、法规、检查表、单篇文章和孤立工具不得作为教材凑数。",
    "开放教材优先采用作者、出版机构、大学、OER 仓储和明确开放许可的完整书稿；商业购买页、登录页和来源不明的镜像不收录。",
    "论文候选由 Tavily 在官方全文域检索，随后按题名相关性、方法价值、代表性和模块覆盖人工筛选。",
    "收录只说明全文入口和主题归属已经核验；课程写作仍须阅读原稿，并记录实际采用的观点与边界。",
  ],
  modules,
  resources: [...books, ...paperResources],
};

const sourceBooks = {
  field: "ai-product",
  title: "AI 产品经理",
  curated_count: books.length,
  methodology: "按 AI 产品经理课程决策链反推教材角色；使用 Tavily 扩展检索并逐本核验完整目录、全文入口、来源授权与课程覆盖。",
  records: books.map((book) => ({
    id: `book:ai-product:${book.id.slice(5)}`,
    field: "ai-product",
    kind: "book",
    resource_class: book.resource_class,
    title: book.title,
    authors: book.creator.split(" / "),
    year: Number(book.year) || book.year,
    publisher: book.creator,
    topics: book.modules,
    official_url: book.content_url,
    authority_reason: book.role,
    access_proof: book.access_proof,
    review_status: book.review_url ? "published" : "pending-full-review",
    access: { status: "open_fulltext", download_url: book.content_url, license: null, local_path: null, sha256: null, bytes: null, checked_at: checkedAt },
    updated_at: checkedAt,
  })),
};

const sourcePapers = {
  field: "ai-product",
  title: "AI 产品经理",
  snapshot_date: checkedAt,
  provider: "Tavily + arXiv API + official publishers",
  selection_method: "十个子模块分别通过 Tavily 检索开放全文候选；人工排除仅因高引命中的无关论文，再用 arXiv API 补齐作者、题名和年份。",
  caveat: "这是可维护的核心参考层，不以引用量代替相关性；写作前仍须阅读原文并核验具体结论。",
  records: paperResources.map((paper) => ({
    id: `paper:ai-product:${paper.id.slice(6)}`,
    field: "ai-product",
    kind: "paper",
    title: paper.title,
    authors: paper.creator.split("、"),
    year: Number(paper.year),
    publication_date: `${paper.year}-01-01`,
    type: "article",
    venue: paper.content_url.includes("arxiv.org") ? "arXiv" : "Official full-text repository",
    doi: null,
    openalex_id: null,
    official_url: paper.content_url,
    cited_by_count_snapshot: null,
    relevance_score_snapshot: null,
    search_rank_snapshot: null,
    referenced_works_count: null,
    language: "en",
    topics: paper.modules,
    source_query: `AI product management ${paper.modules.join(" ")}`,
    authority_tier: "core-or-recent-frontier",
    selection_reason: paper.role,
    open_access: { is_oa: true, status: "open", landing_page_url: paper.content_url, pdf_url: paper.content_url, license: null },
    retrieved_at: checkedAt,
  })),
};

const searchAudit = {
  field: "ai-product",
  searched_at: checkedAt,
  provider: "Tavily CLI",
  policy: "检索只生成候选；最终收录必须经过主题相关性、开放全文与权威来源三项人工复核。",
  book_queries: [
    "AI product management book full text PDF author official university repository open access",
    "product management product discovery open book full text author PDF handbook",
    "machine learning product strategy book full text PDF AI product manager",
    "human centered AI design open book guidebook full text PDF product teams",
    "open online book product experimentation A/B testing metrics full text author",
    "open access book digital product management product analytics full text PDF official",
    "Shape Up full book Basecamp Field Guide to Human-Centered Design PDF IDEO",
    "Lean Service Creation Handbook PDF official product discovery handbook full text",
    "AI product full book GitHub product manager guidebook PDF evals UX",
  ],
  rejected_book_candidates: [
    { title: "AI Meets Strategy", reason: "Springer 页面实测为订阅预览，不是开放全文。" },
    { title: "Machine Learning Yearning", reason: "官方入口要求填写个人信息，未通过直接全文门槛。" },
    { title: "The Lean Product Playbook 非官方 PDF", reason: "第三方来源无法证明分发授权。" },
    { title: "Human-Centered AI 非官方 PDF", reason: "第三方下载站来源不明，未收录。" },
    { title: "HAX / NIST / OECD / UNESCO / WHO / ALTAI", reason: "分别属于准则、工具、标准或治理文件，不承担系统教材角色。" },
  ],
  paper_modules: {
    ...Object.fromEntries(Object.entries(arxivGroups).map(([moduleId, groupIds]) => [moduleId, { selected_arxiv_ids: groupIds, selected_count: groupIds.length }])),
    "strategy-organization": { cross_tagged_from: "economics", selected_count: arxivGroups.economics.length },
  },
};

await mkdir(path.dirname(publicOutput), { recursive: true });
await mkdir(sourceDir, { recursive: true });
await Promise.all([
  writeFile(publicOutput, `${JSON.stringify(catalog, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "books.json"), `${JSON.stringify(sourceBooks, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "papers.json"), `${JSON.stringify(sourcePapers, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "search-audit.json"), `${JSON.stringify(searchAudit, null, 2)}\n`, "utf8"),
]);

console.log(`ai-product catalog: ${books.length} books/handbooks, ${paperResources.length} papers, ${catalog.resources.length} resources`);
