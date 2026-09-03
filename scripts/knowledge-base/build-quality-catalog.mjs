import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const checkedAt = "2026-09-03";
const field = "quality";
const publicOutput = path.resolve("docs/public/data/knowledge-base/quality.json");
const sourceDir = path.resolve("knowledge-base/fields/quality");
const papersPerModule = 22;

const modules = [
  { id: "quality-risk", name: "正式 · 需求、风险与质量策略", track: "formal", node_ids: ["Q01", "Q02"], goal: "把需求变成可验收行为，并按损失、概率和证据成本设计质量策略。" },
  { id: "testing-evidence", name: "正式 · 测试设计与证据分层", track: "formal", node_ids: ["Q03", "Q04", "Q05", "Q06"], goal: "组合单元、性质、集成、契约和端到端测试，处理测试预言、变异与不稳定测试。" },
  { id: "build-artifacts", name: "正式 · 静态分析、构建与制品", track: "formal", node_ids: ["Q07", "Q08", "Q09"], goal: "让检查、依赖、构建环境、镜像和制品身份可复现、可追踪。" },
  { id: "delivery-release", name: "正式 · CI/CD、迁移与回滚", track: "formal", node_ids: ["Q10", "Q11"], goal: "设计有门禁、渐进发布、数据库兼容和回退路径的交付流水线。" },
  { id: "observability-recovery", name: "正式 · 可观测性、SLO 与恢复", track: "formal", node_ids: ["Q12", "Q13", "Q14"], goal: "用日志、指标、追踪、服务目标、告警和复盘缩短发现与恢复时间。" },
  { id: "secure-supply-chain", name: "正式 · 安全供应链与生产验收", track: "formal", node_ids: ["Q15", "Q16"], goal: "把威胁模型、依赖、SBOM、来源证明、漏洞处置和上线检查连成证据链。" },
  { id: "kubernetes-foundations", name: "进阶 · Kubernetes 工作负载、网络与存储", track: "advanced", node_ids: ["AQ01", "AQ02", "AQ03"], goal: "理解调和循环、工作负载、服务发现、探针、配置和有状态存储的失效边界。" },
  { id: "kubernetes-operations", name: "进阶 · 调度、扩缩、权限与集群安全", track: "advanced", node_ids: ["AQ04", "AQ05", "AQ06"], goal: "用资源请求、调度、自动扩缩、RBAC、网络策略和运行时控制管理共享集群。" },
  { id: "iac-gitops", name: "进阶 · IaC、GitOps、策略与漂移", track: "advanced", node_ids: ["AQ07", "AQ08", "AQ09"], goal: "让基础设施声明、计划、调和、策略、例外和漂移检测进入同一变更闭环。" },
  { id: "performance-capacity", name: "进阶 · 性能、容量与排队", track: "advanced", node_ids: ["AQ10", "AQ11", "AQ12"], goal: "从工作负载、瓶颈、尾延迟、饱和点和排队关系建立容量预算。" },
  { id: "chaos-sre", name: "进阶 · Chaos、Game Day 与错误预算", track: "advanced", node_ids: ["AQ13", "AQ14", "AQ15"], goal: "在有稳态假设、停止条件和爆炸半径控制的实验中验证恢复能力。" },
  { id: "platform-resilience", name: "进阶 · 容灾、平台工程与韧性治理", track: "advanced", node_ids: ["AQ16", "AQ17", "AQ18"], goal: "连接多区域恢复、平台产品、开发者体验、策略门禁和组织级韧性。" },
];

