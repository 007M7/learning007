# 软件质量与生产交付来源目录

核验日：2026-08-31。工具文档说明“如何使用”，SRE/安全规范帮助回答“要证明什么”。

| 来源 | 版本/状态 | 支持节点 | 使用边界 |
|---|---|---|---|
| [pytest 文档](https://docs.pytest.org/en/stable/) | stable，示例显示 pytest 9.x | Q03—04 | Python 测试实现；测试策略不绑定框架 |
| [Playwright 文档](https://playwright.dev/docs/intro) | 活文档，2026 站点 | Q06 | Web E2E、trace、可访问定位；只保留少量核心旅程 |
| [Docker Get Started](https://docs.docker.com/get-started/) | 活文档 | Q09 | 镜像、容器、网络、卷；不把容器等同虚拟机 |
| [GitHub Actions](https://docs.github.com/en/actions) | 活文档 | Q10—11 | 本仓库 CI/CD 实现；供应链风险需额外控制 |
| [Semantic Versioning](https://semver.org/) | 2.0.0 | Q08 | 表达公开 API 兼容意图，不证明真正兼容 |
| [SLSA Specification](https://slsa.dev/spec/v1.2/) | v1.2，Approved | Q08、Q15 | 来源/构建完整性与 provenance；逐级采用 |
| [OpenTelemetry Docs](https://opentelemetry.io/docs/) | 活文档 | Q12 | traces、metrics、logs 与上下文传播 |
| [Google SRE Book](https://sre.google/sre-book/table-of-contents/) | 公开在线书，2016 | Q13—14 | SLI/SLO、错误预算、事故与运维原则 |
| [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/) | 官方项目活文档 | Q15—16 | Web 安全测试清单；需结合威胁模型 |
| [NIST SSDF SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) | v1.1，2022 | Q15—16 | 安全软件开发框架；组织级控制按风险裁剪 |

## 证据强度

静态检查 < 单元行为 < 真实依赖集成 < 已部署旅程 < 生产指标/演练，不是绝对排序，而是不同问题的证据。比如类型检查很快但不能证明数据库迁移；E2E 能证明旅程却不适合穷举业务边界。

## 易过时项

Action、基础镜像、Node/Python 支持矩阵、扫描规则和安全建议每季度复核。SLSA/OWASP/NIST 新版发布时触发全站影响审查。版本锁定不等于永不升级，升级要有自动化证据与回退。
