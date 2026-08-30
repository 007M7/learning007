import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const docsRoot = resolve("docs");
const failures = [];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() && !entry.name.startsWith(".vitepress")
      ? walk(path)
      : entry.isFile() && extname(entry.name) === ".md" ? [path] : [];
  });
}

function targetExists(raw) {
  const clean = raw.split("#")[0].split("?")[0];
  if (!clean || !clean.startsWith("/") || clean.startsWith("//")) return true;
  const relative = decodeURIComponent(clean).replace(/^\//, "");
  const candidates = clean.endsWith("/")
    ? [join(docsRoot, relative, "index.md")]
    : [join(docsRoot, relative), join(docsRoot, `${relative}.md`), join(docsRoot, relative, "index.md")];
  return candidates.some(existsSync);
}

for (const file of walk(docsRoot)) {
  const source = readFileSync(file, "utf8");
  const links = [
    ...source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g),
    ...source.matchAll(/(?:href|link)=["']([^"']+)["']/g),
  ].map((match) => match[1].trim().replace(/^<|>$/g, ""));
  for (const link of links) {
    if (!targetExists(link)) failures.push(`${file.replace(docsRoot, "docs")} -> ${link}`);
  }
}

if (failures.length) {
  console.error(`发现 ${failures.length} 个失效内部链接:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("内部链接检查通过。");
