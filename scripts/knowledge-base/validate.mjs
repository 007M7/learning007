import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { fields } from "./field-config.mjs";
import { fieldsDir, knowledgeBaseDir, readJson } from "./utils.mjs";

const errors = [];

const publicCatalogDir = path.resolve("docs/public/data/knowledge-base");
const catalogTypes = new Set(["book", "paper"]);
const catalogLevels = new Set(["starter", "core", "advanced"]);
const catalogAccess = new Set(["open"]);
const forbiddenCatalogKeys = new Set(["official_url", "download_url", "local_path", "artifact", "sha256", "bytes", "raw_content"]);

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
      if (!resource.content_url?.startsWith("https://")) errors.push(`${label}: non-HTTPS content URL for ${id}`);
      if (resource.type === "paper" && !/(arxiv\.org\/pdf\/|\.pdf(?:$|[?#]))/i.test(resource.content_url ?? "")) {
        errors.push(`${label}: paper URL is not direct full text for ${id}`);
      }
      if (resource.verification?.status !== "fulltext-url-verified" || !resource.verification?.checked_at) {
        errors.push(`${label}: full-text URL not verified for ${id}`);
      }
      if (resource.type === "book") {
        if (!resource.review_url?.startsWith("/knowledge-base/reviews/")) {
          errors.push(`${label}: missing review URL for ${id}`);
        } else {
          try {
            await access(path.resolve("docs", `${resource.review_url.replace(/^\/+/, "")}.md`));
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
    if (count < 6) errors.push(`${field}: topic ${topic} has only ${count} papers (< 6)`);
  }
  for (const book of books.records.filter((record) => record.access?.status === "downloaded" && record.access?.local_path)) {
    try {
      await access(path.join(knowledgeBaseDir, book.access.local_path));
      if (!book.access.sha256 || !book.access.bytes) errors.push(`${field}: downloaded book lacks hash/size ${book.id}`);
    } catch {
      errors.push(`${field}: missing cached file ${book.access.local_path}`);
    }
  }
  console.log(`${field}: ${books.records.length} books, ${papers.records.length} papers, ${coveredTopics.size}/10 topics`);
}

if (errors.length) {
  console.error("\nKnowledge-base validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("\nKnowledge-base validation passed.");
