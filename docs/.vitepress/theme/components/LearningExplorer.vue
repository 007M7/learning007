<script setup lang="ts">
import { computed, ref } from "vue";
import { withBase } from "vitepress";

type Level = "core" | "project" | "advanced";
interface Card { title: string; icon: string; level: Level; description: string; link: string }

const cards: Card[] = [
  { title: "软件与系统工程 · 16 节点", icon: "◫", level: "core", description: "程序怎样运行，数据怎样流动，业务怎样变成可靠的软件。", link: "/domains/software/" },
  { title: "质量与生产交付 · 16 节点", icon: "✓", level: "core", description: "怎样证明系统正确，并让它能够构建、发布、观察与恢复。", link: "/domains/quality/" },
  { title: "AI 应用与 Agent · 19 节点", icon: "✦", level: "core", description: "理解模型边界，并构建有证据、有工具权限和评测门禁的 AI 系统。", link: "/domains/ai/" },
  { title: "软件项目路线", icon: "→", level: "project", description: "把语言、网络、数据库和后端知识放进同一个纵向切片。", link: "/domains/software/roadmap" },
  { title: "交付项目路线", icon: "↻", level: "project", description: "围绕真实服务补齐测试、容器、流水线、日志与恢复。", link: "/domains/quality/roadmap" },
  { title: "Agent 项目路线", icon: "◎", level: "project", description: "从结构化输出到 RAG、工具调用、状态恢复和评测。", link: "/domains/ai/roadmap" },
  { title: "软件进阶 · 18 节点", icon: "△", level: "advanced", description: "性能、运行时、内核、共识、数据流与服务架构演进。", link: "/advanced/software/" },
  { title: "交付进阶 · 18 节点", icon: "◇", level: "advanced", description: "Kubernetes、IaC、容量、Chaos、容灾与平台工程。", link: "/advanced/quality/" },
  { title: "AI 进阶 · 18 节点", icon: "✧", level: "advanced", description: "数学、训练、微调、推理系统、GraphRAG 与多 Agent。", link: "/advanced/ai/" },
];
const filters = [
  { key: "all", label: "全部" }, { key: "core", label: "必修核心" },
  { key: "project", label: "项目路线" }, { key: "advanced", label: "可选进阶" },
] as const;
const selected = ref<(typeof filters)[number]["key"]>("all");
const visible = computed(() => selected.value === "all" ? cards : cards.filter((card) => card.level === selected.value));
const labels: Record<Level, string> = { core: "必修", project: "项目", advanced: "进阶" };
</script>

<template>
  <section class="explorer" aria-labelledby="learning-map-title">
    <div class="explorer-heading">
      <div><p class="eyebrow">VISUAL LEARNING MAP</p><h2 id="learning-map-title">从三张地图开始，而不是被完整清单压倒</h2></div>
      <div class="filters" aria-label="筛选学习内容">
        <button v-for="filter in filters" :key="filter.key" type="button" :class="['filter', selected === filter.key && 'active']" @click="selected = filter.key">{{ filter.label }}</button>
      </div>
    </div>
    <div class="grid">
      <a v-for="card in visible" :key="card.title" :href="withBase(card.link)" class="card">
        <div class="card-top"><span class="icon" aria-hidden="true">{{ card.icon }}</span><span :class="['badge', card.level]">{{ labels[card.level] }}</span></div>
        <h3>{{ card.title }}</h3><p>{{ card.description }}</p><span class="open">打开地图 <span aria-hidden="true">→</span></span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.explorer { max-width: 1152px; margin: 24px auto 0; padding: 28px 24px 64px; }
.explorer-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
.eyebrow { margin: 0 0 8px; color: var(--vp-c-brand-1); font-size: 12px; font-weight: 750; letter-spacing: .16em; }
h2 { margin: 0; border: 0; padding: 0; font-size: clamp(24px, 4vw, 34px); letter-spacing: -.025em; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; }
.filter { border: 1px solid var(--vp-c-divider); border-radius: 999px; padding: 7px 14px; color: var(--vp-c-text-2); background: var(--vp-c-bg); cursor: pointer; }
.filter:hover, .filter.active { color: #fff; border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-1); }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.card { min-height: 210px; display: flex; flex-direction: column; padding: 20px; color: inherit; text-decoration: none; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg)); transition: .2s ease; }
.card:hover { transform: translateY(-4px); border-color: var(--vp-c-brand-1); box-shadow: 0 14px 32px rgba(24, 54, 52, .10); }
.card-top { display: flex; align-items: center; justify-content: space-between; }
.icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px; color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); font-size: 22px; }
.badge { border-radius: 999px; padding: 3px 9px; font-size: 11px; font-weight: 700; }
.badge.core { color: #256f68; background: rgba(37,111,104,.12); }.badge.project { color: #9a5b00; background: rgba(178,105,0,.12); }.badge.advanced { color: #625bb4; background: rgba(107,102,200,.12); }
h3 { margin: 22px 0 8px; font-size: 18px; }.card p { margin: 0; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.65; }.open { margin-top: auto; padding-top: 18px; color: var(--vp-c-brand-1); font-size: 13px; font-weight: 700; }
@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.explorer-heading { align-items: flex-start; flex-direction: column; }.filters { justify-content: flex-start; } }
@media (max-width: 620px) { .grid { grid-template-columns: 1fr; }.card { min-height: 190px; } }
</style>
