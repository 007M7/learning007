export type LessonLens = "orientation" | "concept" | "mechanism" | "derivation" | "guided" | "case" | "decision" | "frontier" | "synthesis";

export interface FieldChapter {
  title: string;
  text: string;
  link: string;
  ids: string[];
  question: string;
  sources: string[];
  outcome: string;
  stage: string;
  lens: LessonLens;
  insight: string;
}

export interface LearningField {
  slug: string;
  title: string;
  shortTitle: string;
  prefix: string;
  color: string;
  promise: string;
  project: string;
  chapters: FieldChapter[];
}

export type ChapterSeed = {
  stage: string;
  slug: string;
  title: string;
  lens: LessonLens;
  question: string;
  outcome: string;
  sources: string[];
  insight?: string;
};

export type FieldMeta = Omit<LearningField, "chapters">;

export const defineField = (meta: FieldMeta, seeds: ChapterSeed[]): LearningField => {
  if (seeds.length !== 40) throw new Error(`${meta.slug} 应有 40 个独立主题，实际 ${seeds.length}`);
  const seen = new Set<string>();
  const chapters = seeds.map((seed, index): FieldChapter => {
    const number = String(index + 1).padStart(2, "0");
    if (seen.has(seed.slug)) throw new Error(`${meta.slug} 存在重复章节 slug：${seed.slug}`);
    seen.add(seed.slug);
    return {
      ...seed,
      insight: seed.insight ?? `${seed.title}必须把“${seed.question}”转化为可检验的机制，并最终产出${seed.outcome}。`,
      text: `${number} · ${seed.title}`,
      link: `/fields/${meta.slug}/${number}-${seed.slug}`,
      ids: [`${meta.prefix}${number}`],
    };
  });
  return { ...meta, chapters };
};

export const lesson = (
  stage: string,
  slug: string,
  title: string,
  lens: LessonLens,
  question: string,
  outcome: string,
  sources: string[],
): ChapterSeed => ({ stage, slug, title, lens, question, outcome, sources });
