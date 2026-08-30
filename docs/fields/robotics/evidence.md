# 物理 AI · 机器人证据账本

> 当前版本核验日：**2026-08-30**。本页记录一手来源支持什么、不能推出什么，以及什么变化会触发课程更新。

## 来源准入规则

- 模型论文数字绑定本体/任务/数据/控制器
- 公司演示与模型卡不视为独立安全证据
- 经典控制/几何保留稳定来源并在目标硬件复测
- 标准使用 ISO/NIST 官方入口并阅读适用正文

## 核心证据

| 日期 | 来源 | 本课程采用的证据 | 不外推到 |
|---|---|---|---|
| 1985-03-01 | [Impedance Control](https://doi.org/10.1115/1.3140702) | 解释为什么纯位置跟踪不足。 | 实际稳定受带宽、延迟、结构柔顺和环境影响。 |
| 2011-04-21 | [DAgger](https://proceedings.mlr.press/v15/ross11a.html) | 建立数据在环模仿范式。 | 需要专家安全介入；真实机器人采集成本/风险很高。 |
| 2017-04-10 | [PointNet](https://arxiv.org/abs/1612.00593) | 奠定点云深度学习范式。 | 全局池化对局部几何有限，任务级位姿/安全仍需专门验证。 |
| 2017-05-10 | [Modern Robotics](https://modernrobotics.northwestern.edu/nu-gm-book-resource/) | 为后续学习策略提供物理审计工具。 | 教材公式需在具体机器人坐标/参数上验证。 |
| 2021-12-13 | [ORB-SLAM3](https://arxiv.org/abs/2007.11898) | 提供现代开源 SLAM 基线。 | 公开数据不覆盖所有仓库动态/无纹理/长期变化，需本地复测。 |
| 2023-03-01 | [Diffusion Policy](https://arxiv.org/abs/2303.04137) | 形成现代通用操作策略基线。 | 结果依赖示范覆盖、控制栈和任务；扩散采样延迟/安全需目标硬件验证。 |
| 2023-04-01 | [ALOHA / ACT](https://arxiv.org/abs/2304.13705) | 把数据采集硬件与策略联合设计。 | 成功演示和有限任务不代表开放家庭泛化；示范/硬件校准很关键。 |
| 2023-07-28 | [RT-2](https://arxiv.org/abs/2307.15818) | 证明 web 语义与动作学习可联合。 | 自报任务/硬件有限，动作离散和控制安全需本地验证。 |
| 2023-08-08 | [3D Gaussian Splatting](https://arxiv.org/abs/2308.04079) | 推动机器人世界表示与合成数据。 | 渲染逼真不保证碰撞、材质或动力学正确。 |
| 2024-06-13 | [OpenVLA](https://arxiv.org/abs/2406.09246) | 提供开放权重/训练路线。 | 数字绑定论文实验，跨本体、安全和真实部署需独立复验。 |
| 2025-01-01 | [ISO 10218-1:2025](https://www.iso.org/standard/73933.html) | 安全功能必须对照正式标准与集成要求。 | 标准适用范围有限，服务/医疗等需其他法规标准。 |
| 2025-04-22 | [π0.5](https://arxiv.org/abs/2504.16054) | 代表 2025 通用机器人策略方向。 | 公司自报设置、任务成功和数据细节限制外推。 |
| 2026-03-12 | [HomeSafeBench](https://arxiv.org/abs/2603.11975) | 推动过程风险与任务成功并列。 | 仿真/基准无法覆盖所有家庭伦理和真实伤害。 |
| 2026-03-24 | [ABot-PhysWorld](https://arxiv.org/abs/2603.23376) | 为物理一致性建立反证。 | 预印本与特定平台；需独立复现。 |
| 2026-06-03 | [Same Weights, Different Robot](https://arxiv.org/abs/2606.03724) | 直接反驳权重中心的能力声明。 | 预印本平台有限；仍需每个目标本体实测。 |
| 2026-06-16 | [PAIWorld](https://arxiv.org/abs/2606.18375) | 代表 2026 3D-aware 世界模型方向。 | 预印本结果和视觉指标不等于机器人控制有效。 |
| 2026-06-29 | [ForesightSafety-VLA](https://arxiv.org/abs/2606.27079) | 把安全从即时碰撞扩展到任务后果。 | 模型预测不能替代独立安全控制，基准覆盖与真实校准待验证。 |
| 2026-07-15 | [Xiaomi Robotics U0](https://arxiv.org/abs/2607.11643) | 代表 2026 联合世界—动作路线。 | 公司预印本数字绑定其任务/数据，不能视为普适结论。 |
| 2026-07-30 | [Gemini Robotics 2](https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/) | 提示 VLA 正从单臂走向全身/推理协同。 | 官方演示/模型卡不是独立普适安全证据，需目标硬件全回合测试。 |
| 2026-08-30 | [NIST Robotics Test Facility](https://www.nist.gov/laboratories/tools-instruments/robotics-test-facility) | 为课程的基准装置与过程指标提供权威入口。 | 设施测试并不覆盖所有家庭/开放世界风险，需按 ODD 扩展。 |
| 2026-08-30 | [ISO Robotics Standards](https://www.iso.org/cms/live/live/en/sites/isoorg/home/sectors/engineering/robotics.html) | 把数据飞轮置于控制边界。 | 标准并不直接给 ML 算法方案，需结合风险分析。 |
| 2026-08-30 | [NIST Robot Performance](https://www.nist.gov/topics/robotics) | 连接公式与台架证据。 | 具体装置需按任务构造。 |
| 2026-08-30 | [Nav2 Documentation](https://docs.nav2.org/) | 适合做分层消融。 | 配置示例不是产品安全证明，实时/硬件/人机风险需另验。 |

## 冲突证据

### 端到端统一 vs 模块化安全

VLA 提升语义—动作统一性；模块化状态、控制和安全仍提供可诊断与独立防线，课程用同任务消融而非预设胜负。

### 视频世界 vs 物理世界

生成质量可改善数据与规划界面，但接触、动作因果和长期一致必须用干预与真实闭环证明。

## 更新触发器

- 新 VLA 在同数据/控制/本体下改变泛化 Pareto
- 新世界模型通过独立真实闭环控制评测
- ISO/NIST 或地区机器人安全要求更新
- 机器人事故/召回改变危险或部署边界

## 版本解释

“新鲜”不等于只保留新论文。基础定理、经典算法和稳定标准作为机制前置；近三年材料负责修正能力边界、真实基准、实现条件与监管状态。预印本与厂商报告会明确标注，不能获得与独立复现、正式标准相同的证据权重。