const bookRows = [
  ["swebok-v4", "Guide to the Software Engineering Body of Knowledge, Version 4.0", "IEEE Computer Society", "2024", ["quality-risk", "testing-evidence", "build-artifacts"], "core", "以软件工程知识体系校准质量、测试、配置、运维和工程过程之间的边界。", "https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf"],
  ["istqb-ctfl", "Certified Tester Foundation Level Syllabus v4.0.1", "ISTQB", "2024", ["quality-risk", "testing-evidence"], "starter", "系统组织测试原则、生命周期、静态测试、测试设计、管理和工具，是测试语言与基础判断的共同底座。", "https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0"],
  ["istqb-test-analyst", "Certified Tester Advanced Level Test Analyst Syllabus", "ISTQB", "持续更新", ["quality-risk", "testing-evidence"], "advanced", "围绕风险分析、黑盒设计、缺陷分析和测试过程深化业务侧测试判断。", "https://istqb.org/certifications/certified-tester-advanced-level-test-analyst"],
  ["istqb-test-automation", "Certified Tester Test Automation Engineering Syllabus", "ISTQB", "持续更新", ["testing-evidence", "delivery-release"], "advanced", "把自动化架构、部署、维护、度量和持续改进放进完整测试系统。", "https://istqb.org/certifications/certified-tester-advanced-level-test-automation-engineering-ctal-tae-v2-0"],
  ["istqb-test-management", "Certified Tester Advanced Level Test Management Syllabus", "ISTQB", "持续更新", ["quality-risk", "testing-evidence", "delivery-release"], "advanced", "连接组织风险、测试策略、监控、估算和团队协作，避免只按测试用例数量管理质量。", "https://istqb.org/certifications/certified-tester-advanced-level-test-management"],
  ["nasa-software", "NASA Software Engineering Handbook", "NASA", "持续更新", ["quality-risk", "testing-evidence", "delivery-release"], "core", "用高可信系统的生命周期要求解释验证、确认、配置、审查和软件保证。", "https://swehb.nasa.gov/"],
  ["nasa-systems", "NASA Systems Engineering Handbook", "NASA", "2016", ["quality-risk", "observability-recovery", "platform-resilience"], "core", "从需求、技术评审、验证确认、风险和运行过渡建立系统级质量视角。", "https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf"],
  ["pytest", "pytest Documentation", "pytest Project", "持续更新", ["testing-evidence"], "starter", "通过 fixture、参数化、标记、插件和失败诊断建立可维护的自动化测试实践。", "https://docs.pytest.org/en/stable/contents.html"],
  ["playwright", "Playwright Documentation", "Microsoft", "持续更新", ["testing-evidence", "delivery-release"], "starter", "围绕定位器、自动等待、隔离、追踪和并行执行构造低脆弱性的关键旅程测试。", "https://playwright.dev/docs/intro"],
  ["hypothesis", "Hypothesis Documentation", "Hypothesis Project", "持续更新", ["testing-evidence"], "core", "用性质、生成器、缩减和状态机测试补足人工示例无法覆盖的输入空间。", "https://hypothesis.readthedocs.io/en/latest/"],
  ["pact", "Pact Documentation", "Pact Foundation", "持续更新", ["testing-evidence", "delivery-release"], "core", "用消费者驱动契约、验证代理和版本矩阵约束独立服务演进。", "https://docs.pact.io/"],
  ["openapi", "OpenAPI Specification", "OpenAPI Initiative", "持续更新", ["testing-evidence", "delivery-release"], "core", "以机器可读接口契约支撑验证、兼容分析、Mock 和跨团队交付。", "https://spec.openapis.org/oas/latest.html"],
  ["semver", "Semantic Versioning 2.0.0", "Tom Preston-Werner / semver.org", "2.0.0", ["build-artifacts", "delivery-release"], "starter", "把公开 API 的兼容承诺编码进版本号，同时提醒版本号不能替代真正的兼容测试。", "https://semver.org/"],
  ["reproducible-builds", "Reproducible Builds Documentation", "Reproducible Builds Project", "持续更新", ["build-artifacts", "secure-supply-chain"], "core", "系统解释确定性构建、环境差异、归档元数据和独立重建怎样证明制品一致。", "https://reproducible-builds.org/docs/"],
  ["docker-build", "Docker Build Documentation", "Docker", "持续更新", ["build-artifacts"], "starter", "覆盖构建上下文、层、缓存、多阶段构建、构建器和镜像最佳实践。", "https://docs.docker.com/build/"],
  ["github-actions", "GitHub Actions Documentation", "GitHub", "持续更新", ["delivery-release", "secure-supply-chain"], "starter", "说明工作流、事件、Runner、制品、环境审批和 OpenID Connect 等交付构件。", "https://docs.github.com/en/actions"],
  ["google-sre", "Site Reliability Engineering", "Betsy Beyer 等 / Google", "2016", ["observability-recovery", "performance-capacity", "chaos-sre"], "core", "用 SLI/SLO、错误预算、监控、容量、自动化和事故响应建立生产可靠性的稳定框架。", "https://sre.google/sre-book/table-of-contents/"],
  ["sre-workbook", "The Site Reliability Workbook", "Betsy Beyer 等 / Google", "2018", ["delivery-release", "observability-recovery", "chaos-sre"], "advanced", "把 SRE 原则转化为 SLO、告警、金丝雀、过载、值班和应急演练。", "https://sre.google/workbook/table-of-contents/"],
  ["secure-reliable", "Building Secure and Reliable Systems", "Heather Adkins 等 / Google", "2020", ["secure-supply-chain", "observability-recovery", "platform-resilience"], "core", "把安全和可靠性共同前置到设计、实现、部署、响应和恢复。", "https://google.github.io/building-secure-and-reliable-systems/raw/toc.html"],
  ["opentelemetry", "OpenTelemetry Documentation and Specification", "Cloud Native Computing Foundation", "持续更新", ["observability-recovery", "performance-capacity"], "core", "以统一语义和上下文传播连接 traces、metrics、logs、采样与 Collector。", "https://opentelemetry.io/docs/"],
  ["prometheus", "Prometheus Documentation", "Cloud Native Computing Foundation", "持续更新", ["observability-recovery", "performance-capacity"], "core", "从时间序列、抓取、查询、规则到告警解释指标系统的工作方式与限制。", "https://prometheus.io/docs/introduction/overview/"],
  ["nist-risk", "NIST SP 800-30 Rev. 1: Guide for Conducting Risk Assessments", "NIST", "2012", ["quality-risk"], "core", "用威胁、脆弱性、影响、可能性和不确定性组织风险评估，不把风险分数冒充精确概率。", "https://csrc.nist.gov/pubs/sp/800/30/r1/final"],
  ["nist-ssdf", "NIST SP 800-218: Secure Software Development Framework", "NIST", "2022", ["secure-supply-chain", "delivery-release"], "core", "以组织准备、软件保护、生产安全软件和漏洞响应四组实践约束开发生命周期。", "https://csrc.nist.gov/pubs/sp/800/218/final"],
  ["nist-incident", "NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations", "NIST", "2025", ["observability-recovery", "platform-resilience"], "core", "把事故响应纳入风险管理、准备、检测、处置、恢复与持续改进。", "https://csrc.nist.gov/pubs/sp/800/61/r3/final"],
  ["nist-contingency", "NIST SP 800-34 Rev. 1: Contingency Planning Guide", "NIST", "2010", ["observability-recovery", "platform-resilience"], "advanced", "系统说明业务影响分析、恢复策略、计划编制、测试演练和维护。", "https://csrc.nist.gov/pubs/sp/800/34/r1/final"],
  ["nist-container", "NIST SP 800-190: Application Container Security Guide", "NIST", "2017", ["build-artifacts", "kubernetes-operations", "secure-supply-chain"], "advanced", "按镜像、注册表、编排器、容器和宿主机拆解容器风险与控制。", "https://csrc.nist.gov/pubs/sp/800/190/final"],
  ["owasp-wstg", "OWASP Web Security Testing Guide", "OWASP Foundation", "持续更新", ["testing-evidence", "secure-supply-chain"], "core", "以系统化测试场景覆盖身份、会话、输入、业务逻辑、客户端和 API 安全。", "https://owasp.org/www-project-web-security-testing-guide/stable/"],
  ["owasp-asvs", "OWASP Application Security Verification Standard", "OWASP Foundation", "5.0", ["quality-risk", "secure-supply-chain"], "core", "把应用安全需求组织为可分级、可验证的控制集合，用于确定测试深度。", "https://owasp.org/www-project-application-security-verification-standard/"],
  ["slsa", "SLSA Specification", "OpenSSF / SLSA Steering Committee", "1.2", ["build-artifacts", "secure-supply-chain"], "advanced", "用来源、构建平台和 provenance 的保证等级讨论软件供应链完整性。", "https://slsa.dev/spec/v1.2/"],
  ["in-toto", "in-toto Specification", "in-toto Project / CNCF", "持续更新", ["build-artifacts", "secure-supply-chain"], "advanced", "用布局、步骤、签名和证明记录供应链中由谁执行了什么。", "https://in-toto.io/"],
  ["tuf", "The Update Framework Specification", "TUF Project / CNCF", "持续更新", ["delivery-release", "secure-supply-chain"], "advanced", "通过角色分离、阈值签名、版本和过期机制抵御软件更新系统中的密钥与仓库攻击。", "https://theupdateframework.github.io/specification/latest/"],
  ["spdx", "SPDX Specification", "Linux Foundation", "3.0", ["secure-supply-chain"], "advanced", "定义软件、包、文件、依赖和许可证的可交换 SBOM 数据模型。", "https://spdx.github.io/spdx-spec/v3.0/"],
  ["cyclonedx", "CycloneDX Specification", "OWASP Foundation", "持续更新", ["secure-supply-chain"], "advanced", "覆盖 SBOM、SaaSBOM、漏洞、配方、证明和运营使用场景。", "https://cyclonedx.org/specification/overview/"],
  ["kubernetes", "Kubernetes Documentation", "Kubernetes Project / CNCF", "持续更新", ["kubernetes-foundations", "kubernetes-operations"], "starter", "从对象模型、控制器、工作负载、服务、配置、存储到集群管理建立编排主线。", "https://kubernetes.io/docs/home/"],
  ["kubernetes-security", "Kubernetes Security Checklist", "Kubernetes Project / CNCF", "持续更新", ["kubernetes-operations", "secure-supply-chain"], "advanced", "按认证授权、Pod、网络、密钥、镜像和日志给出共享集群的最低安全检查面。", "https://kubernetes.io/docs/concepts/security/security-checklist/"],
  ["cloud-native-security", "Cloud Native Security Whitepaper v2", "CNCF TAG Security", "2022", ["kubernetes-operations", "secure-supply-chain", "platform-resilience"], "advanced", "沿开发、分发、部署和运行生命周期组织云原生安全责任与控制。", "https://tag-security.cncf.io/community/resources/security-whitepaper/v2/cloud-native-security-whitepaper/"],
  ["opengitops", "OpenGitOps Principles", "CNCF OpenGitOps Working Group", "持续更新", ["iac-gitops"], "core", "用声明式、版本化、自动拉取和持续调和定义 GitOps 的稳定边界。", "https://opengitops.dev/"],
  ["terraform", "Terraform Documentation", "HashiCorp", "持续更新", ["iac-gitops"], "starter", "解释配置、状态、计划、Provider、Module 与远端执行的 IaC 工作流。", "https://developer.hashicorp.com/terraform/docs"],
  ["argocd", "Argo CD Documentation", "Argo Project / CNCF", "持续更新", ["iac-gitops", "delivery-release"], "core", "围绕期望状态、同步、健康检查、差异和回滚实现 Kubernetes 持续交付。", "https://argo-cd.readthedocs.io/en/stable/"],
  ["principles-chaos", "Principles of Chaos Engineering", "Chaos Engineering Community", "持续更新", ["chaos-sre"], "core", "用稳态假设、真实事件、生产实验、自动化和最小爆炸半径界定混沌实验。", "https://principlesofchaos.org/"],
  ["cncf-platforms", "CNCF Platforms White Paper", "CNCF TAG App Delivery", "2023", ["platform-resilience", "iac-gitops"], "advanced", "把内部平台定义为面向用户需求组合能力的产品，而不是工具门户。", "https://tag-app-delivery.cncf.io/whitepapers/platforms/"],
  ["platform-maturity", "Platform Engineering Maturity Model", "CNCF TAG App Delivery", "2023", ["platform-resilience"], "advanced", "用投资、采用、接口、运营和度量维度判断平台能力的成熟度与下一步。", "https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/"],
];

