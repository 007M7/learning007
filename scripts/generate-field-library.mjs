import { fieldEvidenceCutoff, learningFieldBySlug, learningFields } from "../docs/.vitepress/field-curriculum.ts";
import { writeDomain, writeOverview } from "./field-content/library-writer.mjs";
import machineLearning from "./field-content/machine-learning.mjs";
import deepLearning from "./field-content/deep-learning.mjs";
import nlp from "./field-content/nlp.mjs";
import aiProduct from "./field-content/ai-product.mjs";
import lowAltitude from "./field-content/low-altitude.mjs";
import robotics from "./field-content/robotics.mjs";

const domains = { machineLearning, deepLearning, nlp, aiProduct, lowAltitude, robotics };

writeOverview(learningFields, fieldEvidenceCutoff);
for (const [slug, domain] of Object.entries(domains)) {
  const field = learningFieldBySlug[slug.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)];
  if (!field) throw new Error(`Unknown field data: ${slug}`);
  const evidenceClusters = new Set(field.chapters.map((_, index) => Math.floor(index / 4))).size;
  if (domain.details.length !== evidenceClusters) throw new Error(`${slug} expected ${evidenceClusters} source clusters, received ${domain.details.length}`);
  writeDomain(field, domain, fieldEvidenceCutoff);
}

console.log(`Generated ${learningFields.length} fields / ${learningFields.reduce((sum, field) => sum + field.chapters.length, 0)} chapters.`);
