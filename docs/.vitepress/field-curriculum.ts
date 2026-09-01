import machineLearning from "./field-curricula/machine-learning.ts";
import deepLearning from "./field-curricula/deep-learning.ts";
import nlp from "./field-curricula/nlp.ts";
import aiProduct from "./field-curricula/ai-product.ts";
import lowAltitude from "./field-curricula/low-altitude.ts";
import robotics from "./field-curricula/robotics.ts";
import type { FieldChapter, LearningField, LessonLens } from "./field-curricula/types.ts";

export type { FieldChapter, LearningField, LessonLens };

export const fieldEvidenceCutoff = "2026-08-30";
export const learningFields: LearningField[] = [machineLearning, deepLearning, nlp, aiProduct, lowAltitude, robotics];
export const learningFieldBySlug = Object.fromEntries(learningFields.map((field) => [field.slug, field])) as Record<string, LearningField>;
export const fieldChapterCount = learningFields.reduce((sum, field) => sum + field.chapters.length, 0);
export const fieldNodeCount = learningFields.reduce((sum, field) => sum + field.chapters.flatMap((chapter) => chapter.ids).length, 0);

export function fieldSidebar(slug: string) {
  const field = learningFieldBySlug[slug];
  if (!field) return [];
  const stages = [...new Set(field.chapters.map((chapter) => chapter.stage))];
  return [
    {
      text: field.title,
      items: [
        { text: "领域总览与近期队列", link: `/fields/${slug}/` },
        { text: `${field.chapters.length} 章学习路线`, link: `/fields/${slug}/roadmap` },
        { text: "证据账本与更新规则", link: `/fields/${slug}/evidence` },
        ...(field.fieldSummary ? [field.fieldSummary] : []),
      ],
    },
    ...stages.map((stage) => ({
      text: stage,
      collapsed: true,
      items: [
        ...field.chapters.filter((chapter) => chapter.stage === stage).map(({ text, link }) => ({ text, link })),
        ...(field.stageSummaries ?? []).filter((summary) => summary.stage === stage).map(({ text, link }) => ({ text, link })),
      ],
    })),
  ];
}
