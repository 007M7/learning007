# 物理 AI · 低空智能证据账本

> 当前版本核验日：**2026-08-30**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

- 法规标准仅用政府/标准组织官方页并标生效日
- 研究演示不提升为适航/运行证据
- 国际规则只作比较不替代运营地规则
- 所有性能数字绑定构型、ODD、载荷与测试等级

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
| 2023-05-23 | [GB 42590-2023 民用无人驾驶航空器系统安全要求](https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=7E5B5F3B37E271A31E90DE8B09A8A3C5) | 提醒感知/避障只能在系统安全要求内论证。 | 需获取正式标准文本并按产品类别逐条符合性分析。 |
| 2023-06-28 | [无人驾驶航空器飞行管理暂行条例](https://www.gov.cn/zhengce/content/202306/content_6888799.htm) | 明确低空产品必须同时建模航空器、运营与空域。 | 具体许可、地方实施和后续法律/标准需按当前任务核对。 |
| 2025-05-01 | [NASA AAM Autonomy Tutorial](https://ntrs.nasa.gov/citations/20250005043) | 把集群置于安全论证而非演示。 | 具体集群算法仍需原论文和本地试验。 |
| 2025-12-27 | [修订后的中华人民共和国民用航空法](https://www.caac.gov.cn/PHONE/XWZX/MHYW/202512/t20251227_229595.html) | 要求所有旧流程按 2026-07-01 后法制环境复核。 | 官方新闻不是逐条法律意见，具体条款应用需读正式文本。 |
| 2026-02-05 | [低空经济标准体系建设指南（2025年版）](https://www.mot.gov.cn/xinwen/jiaotongyaowen/202602/t20260205_4199749.html) | 支持全栈标准缺口图。 | 指南是建设路线，不等于所有标准已发布/实施。 |
| 2026-04-17 | [CAAC AC-21-AA-2026-47](https://www.caac.gov.cn/PHONE/XXGK_17/XXGK/GFXWJ/202604/t20260417_230570.html) | 直接影响中国动力提升项目路线。 | 必须按项目类别与审定当局解释，不能凭课程自判合规。 |
| 2026-07-02 | [GB/T 47575-2026 低空交通管理服务相关国家标准](https://openstd.samr.gov.cn/bzgk/std/newGbInfo?hcno=F5C4C49E2761CC5EAB22130B73F14229) | 必须明确区分发布和生效，提前做接口差距分析。 | 正式适用范围、条文和配套标准需逐项读取；不得写成已实施。 |
| 2026-07-06 | [FAA Drone Normalization Strategy 2026](https://www.faa.gov/uas/resources/Drone_Normalization_Strategy_Report_Update_2026.pdf) | 帮助辨认常态运行所需制度与基础设施。 | 目标/计划不等于已经生效的最终规则。 |
| 2026-08-30 | [ICAO UTM Guidance](https://www.icao.int/utm-guidance) | 避免把私有集群协议当全空域协调。 | 各国实现存在差异。 |
| 2026-08-30 | [NASA Advanced Air Mobility](https://www.nasa.gov/mission/advanced-air-mobility/) | 提供公开研究与试验入口。 | NASA 场景与美国监管不能直接等同中国商业批准。 |
| 2026-08-30 | [FAA Pilot’s Handbook of Aeronautical Knowledge](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak) | 把 AI 学习锚定航空基础。 | 以有人航空为主，需按 UAV/eVTOL 构型补充验证。 |
| 2026-08-30 | [NASA RAVEN](https://www.nasa.gov/raven/) | 支持 HIL 和受限包线逐级扩展。 | 研究进展不等于商业型号批准。 |
| 2026-08-30 | [NASA HDV / Autonomous Vehicle Applications](https://www.nasa.gov/human-systems-integration-division/integration-and-evaluation/autonomous-vehicle-applications/) | 支持机队而非单机优化。 | 研究环境与商业 KPI 仍需本地建模。 |
| 2026-08-30 | [NASA AVIATE/autonomy research](https://www.nasa.gov/aeronautics/autonomous-systems/) | 支持把定位健康从算法扩展到运行决策。 | 具体滤波/指标需使用相应技术报告和本地试验。 |
| 2026-08-30 | [EASA U-space](https://www.easa.europa.eu/en/domains/air-traffic-management/u-space) | 帮助对照 UTM/UOM 状态和接口。 | 欧盟框架不能替代中国规则，角色和数据要求不同。 |
| 2026-08-30 | [FAA Advanced Air Mobility](https://www.faa.gov/air-taxis) | 提供国际比较与术语入口。 | 美国规则不直接适用于中国项目。 |

## 冲突证据

### 飞行能力 vs 可运营性

单机正常飞行只覆盖物理能力，不能替代空域、人员、维护、失效和第三方安全。

### 高自主 vs 可批准

更开放策略提高适应性，也扩大验证空间；需要 ODD、安全壳和逐级证据限制。

## 更新触发器

- 中国法律/标准正式文本、实施日或配套规则变化
- BVLOS/UTM/U-space 最终规则和接口变化
- 动力提升适航方法或批准案例更新
- 事故/适航指令改变危险和运行假设

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
