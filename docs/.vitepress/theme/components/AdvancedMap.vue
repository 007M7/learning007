<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { advancedDomains, type AdvancedDomainKey } from "../../advanced-curriculum";

const props = defineProps<{ domain: AdvancedDomainKey }>();
const current = computed(() => advancedDomains.find((item) => item.key === props.domain)!);
</script>

<template>
  <section class="advanced-map" :style="{ '--advanced-accent': current.accent }" :aria-label="`${current.title}知识地图`">
    <header>
      <div><span>OPTIONAL DEPTH MAP</span><h2>{{ current.title }}</h2><p>{{ current.short }}</p></div>
      <strong>{{ current.count }} 个可选节点</strong>
    </header>
    <div class="advanced-flow">
      <a v-for="(chapter, index) in current.chapters" :key="chapter.link" :href="withBase(chapter.link)" class="advanced-node">
        <span class="number">{{ String(index + 1).padStart(2, "0") }}</span>
        <div class="content">
          <b>{{ chapter.text.replace(/^\d+ · /, "") }}</b>
          <small>{{ chapter.ids.join(" · ") }}</small>
          <p><em>解锁：</em>{{ chapter.unlock }}</p>
          <p><em>产出：</em>{{ chapter.outcome }}</p>
        </div>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>
    <p class="caption">连线表示推荐依赖，不是必须按顺序学完。只有项目瓶颈、岗位要求或核心证据触发时，才把一个专题中的 1—3 个节点放入近期队列。</p>
  </section>
</template>

<style scoped>
.advanced-map{--advanced-accent:var(--vp-c-brand-1);margin:28px 0;padding:22px;border:1px solid var(--vp-c-divider);border-radius:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--advanced-accent) 9%,var(--vp-c-bg)),var(--vp-c-bg))}.advanced-map header{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:18px}.advanced-map header span{display:block;color:var(--advanced-accent);font-size:11px;font-weight:800;letter-spacing:.16em}.advanced-map h2{margin:4px 0 0;padding:0;border:0;font-size:24px}.advanced-map header p{margin:6px 0 0;color:var(--vp-c-text-2);font-size:13px}.advanced-map header strong{color:var(--vp-c-text-2);font-size:13px;white-space:nowrap}.advanced-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.advanced-node{display:flex;align-items:flex-start;gap:12px;padding:15px;color:inherit;text-decoration:none;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);transition:.18s ease}.advanced-node:hover{border-color:var(--advanced-accent);transform:translateY(-2px)}.number{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:10px;color:var(--advanced-accent);background:color-mix(in srgb,var(--advanced-accent) 12%,transparent);font-weight:800}.content{min-width:0}.content b,.content small{display:block}.content b{font-size:14px}.content small{margin:3px 0 8px;color:var(--vp-c-text-3);font-size:11px}.content p{margin:3px 0;color:var(--vp-c-text-2);font-size:12px;line-height:1.55}.content em{color:var(--advanced-accent);font-style:normal;font-weight:700}.arrow{margin-left:auto;color:var(--advanced-accent)}.caption{margin:14px 0 0;color:var(--vp-c-text-3);font-size:12px}@media(max-width:760px){.advanced-flow{grid-template-columns:1fr}.advanced-map{padding:16px}.advanced-map header{align-items:flex-start;flex-direction:column}}
</style>
