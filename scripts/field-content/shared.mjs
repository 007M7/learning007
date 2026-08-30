export const u = (label, url) => ({ label, url });
export const ev = (date, title, url, question, mechanism, result, contribution, limit) => ({ date, title, url, question, mechanism, result, contribution, limit });
export const concepts = (rows) => rows.map(([id, name, definition, decision]) => ({ id, name, definition, decision }));

const commonMetrics = [
  ["任务质量", "主指标、分层指标、置信区间和失败类型", "平均分不能说明关键场景是否可用"],
  ["系统表现", "端到端时延、成功率、降级/拒绝和人工介入", "局部模型分数不是用户任务结果"],
  ["资源经济", "训练/推理/标注成本、吞吐、容量与能耗", "确认改进在真实预算下仍成立"],
  ["风险运维", "漂移、越权、事故、恢复时间和残余风险", "把一次实验转化成可持续服务"],
];

export function chapter(x) {
  return {
    stage: x.stage ?? "核心主线",
    duration: x.duration ?? "6 × 45 分钟",
    prerequisite: x.prerequisite,
    goals: x.goals,
    concepts: x.concepts,
    thesis: x.thesis,
    problem: x.problem,
    mechanismTitle: x.mechanismTitle,
    mechanism: x.mechanism,
    formula: x.formula,
    formulaNotes: x.formulaNotes,
    evidence: x.evidence,
    diagram: x.diagram,
    caseTitle: x.caseTitle,
    case: x.case,
    protocol: x.protocol,
    metrics: x.metrics ?? commonMetrics,
    decisions: x.decisions,
    failures: x.failures,
    prompt: x.prompt,
    exerciseTitle: x.exerciseTitle,
    exercise: x.exercise,
    misconceptions: x.misconceptions,
    quiz: x.quiz,
    summary: x.summary,
    mastery: x.mastery,
    sources: x.sources,
  };
}
