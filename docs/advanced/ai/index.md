# AI 应用与 Agent 系统 · 可选进阶

> 一句话点题：AI 进阶的价值，不是知道更多模型名，而是能判断问题到底来自模型表示、训练数据、推理系统、检索结构，还是协调机制。

## 什么时候进入这条路线

先有稳定任务、基线和评测，再谈微调、GraphRAG 或多 Agent。若当前失败主要来自需求模糊、知识源质量差、权限缺失或没有测试集，训练更大模型只会把问题变贵。数学与模型原理可因好奇主动学习，但不要把它伪装成产品上线的必经前置。

## 知识地图

<AdvancedMap domain="ai" />

## 用误差来源选专题

| 主要误差/约束 | 先进入 | 最小对照 |
|---|---|---|
| 看不懂损失、概率或论文实验 | 01 数学与优化 | 手算＋小张量实验 |
| 需要解释注意力、分词或训练资源 | 02 Transformer 与训练 | 小模型前向/训练曲线 |
| Prompt/RAG 已有稳定基线但仍无法适配任务 | 03 微调与评测数据 | base vs PEFT 的盲测 |
| 显存、首 Token、吞吐或成本阻塞自托管 | 04 推理系统 | 相同模型/数据的正确性与性能回归 |
| 查询依赖多跳实体关系或图片/音频证据 | 05 Advanced RAG | 普通混合检索 vs 图/多模态方案 |
| 单工作流无法利用角色并行或权限隔离 | 06 多 Agent | 单 Agent 基线 vs 多 Agent 的质量/成本/失败率 |

## 最小贯穿项目

使用“可引用知识助手”：固定一组文档、50—100 条代表性问题、引用正确性与成本指标。任何升级都必须在同一评测集上与最简单基线比较；性能提升不能以安全、可解释性或不可控成本为代价。

::: warning 最容易踩的坑
把“模型回答看起来更聪明”当成提升。进阶实验必须至少报告任务成功率、关键失败类别、延迟和成本；涉及工具执行时还要报告越权、重复副作用和无法终止的比例。
:::

[从数学与优化开始 →](/advanced/ai/01-math-optimization)

::: tip 需要同步研究前沿？
本路线解决稳定的模型/系统进阶。若要按 2023-08-31—2026-08-30 时间窗拆解 Agent 论文、复现实验与最新评测，请进入独立的 [Agent 前沿强化专题](/frontier/agents/)。它不会替代本路线的数学、RAG、推理和多 Agent 前置。
:::

<div class="source-note">主要来源入口（核验于 2026-08-31）：<a href="https://arxiv.org/abs/1706.03762">Attention Is All You Need</a>、<a href="https://docs.pytorch.org/docs/stable/">PyTorch Documentation</a>、<a href="https://arxiv.org/abs/2106.09685">LoRA</a>、<a href="https://docs.vllm.ai/en/latest/">vLLM Documentation</a>、<a href="https://microsoft.github.io/graphrag/">Microsoft GraphRAG</a>。边界见<a href="../../sources/ai">AI 来源目录</a>。</div>
