<script setup lang="ts">
import { withBase } from "vitepress";
import { agentFrontierChapters, agentFrontierCutoff, agentFrontierNodeCount } from "../../agent-frontier";
</script>

<template>
  <section class="frontier-map" aria-label="Agent 前沿强化知识地图">
    <header>
      <div>
        <span>AGENT FRONTIER · EVIDENCE CUTOFF {{ agentFrontierCutoff }}</span>
        <h2>从论文机制到可复现实验</h2>
        <p>10 个专题不是顺序书单；先激活 AGF01—03，再由真实项目选择下一组。</p>
      </div>
      <strong>{{ agentFrontierNodeCount }} 个节点</strong>
    </header>
    <div class="frontier-flow">
      <a v-for="(chapter, index) in agentFrontierChapters" :key="chapter.link" :href="withBase(chapter.link)" class="frontier-node">
        <span class="number">{{ String(index + 1).padStart(2, "0") }}</span>
        <div class="content">
          <b>{{ chapter.text.replace(/^\d+ · /, "") }}</b>
          <small>{{ chapter.ids.join(" · ") }} · {{ chapter.papers.length }} 份核心材料</small>
          <p><em>问题：</em>{{ chapter.question }}</p>
          <p><em>产出：</em>{{ chapter.outcome }}</p>
        </div>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
    </div>
    <p class="caption">关系是“必要前置 → 当前核心 → 邻近扩展”。地图一次展示完整范围，近期学习队列仍限制为 3—5 个节点；论文读完不会自动记为掌握。</p>
  </section>
</template>

<style scoped>
.frontier-map{--frontier:#4e61d8;margin:28px 0;padding:22px;border:1px solid var(--vp-c-divider);border-radius:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--frontier) 11%,var(--vp-c-bg)),var(--vp-c-bg))}.frontier-map header{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:18px}.frontier-map header span{display:block;color:var(--frontier);font-size:11px;font-weight:800;letter-spacing:.12em}.frontier-map h2{margin:4px 0 0;padding:0;border:0;font-size:24px}.frontier-map header p{margin:6px 0 0;color:var(--vp-c-text-2);font-size:13px}.frontier-map header strong{color:var(--vp-c-text-2);font-size:13px;white-space:nowrap}.frontier-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.frontier-node{display:flex;align-items:flex-start;gap:12px;padding:15px;color:inherit;text-decoration:none;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);transition:.18s ease}.frontier-node:hover{border-color:var(--frontier);transform:translateY(-2px)}.number{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:10px;color:var(--frontier);background:color-mix(in srgb,var(--frontier) 12%,transparent);font-weight:800}.content{min-width:0}.content b,.content small{display:block}.content b{font-size:14px}.content small{margin:3px 0 8px;color:var(--vp-c-text-3);font-size:11px}.content p{margin:3px 0;color:var(--vp-c-text-2);font-size:12px;line-height:1.55}.content em{color:var(--frontier);font-style:normal;font-weight:700}.arrow{margin-left:auto;color:var(--frontier)}.caption{margin:14px 0 0;color:var(--vp-c-text-3);font-size:12px}@media(max-width:760px){.frontier-flow{grid-template-columns:1fr}.frontier-map{padding:16px}.frontier-map header{align-items:flex-start;flex-direction:column}}
</style>
