import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, relative, resolve } from "node:path";

const manualRoot = resolve("scripts", "field-content", "manual");
const docsRoot = resolve("docs", "fields");
const aiSourceLedgerPath = resolve("docs", "sources", "ai.md");
const frontierSourceLedgerPath = resolve("docs", "frontier", "agents", "evidence.md");
const failures = [];
let formalCount = 0;
let referencedFormalCount = 0;
let aiLearningPageCount = 0;
let aiReferenceOccurrenceCount = 0;
const aiUniqueReferenceUrls = new Set();

const aiLearningGroups = [
  {
    label: "core AI",
    directory: resolve("docs", "domains", "ai"),
    ledgerPaths: [aiSourceLedgerPath],
  },
  {
    label: "advanced AI",
    directory: resolve("docs", "advanced", "ai"),
    ledgerPaths: [aiSourceLedgerPath],
  },
  {
    label: "frontier agents",
    directory: resolve("docs", "frontier", "agents"),
    ledgerPaths: [aiSourceLedgerPath, frontierSourceLedgerPath],
  },
];

function stripFencedCodeBlocks(markdown) {
  const kept = [];
  let activeFence = null;
  for (const line of markdown.split(/\r?\n/)) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!activeFence) {
        activeFence = { character: marker[0], length: marker.length };
      } else if (marker[0] === activeFence.character && marker.length >= activeFence.length) {
        activeFence = null;
      }
      continue;
    }
    if (!activeFence) kept.push(line);
  }
  return kept.join("\n");
}

