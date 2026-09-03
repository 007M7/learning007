<script setup lang="ts">
import { withBase } from "vitepress";

interface TrackLink {
  label: string;
  role: string;
  link: string;
}

interface Track {
  key: "software" | "quality" | "ai";
  title: string;
  icon: string;
  question: string;
  relation: string;
  links: TrackLink[];
}

const tracks: Track[] = [
  {
    key: "software",
    title: "软件与系统工程",
    icon: "◫",
    question: "业务需求怎样成为结构清楚、数据正确、能够演进的软件？",
    relation: "为 AI 系统提供程序、数据、接口和架构基础，也为质量验证提供对象。",
    links: [
      { label: "16 个核心节点", role: "建立工程基础", link: "/domains/software/" },
      { label: "项目学习路线", role: "把节点接入纵向切片", link: "/domains/software/roadmap" },
      { label: "18 个进阶节点", role: "由性能、规模和一致性瓶颈解锁", link: "/advanced/software/" },
      { label: "权威来源", role: "核对标准、协议与机制", link: "/sources/software" },
    ],
  },
  {
    key: "quality",
    title: "质量与生产交付",
    icon: "✓",
    question: "怎样证明系统正确，并在失败时及时发现、止损和恢复？",
    relation: "从需求到生产持续约束软件与 AI 系统，不是开发完成后的附加步骤。",
    links: [
      { label: "16 个核心节点", role: "建立验证与交付能力", link: "/domains/quality/" },
      { label: "项目学习路线", role: "补齐测试、发布、观测与恢复", link: "/domains/quality/roadmap" },
      { label: "18 个进阶节点", role: "由容量、韧性和平台问题解锁", link: "/advanced/quality/" },
      { label: "权威来源", role: "核对质量、安全与供应链要求", link: "/sources/quality" },
    ],
  },
  {
    key: "ai",
    title: "AI 应用与 Agent",
    icon: "✦",
    question: "怎样让不确定的模型在确定的权限、证据和业务规则内工作？",
    relation: "建立在软件系统上，并由评测、权限、审计、回退和安全门禁约束。",
    links: [
      { label: "19 个核心节点", role: "从模型调用走到可治理 Agent", link: "/domains/ai/" },
      { label: "Agent 前沿", role: "研究推理、工具、记忆、评测与自治", link: "/frontier/agents/" },
      { label: "18 个进阶节点", role: "由训练、推理与检索边界解锁", link: "/advanced/ai/" },
      { label: "权威来源", role: "核对模型、协议、评测和治理证据", link: "/sources/ai" },
    ],
  },
];

const sharedAssets = [
  { title: "学习方法", description: "决定怎样诊断起点、安排近期节点和验证掌握。", link: "/guide/" },
  { title: "模型学习", description: "把机器学习、深度学习和 NLP 组织成连续专题。", link: "/fields/machine-learning/" },
  { title: "物理 AI", description: "低空与机器人共享工程基础，专业机制分别学习。", link: "/fields/low-altitude/" },
  { title: "项目案例", description: "让三条主线在同一个真实约束中协作。", link: "/cases/" },
  { title: "架构模板", description: "保存需求、边界、契约、测试和决策产物。", link: "/templates/" },
];
</script>

