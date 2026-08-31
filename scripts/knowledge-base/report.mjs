import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fields, updatedAt } from "./field-config.mjs";
import { fieldsDir, knowledgeBaseDir, readJson, writeJson } from "./utils.mjs";

const sections = [
  "# 学科来源知识库完成报告",
  "",
  `数据整理日期：${updatedAt}。论文时间边界：抓取日前一天；书籍来源已经 Tavily 官方域名检索审计。`,
  "",
  "> “已下载”只表示从作者、大学、出版社、政府或标准组织的公开链接取得全文并记录 SHA-256；商业版权书从未从非授权来源下载。",
  ""
];

for (const [field, config] of Object.entries(fields)) {
  const booksData = await readJson(path.join(fieldsDir, field, "books.json"));
  const papersData = await readJson(path.join(fieldsDir, field, "papers.json"));
  let readingEvidence = null;
  try {
    readingEvidence = await readJson(path.join(fieldsDir, field, "reading-evidence.json"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const books = booksData.records;
  const papers = papersData.records;
  const statusCounts = Object.groupBy(books, (record) => record.access.status);
  const downloaded = books.filter((record) => record.access.local_path);
  const failures = books.filter((record) => record.access.status === "open_fulltext" && record.access.download_error);
  const oaPapers = papers.filter((record) => record.open_access.is_oa).length;
  const recentPapers = papers.filter((record) => record.year >= 2023).length;
  const readingSources = readingEvidence?.sources ?? [];
  const sourceStateCounts = Object.groupBy(readingSources, (record) => record.acquisition.state);
  const sourceGroundedLessons = readingEvidence?.lessons?.length ?? 0;
  const topicCounts = Object.fromEntries(config.paperQueries.map(([topic]) => [
    topic,
    papers.filter((record) => record.topics.includes(topic)).length
  ]));
  const venueCounts = Object.entries(Object.groupBy(papers.filter((record) => record.venue), (record) => record.venue))
    .map(([venue, records]) => [venue, records.length])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const summary = {
    field,
    title: config.title,
    updated_at: updatedAt,
    books: {
      total: books.length,
      downloaded_open_fulltext: downloaded.length,
      declared_open_fulltext: statusCounts.open_fulltext?.length ?? 0,
      official_online: statusCounts.official_online?.length ?? 0,
      commercial_metadata_only: statusCounts.commercial?.length ?? 0,
      download_failures: failures.length
    },
    papers: {
      total: papers.length,
      open_access: oaPapers,
      since_2023: recentPapers,
      snapshot_date: papersData.snapshot_date,
      topic_counts: topicCounts,
      top_venues: Object.fromEntries(venueCounts)
    },
    reading_evidence: {
      source_ledger_present: Boolean(readingEvidence),
      retrieved_or_beyond: readingSources.filter((record) => ["retrieved", "extracted", "read", "cited"].includes(record.acquisition.state)).length,
      read_or_cited: readingSources.filter((record) => ["read", "cited"].includes(record.acquisition.state)).length,
      cited: sourceStateCounts.cited?.length ?? 0,
      source_grounded_lessons: sourceGroundedLessons
    }
  };
  await writeJson(path.join(fieldsDir, field, "summary.json"), summary);

  sections.push(`## ${config.title}`, "");
  sections.push(`- 书籍/手册：${books.length}；开放全文已下载 ${downloaded.length}；仅官方在线 ${summary.books.official_online}；商业书仅元数据 ${summary.books.commercial_metadata_only}；下载失败 ${failures.length}。`);
  sections.push(`- 核心论文：${papers.length}；其中开放获取 ${oaPapers}；2023 年以来 ${recentPapers}；子主题覆盖 ${Object.values(topicCounts).filter(Boolean).length}/10。`);
  sections.push(readingEvidence
    ? `- 章节级来源账本：已取得或进一步处理 ${summary.reading_evidence.retrieved_or_beyond} 份；已读或正文引用 ${summary.reading_evidence.read_or_cited} 份；支撑 ${sourceGroundedLessons} 篇原稿驱动正式章。具体阅读页码、文件哈希和采用观点见 \`fields/${field}/reading-evidence.json\`。`
    : `- 章节级来源账本：尚未建立；该领域现有页面不得声称已按书籍原稿写成正式章。`);
  sections.push(`- 论文元数据快照：OpenAlex ${papersData.snapshot_date}；完整记录见 \`fields/${field}/papers.json\`。`, "");
  sections.push("| 书籍或手册 | 年份 | 获取状态 | 本地结果 |", "|---|---:|---|---|");
  for (const book of books) {
    const result = book.access.local_path
      ? `已下载（${(book.access.bytes / 1024 / 1024).toFixed(1)} MB）`
      : book.access.download_error
        ? `失败：${book.access.download_error.replaceAll("|", "\\|")}`
        : book.access.status === "commercial" ? "仅官方书目信息" : "官方在线阅读";
    sections.push(`| [${book.title}](${book.official_url}) | ${book.year} | ${book.access.status} | ${result} |`);
  }
  sections.push("", `主题分布：${Object.entries(topicCounts).map(([topic, count]) => `${topic} ${count}`).join("；")}。`, "");
}

sections.push(
  "## 维护说明",
  "",
  "- `npm run kb:refresh`：重建书籍种子并刷新论文快照；稳定 ID 采用 DOI，缺失 DOI 时采用 OpenAlex ID。",
  "- `npm run kb:download-books`：只处理标记为 `open_fulltext` 的官方公开链接，验证 PDF 文件头并记录哈希。",
  "- `npm run kb:validate`：验证每领域至少 10 本书、100 篇论文、唯一 ID、必要字段、十个子主题覆盖与缓存完整性。",
  "- `reading-evidence.json` 使用 catalogued → retrieved → extracted → read → cited 五级状态；只有登记具体阅读范围并通过来源真实性检查的文章才可称为正式章。",
  "- Tavily 原始教材检索快照保存在 `snapshots/tavily/`，可按日期追加并审计来源变更。",
  "- 引用数是候选筛选信号，不是结论真伪；课程正文写作必须回到原论文的方法、实验和局限。",
  ""
);

await writeFile(path.join(knowledgeBaseDir, "REPORT.md"), sections.join("\n"), "utf8");
console.log("knowledge-base/REPORT.md generated");
