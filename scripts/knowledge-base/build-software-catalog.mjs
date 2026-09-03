import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const checkedAt = "2026-09-03";
const publicOutput = path.resolve("docs/public/data/knowledge-base/software.json");
const sourceDir = path.resolve("knowledge-base/fields/software");
const repoRaw = "https://raw.githubusercontent.com/papers-we-love/papers-we-love/main";
const offlineMetadata = process.argv.includes("--offline-metadata");
let existingPaperByUrl = new Map();
try {
  const existing = JSON.parse(await readFile(publicOutput, "utf8"));
  existingPaperByUrl = new Map((existing.resources ?? []).filter((resource) => resource.type === "paper").map((paper) => [paper.content_url, paper]));
} catch {}

const modules = [
  { id: "programming-foundations", name: "程序设计与计算基础", track: "formal", goal: "理解抽象、类型、递归、数据结构、算法与版本控制怎样约束程序。" },
  { id: "language-runtime", name: "语言、编译与运行时", track: "formal+advanced", goal: "从语言语义走到解释器、编译器、内存管理、垃圾回收与 JIT。" },
  { id: "os-concurrency", name: "操作系统与并发", track: "formal+advanced", goal: "理解进程、线程、虚拟内存、文件系统、同步、调度和内核边界。" },
  { id: "network-api", name: "网络、Web 与 API", track: "formal", goal: "从分层协议、拥塞控制和浏览器过程理解 API 契约与网络故障。" },
  { id: "database-transaction", name: "数据库、事务与索引", track: "formal", goal: "理解数据模型、查询、索引、并发控制、恢复与模式演进。" },
  { id: "design-architecture", name: "软件设计与架构", track: "formal", goal: "用模块、状态、依赖、质量属性和架构决策组织可演进的软件。" },
  { id: "testing-verification", name: "测试、验证与正确性", track: "formal+advanced", goal: "把测试策略、形式化验证、故障注入和可复现实验连接起来。" },
  { id: "performance-observability", name: "性能、基准与可观测性", track: "advanced", goal: "用工作负载、性能模型、profiling、追踪和实验定位真实瓶颈。" },
  { id: "distributed-consensus", name: "分布式系统与共识", track: "advanced", goal: "在网络分区、复制、选主与失败模型下判断一致性和可用性。" },
  { id: "storage-streaming", name: "分布式存储与流处理", track: "advanced", goal: "理解分区、复制、日志、背压、重放与跨系统数据正确性。" },
  { id: "reliability-security", name: "可靠性与安全工程", track: "advanced", goal: "把 SLO、容量、事故响应、威胁模型和纵深防御放进生命周期。" },
  { id: "evolution-organization", name: "架构演进与工程组织", track: "advanced", goal: "理解团队边界、技术债、服务拆分、接口演化和社会技术反馈。" },
];

