<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{ question: string; options: string[]; answer: number; explanation: string }>();
const picked = ref<number | null>(null);
</script>
<template>
  <section class="quiz" :aria-label="question"><strong>{{ question }}</strong>
    <button v-for="(option, index) in options" :key="option" type="button" :class="{ correct: picked !== null && index === answer, wrong: picked === index && index !== answer }" :disabled="picked !== null" @click="picked = index"><span>{{ String.fromCharCode(65 + index) }}</span>{{ option }}</button>
    <div v-if="picked !== null" class="explanation" role="status"><b>{{ picked === props.answer ? "回答正确" : "再看一次关键机制" }}</b><p>{{ explanation }}</p><button type="button" class="retry" @click="picked = null">重新回答</button></div>
  </section>
</template>
<style scoped>
.quiz { margin: 24px 0; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg-soft); }.quiz > strong { display: block; margin-bottom: 12px; }
.quiz > button { display: flex; width: 100%; align-items: center; gap: 10px; margin: 8px 0; padding: 10px 12px; text-align: left; color: inherit; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--vp-c-bg); cursor: pointer; }.quiz > button span { width: 24px; height: 24px; display: grid; place-items: center; flex: 0 0 24px; border-radius: 50%; background: var(--vp-c-default-soft); font-size: 12px; font-weight: 700; }.quiz > button.correct { border-color: #31897f; background: rgba(49,137,127,.1); }.quiz > button.wrong { border-color: #cb5b5b; background: rgba(203,91,91,.1); }
.explanation { margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--vp-c-divider); }.explanation p { margin: 6px 0 10px; color: var(--vp-c-text-2); }.retry { border: 1px solid var(--vp-c-divider); border-radius: 8px; padding: 5px 10px; color: inherit; background: var(--vp-c-bg); cursor: pointer; }
</style>
