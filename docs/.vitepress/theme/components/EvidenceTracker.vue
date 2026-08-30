<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{ lesson: string }>();
const checks = ref({ explain: false, apply: false, boundary: false });
const note = ref("");
const hydrated = ref(false);
const storageKey = `learning007:evidence:${props.lesson}`;

onMounted(() => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      checks.value = { ...checks.value, ...data.checks };
      note.value = typeof data.note === "string" ? data.note : "";
    }
  } catch { /* 设备本地记录不可用时仍可学习。 */ }
  hydrated.value = true;
});

watch([checks, note], () => {
  if (!hydrated.value) return;
  try { localStorage.setItem(storageKey, JSON.stringify({ checks: checks.value, note: note.value })); } catch { /* ignore */ }
}, { deep: true });
</script>

<template>
  <section class="evidence-tracker">
    <div class="heading"><div><span>LOCAL EVIDENCE</span><h3>本节掌握证据</h3></div><b>{{ Object.values(checks).filter(Boolean).length }}/3</b></div>
    <label><input v-model="checks.explain" type="checkbox">我能不看正文解释关键机制</label>
    <label><input v-model="checks.apply" type="checkbox">我在练习或项目里应用过一次</label>
    <label><input v-model="checks.boundary" type="checkbox">我能指出一个失败边界或常见误区</label>
    <textarea v-model="note" rows="3" placeholder="粘贴提交、测试、图或复盘的链接；也可以写下仍不确定的问题。" />
    <p>记录只保存在当前浏览器。勾选是自我记录，不会自动判定“已掌握”。</p>
  </section>
</template>

<style scoped>
.evidence-tracker{margin:28px 0;padding:20px;border:1px solid var(--vp-c-divider);border-radius:14px;background:var(--vp-c-bg-soft)}.heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.heading span{color:var(--vp-c-brand-1);font-size:11px;font-weight:800;letter-spacing:.14em}.heading h3{margin:3px 0 0;font-size:18px}.heading b{color:var(--vp-c-brand-1)}label{display:flex;align-items:center;gap:9px;margin:9px 0;font-size:14px}input{accent-color:var(--vp-c-brand-1)}textarea{box-sizing:border-box;width:100%;margin-top:10px;padding:10px 12px;resize:vertical;color:inherit;border:1px solid var(--vp-c-divider);border-radius:9px;background:var(--vp-c-bg)}.evidence-tracker p{margin:8px 0 0;color:var(--vp-c-text-3);font-size:11px}
</style>
