import { defineConfig } from "vitepress";
import {
  aiLearningSidebar,
  knowledgeBaseSidebar,
  learningHubSidebar,
  modelLearningSidebar,
  physicalLearningSidebar,
  qualityLearningSidebar,
  softwareLearningSidebar,
} from "./learning-navigation";

export default defineConfig({
  title: "Learning 007",
  description: "面向非科班学习者的 AI 编码与系统工程可视化学习图谱",
  lang: "zh-CN",
  base: process.env.GITHUB_ACTIONS ? "/learning007/" : "/",
  cleanUrls: true,
  lastUpdated: true,
  markdown: { lineNumbers: true, math: true },
  head: [
    ["meta", { name: "theme-color", content: "#256f68" }],
    ["meta", { property: "og:title", content: "Learning 007" }],
    ["meta", { property: "og:description", content: "从看懂系统到可靠地使用 AI 编码：教程、知识地图、案例与掌握证据。" }],
  ],
  themeConfig: {
    logo: { src: "/logo.svg", alt: "Learning 007" },
    nav: [
      { text: "首页", link: "/" },
      { text: "学习", link: "/learn/" },
      { text: "知识库", link: "/knowledge-base/" },
    ],
    sidebar: {
      "/knowledge-base/": knowledgeBaseSidebar(),
      "/sources/": knowledgeBaseSidebar(),

      "/domains/software/": softwareLearningSidebar(),
      "/advanced/software/": softwareLearningSidebar(),

      "/domains/quality/": qualityLearningSidebar(),
      "/advanced/quality/": qualityLearningSidebar(),

      "/domains/ai/": aiLearningSidebar(),
      "/advanced/ai/": aiLearningSidebar(),
      "/frontier/agents/": aiLearningSidebar(),
      "/fields/ai-product/": aiLearningSidebar(),

      "/fields/machine-learning/": modelLearningSidebar(),
      "/fields/deep-learning/": modelLearningSidebar(),
      "/fields/nlp/": modelLearningSidebar(),

      "/fields/low-altitude/": physicalLearningSidebar(),
      "/fields/robotics/": physicalLearningSidebar(),

      "/learn/": learningHubSidebar(),
      "/guide/": learningHubSidebar(),
      "/map/": learningHubSidebar(),
      "/cases/": learningHubSidebar(),
      "/templates/": learningHubSidebar(),
      "/advanced/": learningHubSidebar(),
      "/fields/": learningHubSidebar(),
    },
    search: { provider: "local" },
    outline: { label: "本页目录", level: [2, 3] },
    docFooter: { prev: "上一页", next: "下一页" },
    lastUpdated: { text: "最后更新" },
    socialLinks: [{ icon: "github", link: "https://github.com/007M7/learning007" }],
    footer: { message: "知识地图用于导航，项目与解释证据才代表掌握。", copyright: "Learning 007" },
  },
});
