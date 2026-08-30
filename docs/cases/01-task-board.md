# 案例 01 · 个人任务板

<div class="lesson-meta"><span>入门纵向切片</span><span>SW01/02/08/09/10/12</span><span>Q01/03/06</span></div>

## 需求与约束

单个用户创建、编辑、完成和筛选任务；刷新后数据不丢。第一版不协作、不离线、不做微服务。关键不变量：标题非空；完成时间只在进入 done 时存在；用户只能读写自己的任务。

## 最小架构

```text
Browser UI → HTTP API → Application/Task State Machine → PostgreSQL
```

前端状态分为：URL 过滤条件、表单草稿、服务端任务列表。服务端是权威事实。`tasks(id, owner_id, title, status, due_at, completed_at, version)`；更新带 `version` 做乐观并发，冲突返回稳定错误。

## API 与状态

- `POST /tasks`：运行时验证，返回 201；
- `GET /tasks?status=&cursor=`：稳定排序和游标；
- `PATCH /tasks/{id}`：只允许字段白名单，检查 owner/version；
- `POST /tasks/{id}:complete`：显式状态命令，可幂等返回已完成结果。

状态为 `todo → doing → done`，是否允许 `done → todo` 必须是产品决定。删除先用可恢复的 `deleted_at` 还是物理删除，也需要数据保留约束。

## 质量证据

状态机单元测试；owner 条件和约束的真实数据库测试；创建→完成→过滤的 E2E；错误体含 request ID；一条迁移从空库可执行。

<DecisionCard title="前端直接使用浏览器 localStorage 可以吗？" prompt="只有一个用户，想最快完成。" answer="可以作为有意约束的原型，但要明确：数据只在设备/浏览器、无可靠备份、难协作、Schema 迁移仍需处理。若目标是学习完整 AI 编码链，HTTP＋数据库更能暴露契约、权限和交付问题。" />

## 你的变化任务

新增共享任务。先不要写代码：补角色、邀请/撤销、资源所有权、并发编辑、通知与审计，画新信任边界。证明为什么这不是“tasks 加一个 shared=true”。
