<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { fieldEvidenceCutoff, learningFieldBySlug } from "../../field-curriculum";

const props = defineProps<{ domain: string }>();
const field = computed(() => learningFieldBySlug[props.domain]);
</script>

<template>
  <section v-if="field" class="field-map" :style="{ '--field': field.color }" :aria-label="`${field.title}知识地图`">
    <header>
      <div>
        <span>{{ field.prefix }} · EVIDENCE CUTOFF {{ fieldEvidenceCutoff }}</span>
        <h2>{{ field.title }}：从机制到作品证据</h2>
        <p>{{ field.promise }}</p>
      </div>
      <strong>10 章 · 30 节点</strong>
    </header>
    <div class="field-flow">
      <a v-for="(item, index) in field.chapters" :key="item.link" :href="withBase(item.link)" class="field-node">
        <span class="number">{{ String(index + 1).padStart(2, "0") }}</span>
        <div class="content">
          <b>{{ item.text.replace(/^\d+ · /, "") }}</b>
          <small>{{ item.ids.join(" · ") }} · {{ item.sources.length }} 组核心来源</small>
          <p><em>问题：</em>{{ item.question }}</p>
          <p><em>产出：</em>{{ item.outcome }}</p>
        </div>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>
    <p class="caption">全图用于导航，不代表需要同时学习。默认只激活首章 3 个节点；解释、应用和评估均通过后再解锁后续内容。</p>
  </section>
</template>

<style scoped>
.field-map{--field:#176b87;margin:28px 0;padding:22px;border:1px solid var(--vp-c-divider);border-radius:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--field) 11%,var(--vp-c-bg)),var(--vp-c-bg))}.field-map header{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:18px}.field-map header span{display:block;color:var(--field);font-size:11px;font-weight:800;letter-spacing:.12em}.field-map h2{margin:4px 0 0;padding:0;border:0;font-size:24px}.field-map header p{max-width:720px;margin:6px 0 0;color:var(--vp-c-text-2);font-size:13px}.field-map header strong{color:var(--vp-c-text-2);font-size:13px;white-space:nowrap}.field-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.field-node{display:flex;align-items:flex-start;gap:12px;padding:15px;color:inherit;text-decoration:none;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);transition:.18s ease}.field-node:hover{border-color:var(--field);transform:translateY(-2px)}.number{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:10px;color:var(--field);background:color-mix(in srgb,var(--field) 12%,transparent);font-weight:800}.content{min-width:0}.content b,.content small{display:block}.content b{font-size:14px}.content small{margin:3px 0 8px;color:var(--vp-c-text-3);font-size:11px}.content p{margin:3px 0;color:var(--vp-c-text-2);font-size:12px;line-height:1.55}.content em{color:var(--field);font-style:normal;font-weight:700}.arrow{margin-left:auto;color:var(--field)}.caption{margin:14px 0 0;color:var(--vp-c-text-3);font-size:12px}@media(max-width:760px){.field-flow{grid-template-columns:1fr}.field-map{padding:16px}.field-map header{align-items:flex-start;flex-direction:column}}
</style>
