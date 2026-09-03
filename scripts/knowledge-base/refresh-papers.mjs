import path from "node:path";
import { fields, updatedAt } from "./field-config.mjs";
import { fieldsDir, mapLimit, normalizeDoi, writeJson, yesterdayIso } from "./utils.mjs";

const endpoint = "https://api.openalex.org/works";
const recentFrom = "2023-01-01";
const currentSnapshotDate = process.env.KB_SNAPSHOT_DATE || yesterdayIso();
const targetPerField = Number(process.env.KB_PAPER_TARGET || 120);
const selectedField = process.env.KB_FIELD || "";
const apiKey = process.env.OPENALEX_API_KEY || "";
const mailto = process.env.OPENALEX_MAILTO || "";
const allowedTypes = new Set(["article", "preprint", "review"]);

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchJson(url, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Learning007KnowledgeBase/1.0 (metadata research)" },
        signal: AbortSignal.timeout(20_000),
      });
      if (response.ok) {
        const data = await response.json();
        await sleep(350);
        return data;
      }
      const message = `${response.status} ${response.statusText}`;
      if (attempt === attempts || ![403, 429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`OpenAlex request failed: ${message} (${url})`);
      }
      const retryAfter = Number(response.headers.get("retry-after") || 0) * 1000;
      await sleep(Math.max(retryAfter, 3000 * 2 ** (attempt - 1)));
    } catch (error) {
      if (attempt === attempts) throw error;
      await sleep(1500 * attempt);
    }
  }
}

function makeUrl(query) {
  const url = new URL(endpoint);
  const filters = [
    "is_retracted:false",
    `to_publication_date:${currentSnapshotDate}`
  ];
  url.searchParams.set("search", query);
  url.searchParams.set("filter", filters.join(","));
  url.searchParams.set("per-page", "100");
  url.searchParams.set("select", [
    "id", "doi", "title", "publication_year", "publication_date", "type",
    "cited_by_count", "authorships", "primary_location", "best_oa_location",
    "open_access", "is_retracted", "language", "referenced_works_count", "relevance_score"
  ].join(","));
  if (apiKey) url.searchParams.set("api_key", apiKey);
  if (mailto) url.searchParams.set("mailto", mailto);
  return url;
}

function workId(work) {
  const doi = normalizeDoi(work.doi);
  if (doi) return `paper:doi:${doi}`;
  return `paper:openalex:${work.id.split("/").at(-1).toLowerCase()}`;
}

function authorityTier(work) {
  if (work.publication_year >= 2023 && work.cited_by_count >= 100) return "frontier-established";
  if (work.cited_by_count >= 2000) return "seminal-or-field-defining";
  if (work.cited_by_count >= 500) return "high-impact-core";
  if (work.cited_by_count >= 100) return "established";
  if (work.publication_year >= 2023) return "recent-frontier";
  return "specialist-supporting";
}

function simplify(work, field, topic, query, selectionBand, searchRank) {
  const doi = normalizeDoi(work.doi);
  const primary = work.primary_location;
  const bestOa = work.best_oa_location;
  const authors = (work.authorships ?? [])
    .map((entry) => entry.author?.display_name)
    .filter(Boolean)
    .slice(0, 20);
  return {
    id: workId(work),
    field,
    kind: "paper",
    title: work.title,
    authors,
    year: work.publication_year,
    publication_date: work.publication_date,
    type: work.type,
    venue: primary?.source?.display_name ?? null,
    doi,
    openalex_id: work.id,
    official_url: doi ? `https://doi.org/${doi}` : (primary?.landing_page_url ?? work.id),
    cited_by_count_snapshot: work.cited_by_count,
    relevance_score_snapshot: work.relevance_score ?? null,
    search_rank_snapshot: searchRank,
    referenced_works_count: work.referenced_works_count,
    language: work.language,
    topics: [topic],
    source_query: query,
    authority_tier: authorityTier(work),
    selection_reason: `${selectionBand}；先按 OpenAlex 全文检索相关性收窄，再以引用影响与主题覆盖复核，引用数为 ${currentSnapshotDate} 的快照。`,
    open_access: {
      is_oa: Boolean(work.open_access?.is_oa),
      status: work.open_access?.oa_status ?? null,
      landing_page_url: bestOa?.landing_page_url ?? null,
      pdf_url: bestOa?.pdf_url ?? null,
      license: bestOa?.license ?? null
    },
    retrieved_at: updatedAt
  };
}

