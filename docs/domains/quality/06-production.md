# 06 · 安全供应链与生产验收

<div class="lesson-meta"><span>Q15—Q16</span><span>核心＋项目</span><span>预计 2 × 60 分钟</span><span>前置：Q01—Q14</span></div>

## 本章可观察目标

你能对代码、依赖、构建、制品、权限和运行环境建立最低安全门；用一份生产就绪清单完成端到端验收，而不是把“流水线绿色”当作完成。

## Q15 · 安全贯穿供应链

从攻击者可能改变的每个输入审查：源码提交、第三方依赖、CI Action、构建环境、制品仓库、部署身份、配置密钥、运行时输入。最低控制包括：

- 分支保护、最小审查与签名/可追溯提交；
- lockfile、依赖审计、SBOM、许可证与漏洞响应；
- 固定构建步骤、隔离 runner、短期凭证与最小权限；
- 制品哈希、来源证明、晋升而非重建；
- 密钥轮换、网络边界、运行用户和审计；
- 对输入验证、认证授权、注入、SSRF、文件上传进行安全测试。

漏洞扫描有误报和漏报。必须有人分诊，结合可达性与资产影响决定优先级，并有 SLA。

## Q16 · 生产就绪验收

```text
需求可验收 ✓  测试分层 ✓  制品可追溯 ✓  迁移兼容 ✓
最小权限 ✓    可观测 ✓    SLO/告警 ✓     回滚/恢复演练 ✓
负责人 ✓      Runbook ✓   成本/容量 ✓     已知风险登记 ✓
```

为任务运行器完成一次 Game Day：重复请求、数据库慢查询、队列积压、worker 崩溃、权限越界、磁盘/配额耗尽。每个场景记录预期、观测、止损、恢复和缺口。

## 练习：发布评审会

让 AI 扮演产品、开发、测试、安全和 SRE 五种角色分别提问；你必须用链接到测试报告、制品、仪表盘、ADR、迁移记录和恢复演练回应。没有证据的答案写入风险登记，而不是让 AI“补全已完成”。

常见误区：扫描工具替代威胁建模；CI 使用永久云管理员密钥；生产人工修改后不回写配置；只有回滚命令没有数据恢复；指标正常却关键业务失败；风险没有 owner。

<EvidenceTracker lesson="quality-06-production" />

## 本章完成标准

同一提交通过 CI、在测试环境部署并完成故障/恢复演练；生产就绪表中每个“是”都有可访问证据，每个“否”都有风险、负责人和期限。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://slsa.dev/spec/v1.2/">SLSA 1.2</a>、<a href="https://owasp.org/www-project-web-security-testing-guide/">OWASP Web Security Testing Guide</a>、<a href="https://docs.github.com/en/actions/security-for-github-actions">GitHub Actions Security</a>。</div>