<template>
  <section class="explorer" aria-labelledby="learning-map-title">
    <div class="explorer-heading">
      <div>
        <p class="eyebrow">CONNECTED KNOWLEDGE MAP</p>
        <h2 id="learning-map-title">三条工程主线，共用一套方法、项目与证据</h2>
        <p class="heading-copy">先进入当前问题所在的主线，再沿真实前置和项目关系扩展。没有强联系的专业知识保留在独立专题。</p>
      </div>
      <a :href="withBase('/map/')" class="map-link">查看全站关系图 <span aria-hidden="true">→</span></a>
    </div>

    <div class="track-grid">
      <article v-for="track in tracks" :key="track.key" :class="['track', track.key]">
        <div class="track-title">
          <span class="icon" aria-hidden="true">{{ track.icon }}</span>
          <h3>{{ track.title }}</h3>
        </div>
        <p class="question">{{ track.question }}</p>
        <p class="relation">{{ track.relation }}</p>
        <div class="track-links">
          <a v-for="item in track.links" :key="item.link" :href="withBase(item.link)">
            <span>{{ item.label }}</span>
            <small>{{ item.role }}</small>
          </a>
        </div>
      </article>
    </div>

    <div class="connection" aria-label="三条主线的关系">
      <span>软件提供确定性系统</span><b aria-hidden="true">→</b>
      <span>AI 增加模型能力</span><b aria-hidden="true">←</b>
      <span>质量持续验证并约束两者</span>
    </div>

    <div class="shared">
      <div class="shared-heading">
        <p class="eyebrow">SHARED ASSETS</p>
        <h3>模型与物理专题继续深入，方法和工程产物贯穿全程</h3>
      </div>
      <div class="shared-grid">
        <a v-for="asset in sharedAssets" :key="asset.link" :href="withBase(asset.link)">
          <strong>{{ asset.title }}</strong>
          <span>{{ asset.description }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.explorer { position: relative; max-width: 1152px; margin: 24px auto 0; padding: 28px 24px 64px; }
.explorer-heading { display: flex; align-items: end; justify-content: space-between; gap: 32px; margin-bottom: 24px; }
.eyebrow { margin: 0 0 8px; color: var(--vp-c-brand-1); font-size: 12px; font-weight: 750; letter-spacing: .16em; }
h2, h3 { border: 0; padding: 0; }
h2 { margin: 0; font-size: clamp(24px, 4vw, 34px); letter-spacing: -.025em; }
.heading-copy { max-width: 720px; margin: 12px 0 0; color: var(--vp-c-text-2); line-height: 1.7; }
.map-link { flex: 0 0 auto; border: 1px solid var(--vp-c-brand-1); border-radius: 999px; padding: 9px 15px; color: var(--vp-c-brand-1); text-decoration: none; font-size: 13px; font-weight: 700; }
.map-link:hover { color: #fff; background: var(--vp-c-brand-1); }
.track-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.track { display: flex; min-height: 410px; flex-direction: column; padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 18px; background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg)); }
.track.software { border-top: 4px solid #256f68; }.track.quality { border-top: 4px solid #b26900; }.track.ai { border-top: 4px solid #6b66c8; }
.track-title { display: flex; align-items: center; gap: 12px; }
.track-title h3 { margin: 0; font-size: 19px; }
.icon { width: 38px; height: 38px; display: grid; flex: 0 0 auto; place-items: center; border-radius: 11px; color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); font-size: 21px; }
.question { margin: 18px 0 8px; color: var(--vp-c-text-1); font-weight: 650; line-height: 1.65; }
.relation { margin: 0 0 18px; color: var(--vp-c-text-2); font-size: 14px; line-height: 1.65; }
.track-links { display: grid; gap: 8px; margin-top: auto; }
.track-links a { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; color: inherit; text-decoration: none; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg); }
.track-links a:hover { border-color: var(--vp-c-brand-1); transform: translateX(2px); }
.track-links span { color: var(--vp-c-text-1); font-size: 14px; font-weight: 700; }
.track-links small { color: var(--vp-c-text-2); font-size: 12px; line-height: 1.5; }
.connection { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 16px 0 28px; padding: 13px 16px; border-radius: 12px; color: var(--vp-c-text-2); background: var(--vp-c-bg-soft); font-size: 13px; }
.connection b { color: var(--vp-c-brand-1); }
.shared { padding-top: 4px; }
.shared-heading h3 { margin: 0 0 14px; font-size: 19px; }
.shared-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
.shared-grid a { display: flex; flex-direction: column; gap: 6px; min-height: 112px; padding: 15px; color: inherit; text-decoration: none; border: 1px solid var(--vp-c-divider); border-radius: 13px; }
.shared-grid a:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }
.shared-grid strong { font-size: 14px; }.shared-grid span { color: var(--vp-c-text-2); font-size: 12px; line-height: 1.6; }
@media (max-width: 900px) {
  .track-grid { grid-template-columns: 1fr; }.track { min-height: 0; }
  .shared-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .explorer-heading { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 620px) {
  .shared-grid { grid-template-columns: 1fr; }
  .connection { align-items: flex-start; flex-direction: column; }.connection b { transform: rotate(90deg); }
}
</style>
