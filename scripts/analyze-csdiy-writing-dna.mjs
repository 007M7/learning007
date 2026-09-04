import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const projectRoot = process.cwd();
const sourceRepositoryRoot = path.join(projectRoot, "knowledge-base", "cache", "reference", "cs-self-learning");
const sourceRoot = path.join(sourceRepositoryRoot, "docs");
const outputRoot = path.join(projectRoot, "docs", "writing-dna", "csdiy-wiki", "_meta");
const reviewEvidencePath = path.join(outputRoot, "review-evidence.json");
const imageAuditPath = path.join(outputRoot, "image-audit.json");
const interfaceSamplesPath = path.join(outputRoot, "interface-samples.json");
const reproductionValidationPath = path.join(outputRoot, "reproduction-validation.json");
const shortWritingDnaPath = path.join(projectRoot, "docs", "writing-dna", "csdiy-wiki", "Writing-DNA.md");
const expectedSourceCommit = "adce8e13789dc16aa6d1fbe163e9541736defae4";

const deepReadPaths = new Set([
  "index.md", "使用指南.md", "CS学习规划.md", "后记.md", "好书推荐.md",
  "必学工具/workflow.md", "必学工具/信息检索.md", "编程入门/Python/CS61A.md",
  "编程入门/C/CS50.md", "编程入门/Rust/CS110L.md", "编程入门/cpp/CS106B_CS106X.md",
  "编程入门/Functional/CS3110.md", "编程入门/MIT-Missing-Semester.md", "软件工程/6031.md",
  "计算机系统基础/CSAPP.md", "体系结构/N2T.md", "体系结构/CS61C.md",
  "操作系统/MIT6.S081.md", "操作系统/CS162.md", "操作系统/NJUOS.md",
  "计算机网络/CS144.md", "数据库系统/15445.md", "并行与分布式系统/MIT6.824.md",
  "数据结构与算法/Algo.md", "编译原理/PKU-Compilers.md",
  "编程语言设计与分析/CS242.md", "计算机图形学/15462.md",
  "深度学习/EECS498-007.md", "机器学习系统/CSE234.md",
  "机器学习进阶/roadmap.md", "深度生成模型/roadmap.md"
]);

const stopWords = new Set(
  "这个 这些 那个 那些 一些 一种 一个 我们 你们 他们 它们 可以 需要 应该 已经 因为 所以 如果 但是 以及 通过 进行 内容 作者 同时 其中 比较 非常 然后 对于 这样 自己 相关 主要 大家 时候 什么 怎么 为什么 如何 这里 那里 目前 之后 之前 还有 并且 而且 或者 不是 没有 由于 也就 就是 这种 那么".split(/\s+/)
);
const verbs = "推荐 实现 选择 完成 理解 使用 掌握 阅读 学习 提供 需要 发现 认为 解决 构建 配置 调试 参考 注意 避免 适合 支持 介绍 说明 总结 比较 建议 要求 尝试 运行 开发 设计 编写 分析 解释 验证 测试 修改 建立 处理 访问 保存 安装 写出 输入 输出 观察 判断 拆分 连接 构造 创建 部署 获取 讲解 组织 证明 拒绝 检查 展示 更新 返回 记录 管理 测量 评价 练习 讨论 加入 开始 进入 复习 迁移".split(" ");
const adverbNoise = "非常 比较 其实 基本 一般 大概 可能 也许 往往 通常 最终 直接 完全 特别 相当 十分 尤其 当然 确实 大致 尽量 逐渐 真正 仅仅 只是 仍然 已经".split(" ");
const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });

async function git(args) {
  const { stdout } = await execFile(
    "git",
    ["-c", "core.quotepath=false", "-C", sourceRepositoryRoot, ...args],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
  );
  return stdout;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...(await walk(absolute)));
    if (entry.isFile() && entry.name.endsWith(".md") && !entry.name.endsWith(".en.md")) paths.push(absolute);
  }
  return paths;
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_`|]/g, " ");
}

function narrativeText(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\r?\n/)
    .filter((line) => {
      const value = line.trim();
      return !value || !/^(#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\||!\[|<|\[[^\]]+\]:)/.test(value);
    })
    .join("\n")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[*_`]/g, " ");
}

