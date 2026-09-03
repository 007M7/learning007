import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fields } from "./field-config.mjs";
import { fieldsDir, knowledgeBaseDir, readJson } from "./utils.mjs";

const errors = [];

const publicCatalogDir = path.resolve("docs/public/data/knowledge-base");
const catalogTypes = new Set(["book", "paper"]);
const catalogLevels = new Set(["starter", "core", "advanced"]);
const catalogAccess = new Set(["open"]);
const legacyOpenBookHosts = new Set(["incompleteideas.net"]);
const forbiddenCatalogKeys = new Set(["official_url", "download_url", "local_path", "artifact", "sha256", "bytes", "raw_content"]);

function countCjkCharacters(value) {
  return (value.match(/[\u3400-\u9fff]/g) ?? []).length;
}

function findForbiddenKeys(value, location, found = []) {
  if (!value || typeof value !== "object") return found;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenCatalogKeys.has(key)) found.push(`${location}.${key}`);
    findForbiddenKeys(child, `${location}.${key}`, found);
  }
  return found;
}

try {
  const catalogFiles = (await readdir(publicCatalogDir)).filter((name) => name.endsWith(".json"));
  for (const filename of catalogFiles) {
    const catalog = await readJson(path.join(publicCatalogDir, filename), null);
    const label = `public-catalog/${filename}`;
    if (!catalog?.field || !catalog?.title || !catalog?.updated_at) errors.push(`${label}: missing catalog identity`);
    if (!Array.isArray(catalog?.modules) || !catalog.modules.length) errors.push(`${label}: modules are missing`);
    if (!Array.isArray(catalog?.resources) || !catalog.resources.length) errors.push(`${label}: resources are missing`);

    const moduleIds = new Set();
    for (const module of catalog?.modules ?? []) {
      if (!module.id || !module.name || !module.goal) errors.push(`${label}: incomplete module ${module.id || "unknown"}`);
      if (moduleIds.has(module.id)) errors.push(`${label}: duplicate module ${module.id}`);
      moduleIds.add(module.id);
    }

    const resourceIds = new Set();
    for (const resource of catalog?.resources ?? []) {
      const id = resource.id || resource.title || "unknown";
      if (!resource.id || !resource.title || !resource.creator || !resource.year || !resource.role) {
        errors.push(`${label}: incomplete resource ${id}`);
      }
      if (resourceIds.has(resource.id)) errors.push(`${label}: duplicate resource ${resource.id}`);
      resourceIds.add(resource.id);
      if (!catalogTypes.has(resource.type)) errors.push(`${label}: invalid type for ${id}`);
      if (!catalogLevels.has(resource.level)) errors.push(`${label}: invalid level for ${id}`);
      if (!catalogAccess.has(resource.access)) errors.push(`${label}: invalid access for ${id}`);
      const isHttps = resource.content_url?.startsWith("https://");
      const isApprovedLegacyBook = resource.type === "book" && resource.content_url?.startsWith("http://") && legacyOpenBookHosts.has(new URL(resource.content_url).hostname);
      if (!isHttps && !isApprovedLegacyBook) errors.push(`${label}: unsupported content URL for ${id}`);
      if (resource.type === "paper" && !/(arxiv\.org\/pdf\/|\.pdf(?:$|[?#]))/i.test(resource.content_url ?? "")) {
        errors.push(`${label}: paper URL is not direct full text for ${id}`);
      }
      if (resource.verification?.status !== "fulltext-url-verified" || !resource.verification?.checked_at) {
        errors.push(`${label}: full-text URL not verified for ${id}`);
      }
      if (resource.type === "book" && ["machine-learning", "ai-product", "software", "ai-agent"].includes(catalog.field)) {
        if (!resource.review_url?.startsWith("/knowledge-base/reviews/")) {
          if (!["ai-product", "ai-agent"].includes(catalog.field) || resource.review_status !== "pending-full-review") {
            errors.push(`${label}: missing review URL for ${id}`);
          }
        } else {
          try {
            const reviewPath = path.resolve("docs", `${resource.review_url.replace(/^\/+/, "")}.md`);
            const review = await readFile(reviewPath, "utf8");
            if (review.length < 5000) errors.push(`${label}: review ${resource.review_url} has ${review.length} chars (< 5000)`);
            const isNativeAiAgentReview = resource.review_url.startsWith("/knowledge-base/reviews/ai-agent/");
            if ((catalog.field === "ai-product" || (catalog.field === "ai-agent" && isNativeAiAgentReview)) && countCjkCharacters(review) < 5000) {
              errors.push(`${label}: review ${resource.review_url} has ${countCjkCharacters(review)} CJK chars (< 5000)`);
            }
            if (["ai-product", "software", "ai-agent"].includes(catalog.field) && !review.includes("review-status: formal")) {
              errors.push(`${label}: review ${resource.review_url} is not marked formal`);
            }
          } catch {
            errors.push(`${label}: missing review page ${resource.review_url}`);
          }
        }
      }
      for (const moduleId of resource.modules ?? []) {
        if (!moduleIds.has(moduleId)) errors.push(`${label}: unknown module ${moduleId} on ${id}`);
      }
    }

    for (const forbidden of findForbiddenKeys(catalog, label)) errors.push(`${forbidden}: catalog must remain URL-only`);

    if (catalog.field === "machine-learning") {
      const count = (type) => catalog.resources.filter((resource) => resource.type === type).length;
      if (count("book") < 10) errors.push(`${label}: machine-learning books ${count("book")} < 10`);
      if (catalog.resources.some((resource) => resource.type !== "book" && resource.type !== "paper")) {
        errors.push(`${label}: machine-learning catalog may contain only books and papers`);
      }
      if (count("paper") < 100) errors.push(`${label}: machine-learning papers ${count("paper")} < 100`);
    }
    if (catalog.field === "ai-product") {
      const count = (type) => catalog.resources.filter((resource) => resource.type === type).length;
      if (count("book") < 10) errors.push(`${label}: ai-product books/handbooks ${count("book")} < 10`);
      if (count("paper") < 100) errors.push(`${label}: ai-product papers ${count("paper")} < 100`);
      const unpublished = catalog.resources.filter((resource) => resource.type === "book" && resource.review_status !== "published");
      if (unpublished.length) errors.push(`${label}: ${unpublished.length} AI-product book reviews are not published`);
    }
    if (catalog.field === "software") {
      const count = (type) => catalog.resources.filter((resource) => resource.type === type).length;
      if (count("book") < 15) errors.push(`${label}: software books/handbooks ${count("book")} < 15`);
      if (count("paper") < 150) errors.push(`${label}: software papers ${count("paper")} < 150`);
    }
    if (catalog.field === "quality") {
      const count = (type) => catalog.resources.filter((resource) => resource.type === type).length;
      if (count("book") < 30) errors.push(`${label}: quality books/handbooks ${count("book")} < 30`);
      if (count("paper") < 240) errors.push(`${label}: quality papers ${count("paper")} < 240`);
      if (catalog.modules.length !== 12) errors.push(`${label}: quality modules ${catalog.modules.length} !== 12`);
      const nodeIds = new Set(catalog.modules.flatMap((module) => module.node_ids ?? []));
      if (nodeIds.size !== 34) errors.push(`${label}: quality node coverage ${nodeIds.size} !== 34`);
      for (const module of catalog.modules) {
        const coverage = catalog.resources.filter((resource) => resource.type === "paper" && resource.modules?.includes(module.id)).length;
        if (coverage < 20) errors.push(`${label}: quality module ${module.id} has only ${coverage} papers (< 20)`);
      }
    }
    if (catalog.field === "ai-agent") {
      const count = (type) => catalog.resources.filter((resource) => resource.type === type).length;
      const papers = catalog.resources.filter((resource) => resource.type === "paper");
      const books = catalog.resources.filter((resource) => resource.type === "book");
      if (count("book") < 35) errors.push(`${label}: ai-agent books/monographs ${count("book")} < 35`);
      if (count("paper") < 300) errors.push(`${label}: ai-agent papers ${count("paper")} < 300`);
      if (catalog.modules.length < 15) errors.push(`${label}: ai-agent modules ${catalog.modules.length} < 15`);
      if (catalog.resources.some((resource) => !["current", "recent", "foundation"].includes(resource.freshness))) {
        errors.push(`${label}: ai-agent resources must declare freshness`);
      }
      const currentOrRecentBooks = books.filter((book) => ["current", "recent"].includes(book.freshness)).length;
      if (currentOrRecentBooks < 15) errors.push(`${label}: only ${currentOrRecentBooks} current/recent books (< 15)`);
      const publishedReviews = books.filter((book) => book.review_status === "published");
      if (publishedReviews.length !== books.length) {
        errors.push(`${label}: ${books.length - publishedReviews.length} AI-agent book reviews are not published`);
      }
      const papersSince2023 = papers.filter((paper) => Number(paper.year) >= 2023).length;
      const papersSince2025 = papers.filter((paper) => Number(paper.year) >= 2025).length;
      if (papersSince2023 < 270) errors.push(`${label}: only ${papersSince2023} papers since 2023 (< 270)`);
      if (papersSince2025 < 130) errors.push(`${label}: only ${papersSince2025} papers since 2025 (< 130)`);
      const nonAnchorOldPapers = papers.filter((paper) => Number(paper.year) < 2023 && paper.source_query !== "curated anchor list");
      if (nonAnchorOldPapers.length) errors.push(`${label}: ${nonAnchorOldPapers.length} pre-2023 papers are not curated foundations`);
      const frontierModules = new Set(catalog.modules.filter((module) => module.stage === "frontier").map((module) => module.id));
      const frontierPapers = papers.filter((paper) => paper.modules?.some((moduleId) => frontierModules.has(moduleId)));
      const currentFrontier = frontierPapers.filter((paper) => Number(paper.year) >= 2025).length;
      if (!frontierPapers.length || currentFrontier / frontierPapers.length < 0.6) {
        errors.push(`${label}: frontier papers since 2025 are ${currentFrontier}/${frontierPapers.length} (< 60%)`);
      }
      for (const module of catalog.modules) {
        const coverage = catalog.resources.filter((resource) => resource.type === "paper" && resource.modules?.includes(module.id)).length;
        if (coverage < 15) errors.push(`${label}: ai-agent module ${module.id} has only ${coverage} papers (< 15)`);
      }
    }
    console.log(`${label}: ${catalog.resources.length} verified official URLs across ${moduleIds.size} modules`);
  }
} catch (error) {
  errors.push(`public catalogs: ${error.message}`);
}

for (const [field, config] of Object.entries(fields)) {
  const books = await readJson(path.join(fieldsDir, field, "books.json"), { records: [] });
  const papers = await readJson(path.join(fieldsDir, field, "papers.json"), { records: [] });
  if (books.records.length < 10) errors.push(`${field}: books ${books.records.length} < 10`);
  if (papers.records.length < 100) errors.push(`${field}: papers ${papers.records.length} < 100`);
  for (const [kind, records] of [["books", books.records], ["papers", papers.records]]) {
    const ids = new Set();
    for (const record of records) {
      if (!record.id || !record.title || !record.authors?.length || !record.year || !record.official_url) {
        errors.push(`${field}/${kind}: incomplete record ${record.id || record.title || "unknown"}`);
      }
      if (ids.has(record.id)) errors.push(`${field}/${kind}: duplicate ${record.id}`);
      ids.add(record.id);
    }
  }
  const expectedTopics = new Set(config.paperQueries.map(([topic]) => topic));
  const coveredTopics = new Set(papers.records.flatMap((record) => record.topics ?? []));
  const missingTopics = [...expectedTopics].filter((topic) => !coveredTopics.has(topic));
  if (missingTopics.length) errors.push(`${field}: missing paper topics ${missingTopics.join(", ")}`);
  for (const topic of expectedTopics) {
    const count = papers.records.filter((record) => record.topics?.includes(topic)).length;
    const topicMinimum = field === "ai-agent" ? 15 : 6;
    if (count < topicMinimum) errors.push(`${field}: topic ${topic} has only ${count} papers (< ${topicMinimum})`);
  }
  for (const book of books.records.filter((record) => record.access?.status === "downloaded" && record.access?.local_path)) {
    try {
      await access(path.join(knowledgeBaseDir, book.access.local_path));
      if (!book.access.sha256 || !book.access.bytes) errors.push(`${field}: downloaded book lacks hash/size ${book.id}`);
    } catch {
      errors.push(`${field}: missing cached file ${book.access.local_path}`);
    }
  }
  console.log(`${field}: ${books.records.length} books, ${papers.records.length} papers, ${coveredTopics.size}/${expectedTopics.size} topics`);
}

if (errors.length) {
  console.error("\nKnowledge-base validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("\nKnowledge-base validation passed.");