const books = [
  ["software-foundations", "Software Foundations, Logical Foundations", "Benjamin C. Pierce 等 / University of Pennsylvania", "持续更新", ["programming-foundations", "testing-verification"], "starter", "用 Coq 把函数式程序、归纳定义、证明与程序正确性连成一条可执行路线。", "https://softwarefoundations.cis.upenn.edu/lf-current/index.html"],
  ["crafting-interpreters", "Crafting Interpreters", "Robert Nystrom", "2021", ["language-runtime", "design-architecture"], "core", "亲手实现树遍历解释器和字节码虚拟机，理解语言实现中的扫描、解析、作用域、对象与 GC。", "https://craftinginterpreters.com/contents.html"],
  ["rust-book", "The Rust Programming Language", "Steve Klabnik、Carol Nichols / Rust Project", "持续更新", ["programming-foundations", "language-runtime", "os-concurrency"], "starter", "通过所有权、借用、类型与并发建立内存安全和接口设计的工程直觉。", "https://doc.rust-lang.org/book/"],
  ["ostep", "Operating Systems: Three Easy Pieces", "Remzi H. Arpaci-Dusseau、Andrea C. Arpaci-Dusseau", "持续更新", ["os-concurrency", "performance-observability"], "core", "沿虚拟化、并发与持久化三条主线理解操作系统机制、策略和测量方法。", "https://pages.cs.wisc.edu/~remzi/OSTEP/"],
  ["dive-into-systems", "Dive into Systems", "Suzanne J. Matthews、Tia Newhall、Kevin C. Webb", "2022", ["programming-foundations", "language-runtime", "os-concurrency"], "core", "从 C、汇编、内存和体系结构进入操作系统、并行计算与网络。", "https://diveintosystems.org/"],
  ["open-data-structures", "Open Data Structures", "Pat Morin", "持续更新", ["programming-foundations", "performance-observability"], "core", "用实现、证明和复杂度分析连接数组、链表、树、哈希、图与外存结构。", "https://opendatastructures.org/ods-java/"],
  ["algorithms-erickson", "Algorithms", "Jeff Erickson / University of Illinois Urbana-Champaign", "2019", ["programming-foundations", "performance-observability"], "core", "以递归、回溯、动态规划、图算法和复杂性训练算法建模与证明。", "https://jeffe.cs.illinois.edu/teaching/algorithms/"],
  ["computer-networking", "Computer Networking: Principles, Protocols and Practice", "Olivier Bonaventure", "持续更新", ["network-api", "distributed-consensus"], "core", "从应用层、传输层和网络层理解协议状态、可靠传输、路由与拥塞控制。", "https://www.computer-networking.info/"],
  ["database-design", "Database Design, 2nd Edition", "Adrienne Watt / BCcampus", "2014", ["database-transaction", "design-architecture"], "starter", "从关系模型、规范化、SQL、事务和数据库生命周期建立数据设计基础。", "https://opentextbc.ca/dbdesign01/"],
  ["distributed-systems", "Distributed Systems, 4th Edition", "Maarten van Steen、Andrew S. Tanenbaum", "2023", ["distributed-consensus", "storage-streaming", "reliability-security"], "advanced", "系统讲解通信、协调、复制、容错、安全和分布式系统设计。", "https://www.distributed-systems.net/index.php/books/ds4/"],
  ["distributed-algorithms", "Distributed Algorithms 2020", "Jukka Suomela / Aalto University", "2020", ["distributed-consensus", "testing-verification"], "advanced", "从局部算法、图问题和同步模型进入分布式计算的可解性与复杂度。", "https://jukkasuomela.fi/da2020/"],
  ["aosa", "The Architecture of Open Source Applications", "Amy Brown、Greg Wilson 编", "2011", ["design-architecture", "evolution-organization"], "core", "通过真实开源系统解释架构决定怎样受到历史、约束、团队和演进影响。", "https://aosabook.org/en/"],
  ["aosa-500-lines", "500 Lines or Less", "Amy Brown、Michael DiBernardo 编", "2016", ["design-architecture", "language-runtime"], "core", "用小型完整系统展示数据库、Web、虚拟机、图形和分布式工具的核心结构。", "https://aosabook.org/en/500L/"],
  ["google-sre", "Site Reliability Engineering", "Betsy Beyer 等 / Google", "2016", ["reliability-security", "performance-observability", "evolution-organization"], "advanced", "用 SLO、错误预算、容量、自动化和事故响应解释大规模服务怎样保持可靠。", "https://sre.google/sre-book/table-of-contents/"],
  ["sre-workbook", "The Site Reliability Workbook", "Betsy Beyer 等 / Google", "2018", ["reliability-security", "performance-observability"], "advanced", "把 SRE 原则变成可执行的 SLO、监控、告警、应急与组织实践。", "https://sre.google/workbook/table-of-contents/"],
  ["secure-reliable-systems", "Building Secure and Reliable Systems", "Heather Adkins 等 / Google", "2020", ["reliability-security", "design-architecture", "evolution-organization"], "advanced", "把安全与可靠性共同放进设计、实现、部署、响应和恢复过程。", "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html"],
  ["pro-git", "Pro Git, 2nd Edition", "Scott Chacon、Ben Straub", "持续更新", ["programming-foundations", "evolution-organization"], "starter", "从对象模型、分支、协作流程和服务端机制理解 Git，不把版本控制缩成命令表。", "https://git-scm.com/book/en/v2"],
  ["swebok-v4", "Guide to the Software Engineering Body of Knowledge, Version 4.0", "IEEE Computer Society", "2024", ["design-architecture", "testing-verification", "evolution-organization"], "core", "用知识领域地图连接需求、设计、构造、测试、运维、过程、质量和工程管理。", "https://www.computer.org/education/bodies-of-knowledge/software-engineering"],
].map(([id, title, creator, year, resourceModules, level, role, contentUrl]) => ({
  id: `book-${id}`, type: "book", title, creator, year, modules: resourceModules, level, role,
  content_url: contentUrl, review_url: `/knowledge-base/reviews/software/${id}`, access: "open",
  verification: { status: "fulltext-url-verified", method: "tavily-extract-and-official-source", checked_at: checkedAt },
}));