function classify(relativePath, text) {
  if (/roadmap\.md$|CS学习规划\.md$/.test(relativePath)) return "路线规划";
  if (/使用指南\.md$/.test(relativePath)) return "读者决策指南";
  if (/workflow\.md$|信息检索\.md$/.test(relativePath)) return "机制解释与操作指南";
  if (/好书推荐\.md$/.test(relativePath)) return "资源目录";
  if (/课程简介/.test(text)) return "课程决策卡";
  if (/index\.md$/.test(relativePath)) return "总览/入口";
  return "专题说明";
}

function hasMetadataValue(text, label) {
  return new RegExp(`^[-*]\\s*(?:\\*\\*)?${label}(?:\\*\\*)?\\s*[：:]\\s*(\\S.*)$`, "m").test(text);
}

function getParagraphs(text) {
  return text.split(/\n\s*\n/).map((value) => value.replace(/\s+/g, " ").trim()).filter((value) => value.length >= 8);
}

function getSentences(text) {
  return (text.match(/[^。！？!?；;]+[。！？!?；;]?/g) ?? [])
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter((value) => value.length >= 2);
}

const visibleLength = (text) => [...text.replace(/\s+/g, "")].length;
function wordCount(text) {
  let count = 0;
  for (const item of segmenter.segment(text)) if (item.isWordLike) count += 1;
  return count;
}
function countOccurrences(text, term) {
  let count = 0;
  let offset = 0;
  while ((offset = text.indexOf(term, offset)) !== -1) {
    count += 1;
    offset += term.length;
  }
  return count;
}
function quantile(values, q) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * q)];
}
const average = (items) => items.length ? Number((items.reduce((sum, value) => sum + value, 0) / items.length).toFixed(2)) : 0;

