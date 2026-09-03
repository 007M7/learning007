<script setup lang="ts">
import { withBase } from "vitepress";

const coreTracks = [
  { key: "software", title: "软件与系统工程", role: "程序 · 数据 · 接口 · 架构", link: "/domains/software/" },
  { key: "ai", title: "AI 应用与 Agent", role: "模型 · 检索 · 工具 · Runtime", link: "/domains/ai/" },
];

const extensions = [
  { title: "软件进阶", from: "软件瓶颈", link: "/advanced/software/" },
  { title: "交付进阶", from: "规模与韧性", link: "/advanced/quality/" },
  { title: "AI 进阶", from: "模型与推理边界", link: "/advanced/ai/" },
  { title: "Agent 前沿", from: "自治与评测问题", link: "/frontier/agents/" },
];

const modelChain = [
  { title: "机器学习", role: "泛化与评测", link: "/fields/machine-learning/" },
  { title: "深度学习", role: "表示与训练", link: "/fields/deep-learning/" },
  { title: "NLP", role: "语言与评价", link: "/fields/nlp/" },
  { title: "AI 主线", role: "系统化应用", link: "/domains/ai/" },
];

const sharedAssets = [
  { title: "学习方法", role: "选择路径与验证掌握", link: "/guide/" },
  { title: "项目案例", role: "验证跨领域协作", link: "/cases/" },
  { title: "架构模板", role: "保存工程产物", link: "/templates/" },
  { title: "权威来源", role: "支持与限制结论", link: "/sources/" },
];
</script>