const paperSources = {
  "programming-foundations": ["data_structures/README.md", "comp_sci_fundamentals_and_history/README.md", "logic_and_programming/README.md"],
  "language-runtime": ["languages-theory/README.md", "garbage_collection/README.md", "virtual_machines/README.md", "languages-paradigms/functional_programming/README.md"],
  "os-concurrency": ["operating_systems/README.md", "concurrency/README.md", "non_blocking_algorithms/README.md", "memory_management/README.md", "processes/README.md"],
  "network-api": ["networks/README.md", "api_design/README.md", "distributed_systems/README.md", "computer_architecture/README.md"],
  "database-transaction": ["datastores/README.md", "caching/README.md", "data_replication/README.md"],
  "design-architecture": ["design/README.md", "systems_modeling/README.md", "software_engineering_orgs/README.md", "operating_systems/README.md", "distributed_systems/README.md"],
  "testing-verification": ["testing/README.md", "testing/tdd/README.md", "faults_and_verification/README.md", "concurrency/README.md", "distributed_systems/README.md"],
  "performance-observability": ["experimental_algorithmics/README.md", "computer_architecture/README.md", "memory_management/README.md", "crash_only/README.md", "operating_systems/README.md", "concurrency/README.md"],
  "distributed-consensus": ["distributed_systems/README.md", "gossip/README.md", "data_replication/README.md"],
  "storage-streaming": ["distributed-file-systems/README.md", "streaming_algorithms/README.md", "datastores/README.md"],
  "reliability-security": ["security/README.md", "privacy/README.md", "faults_and_verification/README.md", "unikernels/README.md"],
  "evolution-organization": ["software_engineering_orgs/README.md", "design/README.md", "crash_only/README.md", "systems_modeling/README.md", "operating_systems/README.md", "distributed_systems/README.md"],
};

const moduleRole = Object.fromEntries(modules.map((module) => [module.id, `支撑“${module.name}”中的机制理解、方案比较与失败边界判断。`]));

