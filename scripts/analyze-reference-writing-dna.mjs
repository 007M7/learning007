import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const repo = path.join(process.cwd(), "knowledge-base", "cache", "reference", "awesome-architecture");
const sourceDir = path.join(repo, "tutorial");
const outputDir = path.join(process.cwd(), "docs", "writing-dna", "awesome-architecture", "_meta");
await mkdir(outputDir, { recursive: true });

const files = (await readdir(sourceDir)).filter((name) => /^\d{2}-.*\.md$/.test(name)).sort();
const stopWords = new Set("的了是在和与也就都而及或一个我们你它这那把被让对从中为有会不没有可以如果到用上里下时后前更最很又才所但并其来去做说看能要将还等因为所以以及通过进行需要应该已经这个这些那些什么怎么为什么系统架构技术问题内容一种一些自己他们然后同时其中这里本章就是不是".split(""));
const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" });
const frequencies = new Map();

function groupFor(number) {
  if (number <= 3) return "建立思维";
  if (number <= 6) return "掌握工具箱";
  if (number <= 9) return "实战与演进";
  if (number <= 17) return "进阶硬道理";
  if (number <= 22) return "实战篇";
  if (number <= 26) return "AI协同设计";
  if (number <= 34) return "技术栈选型";
  return "AI原生组织";
}