const books = bookRows.map(([id, title, creator, year, resourceModules, level, role, contentUrl]) => ({
  id: `book-${id}`,
  type: "book",
  title,
  creator,
  year,
  modules: resourceModules,
  level,
  role,
  content_url: contentUrl,
  access: "open",
  review_url: `/knowledge-base/reviews/quality/${id}`,
  review_status: id === "swebok-v4" ? "approved-sample" : "complete-awaiting-user-review",
  verification: { status: "fulltext-url-verified", method: "tavily-discovery-and-official-source-check", checked_at: checkedAt },
}));

const paperSearches = {
  "quality-risk": ["cat:cs.SE AND (all:\"risk based testing\" OR all:\"requirements testing\" OR all:\"software quality\" OR all:\"defect prediction\")", "cat:cs.SE AND (all:\"technical debt\" OR all:\"quality assurance\")"],
  "testing-evidence": ["cat:cs.SE AND (all:\"software testing\" OR all:\"mutation testing\" OR all:fuzzing OR all:\"test oracle\")", "cat:cs.SE AND (all:\"property based testing\" OR all:\"model based testing\" OR all:\"flaky tests\" OR all:\"regression testing\")"],
  "build-artifacts": ["(cat:cs.SE OR cat:cs.CR) AND (all:\"reproducible builds\" OR all:\"static analysis\" OR all:\"build system\" OR all:\"software artifact\")", "(cat:cs.SE OR cat:cs.CR) AND (all:container OR all:provenance OR all:SBOM)"],
  "delivery-release": ["cat:cs.SE AND (all:\"continuous integration\" OR all:\"continuous delivery\" OR all:\"continuous deployment\" OR all:DevOps)", "cat:cs.SE AND (all:\"canary deployment\" OR all:rollback OR all:\"database migration\" OR all:\"release engineering\")", "cat:cs.SE AND (all:\"software release\" OR all:\"deployment pipeline\" OR all:\"release engineering\")"],
  "observability-recovery": ["(cat:cs.SE OR cat:cs.DC) AND (all:observability OR all:\"distributed tracing\" OR all:\"incident response\" OR all:SLO)", "(cat:cs.SE OR cat:cs.DC) AND (all:\"site reliability\" OR all:monitoring OR all:alerting OR all:postmortem)"],
  "secure-supply-chain": ["(cat:cs.SE OR cat:cs.CR) AND (all:\"software supply chain\" OR all:provenance OR all:SBOM)", "(cat:cs.SE OR cat:cs.CR) AND (all:\"dependency security\" OR all:\"package ecosystem\" OR all:vulnerability)"],
  "kubernetes-foundations": ["(cat:cs.DC OR cat:cs.NI) AND (all:Kubernetes OR all:\"container orchestration\")", "(cat:cs.DC OR cat:cs.NI) AND (all:\"cloud native\" OR all:microservices) AND all:orchestration"],
  "kubernetes-operations": ["(cat:cs.DC OR cat:cs.NI) AND all:Kubernetes AND (all:scheduling OR all:autoscaling OR all:\"resource management\")", "(cat:cs.CR OR cat:cs.DC) AND all:Kubernetes AND (all:security OR all:RBAC OR all:\"network policy\")"],
  "iac-gitops": ["(cat:cs.SE OR cat:cs.DC) AND (all:\"infrastructure as code\" OR all:GitOps OR all:\"configuration drift\")", "(cat:cs.SE OR cat:cs.DC) AND (all:\"policy as code\" OR all:\"declarative infrastructure\" OR all:Terraform)", "cat:cs.SE AND all:\"infrastructure as code\"", "cat:cs.SE AND (all:Ansible OR all:Puppet OR all:Terraform OR all:\"configuration management\")"],
  "performance-capacity": ["(cat:cs.PF OR cat:cs.DC OR cat:cs.SE) AND (all:\"performance engineering\" OR all:\"load testing\" OR all:\"capacity planning\" OR all:\"tail latency\")", "(cat:cs.PF OR cat:cs.DC) AND (all:queueing OR all:profiling OR all:throughput OR all:benchmarking)"],
  "chaos-sre": ["(cat:cs.SE OR cat:cs.DC) AND (all:\"chaos engineering\" OR all:\"fault injection\" OR all:\"resilience testing\")", "cat:cs.SE AND (all:\"site reliability\" OR all:\"error budget\" OR all:\"failure recovery\")", "cat:cs.SE AND (all:\"fault injection\" OR all:\"chaos engineering\" OR all:\"resilience experiment\")"],
  "platform-resilience": ["(cat:cs.DC OR cat:cs.SE) AND (all:\"disaster recovery\" OR all:\"multi region\" OR all:\"cloud resilience\")", "(cat:cs.SE OR cat:cs.DC) AND (all:\"internal developer platform\" OR all:\"platform engineering\" OR all:\"software delivery performance\")", "cat:cs.SE AND (all:\"platform engineering\" OR all:\"developer platform\" OR all:\"DevOps platform\")", "cat:cs.SE AND all:\"developer experience\"", "(cat:cs.DC OR cat:cs.SE) AND (all:\"fault tolerance\" OR all:\"high availability\" OR all:\"graceful degradation\")", "cat:cs.DC AND (all:\"geo replication\" OR all:\"cross region\" OR all:\"multi data center\")"],
};

