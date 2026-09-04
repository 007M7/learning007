<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { agentFrontierChapters, agentFrontierCutoff, agentFrontierNodeCount } from "../../agent-frontier";

const frontierStages = computed(() =>
  [...new Set(agentFrontierChapters.map((chapter) => chapter.stage))].map((stage) => {
    const chapters = agentFrontierChapters.filter((chapter) => chapter.stage === stage);
    return {
      id: stage,
      title: `阶段${["一", "二", "三", "四", "五"][stage - 1]} · ${chapters[0].stageTitle}`,
      chapters,
      review: chapters.find((chapter) => chapter.stageReview)?.stageReview,
    };
  }),
);
</script>

<template>
  <section class="frontier-map" aria-label="Agent 前沿强化知识地图">
    <header>
      <div>
        <span>AGENT FRONTIER · EVIDENCE CUTOFF {{ agentFrontierCutoff }}</span>
        <h2>从论文机制到可复现实验</h2>
        <p>10 个专题沿五个阶段推进；每两章都要经过一次陌生场景迁移。</p>
      </div>
      <strong>{{ agentFrontierNodeCount }} 个节点</strong>
    </header>
    <div class="frontier-stages">
      <section v-for="stage in frontierStages" :key="stage.id" class="stage-block">
        <div class="stage-title"><span>STAGE {{ stage.id }}</span><b>{{ stage.title }}</b></div>
        <div class="frontier-flow">
          <a v-for="chapter in stage.chapters" :key="chapter.link" :href="withBase(chapter.link)" class="frontier-node">
            <span class="number">{{ chapter.text.slice(0, 2) }}</span>
            <div class="content">
              <b>{{ chapter.text.replace(/^\d+ · /, "") }}</b>
              <small>{{ chapter.ids.join(" · ") }} · {{ chapter.papers.length }} 份核心材料</small>
              <p><em>问题：</em>{{ chapter.question }}</p>
              <p><em>产出：</em>{{ chapter.outcome }}</p>
            </div>
            <span class="arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <a v-if="stage.review" class="stage-review" :href="withBase(stage.review.link)">{{ stage.review.text }} →</a>
      </section>
    </div>
    <p class="caption">实线顺序表示能力前置；评测与安全约束从第一阶段就启用，第五阶段再集中学习测量和治理。论文读完不会自动记为掌握。</p>
  </section>
</template>

<style scoped>
.frontier-map{--frontier:#4e61d8;margin:28px 0;padding:22px;border:1px solid var(--vp-c-divider);border-radius:18px;background:linear-gradient(145deg,color-mix(in srgb,var(--frontier) 11%,var(--vp-c-bg)),var(--vp-c-bg))}.frontier-map header{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:18px}.frontier-map header span{display:block;color:var(--frontier);font-size:11px;font-weight:800;letter-spacing:.12em}.frontier-map h2{margin:4px 0 0;padding:0;border:0;font-size:24px}.frontier-map header p{margin:6px 0 0;color:var(--vp-c-text-2);font-size:13px}.frontier-map header strong{color:var(--vp-c-text-2);font-size:13px;white-space:nowrap}.frontier-stages{display:grid;gap:14px}.stage-block{padding:14px;border:1px solid color-mix(in srgb,var(--frontier) 24%,var(--vp-c-divider));border-radius:14px;background:color-mix(in srgb,var(--vp-c-bg) 94%,transparent)}.stage-title{display:flex;align-items:baseline;gap:10px;margin-bottom:10px}.stage-title span{color:var(--frontier);font-size:10px;font-weight:800;letter-spacing:.12em}.stage-title b{font-size:14px}.frontier-flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.frontier-node{display:flex;align-items:flex-start;gap:12px;padding:15px;color:inherit;text-decoration:none;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg);transition:.18s ease}.frontier-node:hover{border-color:var(--frontier);transform:translateY(-2px)}.number{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:10px;color:var(--frontier);background:color-mix(in srgb,var(--frontier) 12%,transparent);font-weight:800}.content{min-width:0}.content b,.content small{display:block}.content b{font-size:14px}.content small{margin:3px 0 8px;color:var(--vp-c-text-3);font-size:11px}.content p{margin:3px 0;color:var(--vp-c-text-2);font-size:12px;line-height:1.55}.content em{color:var(--frontier);font-style:normal;font-weight:700}.arrow{margin-left:auto;color:var(--frontier)}.stage-review{display:inline-block;margin-top:10px;color:var(--frontier);font-size:12px;font-weight:700;text-decoration:none}.stage-review:hover{text-decoration:underline}.caption{margin:14px 0 0;color:var(--vp-c-text-3);font-size:12px}@media(max-width:760px){.frontier-flow{grid-template-columns:1fr}.frontier-map{padding:16px}.frontier-map header{align-items:flex-start;flex-direction:column}}
</style>