<template>
  <section class="knowledge-graph" aria-label="Learning 007 全站知识关系">
    <div class="legend">
      <span><i class="strong"></i>前置或产物关系</span>
      <span><i class="constraint"></i>持续约束与验证</span>
      <span><i class="separate"></i>弱关联独立专题</span>
    </div>

    <div class="core-zone zone">
      <p class="zone-label">工程主干</p>
      <div class="core-row">
        <a v-for="(track, index) in coreTracks" :key="track.key" :href="withBase(track.link)" :class="['node', 'core-node', track.key]">
          <strong>{{ track.title }}</strong>
          <span>{{ track.role }}</span>
          <b v-if="index === 0" class="right-arrow" aria-hidden="true">提供系统基础 →</b>
        </a>
      </div>
      <a :href="withBase('/domains/quality/')" class="quality-band">
        <strong>质量与生产交付</strong>
        <span>从需求到生产持续验证软件与 AI，负责测试、发布、观测、恢复和安全</span>
      </a>
    </div>

    <div class="down" aria-hidden="true">真实瓶颈决定是否向下深入 ↓</div>

    <div class="extension-zone zone">
      <p class="zone-label">强关联扩展</p>
      <div class="extension-grid">
        <a v-for="item in extensions" :key="item.link" :href="withBase(item.link)" class="node small-node">
          <strong>{{ item.title }}</strong><span>{{ item.from }}</span>
        </a>
      </div>
    </div>

    <div class="model-zone zone">
      <p class="zone-label">模型与语言知识链</p>
      <div class="chain">
        <template v-for="(item, index) in modelChain" :key="item.link">
          <a :href="withBase(item.link)" class="node chain-node"><strong>{{ item.title }}</strong><span>{{ item.role }}</span></a>
          <b v-if="index < modelChain.length - 1" aria-hidden="true">→</b>
        </template>
      </div>
    </div>

    <div class="scenario-grid">
      <div class="zone product-zone">
        <p class="zone-label">跨领域产品判断</p>
        <a :href="withBase('/fields/ai-product/')" class="node scenario-node">
          <strong>AI 产品经理</strong><span>连接 AI 能力、质量证据、用户任务与经济约束</span>
        </a>
      </div>
      <div class="zone physical-zone">
        <p class="zone-label">物理 AI 专区</p>
        <div class="physical-shared">共享感知、估计、规划、控制、安全与仿真</div>
        <div class="physical-grid">
          <a :href="withBase('/fields/low-altitude/')" class="node standalone-node"><strong>低空智能</strong><span>航空、空域、适航与运行监管独立学习</span></a>
          <a :href="withBase('/fields/robotics/')" class="node standalone-node"><strong>机器人</strong><span>本体、运动学、动力学与接触独立学习</span></a>
        </div>
      </div>
    </div>

    <div class="asset-zone zone">
      <p class="zone-label">贯穿全站的学习与证据资源</p>
      <div class="asset-grid">
        <a v-for="item in sharedAssets" :key="item.link" :href="withBase(item.link)" class="node asset-node">
          <strong>{{ item.title }}</strong><span>{{ item.role }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.knowledge-graph { margin: 22px 0 42px; color: var(--vp-c-text-1); }
.legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 14px; color: var(--vp-c-text-2); font-size: 12px; }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.legend i { width: 18px; height: 4px; border-radius: 999px; }.legend .strong { background: var(--vp-c-brand-1); }.legend .constraint { border-top: 2px dashed #b26900; }.legend .separate { background: #8a86c8; }
.zone { position: relative; padding: 34px 18px 18px; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--vp-c-bg-soft); }
.zone-label { position: absolute; top: 10px; left: 18px; margin: 0; color: var(--vp-c-text-2); font-size: 11px; font-weight: 800; letter-spacing: .11em; }
.node { display: flex; flex-direction: column; gap: 4px; color: inherit; text-decoration: none; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); transition: .18s ease; }
.node:hover { border-color: var(--vp-c-brand-1); transform: translateY(-2px); }
.node strong { font-size: 14px; }.node span { color: var(--vp-c-text-2); font-size: 12px; line-height: 1.5; }
.core-row { display: grid; grid-template-columns: 1fr 1fr; gap: 74px; }
.core-node { position: relative; padding: 18px; border-top-width: 4px; }.core-node.software { border-top-color: #256f68; }.core-node.ai { border-top-color: #6b66c8; }
.right-arrow { position: absolute; z-index: 2; right: -68px; top: 28px; width: 62px; color: var(--vp-c-brand-1); font-size: 10px; text-align: center; }
.quality-band { display: flex; align-items: center; gap: 18px; margin-top: 13px; padding: 11px 16px; color: inherit; text-decoration: none; border: 1px dashed #b26900; border-radius: 11px; background: rgba(178,105,0,.06); }
.quality-band strong { flex: 0 0 auto; font-size: 13px; }.quality-band span { color: var(--vp-c-text-2); font-size: 12px; }
.down { padding: 11px 0; color: var(--vp-c-text-2); font-size: 12px; text-align: center; }
.extension-grid, .asset-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 10px; }
.small-node, .asset-node { padding: 12px; }
.model-zone { margin-top: 14px; }
.chain { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr; align-items: center; gap: 8px; }
.chain > b { color: var(--vp-c-brand-1); }.chain-node { padding: 12px; }
.scenario-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 14px; margin-top: 14px; }
.scenario-node { min-height: 105px; justify-content: center; padding: 16px; }
.physical-shared { margin-bottom: 10px; padding: 8px 10px; border-radius: 8px; color: var(--vp-c-text-2); background: var(--vp-c-bg); font-size: 12px; text-align: center; }
.physical-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }.standalone-node { padding: 13px; border-left: 4px solid #8a86c8; }
.asset-zone { margin-top: 14px; }
@media (max-width: 760px) {
  .core-row, .scenario-grid, .physical-grid { grid-template-columns: 1fr; gap: 10px; }
  .right-arrow { position: static; width: auto; margin-top: 6px; text-align: left; }
  .quality-band { align-items: flex-start; flex-direction: column; gap: 4px; }
  .extension-grid, .asset-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .chain { grid-template-columns: 1fr; }.chain > b { transform: rotate(90deg); text-align: center; }
}
@media (max-width: 460px) { .extension-grid, .asset-grid { grid-template-columns: 1fr; } }
</style>
