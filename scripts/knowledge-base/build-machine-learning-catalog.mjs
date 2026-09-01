import { writeFile } from "node:fs/promises";
import path from "node:path";

const checkedAt = "2026-09-01";
const output = path.resolve("docs/public/data/knowledge-base/machine-learning.json");

const modules = [
  { id: "foundations", name: "入门与统计学习", goal: "建立问题、数据、监督学习与模型评价的第一套完整框架。" },
  { id: "theory", name: "数学、优化与泛化", goal: "理解优化、正则化、经验风险、模型容量与泛化行为。" },
  { id: "classical", name: "经典模型与表格学习", goal: "掌握树、核方法、集成学习、降维、AutoML 与模型解释。" },
  { id: "data-eval", name: "数据、评测与分布偏移", goal: "处理数据质量、标签、切分、校准、泄漏和分布变化。" },
  { id: "trustworthy", name: "因果、公平、安全与不确定性", goal: "区分预测与干预，理解可靠性、群体影响、隐私和攻击面。" },
  { id: "production", name: "生产机器学习", goal: "把模型接入数据、服务、监控、分布式训练和持续改进流程。" },
];

const books = [
  ["book-islr", "An Introduction to Statistical Learning", "Gareth James、Daniela Witten、Trevor Hastie、Robert Tibshirani", "2013", ["foundations", "classical"], "starter", "统计学习、重采样、线性模型、树和无监督学习的入门主教材。", "https://www.statlearning.com/s/ISLRSeventhPrinting.pdf"],
  ["book-understanding-ml", "Understanding Machine Learning: From Theory to Algorithms", "Shai Shalev-Shwartz、Shai Ben-David", "2014", ["theory"], "advanced", "系统学习 PAC、经验风险、在线学习、核方法、优化与泛化理论。", "https://www.cs.huji.ac.il/~shais/UnderstandingMachineLearning/understanding-machine-learning-theory-algorithms.pdf"],
  ["book-mathematics-ml", "Mathematics for Machine Learning", "Marc Peter Deisenroth、A. Aldo Faisal、Cheng Soon Ong", "2020", ["theory"], "core", "按机器学习用途组织线性代数、矩阵分解、微积分与概率。", "https://mml-book.github.io/book/mml-book.pdf"],
  ["book-probml-intro", "Probabilistic Machine Learning: An Introduction", "Kevin P. Murphy", "2022", ["theory", "classical"], "core", "连接概率建模、决策理论、经典机器学习与现代深度学习。", "https://probml.github.io/pml-book/book1.html"],
  ["book-probml-advanced", "Probabilistic Machine Learning: Advanced Topics", "Kevin P. Murphy", "2023", ["theory", "trustworthy"], "advanced", "覆盖高级推断、结构化模型、因果、生成模型与不确定性。", "https://probml.github.io/pml-book/book2.html"],
  ["book-fairness-ml", "Fairness and Machine Learning", "Solon Barocas、Moritz Hardt、Arvind Narayanan", "2023", ["trustworthy", "data-eval"], "core", "把测量、模型、行动、群体影响与反馈放进社会技术框架。", "https://fairmlbook.org/pdf/fairmlbook.pdf"],
  ["book-causal-what-if", "Causal Inference: What If", "Miguel A. Hernán、James M. Robins", "2026", ["trustworthy"], "advanced", "以目标试验、识别假设和观察数据为主线学习现代因果推断。", "https://miguelhernan.org/s/hernanrobins_WhatIf_19aug26.pdf"],
  ["book-interpretable-ml", "Interpretable Machine Learning", "Christoph Molnar", "持续更新", ["classical", "trustworthy"], "core", "系统比较解释方法，并明确特征归因的假设与不可外推边界。", "https://christophm.github.io/interpretable-ml-book/"],
  ["book-deep-learning", "Deep Learning", "Ian Goodfellow、Yoshua Bengio、Aaron Courville", "2016", ["theory"], "core", "神经网络、优化、正则化、表示学习与生成模型的开放在线教材。", "https://www.deeplearningbook.org/"],
  ["book-gpml", "Gaussian Processes for Machine Learning", "Carl Edward Rasmussen、Christopher K. I. Williams", "2006", ["theory", "classical", "trustworthy"], "advanced", "高斯过程、核、边际似然与预测不确定性的经典专著。", "https://gaussianprocess.org/gpml/chapters/RW.pdf"],
  ["book-convex-optimization", "Convex Optimization", "Stephen Boyd、Lieven Vandenberghe", "2004", ["theory"], "advanced", "理解凸集、对偶、约束优化和机器学习优化问题的基础教材。", "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf"],
  ["book-foundations-data-science", "Foundations of Data Science", "Avrim Blum、John Hopcroft、Ravindran Kannan", "2020", ["foundations", "theory"], "core", "从高维几何、随机投影、谱方法和聚类建立数据科学理论基础。", "https://www.cs.cornell.edu/jeh/book.pdf"],
  ["book-d2l", "Dive into Deep Learning", "Aston Zhang、Zachary C. Lipton、Mu Li、Alexander J. Smola", "持续更新", ["foundations", "theory"], "starter", "用可执行代码连接机器学习数学、模型训练和工程实现。", "https://d2l.ai/d2l-en.pdf"],
].map(([id, title, creator, year, resourceModules, level, role, contentUrl]) => ({
  id, type: "book", title, creator, year, modules: resourceModules, level, role,
  review_url: `/knowledge-base/reviews/machine-learning/${id.slice(5)}`,
  content_url: contentUrl,
  access: "open",
  verification: { status: "fulltext-url-verified", method: "tavily-and-official-source", checked_at: checkedAt },
}));

