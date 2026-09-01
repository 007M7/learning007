<script setup lang="ts">
import { computed, ref } from "vue";
import { withBase } from "vitepress";
import machineLearningCatalog from "../../../public/data/knowledge-base/machine-learning.json";

type ResourceType = "book" | "paper";
type Resource = {
  id: string;
  type: ResourceType;
  title: string;
  creator: string;
  year: string;
  modules: string[];
  level: "starter" | "core" | "advanced";
  role: string;
  content_url: string;
  review_url?: string;
  access: "open";
  verification: { status: string; method: string; checked_at: string };
};

const props = withDefaults(defineProps<{ field?: string }>(), { field: "machine-learning" });
const catalogs = { "machine-learning": machineLearningCatalog } as const;
const catalog = computed(() => catalogs[props.field as keyof typeof catalogs] ?? machineLearningCatalog);

const activeModule = ref("all");
const activeType = ref<"all" | ResourceType>("all");
const activeLevel = ref("all");
const query = ref("");

const typeLabels: Record<ResourceType, string> = { book: "教材原文", paper: "论文全文" };
const levelLabels = { starter: "入门", core: "核心", advanced: "进阶" } as const;
const accessLabels = { open: "无需登录" } as const;
const typeOrder: ResourceType[] = ["book", "paper"];

const moduleById = computed(() => Object.fromEntries(catalog.value.modules.map((item) => [item.id, item])));
const resources = computed(() => catalog.value.resources as Resource[]);
const filtered = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase();
  return resources.value.filter((resource) => {
    const matchesModule = activeModule.value === "all" || resource.modules.includes(activeModule.value);
    const matchesType = activeType.value === "all" || resource.type === activeType.value;
    const matchesLevel = activeLevel.value === "all" || resource.level === activeLevel.value;
    const haystack = `${resource.title} ${resource.creator} ${resource.role}`.toLocaleLowerCase();
    return matchesModule && matchesType && matchesLevel && (!needle || haystack.includes(needle));
  });
});
const grouped = computed(() => typeOrder
  .map((type) => ({ type, items: filtered.value.filter((item) => item.type === type) }))
  .filter((group) => group.items.length));
const counts = computed(() => Object.fromEntries(typeOrder.map((type) => [type, resources.value.filter((item) => item.type === type).length])));

function resetFilters() {
  activeModule.value = "all";
  activeType.value = "all";
  activeLevel.value = "all";
  query.value = "";
}
</script>

<template>
  <section class="resource-library" aria-label="机器学习资源知识库">
    <header class="resource-library__summary">
      <div>
        <span>CURATED SOURCE CATALOG</span>
        <strong>{{ catalog.title }}资源目录</strong>
        <p>{{ catalog.storage_policy }}</p>
      </div>
      <dl>
        <div><dt>{{ resources.length }}</dt><dd>条官方入口</dd></div>
        <div><dt>{{ counts.book }}</dt><dd>本教材</dd></div>
        <div><dt>{{ counts.paper }}</dt><dd>篇核心论文</dd></div>
        <div><dt>{{ catalog.modules.length }}</dt><dd>个知识子模块</dd></div>
      </dl>
    </header>

    <div class="resource-library__modules" aria-label="知识模块">
      <button
        v-for="module in catalog.modules"
        :key="module.id"
        type="button"
        :class="{ active: activeModule === module.id }"
        :aria-pressed="activeModule === module.id"
        @click="activeModule = activeModule === module.id ? 'all' : module.id"
      >
        <span>{{ module.name }}</span>
        <small>{{ module.goal }}</small>
      </button>
    </div>

    <div class="resource-library__controls">
      <label class="resource-library__search">
        <span>搜索资源</span>
        <input v-model="query" type="search" placeholder="输入书名、作者、机构或主题" />
      </label>
      <label>
        <span>资源类型</span>
        <select v-model="activeType">
          <option value="all">全部类型</option>
          <option value="book">教材原文</option>
          <option value="paper">论文全文</option>
        </select>
      </label>
      <label>
        <span>学习阶段</span>
        <select v-model="activeLevel">
          <option value="all">全部阶段</option>
          <option value="starter">入门</option>
          <option value="core">核心</option>
          <option value="advanced">进阶</option>
        </select>
      </label>
      <button class="resource-library__reset" type="button" @click="resetFilters">重置</button>
    </div>

    <p class="resource-library__result">当前显示 {{ filtered.length }} 条。点击模块卡片可以单独查看该模块。</p>

    <div v-if="grouped.length" class="resource-library__groups">
      <section v-for="group in grouped" :key="group.type" class="resource-group">
        <header>
          <h2>{{ typeLabels[group.type] }}</h2>
          <span>{{ group.items.length }}</span>
        </header>
        <div class="resource-group__grid">
          <article v-for="resource in group.items" :key="resource.id" class="resource-card">
            <div class="resource-card__meta">
              <span>{{ typeLabels[resource.type] }}</span>
              <span>{{ levelLabels[resource.level] }}</span>
              <span>{{ accessLabels[resource.access] }}</span>
            </div>
            <h3>{{ resource.title }}</h3>
            <p class="resource-card__creator">{{ resource.creator }} · {{ resource.year }}</p>
            <p>{{ resource.role }}</p>
            <div class="resource-card__modules">
              <span v-for="moduleId in resource.modules" :key="moduleId">{{ moduleById[moduleId]?.name }}</span>
            </div>
            <footer>
              <small>URL 核验于 {{ resource.verification.checked_at }}</small>
              <div class="resource-card__actions">
                <a v-if="resource.type === 'book' && resource.review_url" class="primary" :href="withBase(resource.review_url)">阅读综述</a>
                <a :href="resource.content_url" target="_blank" rel="noopener noreferrer">{{ resource.type === 'book' ? '查看原文' : '直接阅读全文' }} <span aria-hidden="true">↗</span></a>
              </div>
            </footer>
          </article>
        </div>
      </section>
    </div>
    <div v-else class="resource-library__empty">
      <strong>没有符合当前条件的资源</strong>
      <p>可以减少筛选条件，或者清空搜索词。</p>
      <button type="button" @click="resetFilters">清除筛选</button>
    </div>
  </section>