function typeFor(number) {
  if ([1, 2, 9, 17, 35, 36, 37, 38, 39, 40].includes(number)) return "概念启蒙/综合判断";
  if (number >= 10 && number <= 16) return "原理深挖";
  if (number >= 18 && number <= 22) return "案例演练/迁移实战";
  if (number >= 23 && number <= 26) return "协作方法/检查清单";
  if (number >= 27 && number <= 34) return "决策与选型";
  return "概念工具/跟做实战";
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<Quiz[\s\S]*?\/>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_`|\-–—┌┐└┘├┤┬┴┼─│▶◀▼▲]/g, " ");
}

const records = [];
for (const file of files) {
  const text = await readFile(path.join(sourceDir, file), "utf8");
  const number = Number(file.slice(0, 2));
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file.replace(/\.md$/, "");
  const heading2 = [...text.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const heading3 = [...text.matchAll(/^###\s+(.+)$/gm)].map((match) => match[1].trim());
  const plain = stripMarkdown(text);
  const paragraphs = plain.split(/\n\s*\n/).map((value) => value.replace(/\s+/g, "").trim()).filter((value) => value.length >= 8);
  const sentences = plain.split(/[。！？!?；;]/).map((value) => value.replace(/\s+/g, "").trim()).filter((value) => value.length >= 2);
  const sentenceLengths = sentences.map((sentence) => [...sentence].length);
  const externalLinks = [...text.matchAll(/\[[^\]]+\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
  const intro = text.split(/^---\s*$/m).slice(0, 2).join("\n");
  for (const item of segmenter.segment(plain)) {
    const word = item.segment.trim().toLowerCase();
    if (!item.isWordLike || word.length < 2 || stopWords.has(word)) continue;
    frequencies.set(word, (frequencies.get(word) ?? 0) + 1);
  }
  records.push({
    file,
    number,
    title,
    date: "2026-08-21",
    author: "study8677",
    column: groupFor(number),
    article_type: typeFor(number),
    topic_tags: heading2.slice(0, 5),
    hook_type: /\?|？/.test(intro) ? "问题式/观点式" : "观点式/场景式",
    structure_pattern: number >= 27 && number <= 34 ? "约束→比较维度→决策树→案例" : number >= 18 && number <= 22 ? "任务链→跟做→证据→迁移" : "误解/冲突→机制展开→案例→检验→承接",
    source_types: [
      externalLinks.length ? "外部案例/公开资料" : null,
      /真实案例|案例/.test(text) ? "案例" : null,
      /```/.test(text) ? "代码/ASCII示意" : null,
      /^\|/m.test(text) ? "对比表" : null
    ].filter(Boolean),
    character_count: text.length,
    paragraph_count: paragraphs.length,
    sentence_count: sentences.length,
    average_sentence_characters: Number((sentenceLengths.reduce((sum, value) => sum + value, 0) / sentenceLengths.length).toFixed(1)),
    short_sentence_ratio: Number((sentenceLengths.filter((value) => value <= 15).length / sentenceLengths.length).toFixed(3)),
    long_sentence_ratio: Number((sentenceLengths.filter((value) => value >= 50).length / sentenceLengths.length).toFixed(3)),
    average_sentences_per_paragraph: Number((sentences.length / paragraphs.length).toFixed(2)),
    h2_count: heading2.length,
    h3_count: heading3.length,
    h2_headings: heading2,
    h3_headings: heading3,
    code_block_count: Math.floor((text.match(/```/g)?.length ?? 0) / 2),
    ascii_diagram_count: [...text.matchAll(/```[\s\S]*?[┌┐└┘├┤┬┴┼─│▶◀▼▲][\s\S]*?```/g)].length,
    table_row_count: [...text.matchAll(/^\|/gm)].length,
    image_count: [...text.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length,
    external_link_count: externalLinks.length,
    bold_span_count: Math.floor((text.match(/\*\*/g)?.length ?? 0) / 2),
    blockquote_line_count: [...text.matchAll(/^>\s?/gm)].length,
    quiz_count: [...text.matchAll(/<Quiz/g)].length,
    has_summary: /##\s+本章小结/.test(text),
    notable: `${heading2.length} 个二级标题；${Math.floor((text.match(/```/g)?.length ?? 0) / 2)} 个代码或文本图块；${externalLinks.length} 个外部链接。`
  });
}

const totals = (key) => records.map((record) => record[key]);
const average = (values) => Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
const sortedFrequency = [...frequencies.entries()].sort((a, b) => b[1] - a[1]);
const statistics = {
  source_repository: "https://github.com/study8677/awesome-architecture",
  source_commit: "7f43e49b95ad9c255418733738fddab4eb0f6a68",
  license: "MIT",
  analyzed_at: "2026-08-31",
  article_count: records.length,
  total_characters: totals("character_count").reduce((sum, value) => sum + value, 0),
  averages: {
    characters: average(totals("character_count")),
    paragraphs: average(totals("paragraph_count")),
    sentence_characters: average(totals("average_sentence_characters")),
    sentences_per_paragraph: average(totals("average_sentences_per_paragraph")),
    h2: average(totals("h2_count")),
    h3: average(totals("h3_count")),
    code_blocks: average(totals("code_block_count")),
    table_rows: average(totals("table_row_count")),
    bold_spans: average(totals("bold_span_count")),
    external_links: average(totals("external_link_count"))
  },
  ranges: {
    characters: [Math.min(...totals("character_count")), Math.max(...totals("character_count"))],
    h2: [Math.min(...totals("h2_count")), Math.max(...totals("h2_count"))],
    code_blocks: [Math.min(...totals("code_block_count")), Math.max(...totals("code_block_count"))]
  },
  format_presence: {
    quiz: records.filter((record) => record.quiz_count > 0).length,
    summary: records.filter((record) => record.has_summary).length,
    ascii_diagram: records.filter((record) => record.ascii_diagram_count > 0).length,
    table: records.filter((record) => record.table_row_count > 0).length,
    markdown_image: records.filter((record) => record.image_count > 0).length
  },
  frequent_terms: sortedFrequency.slice(0, 150).map(([term, count]) => ({ term, count }))
};

await writeFile(path.join(outputDir, "corpus.json"), `${JSON.stringify(records, null, 2)}\n`);
await writeFile(path.join(outputDir, "corpus-statistics.json"), `${JSON.stringify(statistics, null, 2)}\n`);
console.log(`Analyzed ${records.length} articles (${statistics.total_characters} characters).`);