function cleanTitle(value) {
  return value.replace(/<[^>]+>/g, "").replace(/[*_`￼]/g, "").replace(/\s+/g, " ").trim();
}

function directPdfUrl(rawUrl, readme) {
  const url = rawUrl.replace(/\\([()])/g, "$1").split("#")[0];
  if (/^https?:\/\//i.test(url)) {
    if (!/\.pdf(?:$|\?)/i.test(url) && !/arxiv\.org\/(?:abs|pdf)\//i.test(url)) return null;
    return url.replace(/^http:/, "https:").replace("https://arxiv.org/abs/", "https://arxiv.org/pdf/").replace(/(?<!\.pdf)$/, (tail) => tail);
  }
  if (!/\.pdf$/i.test(url)) return null;
  const base = new URL(readme, `${repoRaw}/`);
  return new URL(url, base).href;
}

function parsePapers(markdown, readme, moduleId) {
  const records = [];
  const pattern = /\[([^\]]+)\]\(([^\s)]+(?:\([^)]*\)[^\s)]*)?)\)/g;
  for (const match of markdown.matchAll(pattern)) {
    const title = cleanTitle(match[1]);
    if (title.length < 12 || title === ":scroll:" || title.startsWith("http")) continue;
    const contentUrl = directPdfUrl(match[2], readme);
    if (!contentUrl) continue;
    records.push({ title, contentUrl, modules: [moduleId] });
  }
  return records;
}

async function fetchWithRetry(url, options = {}, attempts = 4) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(10000) });
      if (response.ok) return response;
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }
  throw lastError;
}

async function fetchReadme(readme) {
  const response = await fetchWithRetry(`${repoRaw}/${readme}`);
  return response.text();
}

function similarity(left, right) {
  const tokens = (value) => new Set(value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter((word) => word.length > 2));
  const a = tokens(left); const b = tokens(right);
  const overlap = [...a].filter((token) => b.has(token)).length;
  return overlap / Math.max(1, new Set([...a, ...b]).size);
}

async function enrichPaper(paper) {
  const cached = existingPaperByUrl.get(paper.contentUrl);
  if (cached && cached.creator !== "原论文作者，详见原稿") {
    return { ...paper, creator: cached.creator, year: cached.year, citedBy: cached.cited_by_count_snapshot ?? null };
  }
  if (offlineMetadata) return { ...paper, creator: cached?.creator ?? "原论文作者，详见原稿", year: cached?.year ?? "原稿年份", citedBy: cached?.cited_by_count_snapshot ?? null };
  try {
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(paper.title)}&per-page=5&select=display_name,publication_year,authorships,cited_by_count`;
    const response = await fetchWithRetry(url, { headers: { "user-agent": "Learning007/1.0 (software knowledge base)" } }, 4);
    const payload = await response.json();
    const match = (payload.results ?? []).map((work) => ({ work, score: similarity(paper.title, work.display_name ?? "") })).sort((a, b) => b.score - a.score)[0];
    if (!match || match.score < 0.42) throw new Error("no confident match");
    const authors = (match.work.authorships ?? []).slice(0, 8).map((entry) => entry.author?.display_name).filter(Boolean);
    return { ...paper, creator: `${authors.join("、")}${(match.work.authorships?.length ?? 0) > 8 ? " 等" : ""}` || "原论文作者", year: String(match.work.publication_year ?? "原稿年份"), citedBy: match.work.cited_by_count ?? null };
  } catch {
    return { ...paper, creator: "原论文作者，详见原稿", year: "原稿年份", citedBy: null };
  }
}

function addRelatedModules(paper) {
  const title = paper.title.toLowerCase();
  const rules = [
    ["network-api", /network|routing|traffic|congestion|\btcp\b|\bip\b|protocol|datacenter/],
    ["design-architecture", /architect|design|modular|component|interface|system structure/],
    ["testing-verification", /test|verif|correct|proof|failure|fault|debug|model check/],
    ["performance-observability", /performance|latency|throughput|scalab|profil|benchmark|memory|cache|tracing/],
    ["evolution-organization", /software|organization|evolution|history|technical debt|programmer|development/],
  ];
  for (const [moduleId, pattern] of rules) if (pattern.test(title) && !paper.modules.includes(moduleId)) paper.modules.push(moduleId);
  return paper;
}

const readmes = [...new Set(Object.values(paperSources).flat())];
const readmeTexts = Object.fromEntries(await Promise.all(readmes.map(async (readme) => [readme, await fetchReadme(readme)])));
const selected = new Map();
for (const [moduleId, sources] of Object.entries(paperSources)) {
  const candidates = sources.flatMap((readme) => parsePapers(readmeTexts[readme], readme, moduleId));
  let accepted = 0;
  for (const candidate of candidates) {
    const key = candidate.contentUrl.toLowerCase();
    const existing = selected.get(key);
    if (existing) {
      if (!existing.modules.includes(moduleId)) existing.modules.push(moduleId);
      continue;
    }
    selected.set(key, candidate);
    accepted += 1;
    if (accepted >= 20) break;
  }
}

if (selected.size < 150) throw new Error(`Only ${selected.size} unique papers were selected; expected at least 150`);
const candidates = [...selected.values()];
const enriched = [];
await mkdir(sourceDir, { recursive: true });
for (let index = 0; index < candidates.length; index += 6) {
  const batch = await Promise.all(candidates.slice(index, index + 6).map(enrichPaper));
  enriched.push(...batch);
  for (const paper of batch) {
    if (paper.creator !== "原论文作者，详见原稿") {
      existingPaperByUrl.set(paper.contentUrl, { content_url: paper.contentUrl, creator: paper.creator, year: paper.year, cited_by_count_snapshot: paper.citedBy });
    }
  }
  await writeFile(path.join(sourceDir, "paper-metadata-cache.json"), `${JSON.stringify([...existingPaperByUrl.values()], null, 2)}\n`, "utf8");
}

const papers = enriched.map(addRelatedModules).map((paper) => ({
  id: `paper-${createHash("sha1").update(paper.contentUrl).digest("hex").slice(0, 12)}`,
  type: "paper", title: paper.title, creator: paper.creator, year: paper.year,
  modules: paper.modules, level: paper.modules.some((id) => modules.find((module) => module.id === id)?.track === "formal") ? "core" : "advanced",
  role: paper.modules.map((id) => moduleRole[id]).join(" "), content_url: paper.contentUrl, access: "open",
  verification: { status: "fulltext-url-verified", method: "tavily-discovery-papers-we-love-curation", checked_at: checkedAt },
  cited_by_count_snapshot: paper.citedBy,
}));

const catalog = {
  schema_version: 2, field: "software", title: "软件与系统工程", updated_at: checkedAt,
  storage_policy: "只保存无需购买、无需登录即可阅读的教材、权威手册和论文全文 URL；原文不在本站镜像；18 部教材均配有独立中文阅读综述。",
  selection_policy: [
    "知识模块同时覆盖正式学习与软件进阶，资源按能力依赖归类，不按技术热度堆放。",
    "教材候选经 Tavily 检索与正文抽取核验，只保留作者、大学、标准组织或官方项目维护的开放正文。",
    "论文以 Tavily 发现的权威课程与 Papers We Love 主题清单为候选池，保留可直接阅读的 PDF，并通过 OpenAlex 补齐作者和年份。",
    "目录收录只证明来源身份和全文入口可用；课程引用仍需记录实际阅读范围、采用观点和外推边界。",
  ],
  modules, resources: [...books, ...papers],
};

const sourceBooks = { field: "software", title: "软件与系统工程", curated_count: books.length, methodology: "Tavily 检索、正文抽取、官方来源复核与逐书中文综述", records: books.map((book) => ({ id: `book:software:${book.id.slice(5)}`, field: "software", kind: "book", title: book.title, authors: book.creator.split("、"), year: book.year, publisher: book.creator, topics: book.modules, official_url: book.content_url, review_url: book.review_url, review_status: "complete-awaiting-user-review", authority_reason: book.role, access: { status: "open_fulltext", download_url: book.content_url, local_path: null, checked_at: checkedAt }, updated_at: checkedAt })) };
const sourcePapers = { field: "software", title: "软件与系统工程", snapshot_date: checkedAt, provider: "Tavily + Papers We Love + OpenAlex", selection_method: "先按正式与进阶课程模块建立来源地图，再从主题化论文清单选取直接全文并补齐元数据。", records: papers.map((paper) => ({ id: `paper:software:${paper.id.slice(6)}`, field: "software", kind: "paper", title: paper.title, authors: paper.creator.split("、"), year: paper.year, topics: paper.modules, official_url: paper.content_url, cited_by_count_snapshot: paper.cited_by_count_snapshot, access: { status: "open_fulltext", download_url: paper.content_url, local_path: null, checked_at: checkedAt }, updated_at: checkedAt })) };
const audit = { field: "software", checked_at: checkedAt, tavily_queries: ["open access computer science software systems engineering textbooks official free online SICP OSTEP distributed systems", "author official free online software architecture site reliability engineering database systems networking textbooks", "authoritative university systems research reading list operating systems distributed systems databases networking software engineering papers"], textbook_extracts: { requested: 19, succeeded: 18 }, paper_candidate_source: "papers-we-love/papers-we-love", openalex_enriched: papers.filter((paper) => paper.creator !== "原论文作者，详见原稿").length, paper_count: papers.length };

await mkdir(path.dirname(publicOutput), { recursive: true });
await mkdir(sourceDir, { recursive: true });
await Promise.all([
  writeFile(publicOutput, `${JSON.stringify(catalog, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "books.json"), `${JSON.stringify(sourceBooks, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "papers.json"), `${JSON.stringify(sourcePapers, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "search-audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8"),
]);

console.log(`software catalog: ${books.length} books, ${papers.length} papers, ${modules.length} modules`);
