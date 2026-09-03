import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import LearningExplorer from "./components/LearningExplorer.vue";
import LearningPath from "./components/LearningPath.vue";
import Quiz from "./components/Quiz.vue";
import CurriculumMap from "./components/CurriculumMap.vue";
import DecisionCard from "./components/DecisionCard.vue";
import EvidenceTracker from "./components/EvidenceTracker.vue";
import AdvancedMap from "./components/AdvancedMap.vue";
import AgentFrontierMap from "./components/AgentFrontierMap.vue";
import FieldMap from "./components/FieldMap.vue";
import KnowledgeFlow from "./components/KnowledgeFlow.vue";
import ResourceLibrary from "./components/ResourceLibrary.vue";
import SiteKnowledgeGraph from "./components/SiteKnowledgeGraph.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("LearningExplorer", LearningExplorer);
    app.component("LearningPath", LearningPath);
    app.component("Quiz", Quiz);
    app.component("CurriculumMap", CurriculumMap);
    app.component("DecisionCard", DecisionCard);
    app.component("EvidenceTracker", EvidenceTracker);
    app.component("AdvancedMap", AdvancedMap);
    app.component("AgentFrontierMap", AgentFrontierMap);
    app.component("FieldMap", FieldMap);
    app.component("KnowledgeFlow", KnowledgeFlow);
    app.component("ResourceLibrary", ResourceLibrary);
    app.component("SiteKnowledgeGraph", SiteKnowledgeGraph);
  },
} satisfies Theme;