const positivePatterns = {
  "quality-risk": /software|testing|quality|requirements?|risk|defect|technical debt/i,
  "testing-evidence": /test|fuzz|mutation|oracle|flaky|verification|validation|debug|fault localization/i,
  "build-artifacts": /build|static analysis|artifact|container|reproduc|provenance|sbom|dependency/i,
  "delivery-release": /continuous|deploy|delivery|devops|release|rollback|migration|pipeline|canary/i,
  "observability-recovery": /observab|tracing|monitor|incident|reliab|slo|alert|postmortem|logging/i,
  "secure-supply-chain": /software|supply chain|security|vulnerab|dependency|provenance|sbom|package/i,
  "kubernetes-foundations": /kubernetes|container|orchestrat|microservice|cloud.native|service mesh/i,
  "kubernetes-operations": /kubernetes|cluster|schedul|autoscal|resource|rbac|container secur/i,
  "iac-gitops": /infrastructure.as.code|gitops|configuration|declarative|drift|policy.as.code|terraform/i,
  "performance-capacity": /performance|latency|capacity|queue|profil|benchmark|throughput|load test|scalab/i,
  "chaos-sre": /chaos|fault.inject|resilien|reliab|failure|recovery|error budget|game.day/i,
  "platform-resilience": /disaster recovery|multi.region|cloud resili|platform engineer|developer platform|developer experience|graceful degradation|fault.toler|high availability|resilien|geo.replication|cross.region|multi.data.center/i,
};

