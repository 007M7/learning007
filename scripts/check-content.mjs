import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("docs");
const chapters = {
  software: ["01-programming", "02-runtime", "03-web-api", "04-data", "05-design", "06-architecture"],
  quality: ["01-strategy", "02-testing", "03-build", "04-delivery", "05-operations", "06-production"],
  ai: ["01-models", "02-context", "03-rag", "04-tools-mcp", "05-agent-runtime", "06-evals-safety"],
};
const required = ["本章可观察目标", "练习", "常见误区", "本章完成标准", "<EvidenceTracker", "source-note"];
const failures = [];

for (const [domain, pages] of Object.entries(chapters)) {
  for (const page of pages) {
    const file = resolve(root, "domains", domain, `${page}.md`);
    if (!existsSync(file)) { failures.push(`缺少章节 ${file}`); continue; }
    const source = readFileSync(file, "utf8");
    for (const marker of required) if (!source.includes(marker)) failures.push(`${domain}/${page} 缺少 ${marker}`);
  }
}

for (let index = 1; index <= 6; index += 1) {
  const prefix = String(index).padStart(2, "0");
  const found = ["task-board", "task-runner", "rag-assistant", "tool-agent", "code-review", "learning-system"]
    .some((name) => existsSync(resolve(root, "cases", `${prefix}-${name}.md`)));
  if (!found) failures.push(`缺少案例 ${prefix}`);
}

const curriculum = readFileSync(resolve(root, ".vitepress", "curriculum.ts"), "utf8");
for (const [prefix, expected] of [["SW", 16], ["Q", 16], ["AI", 19]]) {
  const ids = new Set([...curriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 节点应为 ${expected}，实际 ${ids.size}`);
}

if (failures.length) {
  console.error(`内容契约失败:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("内容契约通过：18 章、51 节点、6 个案例。Q 表示质量节点，不与章节数重复统计。" );
