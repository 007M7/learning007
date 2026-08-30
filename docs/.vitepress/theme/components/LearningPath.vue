<script setup lang="ts">defineProps<{ steps: string[] }>();</script>
<template><ol class="learning-path"><li v-for="(step, index) in steps" :key="step"><span class="number">{{ String(index + 1).padStart(2, "0") }}</span><span>{{ step }}</span></li></ol></template>
<style scoped>
.learning-path { list-style: none; padding: 0; margin: 24px 0; display: grid; gap: 10px; }
.learning-path li { display: flex; align-items: center; gap: 14px; padding: 13px 16px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); }
.number { color: var(--vp-c-brand-1); font-family: var(--vp-font-family-mono); font-size: 12px; font-weight: 800; }
</style>