const arxivGroups = {
  foundations: ["1412.6980", "1711.05101", "1207.0580", "1502.03167", "1607.06450", "1609.04836", "1611.03530", "1912.02292", "1906.11300", "1710.09412", "1803.03635", "2201.02177", "2001.08361", "2203.15556", "1206.5533", "1503.02531", "1602.07868", "1511.07289", "1803.05407", "1907.08610", "1603.06560", "1206.2944", "1012.2599"],
  classical: ["1603.02754", "1706.09516", "1908.07442", "2012.06678", "2106.11959", "2207.01848", "2207.08815", "1802.03426", "0805.2368", "1705.07321", "1106.1813", "1612.08468", "1602.04938", "1705.07874", "1703.04730", "1703.01365", "1711.11279", "1909.06312", "1603.06212", "1908.00709"],
  "data-eval": ["1803.09010", "1810.03993", "1805.03677", "2303.10158", "1811.03402", "2012.07421", "2007.01434", "1407.7722", "1703.00512", "1706.04599", "1905.11659", "2107.07511", "2208.02814", "1506.02629", "1411.2664", "2011.03395", "2004.07780", "1906.02530", "1810.11953", "1802.03916", "2005.00687", "2009.10795", "1904.02868", "1911.07128", "1605.07723"],
  trustworthy: ["1104.3913", "1610.02413", "1709.02012", "1610.07524", "1412.3756", "1811.07867", "1711.07076", "1711.00399", "1702.08608", "1612.01474", "1703.04977", "1506.02142", "1610.05820", "1609.02943", "1607.00133", "1312.6199", "1412.6572", "1706.06083", "1510.04342", "1610.01271", "1608.00060", "1706.03461", "1606.03976", "1906.02120", "1705.08821", "2011.04216", "1803.01422", "1904.10098", "1907.02893", "1501.01332", "1911.10500", "2102.11107"],
  production: ["1712.05889", "1605.08695", "1602.05629", "1611.04482", "1912.04977", "2205.02302", "2003.12206"],
};

const groupRoles = {
  foundations: "优化、正则化、模型容量与泛化研究中的代表性原始论文。",
  classical: "经典模型、表格学习、自动化建模或模型解释中的代表性原始论文。",
  "data-eval": "数据质量、评测、校准、数据价值或分布偏移中的核心论文。",
  trustworthy: "公平、隐私、安全、不确定性或因果推断中的核心论文。",
  production: "分布式训练、联邦学习、机器学习系统或可复现工程中的核心论文。",
};

const manualPapers = [
  ["paper-useful-things", "A Few Useful Things to Know About Machine Learning", "Pedro Domingos", "2012", ["foundations", "data-eval"], "用实践反例校准泛化、过拟合、数据量、特征和模型复杂度判断。", "https://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf"],
  ["paper-random-forests", "Random Forests", "Leo Breiman", "2001", ["classical"], "随机森林的原始方法论文。", "https://www.stat.berkeley.edu/~breiman/randomforest2001.pdf"],
  ["paper-bagging", "Bagging Predictors", "Leo Breiman", "1996", ["classical"], "通过自助采样降低不稳定学习器方差的原始论文。", "https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf"],
  ["paper-adaboost", "A Decision-Theoretic Generalization of On-Line Learning and an Application to Boosting", "Yoav Freund、Robert E. Schapire", "1997", ["classical", "theory"], "AdaBoost 的原始理论与算法论文。", "https://www.face-rec.org/algorithms/Boosting-Ensemble/decision-theoretic_generalization.pdf"],
  ["paper-lightgbm", "LightGBM: A Highly Efficient Gradient Boosting Decision Tree", "Guolin Ke 等", "2017", ["classical", "production"], "大规模梯度提升中的 GOSS 与 EFB。", "https://proceedings.neurips.cc/paper_files/paper/2017/file/6449f44a102fde848669bdd9eb6b76fa-Paper.pdf"],
  ["paper-tsne", "Visualizing Data using t-SNE", "Laurens van der Maaten、Geoffrey Hinton", "2008", ["classical"], "t-SNE 的概率邻域建模与低维可视化方法。", "https://www.jmlr.org/papers/volume9/vandermaaten08a/vandermaaten08a.pdf"],
  ["paper-kmeans-plus-plus", "k-means++: The Advantages of Careful Seeding", "David Arthur、Sergei Vassilvitskii", "2007", ["classical"], "用概率化初始化改善 k-means 聚类质量。", "https://theory.stanford.edu/~sergei/papers/kMeansPP-soda.pdf"],
  ["paper-proper-scoring", "Strictly Proper Scoring Rules, Prediction, and Estimation", "Tilmann Gneiting、Adrian E. Raftery", "2007", ["data-eval", "trustworthy"], "概率预测与校准评价的理论基础。", "https://sites.stat.washington.edu/raftery/Research/PDF/Gneiting2007jasa.pdf"],
  ["paper-hidden-debt", "Hidden Technical Debt in Machine Learning Systems", "D. Sculley 等", "2015", ["production", "data-eval"], "把数据依赖、反馈回路和系统债务纳入模型设计。", "https://proceedings.neurips.cc/paper_files/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf"],
  ["paper-ml-test-score", "The ML Test Score: A Rubric for ML Production Readiness and Technical Debt Reduction", "Eric Breck 等", "2017", ["production"], "用测试与监控清单评估生产机器学习系统的准备程度。", "https://storage.googleapis.com/gweb-research2023-media/pubtools/4156.pdf"],
  ["paper-gender-shades", "Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification", "Joy Buolamwini、Timnit Gebru", "2018", ["trustworthy", "data-eval"], "用交叉群体切片揭示商业分类系统的性能差异。", "https://proceedings.mlr.press/v81/buolamwini18a/buolamwini18a.pdf"],
];

