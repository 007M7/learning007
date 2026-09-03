import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const catalogPath = path.resolve("docs/public/data/knowledge-base/software.json");
const sourcePapersPath = path.resolve("knowledge-base/fields/software/papers.json");
const auditPath = path.resolve("knowledge-base/fields/software/url-verification.json");
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const papers = catalog.resources.filter((resource) => resource.type === "paper");

async function verify(paper) {
  try {
    const response = await fetch(paper.content_url, {
      headers: { range: "bytes=0-2047", "user-agent": "Learning007/1.0 source verifier" },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    const contentType = response.headers.get("content-type") ?? "";
    const ok = response.ok && (/pdf|octet-stream/i.test(contentType) || /\.pdf(?:$|[?#])/i.test(response.url));
    await response.body?.cancel();
    return { id: paper.id, url: paper.content_url, final_url: response.url, status: response.status, content_type: contentType, ok };
  } catch (error) {
    return { id: paper.id, url: paper.content_url, status: null, content_type: null, ok: false, error: error.name };
  }
}

const results = [];
for (let index = 0; index < papers.length; index += 16) {
  results.push(...await Promise.all(papers.slice(index, index + 16).map(verify)));
}
const validIds = new Set(results.filter((result) => result.ok).map((result) => result.id));
if (validIds.size < 150) {
  await writeFile(auditPath, `${JSON.stringify({ checked_at: "2026-09-02", total: papers.length, valid: validIds.size, invalid: papers.length - validIds.size, results }, null, 2)}\n`, "utf8");
  throw new Error(`Only ${validIds.size} paper URLs passed direct-fulltext verification; catalog was not changed`);
}

catalog.resources = catalog.resources.filter((resource) => resource.type !== "paper" || validIds.has(resource.id));
for (const resource of catalog.resources) {
  if (resource.type === "paper") resource.verification = { status: "fulltext-url-verified", method: "http-range-content-check", checked_at: "2026-09-02" };
}
const sourcePapers = JSON.parse(await readFile(sourcePapersPath, "utf8"));
sourcePapers.records = sourcePapers.records.filter((record) => validIds.has(`paper-${record.id.split(":").at(-1)}`));
await Promise.all([
  writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8"),
  writeFile(sourcePapersPath, `${JSON.stringify(sourcePapers, null, 2)}\n`, "utf8"),
  writeFile(auditPath, `${JSON.stringify({ checked_at: "2026-09-02", total: papers.length, valid: validIds.size, invalid: papers.length - validIds.size, results }, null, 2)}\n`, "utf8"),
]);
console.log(`software paper URLs: ${validIds.size}/${papers.length} verified direct full text`);
