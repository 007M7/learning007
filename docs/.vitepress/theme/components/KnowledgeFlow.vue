<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  title: string;
  intro: string;
  what: string;
  why: string;
  how: string;
  terms: string;
}>();

const termList = computed(() => props.terms.split("|").map((term) => term.trim()).filter(Boolean));
</script>

<template>
  <section class="knowledge-flow" aria-label="本章知识导图">
    <header>
      <span>LEARNING MAP</span>
      <strong>{{ title }}</strong>
      <p>{{ intro }}</p>
    </header>

    <div class="knowledge-flow__steps">
      <article>
        <small>01</small>
        <b>是什么</b>
        <p>{{ what }}</p>
      </article>
      <i aria-hidden="true">→</i>
      <article>
        <small>02</small>
        <b>为什么</b>
        <p>{{ why }}</p>
      </article>
      <i aria-hidden="true">→</i>
      <article>
        <small>03</small>
        <b>怎么做</b>
        <p>{{ how }}</p>
      </article>
    </div>

    <div class="knowledge-flow__terms">
      <b>本章专业术语</b>
      <span v-for="term in termList" :key="term">{{ term }}</span>
    </div>
  </section>
</template>

<style scoped>
.knowledge-flow {
  --flow-accent: #176b87;
  margin: 24px 0 34px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: color-mix(in srgb, var(--flow-accent) 6%, var(--vp-c-bg));
}

.knowledge-flow header > span {
  display: block;
  color: var(--flow-accent);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .14em;
}

.knowledge-flow header > strong {
  display: block;
  margin-top: 4px;
  font-size: 20px;
}

.knowledge-flow header > p {
  margin: 6px 0 16px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.65;
}

.knowledge-flow__steps {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 20px minmax(0, 1fr) 20px minmax(0, 1fr);
  align-items: stretch;
  gap: 6px;
}

.knowledge-flow__steps article {
  padding: 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.knowledge-flow__steps small,
.knowledge-flow__steps b {
  display: block;
}

.knowledge-flow__steps small {
  color: var(--flow-accent);
  font-size: 10px;
  font-weight: 800;
}

.knowledge-flow__steps b {
  margin-top: 2px;
  font-size: 15px;
}

.knowledge-flow__steps p {
  margin: 7px 0 0;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.6;
}

.knowledge-flow__steps i {
  display: grid;
  place-items: center;
  color: var(--flow-accent);
  font-size: 18px;
  font-style: normal;
  font-weight: 800;
}

.knowledge-flow__terms {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-top: 14px;
  padding-top: 13px;
  border-top: 1px solid var(--vp-c-divider);
}

.knowledge-flow__terms b {
  margin-right: 3px;
  font-size: 12px;
}

.knowledge-flow__terms span {
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--flow-accent);
  background: color-mix(in srgb, var(--flow-accent) 11%, transparent);
  font-size: 11px;
  font-weight: 700;
}

@media (max-width: 760px) {
  .knowledge-flow { padding: 16px; }
  .knowledge-flow__steps { grid-template-columns: 1fr; }
  .knowledge-flow__steps i { transform: rotate(90deg); }
}
</style>