const driftPattern = /medical|healthcare|clinical|patient|perinatal|protein|cancer|agricultur|vehicle|traffic signal|power grid|blockchain|smart contract|cryptocurrency|financial(?:ly| market)|wireless sensor/i;
const moduleDriftPatterns = {
  "quality-risk": /large language model|\bLLM\b|deep learning|AI engineer|AI.augmented|autoencoder|transformer model/i,
  "testing-evidence": /large language model|\bLLMs?\b|deep learning|\bDNN\b|pre.trained language|chatbots?|neural method|cyber.physical|testing education|AI adoption|agent.based|NLP.assisted|quantum|Android/i,
  "build-artifacts": /large language model|\bLLM\b|quantum|scientific knowledge|multi.agent/i,
  "delivery-release": /large language model|\bLLMs?\b|machine learning models?|\bMLOps\b|artificial intelligence|document workflows?|autonomous enterprise/i,
  "observability-recovery": /large language model|\bLLMs?\b|GPU|IoT|carbon|wastewater|\bRAG\b|video game|gridmonitor|meta.learning|sensing.domain|diffusion serving/i,
  "secure-supply-chain": /large language model|\bLLMs?\b|hardware.enforced|RoBERTa|critical systems/i,
  "kubernetes-foundations": /5G|IoT|satellite|\bLEO\b|neuromorphic|quantum|GenAI|large language model|speech recognition|HPC/i,
  "kubernetes-operations": /quantum|large language model|\bLLM\b|MPI|HPC|edge|GPU|reinforcement|deep learning|AI.driven/i,
  "iac-gitops": /large language model|\bLLM\b|capture the flag|agentic|AI agents?|IoT|LoRa|satellite/i,
  "performance-capacity": /large language model|\bLLM\b|machine learning|video game|autonomous edge|quantum|fluid.dynamics|federated transfer/i,
  "chaos-sre": /large language model|\bLLM\b|agent systems?|Android|CentOS|HPC|HDL|UAS|DNN|\bMEC\b|fog|quantum|continuum dynamics|erasure.code/i,
  "platform-resilience": /satellite|\bLEO\b|perception|large language model|\bLLMs?\b|spot instance|photo|UAS|bank server|erasure code|LGBTQ|AI polic|AI coding|quantum|cryptograph|code review|low.code|refactor|\bSSI\b/i,
};

