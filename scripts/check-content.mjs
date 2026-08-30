import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("docs");
const core = {
  software: ["01-programming", "02-runtime", "03-web-api", "04-data", "05-design", "06-architecture"],
  quality: ["01-strategy", "02-testing", "03-build", "04-delivery", "05-operations", "06-production"],
  ai: ["01-models", "02-context", "03-rag", "04-tools-mcp", "05-agent-runtime", "06-evals-safety"],
};
const advanced = {
  software: ["01-performance", "02-runtime-compiler", "03-kernel-ebpf", "04-distributed-consensus", "05-storage-streaming", "06-architecture-evolution"],
  quality: ["01-kubernetes-core", "02-kubernetes-operations", "03-iac-gitops", "04-performance-capacity", "05-chaos-sre", "06-platform-resilience"],
  ai: ["01-math-optimization", "02-transformer-training", "03-finetuning", "04-inference", "05-advanced-rag", "06-multi-agent"],
};
const frontierAgents = [
  "01-paradigm", "02-reasoning-planning", "03-tools-protocols", "04-memory-context", "05-computer-use",
  "06-coding-agents", "07-research-multi-agent", "08-agent-learning", "09-evaluation", "10-safety-governance",
];
const commonRequired = [
  "本章可观察目标", "会死在哪里", "与 AI 协作", "练习", "常见误区",
  "本章小结", "本章完成标准", "<EvidenceTracker", "source-note", "```mermaid",
];
const failures = [];

function checkChapter(kind, domain, page) {
  const file = kind === "frontier"
    ? resolve(root, "frontier", "agents", `${page}.md`)
    : resolve(root, kind === "core" ? "domains" : "advanced", domain, `${page}.md`);
  if (!existsSync(file)) {
    failures.push(`缺少章节 ${file}`);
    return;
  }
  const source = readFileSync(file, "utf8");
  const relative = `${kind}/${domain}/${page}`;
  for (const marker of commonRequired) {
    if (!source.includes(marker)) failures.push(`${relative} 缺少 ${marker}`);
  }
  if ((kind === "advanced" || kind === "frontier") && !source.includes("解锁与跳过")) failures.push(`${relative} 缺少解锁与跳过`);
  if (!source.includes("贯穿")) failures.push(`${relative} 缺少贯穿案例/故障`);

  if (kind === "frontier") {
    for (const marker of ["研究问题", "核心机制", "关键公式", "实验与指标", "真正贡献", "局限", "复现任务", "对产品架构的影响"]) {
      if (!source.includes(marker)) failures.push(`${relative} 论文拆解缺少 ${marker}`);
    }
  }

  const h2Count = (source.match(/^## /gm) ?? []).length;
  const minChars = kind === "core" ? 3200 : kind === "frontier" ? 4700 : 2700;
  const minH2 = kind === "frontier" ? 16 : kind === "core" ? 10 : 12;
  if (source.length < minChars) failures.push(`${relative} 正文过薄：${source.length} < ${minChars} 字符预警线`);
  if (h2Count < minH2) failures.push(`${relative} 推理链不足：${h2Count} < ${minH2} 个二级部分`);
}

for (const [domain, pages] of Object.entries(core)) for (const page of pages) checkChapter("core", domain, page);
for (const [domain, pages] of Object.entries(advanced)) for (const page of pages) checkChapter("advanced", domain, page);
for (const page of frontierAgents) checkChapter("frontier", "agents", page);

for (let index = 1; index <= 6; index += 1) {
  const prefix = String(index).padStart(2, "0");
  const found = ["task-board", "task-runner", "rag-assistant", "tool-agent", "code-review", "learning-system"]
    .some((name) => existsSync(resolve(root, "cases", `${prefix}-${name}.md`)));
  if (!found) failures.push(`缺少案例 ${prefix}`);
}

const coreCurriculum = readFileSync(resolve(root, ".vitepress", "curriculum.ts"), "utf8");
for (const [prefix, expected] of [["SW", 16], ["Q", 16], ["AI", 19]]) {
  const ids = new Set([...coreCurriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 核心节点应为 ${expected}，实际 ${ids.size}`);
}

const advancedCurriculum = readFileSync(resolve(root, ".vitepress", "advanced-curriculum.ts"), "utf8");
for (const [prefix, expected] of [["ASW", 18], ["AQ", 18], ["AAI", 18]]) {
  const ids = new Set([...advancedCurriculum.matchAll(new RegExp(`"(${prefix}\\d{2})"`, "g"))].map((match) => match[1]));
  if (ids.size !== expected) failures.push(`${prefix} 进阶节点应为 ${expected}，实际 ${ids.size}`);
}

const frontierCurriculum = readFileSync(resolve(root, ".vitepress", "agent-frontier.ts"), "utf8");
const frontierIds = new Set([...frontierCurriculum.matchAll(/"(AGF\d{2})"/g)].map((match) => match[1]));
if (frontierIds.size !== 30) failures.push(`AGF 强化节点应为 30，实际 ${frontierIds.size}`);
const frontierEvidence = readFileSync(resolve(root, "frontier", "agents", "evidence.md"), "utf8");
for (const marker of ["2026-08-30", "2023-08-31", "AgentJudgeBench", "2608.26623", "冲突证据", "更新触发器"]) {
  if (!frontierEvidence.includes(marker)) failures.push(`Agent 前沿证据库缺少 ${marker}`);
}

if (failures.length) {
  console.error(`内容契约失败:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("内容契约通过：18 个核心章 / 51 节点，18 个进阶章 / 54 节点，10 个 Agent 前沿章 / 30 节点，6 个案例；每章均含机制图、贯穿案例、失败边界、实战与掌握证据。" );