function inferHook(paragraphs) {
  const opening = paragraphs[0] ?? "";
  if (/[？?]/.test(opening)) return "问题/追问式（自动规则，未人工深读）";
  if (/我|笔者|亲自|经历|体验/.test(opening)) return "个人经验式（自动规则，未人工深读）";
  if (/难|问题|不足|缺|遗憾|痛点/.test(opening)) return "问题警示式（自动规则，未人工深读）";
  if (/课程|本书|本文|指南|路线/.test(opening)) return "定位说明式（自动规则，未人工深读）";
  return "首段陈述式（自动规则，未人工深读）";
}
function inferStructure(h2, h3) {
  const labels = [...h2, ...h3].slice(0, 5);
  return `自动结构摘要：H2=${h2.length}、H3=${h3.length}${labels.length ? `；前五个小节：${labels.join(" / ")}` : "；无 H2/H3"}。未替代人工骨架判断。`;
}
function deriveTopicTags(relativePath, title) {
  const pathTags = relativePath.replace(/\.md$/, "").split("/").filter((value) => !/^(index|roadmap)$/i.test(value));
  return [...new Set([...pathTags, title].filter(Boolean))].slice(0, 5);
}
function sourceTypes(text) {
  const urls = [...text.matchAll(/(?:\]\(|href=["']?)(https?:\/\/[^\s)"'>]+)/gi)].map((match) => match[1].toLowerCase());
  const types = new Set();
  for (const url of urls) {
    if (/github\.com|gitlab\.com|gitee\.com/.test(url)) types.add("开源仓库");
    else if (/youtube\.com|youtu\.be|bilibili\.com/.test(url)) types.add("课程视频/公开视频");
    else if (/arxiv\.org|doi\.org|acm\.org|ieee\.org/.test(url)) types.add("论文/研究资料");
    else if (/\.edu(?:\/|$)|mit\.edu|stanford\.edu|berkeley\.edu|cmu\.edu/.test(url)) types.add("高校或课程官网");
    else if (/douban\.com|book|textbook|press\./.test(url)) types.add("书籍/教材");
    else types.add("外部网页");
  }
  return types.size ? [...types] : ["未自动识别外部来源；需人工复核"];
}
function buildLastChangedMap(logOutput) {
  const result = new Map();
  let currentDate = null;
  for (const rawLine of logOutput.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith("@@")) currentDate = line.slice(2);
    else if (currentDate && line.startsWith("docs/")) {
      const relative = line.slice(5).replaceAll("\\", "/");
      if (relative.endsWith(".md") && !relative.endsWith(".en.md") && !result.has(relative)) result.set(relative, currentDate);
    }
  }
  return result;
}

function validateReviewEvidence(document) {
  if (document.source_commit !== expectedSourceCommit) throw new Error(`review-evidence source_commit ${document.source_commit} does not match ${expectedSourceCommit}`);
  if (!Array.isArray(document.records)) throw new Error("review-evidence.records must be an array");
  const required = ["path", "author", "date", "article_type", "topic_tags", "hook_type", "structure_pattern", "source_types", "cognitive_signals", "notes"];
  const byPath = new Map();
  for (const record of document.records) {
    for (const key of required) {
      const value = record[key];
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) throw new Error(`review-evidence ${record.path ?? "<unknown>"} missing ${key}`);
    }
    if (byPath.has(record.path)) throw new Error(`duplicate review-evidence path ${record.path}`);
    byPath.set(record.path, record);
  }
  const missing = [...deepReadPaths].filter((item) => !byPath.has(item));
  const extra = [...byPath.keys()].filter((item) => !deepReadPaths.has(item));
  if (missing.length || extra.length) throw new Error(`review-evidence path mismatch; missing=${missing.join(",")}; extra=${extra.join(",")}`);
  return byPath;
}

function validateSupportingAudit(document, name, expectedRecords) {
  if (document.source_commit !== expectedSourceCommit) throw new Error(`${name} source_commit ${document.source_commit} does not match ${expectedSourceCommit}`);
  if (!Array.isArray(document.records) || document.records.length !== expectedRecords) {
    throw new Error(`${name}.records should contain ${expectedRecords} records; found ${document.records?.length ?? "missing"}`);
  }
  const ids = new Set(document.records.map((record) => record.id));
  if (ids.size !== expectedRecords) throw new Error(`${name} contains duplicate or missing record ids`);
}

function validateReproduction(document) {
  if (document.schema_version !== "1.0") throw new Error("reproduction-validation schema_version must be 1.0");
  if (document.input_mode !== "short-writing-dna-only") throw new Error("reproduction-validation must test the short Writing-DNA alone");
  if (!Array.isArray(document.generator_read_files) || document.generator_read_files.length !== 1 || document.generator_read_files[0] !== "docs/writing-dna/csdiy-wiki/Writing-DNA.md") {
    throw new Error("isolated generator must read only docs/writing-dna/csdiy-wiki/Writing-DNA.md");
  }
  if (!Number.isFinite(document.score_total) || document.score_total < 7 || document.score_total > 10) {
    throw new Error(`short Writing-DNA reproduction score must be 7..10; found ${document.score_total}`);
  }
  if (!document.sample_path || !document.score_evidence_path || !document.limitations?.length) {
    throw new Error("reproduction-validation must retain sample, score evidence, and limitations");
  }
}

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const actualSourceCommit = (await git(["rev-parse", "HEAD"])).trim();
if (actualSourceCommit !== expectedSourceCommit) throw new Error(`CSDIY cache moved: expected ${expectedSourceCommit}, found ${actualSourceCommit}. Review before regenerating.`);
const sourceCommitDate = (await git(["show", "-s", "--format=%cI", "HEAD"])).trim();
const trackedDocsStatus = (await git(["status", "--porcelain=v1", "--untracked-files=no", "--", "docs"])).trim();
if (trackedDocsStatus) throw new Error(`CSDIY cached docs have tracked changes:\n${trackedDocsStatus}`);
const lastChanged = buildLastChangedMap(await git(["log", "--format=@@%cI", "--name-only", "--", "docs"]));
const reviewDocument = JSON.parse(await readFile(reviewEvidencePath, "utf8"));
const reviewByPath = validateReviewEvidence(reviewDocument);
const imageAuditDocument = JSON.parse(await readFile(imageAuditPath, "utf8"));
const interfaceSamplesDocument = JSON.parse(await readFile(interfaceSamplesPath, "utf8"));
validateSupportingAudit(imageAuditDocument, "image-audit", 18);
validateSupportingAudit(interfaceSamplesDocument, "interface-samples", 14);
const reproductionValidationDocument = JSON.parse(await readFile(reproductionValidationPath, "utf8"));
validateReproduction(reproductionValidationDocument);
const shortWritingDna = await readFile(shortWritingDnaPath, "utf8");
if ((shortWritingDna.match(/\p{Script=Han}/gu) ?? []).length > 4000) throw new Error("Writing-DNA.md exceeds the 4000 Chinese-character limit");
if (sha256(shortWritingDna) !== reproductionValidationDocument.input_sha256) throw new Error("Writing-DNA.md changed after the isolated reproduction test; rerun generation and scoring");
const reproductionSample = await readFile(path.join(projectRoot, reproductionValidationDocument.sample_path), "utf8");
const reproductionScoreEvidence = await readFile(path.join(projectRoot, reproductionValidationDocument.score_evidence_path), "utf8");
if (sha256(reproductionSample) !== reproductionValidationDocument.sample_sha256) throw new Error("isolated reproduction sample changed after scoring");
if (sha256(reproductionScoreEvidence) !== reproductionValidationDocument.score_evidence_sha256) throw new Error("isolated reproduction score evidence changed after scoring");

const files = (await walk(sourceRoot)).sort((a, b) => a.localeCompare(b, "zh-CN"));
const frequencies = new Map();
const records = [];
const allNarratives = [];
const allNarrativeParagraphs = [];

for (const absolutePath of files) {
  const text = await readFile(absolutePath, "utf8");
  const relativePath = path.relative(sourceRoot, absolutePath).replaceAll("\\", "/");
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? path.basename(relativePath, ".md");
  const heading2 = [...text.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const heading3 = [...text.matchAll(/^###\s+(.+)$/gm)].map((match) => match[1].trim());
  const plain = stripMarkdown(text);
  const narrative = narrativeText(text);
  const paragraphs = getParagraphs(narrative);
  const sentences = getSentences(narrative);
  const lengths = sentences.map(visibleLength);
  const markdownImages = [...text.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length;
  const htmlImages = [...text.matchAll(/<img\b/gi)].length;
  const links = [...text.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
  const codeBlocks = Math.floor((text.match(/```/g)?.length ?? 0) / 2);
  const review = reviewByPath.get(relativePath);
  allNarratives.push(narrative);
  allNarrativeParagraphs.push(...paragraphs);
  for (const item of segmenter.segment(narrative)) {
    const word = item.segment.trim().toLowerCase();
    if (!item.isWordLike || [...word].length < 2 || stopWords.has(word)) continue;
    frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  }
  records.push({
    path: relativePath,
    title,
    date: review?.date ?? "unknown",
    date_basis: review?.date_basis ?? "page text does not state a publication date",
    repository_last_changed_at: lastChanged.get(relativePath) ?? "unknown",
    author: review?.author ?? "unknown",
    author_basis: review?.author_basis ?? "page text does not state an author",
    column: relativePath.includes("/") ? relativePath.split("/")[0] : "站点入口与总览",
    article_type: review?.article_type ?? classify(relativePath, text),
    topic_tags: review?.topic_tags ?? deriveTopicTags(relativePath, title),
    hook_type: review?.hook_type ?? inferHook(paragraphs),
    structure_pattern: review?.structure_pattern ?? inferStructure(heading2, heading3),
    source_types: review?.source_types ?? sourceTypes(text),
    word_count: wordCount(plain),
    word_count_method: "Intl.Segmenter(zh-CN) word-like segments after removing code/script/style/image payloads and Markdown marks; not an English-style whitespace count.",
    notable: review?.notes ?? `未列入31页人工深读；仅自动记录结构与格式，不能据此推断叙事或认知策略。H2=${heading2.length}, H3=${heading3.length}。`,
    deep_read: Boolean(review),
    deep_read_evidence_id: review ? `review-evidence.json#${relativePath}` : null,
    cognitive_signals: review?.cognitive_signals ?? [],
    metadata_provenance: review ? "manual full-page read recorded in review-evidence.json" : "path/text heuristic; explicitly not manual deep-read evidence",
    character_count: text.length,
    non_whitespace_character_count: visibleLength(text),
    paragraph_count: paragraphs.length,
    sentence_count: sentences.length,
    average_sentence_characters: lengths.length ? Number((lengths.reduce((sum, value) => sum + value, 0) / lengths.length).toFixed(1)) : 0,
    short_sentence_ratio: lengths.length ? Number((lengths.filter((value) => value <= 15).length / lengths.length).toFixed(3)) : 0,
    long_sentence_ratio: lengths.length ? Number((lengths.filter((value) => value >= 50).length / lengths.length).toFixed(3)) : 0,
    h2_count: heading2.length, h3_count: heading3.length, h2_headings: heading2, h3_headings: heading3,
    code_block_count: codeBlocks, table_row_count: [...text.matchAll(/^\|/gm)].length,
    markdown_image_count: markdownImages, html_image_count: htmlImages, external_link_count: links.length,
    has_course_intro: /课程简介/.test(text), has_university: hasMetadataValue(text, "所属大学"),
    has_prerequisite: hasMetadataValue(text, "先修要求"), has_language: hasMetadataValue(text, "编程语言"),
    has_difficulty: hasMetadataValue(text, "课程难度"), has_estimated_time: hasMetadataValue(text, "预计学时"),
    has_course_resource: /课程资源/.test(text), has_resource_summary: /资源汇总/.test(text)
  });
}

const narrativeCorpus = allNarratives.join("\n\n");
const narrativeSentences = getSentences(narrativeCorpus);
const narrativeSentenceLengths = narrativeSentences.map(visibleLength);
const paragraphSentenceCounts = allNarrativeParagraphs.map((paragraph) => getSentences(paragraph).length);
const nonWhitespaceCharacters = visibleLength(narrativeCorpus);
const punctuationCharacters = ["，", "。", "？", "！", "；", "：", "、", "“", "”", "‘", "’", "《", "》"];
const punctuationCounts = Object.fromEntries(punctuationCharacters.map((character) => [character, countOccurrences(narrativeCorpus, character)]));
const punctuationPerThousand = Object.fromEntries(Object.entries(punctuationCounts).map(([character, count]) => [character, nonWhitespaceCharacters ? Number(((count * 1000) / nonWhitespaceCharacters).toFixed(3)) : 0]));
const values = (key) => records.map((record) => record[key]);
const courseCards = records.filter((record) => record.has_course_intro);
const countCourseCards = (key) => courseCards.filter((record) => record[key]).length;
const sortedFrequencies = [...frequencies.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
const frequentTerms = sortedFrequencies.slice(0, 150).map(([term, count]) => ({ term, count }));
const nounLikeCandidates = sortedFrequencies.filter(([term]) => !verbs.includes(term) && !adverbNoise.includes(term)).slice(0, 100).map(([term, count]) => ({ term, count }));
const verbLexiconCounts = verbs.map((term) => ({ term, count: countOccurrences(narrativeCorpus, term) })).filter((item) => item.count > 0).sort((a, b) => b.count - a.count || a.term.localeCompare(b.term, "zh-CN")).slice(0, 50);
const adverbNoiseCounts = adverbNoise.map((term) => ({ term, count: countOccurrences(narrativeCorpus, term) })).sort((a, b) => b.count - a.count || a.term.localeCompare(b.term, "zh-CN"));
const h2Headings = records.flatMap((record) => record.h2_headings);
const h3Headings = records.flatMap((record) => record.h3_headings);
const allHeadings = [...h2Headings, ...h3Headings];
const headingLengths = allHeadings.map(visibleLength);
const dashUnits = narrativeCorpus.match(/(?:—{1,2}|--)/g) ?? [];
const parentheticalUnits = narrativeCorpus.match(/(?:（[^）\n]*）|\([^()\n]*\))/g) ?? [];
const quoteContextSamples = [
  ...(narrativeCorpus.match(/“[^”\n]{1,100}”/g) ?? []),
  ...(narrativeCorpus.match(/《[^》\n]{1,80}》/g) ?? []),
  ...(narrativeCorpus.match(/"[^"\n]{1,100}"/g) ?? []),
].slice(0, 30);
const mixedSentences = narrativeSentences.filter((sentence) => /\p{Script=Han}/u.test(sentence) && /[A-Za-z]/.test(sentence));
const latinTokens = [...narrativeCorpus.matchAll(/[A-Za-z][A-Za-z0-9.+#_/-]*/g)].map((match) => match[0].toLowerCase());
const latinTokenCounts = new Map();
for (const token of latinTokens) latinTokenCounts.set(token, (latinTokenCounts.get(token) ?? 0) + 1);
const topLatinTokens = [...latinTokenCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 30).map(([term, count]) => ({ term, count }));
const requiredMetadata = ["title", "date", "author", "column", "article_type", "topic_tags", "hook_type", "structure_pattern", "source_types", "word_count", "notable"];
const hasRecordedValue = (value) => value !== undefined && value !== null && value !== "" && (!Array.isArray(value) || value.length);
const hasKnownValue = (value) => {
  if (!hasRecordedValue(value)) return false;
  if (typeof value === "string") return value !== "unknown" && !value.startsWith("未自动识别");
  if (Array.isArray(value)) return value.some((item) => typeof item !== "string" || !item.startsWith("未自动识别"));
  return true;
};
const metadataCoverage = Object.fromEntries(requiredMetadata.map((key) => [key, {
  recorded: records.filter((record) => hasRecordedValue(record[key])).length,
  known_or_observed: records.filter((record) => hasKnownValue(record[key])).length,
  total: records.length,
  note: key === "author" || key === "date" ? "unknown is recorded but is not counted as known" : undefined
}]));
const analyzedAt = new Date();
const analyzedDateAsiaShanghai = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" }).format(analyzedAt);

const statistics = {
  source_site: "https://csdiy.wiki/", source_repository: "https://github.com/PKUFlyingPig/cs-self-learning",
  source_commit: actualSourceCommit, source_commit_date: sourceCommitDate,
  source_cache_validation: {
    expected_commit: expectedSourceCommit, actual_head: actualSourceCommit,
    head_matches_expected: actualSourceCommit === expectedSourceCommit, tracked_docs_clean: trackedDocsStatus === "",
    command_scope: "git HEAD, commit timestamp, and tracked docs status were read dynamically"
  },
  license: "MIT", analyzed_at: analyzedAt.toISOString(), analyzed_date_asia_shanghai: analyzedDateAsiaShanghai,
  article_count: records.length, deep_read_count: records.filter((record) => record.deep_read).length,
  deep_read_evidence: {
    manifest: "review-evidence.json", records: reviewDocument.records.length,
    required_fields_validated: true, complete_page_read_claim: reviewDocument.complete_page_read_claim,
    limitations: reviewDocument.limitations
  },
  metadata_coverage: metadataCoverage,
  total_characters: values("character_count").reduce((sum, value) => sum + value, 0),
  normalized_narrative_audit: {
    method: "Computed on every run. Remove fenced code; drop entire heading, list, table, blockquote, image-only, HTML-only and link-definition lines; remove image payloads, link URLs, bare URLs and Markdown emphasis/code marks; retain prose anchor text. This is a prose-only audit, not total visible page copy.",
    known_bias: "Dropping list lines excludes course metadata and resource bullets, so counts describe narrative prose and must not be used as total article length.",
    non_whitespace_characters: nonWhitespaceCharacters,
    han_characters: (narrativeCorpus.match(/\p{Script=Han}/gu) ?? []).length,
    line_count: narrativeCorpus.split(/\r?\n/).filter((line) => line.trim()).length,
    sentence_count: narrativeSentences.length, average_sentence_characters: average(narrativeSentenceLengths),
    median_sentence_characters: quantile(narrativeSentenceLengths, 0.5), p25_sentence_characters: quantile(narrativeSentenceLengths, 0.25),
    p75_sentence_characters: quantile(narrativeSentenceLengths, 0.75), quantile_method: "sorted[floor((n-1)*q)]",
    short_sentence_ratio: narrativeSentenceLengths.length ? Number((narrativeSentenceLengths.filter((value) => value <= 15).length / narrativeSentenceLengths.length).toFixed(3)) : 0,
    long_sentence_ratio: narrativeSentenceLengths.length ? Number((narrativeSentenceLengths.filter((value) => value >= 50).length / narrativeSentenceLengths.length).toFixed(3)) : 0,
    narrative_paragraph_count: allNarrativeParagraphs.length, average_sentences_per_paragraph: average(paragraphSentenceCounts),
    single_sentence_paragraph_ratio: paragraphSentenceCounts.length ? Number((paragraphSentenceCounts.filter((value) => value === 1).length / paragraphSentenceCounts.length).toFixed(3)) : 0
  },
  lexical_audit: {
    method: "Intl.Segmenter supplies word-like segmentation but no part-of-speech labels. noun_like_candidates are frequent multi-character segments after stop-word, verb-lexicon and adverb-lexicon exclusion; they are candidates, not POS-tagged nouns. Verb/adverb tables count exact substrings from disclosed hand-built lexicons and therefore include context ambiguity.",
    pronoun_and_condition_markers: { "你": countOccurrences(narrativeCorpus, "你"), "我": countOccurrences(narrativeCorpus, "我"), "如果": countOccurrences(narrativeCorpus, "如果") },
    noun_like_candidates: nounLikeCandidates, verb_lexicon_counts: verbLexiconCounts,
    adverb_noise_counts: adverbNoiseCounts, frequent_terms: frequentTerms
  },
  heading_audit: {
    scope: "all H2 and H3 headings in the 136-page Chinese corpus",
    h2_count: h2Headings.length, h3_count: h3Headings.length, total: allHeadings.length,
    average_non_whitespace_characters: average(headingLengths),
    median_non_whitespace_characters: quantile(headingLengths, 0.5),
    p25_non_whitespace_characters: quantile(headingLengths, 0.25),
    p75_non_whitespace_characters: quantile(headingLengths, 0.75)
  },
  punctuation_audit: {
    scope: "normalized narrative prose defined above", counts: punctuationCounts,
    per_1000_non_whitespace_characters: punctuationPerThousand,
    paired_quote_totals: {
      chinese_double_quote_marks: punctuationCounts["“"] + punctuationCounts["”"],
      chinese_single_quote_marks: punctuationCounts["‘"] + punctuationCounts["’"],
      book_title_marks: punctuationCounts["《"] + punctuationCounts["》"],
      ascii_double_quote_marks: countOccurrences(narrativeCorpus, '"'), ascii_single_quote_marks: countOccurrences(narrativeCorpus, "'")
    },
    dash_parenthesis_usage: {
      dash_unit_definition: "one em-dash run (one or two em dashes) or one ASCII -- sequence",
      parenthetical_unit_definition: "one matched Chinese or ASCII parenthetical span on one line",
      dash_units: dashUnits.length, parenthetical_units: parentheticalUnits.length,
      dash_to_parenthetical_ratio: parentheticalUnits.length ? Number((dashUnits.length / parentheticalUnits.length).toFixed(3)) : null
    },
    quote_context_samples: quoteContextSamples
  },
  mixed_language_audit: {
    scope: "normalized narrative sentences",
    sentence_count: narrativeSentences.length,
    sentences_with_han_and_latin: mixedSentences.length,
    mixed_sentence_ratio: narrativeSentences.length ? Number((mixedSentences.length / narrativeSentences.length).toFixed(3)) : 0,
    top_latin_tokens: topLatinTokens,
    note: "Latin tokens are surface forms, not semantic categories; URLs were removed before counting."
  },
  averages: {
    characters: average(values("character_count")), paragraphs: average(values("paragraph_count")),
    sentence_characters: average(values("average_sentence_characters")), h2: average(values("h2_count")),
    h3: average(values("h3_count")), external_links: average(values("external_link_count"))
  },
  ranges: { characters: [Math.min(...values("character_count")), Math.max(...values("character_count"))], h2: [Math.min(...values("h2_count")), Math.max(...values("h2_count"))] },
  course_cards: {
    count: courseCards.length, with_prerequisite: countCourseCards("has_prerequisite"),
    with_difficulty: countCourseCards("has_difficulty"), with_estimated_time: countCourseCards("has_estimated_time"),
    with_complete_core_metadata: courseCards.filter((record) => record.has_university && record.has_prerequisite && record.has_language && record.has_difficulty && record.has_estimated_time).length,
    with_course_resource: countCourseCards("has_course_resource"), with_resource_summary: countCourseCards("has_resource_summary"),
    under_700_characters: courseCards.filter((record) => record.character_count < 700).length
  },
  format_presence: {
    code_block: records.filter((record) => record.code_block_count > 0).length,
    table: records.filter((record) => record.table_row_count > 0).length,
    markdown_image: records.filter((record) => record.markdown_image_count > 0).length,
    html_image: records.filter((record) => record.html_image_count > 0).length,
    any_image: records.filter((record) => record.markdown_image_count > 0 || record.html_image_count > 0).length
  },
  supporting_audit_validation: {
    image_records: imageAuditDocument.records.length,
    interface_records: interfaceSamplesDocument.records.length,
    short_writing_dna_han_characters: (shortWritingDna.match(/\p{Script=Han}/gu) ?? []).length,
    reproduction_score: reproductionValidationDocument.score_total,
    reproduction_input_mode: reproductionValidationDocument.input_mode
  }
};

await mkdir(outputRoot, { recursive: true });
await writeFile(path.join(outputRoot, "corpus.json"), `${JSON.stringify(records, null, 2)}\n`);
await writeFile(path.join(outputRoot, "corpus-statistics.json"), `${JSON.stringify(statistics, null, 2)}\n`);
console.log(`Analyzed ${records.length} Chinese pages at ${actualSourceCommit}; ${statistics.deep_read_count} manual deep reads; ${statistics.normalized_narrative_audit.non_whitespace_characters} normalized narrative characters.`);
