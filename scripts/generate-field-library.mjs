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
  if (domain.details.length !== field.chapters.length) throw new Error(`${slug} expected ${field.chapters.length} details, received ${domain.details.length}`);
  writeDomain(field, domain, fieldEvidenceCutoff);
}

console.log(`Generated ${learningFields.length} fields / ${learningFields.reduce((sum, field) => sum + field.chapters.length, 0)} chapters.`);
