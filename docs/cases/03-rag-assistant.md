# 案例 03 · 可引用知识助手

<div class="lesson-meta"><span>核心 AI 项目</span><span>AI01—AI08</span><span>Q01/04/12/16</span></div>

## 需求与不变量

员工在被授权的企业文档上问答，答案必须逐段引用；证据不足则明确拒答。文档删除/撤权后不再可检索。核心不变量：检索范围不越租户/ACL；引用能回到版本化原文；模型不能把文档中指令升级为系统权限。

## 数据与查询链

```text
Connector → version/hash → parser → semantic chunks + ACL → hybrid index
Query → identity/ACL filter → keyword + vector → merge/rerank
      → context with source boundaries → structured answer/citations → verify
```

文档、版本、chunk、ACL、embedding model/version 分开保存。删除使用可追踪 tombstone 并异步清索引，期间查询层仍以权威 ACL 过滤。表格/代码按结构切块；每块保留页码/标题锚点。

## 评测与运行

检索评 Recall@k/MRR，生成评答案正确、引用支持、拒答；系统评 ACL、p95、成本。评测集包含专有名词、过期冲突、不可答、跨权限与注入文档。Trace 记录 query 改写、候选 ID、rerank、最终上下文和模型版本，敏感文本按策略脱敏。

<DecisionCard title="检索不到时让模型凭常识回答？" prompt="用户更喜欢总能得到答案。" answer="企业知识问答默认以证据边界为产品承诺：找不到就说明范围并建议如何继续；可选‘通用知识’模式必须显著标注且与企业证据分开。混合回答会破坏用户对引用与时效的判断。" />

## 交付证据

20+ 题版本化评测、ACL 集成测试、删除传播测试、引用验证、注入红队、索引重建/回滚计划、成本与延迟看板。

## 你的变化任务

加入扫描 PDF 与每日变更文档。比较 OCR 质量、解析失败队列、增量索引、版本冲突和“截至时间”提示；定义错误文档如何被发现和修复。
