<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import {
  aiLearningNodeChapters,
  type AILearningTrack,
} from "../../ai-learning-nodes";

const props = defineProps<{ track: AILearningTrack }>();
const chapters = computed(() => aiLearningNodeChapters.filter((chapter) => chapter.track === props.track));
</script>

<template>
  <section class="node-catalog" :aria-label="`${track} 学习节点契约`">
    <details v-for="chapter in chapters" :key="chapter.link">
      <summary>
        <span>{{ chapter.chapterTitle }}</span>
        <small>{{ chapter.nodes.length }} 个可验证节点</small>
      </summary>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>节点</th><th>核心判断</th><th>可验证学习产物</th></tr>
          </thead>
          <tbody>
            <tr v-for="node in chapter.nodes" :key="node.id">
              <td>
                <a :href="`${withBase(chapter.link)}#${node.id.toLowerCase()}`"><b>{{ node.id }}</b> · {{ node.title }}</a>
              </td>
              <td>{{ node.judgment }}</td>
              <td>{{ node.artifact }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>
</template>

<style scoped>
.node-catalog{display:grid;gap:10px;margin:18px 0 28px}.node-catalog details{border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft);overflow:hidden}.node-catalog summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;cursor:pointer;font-weight:700}.node-catalog summary small{color:var(--vp-c-text-3);font-size:12px;font-weight:500;white-space:nowrap}.table-wrap{overflow-x:auto;padding:0 12px 12px}.node-catalog table{display:table;width:100%;margin:0;background:var(--vp-c-bg)}.node-catalog th,.node-catalog td{min-width:210px;vertical-align:top;font-size:13px;line-height:1.6}.node-catalog th:first-child,.node-catalog td:first-child{min-width:180px}.node-catalog a{color:var(--vp-c-brand-1);text-decoration:none}.node-catalog a:hover{text-decoration:underline}@media(max-width:640px){.node-catalog summary{align-items:flex-start;flex-direction:column}.node-catalog summary small{white-space:normal}}
</style>