function decodeXml(value = "") {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
}

function pick(block, tag) {
  return decodeXml((block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function parseArxiv(xml, moduleId, query) {
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match, index) => {
    const block = match[1];
    const rawId = pick(block, "id");
    const arxivId = rawId.match(/\/abs\/([^v]+)(?:v\d+)?$/)?.[1];
    const authorNames = [...block.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map((author) => decodeXml(author[1].trim()));
    const published = pick(block, "published");
    return {
      arxivId,
      title: pick(block, "title"),
      summary: pick(block, "summary"),
      creator: `${authorNames.slice(0, 8).join("、")}${authorNames.length > 8 ? " 等" : ""}`,
      year: published.slice(0, 4),
      publicationDate: published.slice(0, 10),
      venue: pick(block, "arxiv:journal_ref") || "arXiv",
      sourceRank: index + 1,
      moduleId,
      query,
    };
  }).filter((paper) => paper.arxivId && paper.title && paper.creator && paper.year);
}

async function fetchArxiv(query) {
  const url = new URL("https://export.arxiv.org/api/query");
  url.searchParams.set("search_query", query);
  url.searchParams.set("start", "0");
  url.searchParams.set("max_results", "100");
  url.searchParams.set("sortBy", "relevance");
  let lastStatus = 0;
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "Learning007QualityCatalog/1.0" }, signal: AbortSignal.timeout(60_000) });
      lastStatus = response.status;
      if (response.ok) return response.text();
      if (response.status !== 429 && response.status < 500) break;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
  }
  throw new Error(`arXiv ${lastStatus || lastError?.name || "request failed"} for ${query}`);
}

