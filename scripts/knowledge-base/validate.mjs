import { access } from "node:fs/promises";
import path from "node:path";
import { fields } from "./field-config.mjs";
import { fieldsDir, knowledgeBaseDir, readJson } from "./utils.mjs";

const errors = [];

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
  for (const book of books.records.filter((record) => record.access?.local_path)) {
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