function normalizeExternalUrl(url) {
  // Only collapse a trailing slash. Query strings, fragments, dated specs and
  // other version-bearing path segments remain distinct ledger identities.
  const trimmed = url.trim();
  const trailingPathSlash = trimmed.match(/^(https?:\/\/[^?#]*?)\/+([?#].*)?$/);
  return trailingPathSlash ? `${trailingPathSlash[1]}${trailingPathSlash[2] ?? ""}` : trimmed;
}

function extractMarkdownExternalUrls(markdown) {
  const source = stripFencedCodeBlocks(markdown);
  const urls = new Set();
  const linkPattern = /\[[^\]\r\n]*\]\(\s*<?(https?:\/\/[^)\s>]+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;
  for (const match of source.matchAll(linkPattern)) {
    urls.add(normalizeExternalUrl(match[1]));
  }
  return urls;
}

function extractReferenceSection(article) {
  const lines = article.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => /^## 参考资料[ \t]*$/.test(line));
  if (headingIndex < 0) return null;
  const section = [];
  let activeFence = null;
  for (const line of lines.slice(headingIndex + 1)) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      if (!activeFence) {
        activeFence = { character: marker[0], length: marker.length };
      } else if (marker[0] === activeFence.character && marker.length >= activeFence.length) {
        activeFence = null;
      }
      section.push(line);
      continue;
    }
    if (!activeFence && /^## [^\r\n]+/.test(line)) break;
    section.push(line);
  }
  return section.join("\n");
}

function collectLedgerRows(markdown) {
  const rowsByUrl = new Map();
  for (const line of stripFencedCodeBlocks(markdown).split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) continue;
    const cells = trimmed.slice(1, -1).split("|").map((cell) => cell.trim());
    if (cells.length < 4 || cells.some((cell) => !cell) || cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;
    for (const url of extractMarkdownExternalUrls(line)) {
      if (!rowsByUrl.has(url)) rowsByUrl.set(url, []);
      rowsByUrl.get(url).push({ cells, line });
    }
  }
  return rowsByUrl;
}

function readSourceLedger(path) {
  if (!existsSync(path)) {
    failures.push(`缺少 AI 来源台账 ${path}`);
    return { path, rowsByUrl: new Map() };
  }
  const source = readFileSync(path, "utf8");
  if (!/核验日[：:]\s*(?:\*\*)?20\d{2}-\d{2}-\d{2}/u.test(source)) {
    failures.push(`${path} 缺少 YYYY-MM-DD 核验日`);
  }
  if (!/检索截止[：:]\s*(?:\*\*)?20\d{2}-\d{2}-\d{2}/u.test(source)) {
    failures.push(`${path} 缺少 YYYY-MM-DD 检索截止日`);
  }
  if (!/(?:使用边界|外推边界|不能外推到哪里|边界)/u.test(source)) {
    failures.push(`${path} 缺少用途或外推边界字段`);
  }
  return { path, rowsByUrl: collectLedgerRows(source) };
}

function isAiLearningPage(filename) {
  return /^(?:\d{2}-.+|stage-\d+-review|summary)\.md$/.test(filename);
}

function referenceSectionHasBoundary(section) {
  return /(?:不能|不等于|不可|不替代|不代表|不负责|不证明|不构成|不得|仍需|只适用于|限于|边界|依赖|可能变化|尚未|未覆盖)/u.test(section);
}

function verifyAiReferenceParserContract() {
  const fixture = [
    "[source](https://example.invalid/reference/)",
    "```text",
    "[code example](https://example.invalid/code-only)",
    "```",
  ].join("\n");
  const urls = extractMarkdownExternalUrls(fixture);
  if (!urls.has("https://example.invalid/reference") || urls.has("https://example.invalid/code-only")) {
    failures.push("AI 参考资料解析器没有正确规范化尾斜杠或排除代码块 URL");
  }
  if (normalizeExternalUrl("https://example.invalid/spec/2026-07-28") === normalizeExternalUrl("https://example.invalid/spec/2025-11-25")) {
    failures.push("AI 参考资料解析器错误合并了不同版本 URL");
  }
  if (normalizeExternalUrl("https://example.invalid/path/?next=/") !== "https://example.invalid/path?next=/") {
    failures.push("AI 参考资料解析器在规范化路径尾斜杠时改变了查询参数");
  }
}

verifyAiReferenceParserContract();

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

for (const fieldEntry of readdirSync(docsRoot, { withFileTypes: true })) {
  if (!fieldEntry.isDirectory()) continue;
  const fieldDir = resolve(docsRoot, fieldEntry.name);
  for (const filename of readdirSync(fieldDir).filter((name) => /^\d{2}-.*\.md$/.test(name))) {
    const article = readFileSync(resolve(fieldDir, filename), "utf8");
    if (article.includes('class="draft-status"')) continue;
    referencedFormalCount += 1;
    for (const marker of ["<KnowledgeFlow", "## 🎯 随堂检验", "<Quiz", "## 参考资料", "<EvidenceTracker"]) {
      if (!article.includes(marker)) failures.push(`${fieldEntry.name}/${filename} 正式章缺少 ${marker}`);
    }
    const links = article.match(/https?:\/\//g)?.length ?? 0;
    if (links < 2) failures.push(`${fieldEntry.name}/${filename} 正式章至少需要两份可访问参考来源`);
  }
}

for (const fieldEntry of readdirSync(manualRoot, { withFileTypes: true })) {
  if (!fieldEntry.isDirectory()) continue;
  const field = fieldEntry.name;
  const ledgerPath = resolve("knowledge-base", "fields", field, "reading-evidence.json");
  const manualFiles = readdirSync(resolve(manualRoot, field)).filter((name) => name.endsWith(".md"));

  // Legacy hand-written pages may predate the source-ledger contract. They stay
  // drafts until migrated, rather than being counted as source-grounded.
  if (!existsSync(ledgerPath)) continue;

  const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
  const sources = new Map(ledger.sources.map((source) => [source.id, source]));
  const lessons = new Map(ledger.lessons.map((lesson) => [lesson.lesson, lesson]));

  for (const filename of manualFiles) {
    const lessonId = basename(filename, ".md");
    const lesson = lessons.get(lessonId);
    const article = readFileSync(resolve(manualRoot, field, filename), "utf8");
    if (!lesson) {
      failures.push(`${field}/${filename} 没有章节级 reading-evidence 记录`);
      continue;
    }
    if (!article.includes("## 参考资料")) failures.push(`${field}/${filename} 缺少正常的参考资料列表`);
    for (const phrase of ["原稿核验", "reading-evidence.json", "这些结论怎样从原稿", "原稿依据", "依据的是哪些原稿"]) {
      if (article.includes(phrase)) failures.push(`${field}/${filename} 把来源审计话术泄漏进了学习正文：${phrase}`);
    }
    if (article.includes('class="draft-status"')) failures.push(`${field}/${filename} 同时被标成正式章和草稿`);
    if (lesson.source_ids.length < 2) failures.push(`${field}/${filename} 至少需要两份实际阅读来源`);

    for (const sourceId of lesson.source_ids) {
      const source = sources.get(sourceId);
      if (!source) {
        failures.push(`${field}/${filename} 引用了账本中不存在的 ${sourceId}`);
        continue;
      }
      if (source.acquisition.state !== "cited") failures.push(`${sourceId} 尚未达到 cited 状态`);
      if (!source.read_scopes?.length) failures.push(`${sourceId} 没有实际阅读范围`);
      if (!article.includes(source.official_url)) failures.push(`${field}/${filename} 的参考资料未列出 ${sourceId}`);
      const artifactPath = resolve(source.acquisition.artifact.split("#")[0]);
      if (!existsSync(artifactPath)) {
        failures.push(`${sourceId} 的本地原稿/抽取物不存在：${artifactPath}`);
      } else if (hashFile(artifactPath) !== source.acquisition.sha256) {
        failures.push(`${sourceId} 的原稿/抽取物哈希不一致`);
      }
    }
    formalCount += 1;
  }
}

const ledgers = new Map([
  [aiSourceLedgerPath, readSourceLedger(aiSourceLedgerPath)],
  [frontierSourceLedgerPath, readSourceLedger(frontierSourceLedgerPath)],
]);

for (const group of aiLearningGroups) {
  if (!existsSync(group.directory)) {
    failures.push(`缺少 AI 学习目录 ${group.directory}`);
    continue;
  }
  const pages = readdirSync(group.directory)
    .filter(isAiLearningPage)
    .sort();
  for (const filename of pages) {
    const pagePath = resolve(group.directory, filename);
    const article = readFileSync(pagePath, "utf8");
    const referenceSection = extractReferenceSection(article);
    aiLearningPageCount += 1;
    if (referenceSection === null) {
      failures.push(`${group.label}/${filename} 缺少二级标题“参考资料”`);
      continue;
    }
    const urls = extractMarkdownExternalUrls(referenceSection);
    aiReferenceOccurrenceCount += urls.size;
    for (const url of urls) aiUniqueReferenceUrls.add(url);
    if (urls.size < 2) {
      failures.push(`${group.label}/${filename} 的参考资料区至少需要两个不同的 Markdown 外链，实际 ${urls.size}`);
    }
    if (!referenceSectionHasBoundary(referenceSection)) {
      failures.push(`${group.label}/${filename} 的参考资料区缺少用途或外推边界说明`);
    }
    for (const url of urls) {
      const ledgerEntries = group.ledgerPaths.flatMap((path) => ledgers.get(path)?.rowsByUrl.get(url) ?? []);
      if (!ledgerEntries.length) {
        const allowedLedgers = group.ledgerPaths.map((path) => relative(".", path).replaceAll("\\", "/")).join(" 或 ");
        failures.push(`${group.label}/${filename} 的引用未进入允许的来源台账：${url}（应在 ${allowedLedgers}）`);
      }
    }
  }
}

if (failures.length) {
  console.error(`来源契约检查失败:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`来源契约检查通过：${formalCount} 篇领域正式章完成阅读账本与本地工件哈希核验；${referencedFormalCount} 篇领域正式章完成参考资料结构检查。`);
console.log(`AI 学习页目录交叉校验通过：${aiLearningPageCount} 篇页面，${aiReferenceOccurrenceCount} 条页面内去重引用，${aiUniqueReferenceUrls.size} 个全局去重 URL。`);
console.log("本检查只验证本地参考资料区、来源台账和本地工件的一致性；未执行网络可达性或来源真实性核验。");
