import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, resolve } from "node:path";

const manualRoot = resolve("scripts", "field-content", "manual");
const docsRoot = resolve("docs", "fields");
const failures = [];
let formalCount = 0;
let referencedFormalCount = 0;

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

if (failures.length) {
  console.error(`来源真实性检查失败:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`来源真实性检查通过：${formalCount} 篇通过原稿阅读账本与本地工件核验；${referencedFormalCount} 篇正式章通过参考资料与结构核验。`);