</template>

<style scoped>
.resource-library { margin-top: 28px; }
.resource-library__summary {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr);
  gap: 28px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(37, 111, 104, .14), rgba(73, 120, 196, .08));
}
.resource-library__summary > div > span { color: var(--vp-c-brand-1); font-size: 11px; font-weight: 800; letter-spacing: .14em; }
.resource-library__summary strong { display: block; margin-top: 8px; font-size: 28px; line-height: 1.25; }
.resource-library__summary p { margin: 10px 0 0; color: var(--vp-c-text-2); line-height: 1.75; }
.resource-library__summary dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 0; }
.resource-library__summary dl div { padding: 14px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg); }
.resource-library__summary dt { color: var(--vp-c-brand-1); font-size: 24px; font-weight: 800; }
.resource-library__summary dd { margin: 2px 0 0; color: var(--vp-c-text-2); font-size: 12px; }
.resource-library__modules { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 22px 0; }
.resource-library__modules button { padding: 15px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); text-align: left; cursor: pointer; transition: border-color .18s ease, transform .18s ease, background .18s ease; }
.resource-library__modules button:hover { border-color: var(--vp-c-brand-1); transform: translateY(-1px); }
.resource-library__modules button.active { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.resource-library__modules span { display: block; font-size: 14px; font-weight: 750; }
.resource-library__modules small { display: block; margin-top: 7px; color: var(--vp-c-text-2); line-height: 1.55; }
.resource-library__controls { display: grid; grid-template-columns: minmax(220px, 1fr) 150px 130px auto; gap: 10px; align-items: end; padding: 14px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg-soft); }
.resource-library__controls label > span { display: block; margin: 0 0 6px 2px; color: var(--vp-c-text-2); font-size: 11px; font-weight: 700; }
.resource-library__controls input, .resource-library__controls select { width: 100%; height: 40px; padding: 0 11px; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; font-size: 13px; }
.resource-library__controls input:focus, .resource-library__controls select:focus { border-color: var(--vp-c-brand-1); outline: 2px solid var(--vp-c-brand-soft); }
.resource-library__reset, .resource-library__empty button { height: 40px; padding: 0 14px; border: 1px solid var(--vp-c-divider); border-radius: 9px; background: var(--vp-c-bg); color: var(--vp-c-text-1); cursor: pointer; }
.resource-library__result { margin: 12px 2px 0; color: var(--vp-c-text-2); font-size: 12px; }
.resource-library__groups { margin-top: 28px; }
.resource-group { margin-top: 30px; }
.resource-group > header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.resource-group > header h2 { margin: 0; padding: 0; border: 0; font-size: 20px; }
.resource-group > header span { min-width: 24px; padding: 2px 7px; border-radius: 999px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-size: 11px; font-weight: 800; text-align: center; }
.resource-group__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.resource-card { display: flex; min-width: 0; flex-direction: column; padding: 18px; border: 1px solid var(--vp-c-divider); border-radius: 15px; background: var(--vp-c-bg); }
.resource-card__meta, .resource-card__modules { display: flex; flex-wrap: wrap; gap: 6px; }
.resource-card__meta span, .resource-card__modules span { padding: 3px 7px; border-radius: 999px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-size: 10px; }
.resource-card__meta span:first-child { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 800; }
.resource-card h3 { margin: 13px 0 5px; font-size: 16px; line-height: 1.4; overflow-wrap: anywhere; }
.resource-card p { margin: 8px 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.65; }
.resource-card .resource-card__creator { margin-top: 0; color: var(--vp-c-text-3); font-size: 11px; }
.resource-card__modules { margin-top: auto; padding-top: 9px; }
.resource-card footer { display: flex; align-items: end; justify-content: space-between; gap: 12px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--vp-c-divider); }
.resource-card footer small { color: var(--vp-c-text-3); font-size: 10px; }
.resource-card footer a { flex: 0 0 auto; color: var(--vp-c-brand-1); font-size: 12px; font-weight: 750; text-decoration: none; }
.resource-card__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 7px; }
.resource-card__actions a { padding: 5px 8px; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.resource-card__actions a.primary { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: white; }
.resource-library__empty { margin-top: 24px; padding: 40px; border: 1px dashed var(--vp-c-divider); border-radius: 14px; text-align: center; }
.resource-library__empty p { color: var(--vp-c-text-2); }
@media (max-width: 760px) {
  .resource-library__summary { grid-template-columns: 1fr; padding: 20px; }
  .resource-library__modules { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .resource-library__controls { grid-template-columns: 1fr 1fr; }
  .resource-library__search { grid-column: 1 / -1; }
  .resource-group__grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .resource-library__modules, .resource-library__controls { grid-template-columns: 1fr; }
  .resource-library__search { grid-column: auto; }
  .resource-card footer { align-items: flex-start; flex-direction: column; }
  .resource-card__actions { justify-content: flex-start; }
}
</style>