const selected = new Map();
const moduleCounts = Object.fromEntries(modules.map((module) => [module.id, 0]));

try {
  const previousCatalog = JSON.parse(await readFile(publicOutput, "utf8"));
  for (const paper of (previousCatalog.resources ?? []).filter((resource) => resource.type === "paper")) {
    const moduleId = paper.modules?.[0];
    if (!moduleCounts.hasOwnProperty(moduleId)) continue;
    if (driftPattern.test(paper.title) || moduleDriftPatterns[moduleId]?.test(paper.title) || !positivePatterns[moduleId].test(paper.title)) continue;
    const key = paper.content_url.match(/arxiv\.org\/pdf\/([^v]+)(?:v\d+)?$/)?.[1] ?? paper.content_url;
    selected.set(key, paper);
    moduleCounts[moduleId] += 1;
  }
} catch {}

for (const module of modules) {
  for (const [queryIndex, query] of paperSearches[module.id].entries()) {
    if (moduleCounts[module.id] >= papersPerModule) break;
    const xml = await fetchArxiv(query);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    let acceptedForQuery = 0;
    for (const work of parseArxiv(xml, module.id, query)) {
      const queryCap = queryIndex === paperSearches[module.id].length - 1 ? papersPerModule : 15;
      if (moduleCounts[module.id] >= papersPerModule || acceptedForQuery >= queryCap) break;
      const summary = `${work.title} ${work.summary}`;
      if (driftPattern.test(summary) || moduleDriftPatterns[module.id]?.test(summary) || !positivePatterns[module.id].test(work.title)) continue;
      const key = work.arxivId;
      const existing = selected.get(key);
      if (existing) {
        if (!existing.modules.includes(module.id)) existing.modules.push(module.id);
        continue;
      }
      selected.set(key, {
        id: `paper-${createHash("sha1").update(key).digest("hex").slice(0, 12)}`,
        type: "paper",
        title: work.title,
        creator: work.creator,
        year: work.year,
        publication_date: work.publicationDate,
        modules: [module.id],
        level: module.track === "formal" ? "core" : "advanced",
        freshness: Number(work.year) >= 2025 ? "current" : Number(work.year) >= 2023 ? "recent" : "foundation",
        role: `支撑“${module.name}”的机制、实证或边界判断；进入正式文章前仍需核对研究对象、数据和外推条件。`,
        content_url: `https://arxiv.org/pdf/${work.arxivId}`,
        access: "open",
        scholarly_venue: work.venue,
        source_query: query,
        search_rank: work.sourceRank,
        verification: { status: "fulltext-url-verified", method: "tavily-topic-map-and-arxiv-api", checked_at: checkedAt },
      });
      moduleCounts[module.id] += 1;
      acceptedForQuery += 1;
    }
  }
  if (moduleCounts[module.id] < papersPerModule) {
    throw new Error(`${module.id} only has ${moduleCounts[module.id]} papers; expected ${papersPerModule}`);
  }
}

// “稳定基础/前沿证据”需要基于方法成熟度与证据复核，不能仅用发表年份代替。
// 本轮只是目录关卡，因此只保留可客观计算的年份新鲜度。
const papers = [...selected.values()].map(({ maturity: _maturity, ...paper }) => paper);
if (papers.length < 240) throw new Error(`Only ${papers.length} unique papers; expected at least 240`);

const catalog = {
  schema_version: 2,
  field,
  title: "质量与生产交付",
  updated_at: checkedAt,
  storage_policy: "只保存无需购买、无需登录即可阅读的教材、权威手册和论文全文 URL；42 份教材与手册均已建立独立中文阅读综述。",
  selection_policy: [
    "覆盖 16 个质量核心节点与 18 个交付进阶节点，模块按能力依赖建立，不按工具品牌堆放。",
    "教材与手册由 Tavily 发现并回到作者、大学、标准组织、公共机构或官方项目正文核验；排除购买页、登录页和二手下载站。",
    "论文主题由 Tavily 检索结果、权威手册参考脉络和 34 节点共同限定，再用 arXiv API 的开放全文、作者、年份与版本元数据去重。",
    "目录入选只证明来源身份、相关性和全文入口；写作时仍需记录实际阅读范围、采用判断和不可外推边界。",
  ],
  modules,
  resources: [...books, ...papers],
};

