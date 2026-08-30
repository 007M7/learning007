# 物理 AI · 机器人深研路线

> 证据截止：**2026-08-30**。稳定基础不按年份淘汰；涉及模型能力、基准、标准、法规和产业状态的结论优先使用近三年一手来源，并保留发布日期与适用边界。

<div class="lesson-meta"><span>RBF01—RBF30</span><span>领域深研</span><span>10 章 / 30 节点</span><span>机制＋实验＋作品证据</span></div>

把机械本体、状态估计、控制、规划、学习、VLA 与物理安全连接起来，拒绝只看机器人演示视频。

## 知识地图

<FieldMap domain="robotics" />

## 近期只激活 3 个节点

| 节点 | 可观察动作 | 完成证据 |
|---|---|---|
| RBF01 机器人闭环 | 画感知—估计—规划—控制—环境链 | 系统边界图 |
| RBF02 具身与可供性 | 限定本体/工具/对象/环境 | ODD 与任务卡 |
| RBF03 任务与安全边界 | 写成功、过程约束和终止 | 三基线验收协议 |

其余 27 个节点保持 locked/later。只有首章达到 basic，才按真实项目暴露的阻塞选择下一章；路线图是导航，不是同时展开的待办清单。

## 本领域的五条当前判断

1. 2026 机器人基础模型从单臂 VLA 扩展到全身、embodied reasoning 与跨本体
2. 世界模型前沿正在从视觉逼真转向动作条件、三维与物理一致
3. OpenVLA/π0.5 等提升通用性，但公开数字仍绑定特定任务/控制/数据
4. Same Weights Different Robot 强化本体是能力组成而非部署外壳
5. 安全基准开始评价轨迹前瞻和家庭过程风险，但独立物理防护仍不可替代

## 每章怎样学

每章都遵守同一个闭环：问题定义 → 机制与公式 → 一手证据拆解 → 贯穿案例 → 最小复现 → 失败边界 → 练习 → 自测 → 作品证据。论文摘要、视频演示、运行截图和“我懂了”都不能单独证明掌握。

## 贯穿项目

一个能在仿真与真实/半实物环境间复现的移动操作机器人任务，包含安全壳、数据与评测报告。

最终验收至少包括：

- 任务/本体/ODD/安全合同和三层基线
- 运动学动力学/控制/感知/导航可复现实验
- 数据/策略/VLA 泛化矩阵与全回合日志
- 世界模型动作干预和 Sim2Real 残差
- ISO 台账、独立安全壳与 hazard—evidence 案例

## 开始方式

先看 [学习路线与知识图谱](./roadmap)，再进入 [01 · 机器人系统、具身与任务闭环](/fields/robotics/01-embodiment-system)。若前置不足，只补阻塞当前实验的最小知识，不把学习变成无限准备。

<div class="source-note">主要来源（证据截止 2026-08-30）：<a href="https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/">Gemini Robotics 2</a>、<a href="https://arxiv.org/abs/2406.09246">OpenVLA</a>、<a href="https://www.nist.gov/laboratories/tools-instruments/robotics-test-facility">NIST Robotics</a>。数字只描述来源中的实验设置；标准、法规与产品能力均按页面版本和适用范围解释。</div>