function decodeXml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&#39;", "'").replaceAll("&quot;", '"');
}

function pick(block, tag) {
  return decodeXml((block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1] ?? "").replace(/\s+/g, " ").trim());
}

async function fetchArxivMetadata(ids) {
  const url = `https://export.arxiv.org/api/query?id_list=${ids.join(",")}&max_results=${ids.length}`;
  const response = await fetch(url, { headers: { "user-agent": "learning007-resource-catalog/1.0" } });
  if (!response.ok) throw new Error(`arXiv API ${response.status}`);
  const xml = await response.text();
  return Object.fromEntries([...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => {
    const block = match[1];
    const id = pick(block, "id").match(/\/abs\/(\d{4}\.\d{4,5})/)?.[1];
    const authors = [...block.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>/g)].map((author) => decodeXml(author[1].trim()));
    return [id, { title: pick(block, "title"), creator: authors.join("、"), year: pick(block, "published").slice(0, 4) }];
  }));
}

const ids = [...new Set(Object.values(arxivGroups).flat())];
const metadata = await fetchArxivMetadata(ids);
const arxivPapers = Object.entries(arxivGroups).flatMap(([group, groupIds]) => groupIds.map((arxivId) => {
  const paper = metadata[arxivId];
  if (!paper?.title || !paper?.creator || !paper?.year) throw new Error(`Missing arXiv metadata for ${arxivId}`);
  const resourceModules = group === "foundations" ? ["foundations", "theory"] : [group];
  return {
    id: `paper-arxiv-${arxivId.replace(".", "-")}`,
    type: "paper",
    ...paper,
    modules: resourceModules,
    level: group === "foundations" ? "core" : "advanced",
    role: groupRoles[group],
    content_url: `https://arxiv.org/pdf/${arxivId}`,
    access: "open",
    verification: { status: "fulltext-url-verified", method: "arxiv-api-and-tavily-structure", checked_at: checkedAt },
  };
}));

const resources = [
  ...books,
  ...manualPapers.map(([id, title, creator, year, resourceModules, role, contentUrl]) => ({
    id, type: "paper", title, creator, year, modules: resourceModules, level: "core", role,
    content_url: contentUrl,
    access: "open",
    verification: { status: "fulltext-url-verified", method: "tavily-and-official-source", checked_at: checkedAt },
  })),
  ...arxivPapers,
];

const catalog = {
  schema_version: 2,
  field: "machine-learning",
  title: "机器学习",
  updated_at: checkedAt,
  storage_policy: "仅保存无需登录即可直接阅读的书籍正文或论文全文 URL 与结构化元数据；不保存课程，不下载、不镜像原文。",
  selection_policy: [
    "先依据学科主线、权威教材书目和代表性研究脉络确定候选，再核验全文入口。",
    "书籍链接必须直接打开 PDF 或作者维护的在线正文，购买页、登录页和只有简介的页面不收录。",
    "论文链接必须直接打开全文，优先 arXiv、PMLR、JMLR、会议论文集或作者主页 PDF。",
    "收录表示全文入口可用，不代表文章已经引用；写作时仍需记录实际阅读范围与采用观点。",
  ],
  modules,
  resources,
};

await writeFile(output, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
const paperCount = resources.filter((resource) => resource.type === "paper").length;
console.log(`machine-learning catalog: ${books.length} books, ${paperCount} papers, ${resources.length} resources`);