function eligible(work) {
  return Boolean(
    work?.id && work?.title && work?.publication_year && work?.authorships?.length &&
    !work.is_retracted && allowedTypes.has(work.type)
  );
}

function matchesTitle(work, terms = []) {
  if (!terms.length) return true;
  const title = work.title.toLocaleLowerCase();
  return terms.some((term) => title.includes(term.toLocaleLowerCase()));
}

function mergeRecord(target, incoming) {
  target.topics = [...new Set([...target.topics, ...incoming.topics])];
  if (incoming.cited_by_count_snapshot > target.cited_by_count_snapshot) {
    target.cited_by_count_snapshot = incoming.cited_by_count_snapshot;
  }
  if (!target.open_access.pdf_url && incoming.open_access.pdf_url) target.open_access = incoming.open_access;
  return target;
}

for (const [field, config] of Object.entries(fields)) {
  if (selectedField && field !== selectedField) continue;
  const requests = config.paperQueries.map(([topic, query, titleTerms = []]) => ({ topic, query, titleTerms }));
  const responses = await mapLimit(requests, 1, async (request) => {
    const data = await fetchJson(makeUrl(request.query));
    return { ...request, works: (data.results ?? []).filter((work) => eligible(work) && matchesTitle(work, request.titleTerms)) };
  });

  const selected = [];
  const reserveByTopic = new Map(config.paperQueries.map(([topic]) => [topic, []]));
  for (const response of responses) {
    const mapped = response.works.map((work, index) => simplify(work, field, response.topic, response.query, "按检索相关性选出的主题核心文献", index + 1));
    const isLargeCatalog = targetPerField >= 300;
    const classic = mapped.slice(0, isLargeCatalog ? 12 : 8);
    const recent = mapped
      .filter((record) => record.year >= Number(recentFrom.slice(0, 4)) && !classic.some((item) => item.id === record.id))
      .slice(0, isLargeCatalog ? 8 : 4)
      .map((record) => ({ ...record, selection_reason: record.selection_reason.replace("主题核心文献", "前沿与更新证据") }));
    selected.push(...classic, ...recent);
    const selectedIds = new Set([...classic, ...recent].map((record) => record.id));
    reserveByTopic.get(response.topic).push(...mapped.filter((record) => !selectedIds.has(record.id)));
  }

  const byId = new Map();
  for (const record of selected) {
    const existing = byId.get(record.id);
    byId.set(record.id, existing ? mergeRecord(existing, record) : record);
  }

  let reserveIndex = 0;
  const topics = config.paperQueries.map(([topic]) => topic);
  while (byId.size < targetPerField) {
    let added = false;
    for (const topic of topics) {
      const reserve = reserveByTopic.get(topic);
      const record = reserve[reserveIndex];
      if (!record) continue;
      const existing = byId.get(record.id);
      byId.set(record.id, existing ? mergeRecord(existing, record) : record);
      added = true;
      if (byId.size >= targetPerField) break;
    }
    reserveIndex += 1;
    if (!added) break;
  }

  const records = [...byId.values()]
    .sort((a, b) => {
      const impact = b.cited_by_count_snapshot - a.cited_by_count_snapshot;
      return impact || a.search_rank_snapshot - b.search_rank_snapshot;
    })
    .slice(0, targetPerField);
  await writeJson(path.join(fieldsDir, field, "papers.json"), {
    field,
    title: config.title,
    snapshot_date: currentSnapshotDate,
    provider: "OpenAlex",
    selection_method: `${config.paperQueries.length} 个子主题分别抽取经典高影响与 2023 年以来近期论文，按 DOI/OpenAlex ID 去重并保留主题交叉；Tavily 用于来源地图、权威候选与教材骨架审计。`,
    caveat: "这是可复核的核心参考文献层，不以引用数代替论文质量判断；课程写作前仍需阅读原文并核验具体结论。",
    records
  });
  console.log(`${field}: ${records.length} papers (${records.filter((record) => record.year >= 2023).length} since 2023)`);
}
