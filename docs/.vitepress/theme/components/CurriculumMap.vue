<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { domains } from "../../curriculum";

const props = defineProps<{ domain: "software" | "quality" | "ai" }>();
const current = computed(() => domains.find((item) => item.key === props.domain)!);
</script>

<template>
  <section class="curriculum-map" :aria-label="`${current.title}知识地图`">
    <header>
      <div><span>KNOWLEDGE MAP</span><h2>{{ current.title }}</h2></div>
      <strong>{{ current.count }} 个节点</strong>
    </header>
    <div class="map-flow">
      <a v-for="(chapter, index) in current.chapters" :key="chapter.link" :href="withBase(chapter.link)" class="map-node">
        <span class="number">{{ String(index + 1).padStart(2, "0") }}</span>
        <div><b>{{ chapter.text.replace(/^\d+ · /, "") }}</b><small>{{ chapter.ids.join(" · ") }}</small></div>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>
    <p class="caption">箭头表示推荐顺序，不代表必须一次学完。项目遇到阻塞时，可沿节点编号回补前置。</p>
  </section>
</template>

<style scoped>
.curriculum-map{margin:28px 0;padding:22px;border:1px solid var(--vp-c-divider);border-radius:18px;background:linear-gradient(145deg,var(--vp-c-bg-soft),var(--vp-c-bg))}.curriculum-map header{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:18px}.curriculum-map header span{display:block;color:var(--vp-c-brand-1);font-size:11px;font-weight:800;letter-spacing:.16em}.curriculum-map h2{margin:4px 0 0;padding:0;border:0;font-size:24px}.curriculum-map header strong{color:var(--vp-c-text-2);font-size:13px}.map-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.map-node{display:flex;align-items:center;gap:12px;padding:14px;color:inherit;text-decoration:none;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);transition:.18s ease}.map-node:hover{border-color:var(--vp-c-brand-1);transform:translateY(-2px)}.number{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:10px;color:var(--vp-c-brand-1);background:var(--vp-c-brand-soft);font-weight:800}.map-node div{min-width:0}.map-node b,.map-node small{display:block}.map-node b{font-size:14px}.map-node small{margin-top:3px;color:var(--vp-c-text-3);font-size:11px}.arrow{margin-left:auto;color:var(--vp-c-brand-1)}.caption{margin:14px 0 0;color:var(--vp-c-text-3);font-size:12px}@media(max-width:700px){.map-flow{grid-template-columns:1fr}.curriculum-map{padding:16px}}
</style>
