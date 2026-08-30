# 04 · SQL、事务、索引与迁移

<div class="lesson-meta"><span>SW10—SW11</span><span>必修核心</span><span>预计 2 × 60 分钟</span><span>前置：SW02、SW09</span></div>

## 本章可观察目标

你能把业务事实建模为带约束的关系表；解释事务隔离和索引的代价；设计向前兼容、可回滚或可补偿的数据库迁移。

## SW10 · 关系模型与 SQL

表表达同类事实，行是实例，列是属性；主键标识行，外键表达关系，唯一/非空/检查约束保护不变量。**数据库约束是最后一道并发安全网**，不能只依赖表单校验。

```sql
CREATE TABLE runs (
  id uuid PRIMARY KEY,
  workspace_id uuid NOT NULL REFERENCES workspaces(id),
  idempotency_key text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, idempotency_key)
);
```

建模先问：什么是长期业务事实？谁拥有它？何时创建、改变、删除？哪些组合必须唯一？金额用明确精度和币种，不用浮点；时间保存时区明确的时间点；状态使用受约束枚举或状态表。

SQL 的逻辑顺序可近似理解为 `FROM/JOIN → WHERE → GROUP → HAVING → SELECT → ORDER → LIMIT`。JOIN 放大行数时先确认基数；聚合前后过滤语义不同；写查询必须知道空值的三值逻辑。

## SW11 · 事务、索引与迁移

事务把一组操作视为一个原子单元，但隔离级别决定并发时能观察到什么。事务边界应围绕业务不变量，尽量短；不要在持有数据库锁时调用慢外部 API。

索引是额外的排序/查找结构：读得更快，但占空间并增加写成本。复合索引顺序取决于过滤与排序模式，不是把所有列都加进去。用 `EXPLAIN` 和真实数据验证，不凭感觉。

安全迁移使用 **expand → migrate → contract**：

1. 先添加新列/表，旧代码仍可工作；
2. 双写或后台回填，验证数据；
3. 切换读取并观察；
4. 最后删除旧结构。

大表加非空列、重建索引或类型转换可能长时间锁表。迁移脚本与应用版本必须兼容滚动发布；“代码回滚”不等于“数据自动回滚”。

<DecisionCard title="状态历史放一列，还是事件表？" prompt="当前只需显示 run.status，未来还要审计每次状态变化、耗时与失败原因。" answer="主表保留当前状态便于读取，另建 append-only 状态事件表记录 from/to、原因、actor、时间和 trace_id；两者在同一事务更新。只存当前列会丢历史，只从事件实时重建又会增加读复杂度。" />

## 练习：为任务运行器建模

设计 `workspace`、`task`、`run`、`run_event`、`artifact` 五张表，标出主外键、唯一约束、删除策略和最常见三个查询的索引。再设计一次把 `run.output` 拆到 `artifact` 的三阶段迁移。

常见误区：用应用生成“最大值+1”；把 JSON 当作逃避建模；外键列没有索引；事务包含模型调用；先删列再部署代码；没有恢复前备份与校验。

<EvidenceTracker lesson="software-04-data" />

## 本章完成标准

能从三个业务不变量推导数据库约束；能解释一个复合索引服务哪个查询；能写出兼容新旧应用版本的迁移顺序及失败后的处置。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://www.postgresql.org/docs/current/">PostgreSQL 18.6 Current Documentation</a>，重点阅读 DDL、约束、事务隔离、索引、EXPLAIN 与并发控制。</div>