const sourceBooks = {
  field,
  title: "质量与生产交付",
  curated_count: books.length,
  methodology: "Tavily 主题检索 + 官方正文核验 + 逐份资料卡写作 + 阅读综述批量验收",
  records: books.map((book) => ({
    id: `book:${field}:${book.id.slice(5)}`,
    field,
    kind: "book",
    title: book.title,
    authors: book.creator.split("、"),
    year: book.year,
    publisher: book.creator,
    topics: book.modules,
    official_url: book.content_url,
    review_url: book.review_url,
    review_status: book.review_status,
    authority_reason: book.role,
    access: { status: "open_fulltext", download_url: book.content_url, local_path: null, checked_at: checkedAt },
    updated_at: checkedAt,
  })),
};

const sourcePapers = {
  field,
  title: "质量与生产交付",
  snapshot_date: checkedAt,
  provider: "Tavily + arXiv API",
  selection_method: `按 12 个课程模块检索开放全文，每个模块至少 ${papersPerModule} 篇；先满足节点相关性与全文可达性，再兼顾奠基研究和近年新证据。`,
  records: papers.map((paper) => ({
    id: `paper:${field}:${paper.id.slice(6)}`,
    field,
    kind: "paper",
    title: paper.title,
    authors: paper.creator.split("、"),
    year: paper.year,
    topics: paper.modules,
    official_url: paper.content_url,
    doi: paper.doi,
    venue: paper.scholarly_venue,
    cited_by_count_snapshot: paper.citation_count,
    source_query: paper.source_query,
    access: { status: "open_fulltext", download_url: paper.content_url, local_path: null, checked_at: checkedAt },
    updated_at: checkedAt,
  })),
};

const searchAudit = {
  field,
  checked_at: checkedAt,
  gate: "catalog-review",
  learning_nodes: { formal: 16, advanced: 18, total: 34 },
  tavily_queries: [
    "authoritative open access software testing reliability continuous delivery site reliability engineering books handbooks official PDF",
    "authoritative open access software testing verification textbook handbook official PDF university",
    "official open access DevOps continuous delivery SRE observability incident response handbook book",
    "official Kubernetes IaC GitOps platform engineering handbook whitepaper PDF CNCF",
    "open access performance engineering capacity planning queueing systems textbook official PDF",
    "official software supply chain security secure development handbook NIST OWASP SLSA PDF",
    "official resilience disaster recovery chaos engineering game day handbook open access PDF",
    "software testing continuous integration DevOps SRE core papers reading list university",
    "site:arxiv.org software testing continuous delivery observability reliability engineering survey",
    "site:istqb.org CTFL syllabus v4.0.1 pdf",
    "site:nasa.gov software engineering handbook PDF NASA",
    "site:nist.gov software testing secure development incident response contingency planning PDF",
    "site:cncf.io whitepaper platform engineering cloud native security PDF",
    "site:istqb.org certified tester advanced level test automation engineering syllabus",
    "site:nasa.gov NASA systems engineering handbook pdf",
    "site:sre.google books site reliability engineering",
    "platform engineering developer experience empirical study paper",
  ],
  exclusions: ["购买页或登录后正文", "Scribd、Academia 等二手聚合页", "只有课程介绍而无系统正文", "标题相关但研究对象属于医疗、交通、电网或金融等领域的漂移论文"],
  module_paper_counts: Object.fromEntries(modules.map((module) => [module.id, papers.filter((paper) => paper.modules.includes(module.id)).length])),
  book_count: books.length,
  paper_count: papers.length,
};

const summary = {
  field,
  title: "质量与生产交付",
  generated_at: checkedAt,
  books: books.length,
  papers: papers.length,
  modules: modules.length,
  node_coverage: 34,
  review_status: "complete-awaiting-user-review",
};

await mkdir(path.dirname(publicOutput), { recursive: true });
await mkdir(sourceDir, { recursive: true });
await Promise.all([
  writeFile(publicOutput, `${JSON.stringify(catalog, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "books.json"), `${JSON.stringify(sourceBooks, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "papers.json"), `${JSON.stringify(sourcePapers, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "search-audit.json"), `${JSON.stringify(searchAudit, null, 2)}\n`, "utf8"),
  writeFile(path.join(sourceDir, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
]);

console.log(`quality catalog: ${books.length} books/handbooks, ${papers.length} papers, ${modules.length} modules, 34 nodes`);
console.log(moduleCounts);
