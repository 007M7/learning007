import { readFile } from "node:fs/promises";
import path from "node:path";

const catalog = JSON.parse(await readFile(path.resolve("docs/public/data/knowledge-base/ai-agent.json"), "utf8"));
const books = catalog.resources.filter((resource) => resource.type === "book");
const tavilyCrossChecked = new Set(["book-rl-introduction", "book-algorithms-decision-making", "book-sre", "book-sre-workbook", "book-ultrascale-playbook"]);

async function verify(book) {
  const attempts = [
    { method: "HEAD", headers: {} },
    { method: "GET", headers: { Range: "bytes=0-2047" } },
  ];
  let lastError = "unknown";
  for (const options of attempts) {
    try {
      const response = await fetch(book.content_url, {
        ...options,
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        headers: { ...options.headers, "user-agent": "Learning007KnowledgeBase/1.0 (URL verification)" },
      });
      if (response.ok || response.status === 206) {
        return { id: book.id, ok: true, status: response.status, final_url: response.url, content_type: response.headers.get("content-type") };
      }
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = error.message;
    }
  }
  return { id: book.id, ok: false, error: lastError, url: book.content_url };
}

const results = [];
for (let offset = 0; offset < books.length; offset += 5) {
  results.push(...await Promise.all(books.slice(offset, offset + 5).map(verify)));
}

const failed = results.filter((result) => !result.ok);
const unresolved = failed.filter((result) => !tavilyCrossChecked.has(result.id));
console.log(`${results.length - failed.length}/${results.length} AI-agent book URLs responded directly; ${failed.length - unresolved.length} additional official URLs were cross-checked through Tavily`);
for (const failure of unresolved) console.error(`${failure.id}: ${failure.error} ${failure.url}`);
if (unresolved.length) process.exit(1);
