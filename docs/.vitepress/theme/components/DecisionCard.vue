<script setup lang="ts">
import { ref } from "vue";
defineProps<{ title: string; prompt: string; answer: string }>();
const revealed = ref(false);
</script>

<template>
  <section class="decision-card">
    <span class="label">ARCHITECTURE DECISION</span>
    <h3>{{ title }}</h3>
    <p>{{ prompt }}</p>
    <button type="button" @click="revealed = !revealed">{{ revealed ? "收起分析" : "先思考，再看分析" }}</button>
    <div v-if="revealed" class="answer">{{ answer }}</div>
  </section>
</template>

<style scoped>
.decision-card{margin:24px 0;padding:20px;border:1px solid rgba(178,105,0,.28);border-left:4px solid #b26900;border-radius:14px;background:rgba(178,105,0,.06)}.label{color:#a16000;font-size:11px;font-weight:800;letter-spacing:.14em}.decision-card h3{margin:6px 0 8px;font-size:18px}.decision-card p{margin:0 0 12px}.decision-card button{padding:7px 12px;border:1px solid rgba(178,105,0,.35);border-radius:8px;color:inherit;background:var(--vp-c-bg);cursor:pointer}.answer{margin-top:14px;padding-top:14px;border-top:1px dashed rgba(178,105,0,.3);line-height:1.75}
</style>
