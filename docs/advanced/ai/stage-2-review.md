# 第二阶段总结 · 先守住基线，再改变权重与服务

> 第二阶段建立的是一条双重门禁：参数适配必须证明自己比稳定的 Prompt/RAG 基线更值得维护；推理优化必须证明自己在真实负载下没有拿正确性和尾延迟换表面吞吐。两道门都允许“不改”和“回退”成为正确答案。

<div class="lesson-meta"><span>第二阶段复盘</span><span>AAI07—AAI12</span><span>6 个标准回合（每回合 45 分钟）</span><span>陌生场景迁移验收</span></div>

<KnowledgeFlow
  title="阶段出口是一个可追溯、可服务、可撤销的系统候选"
  intro="复盘结束后，你应当能在陌生任务中从冻结基线出发，决定事实、行为和系统瓶颈分别归谁处理，并用独立评测与负载回放完成上线或拒绝。"
  what="后训练改变稳定行为，RAG/工具提供动态事实，推理系统调度计算与 KV 状态；三者共享同一任务合同、版本证据和正确性门禁。"
  why="把动态事实写进权重会失去更新与删除，把测试反馈当训练数据会失去独立证据，把吞吐当唯一指标会失去用户结果。"
  how="先重放政策助手的适配—服务链，再迁移到多语种跨境售后；注入数据、模型、数值和负载故障，提交逐样本与逐请求证据，最后按 basic/proficient rubric 验收。"
  terms="基线优先 | 行为适配 | 动态事实 | sealed test | release manifest | KV 容量 | correctness-adjusted goodput | rollback"
/>

## 两章共同保护的是同一个产品承诺

第三章从“是否改权重”开始。它固定任务、数据谱系和独立评测，让 Base、Prompt、RAG 与 PEFT 在预先门禁下竞争。召回或动态事实错就退回 RAG；稳定 schema、引用行为或拒答规则仍失败，LoRA 才有试验资格；偏好对无法区分事实与风格时，DPO 被拒绝。adapter 不是结果本身，逐样本增益、回归、base 绑定和撤销路径才组成可审理结果。

第四章没有因为模型通过离线评测就宣布完成。它沿一条请求拆开队列、prefill 与 decode，按层数、KV 头、head dimension、精度和 Token 数建立显存账，再用 mixed-length trace 比较调度与量化。最终计算的不只是 tokens/s，而是同时满足 TTFT、TPOT、schema、证据支持和拒答门禁的 correctness-adjusted goodput。

两章通过 release manifest 相接：

| 第三章字段 | 第四章怎样消费 | 变更后的动作 |
|---|---|---|
| base / adapter / tokenizer digest | 加载正确 artifact，标记每条请求 | 任一变化都重跑独立回归 |
| Prompt、schema、证据版本 | 构造 prefill 输入与缓存键 | 版本不兼容则缓存失效 |
| sealed test 与风险切片 | 检验引擎、batch、量化后的输出 | 质量门禁失败即回退 |
| 允许动作与 `abstain` | 区分语义拒答和服务过载 | 分别进入人工或重试路径 |
| 回退候选 | canary 失败时恢复 | 演练并核对路由、digest、哨兵 |

因此，“LoRA 训练结束”与“vLLM 能启动”都不是阶段出口。真正的出口是一名不参与实验的评审者能从 request ID 回答：为什么用了这个候选、证据从哪里来、在什么版本和负载下合格、何时拒答、何时拒绝服务、怎样恢复上一版本。

## 陌生任务：多语种跨境售后助手

现在把方法迁移到一个此前未出现的产品。跨境电商团队希望处理中文、英语和西班牙语售后邮件。输入包含用户来信与订单号；系统从订单工具读取签收时间和商品状态，从版本化规则库读取当前退换条件，然后输出：

```json
{
  "eligible": "yes | no | unknown",
  "reason": "基于工具结果和规则的简短解释",
  "reply": "使用客户语言的回复草稿",
  "policy_refs": ["RET-v18-4.2"],
  "next_action": "draft_only | human_review"
}
```

助手只生成草稿，无权真的退款。订单工具超时、规则版本冲突、商品类别不明或用户要求绕过审核时，`eligible=unknown` 且转人工。促销后会出现三倍突发流量，邮件长度从一句“尺码不合”到带完整往来历史的长线程。这个任务同时迫使我们区分四件事：订单状态是实时工具事实，退换条件是版本化规则事实，三语 schema/语气是可能稳定的行为，排队与 KV 则是服务状态。

以下样本量、阈值和流量都只是迁移作业设定，不代表真实业务基准。你必须用自己的风险、人工容量和负载重新定值。

## 先构造一个有资格失败的基线

先写任务合同：正确读取订单工具结果、使用生效规则、金额与日期不改变、输出可解析、需要时转人工。练习门禁可以设为：综合任务成功率至少 0.92，错误自动判为可退的比率为 0，schema 通过率至少 0.995；任何语言与高价商品切片不得被总体平均遮住。

把数据按客户、订单、邮件线程和规则版本成组切分。同一订单的多轮邮件不能散落到 train/test；规则 v18 的评测参考答案不能通过系统 Prompt 或合成目标泄漏。建立 `train`、`dev`、`test_sealed`、`shadow_future`，记录原始语言、机器翻译、人工改写、生成来源、许可/隐私、去重簇、标注者与指南版本。真实姓名、地址和支付信息在进入训练前按政策最小化。

然后按简单到复杂建立候选梯子。

1. `G-base` 只接原始请求，确定能力下界，但不允许猜订单状态。
2. Prompt 加工具 schema、JSON 合同、正反例和 `unknown` 规则。
3. Prompt + 订单工具 + 规则 RAG，把动态事实显式放进上下文并留下版本引用。
4. 只有第三项在正确事实已提供时仍反复破坏三语格式、语气或转人工政策，才训练 LoRA；事实和日期不进入 adapter 的职责。
5. 只有存在一致、双盲复核的完整回复偏好对，而且事实硬门禁独立保留，才比较 DPO；不能用“更热情”的 chosen 压过金额错误的 rejected。

如果第三项已经满足所有门禁，审理结论就是“不微调”。如果工具经常超时，先修调用、重试和明确 `unknown`；给模型更多订单答案做 SFT 会把实时故障伪装成记忆。若英语有增益而西班牙语退化，adapter 不得全量放行，可以缩小语言路由或继续收集合法数据。

## 再让同一候选经历促销流量

锁定候选后，生成一份可重放的十分钟 trace：70% 短邮件、20% 带历史的长邮件、10% 工具失败/高风险请求；包含正常到达与三倍突发。写清端到端 SLO，例如练习可暂设交互请求 TTFT p95 不高于 1 s、TPOT p95 不高于 50 ms，同时保持第三章质量门禁。数字只是初始假设，评审重点是它们在结果出现前已经固定。

从实际 decoder 配置读取层数、KV 头数和 head dimension，分别估算短、p95、最大线程的 KV；再加权重、adapter、workspace、分配开销与冗余。用 Little 定律检查到达率、系统时间与在途数是否自洽，但不拿平均数代替突发压测。比较 continuous batching、batched-token 上限与一个量化候选，每次只改一个变量。

压测记录必须能和质量记录 join：`request_id`、语言、风险切片、Prompt/output Token、队列、TTFT、TPOT、端到端、KV、model/adapter/quant/engine digest、schema、规则引用、工具事实一致性与最终动作。只有同时过时延和质量门禁的请求进入 goodput。若 INT4 让货币符号、规则 ID 或 JSON 引号退化，即使设备吞吐更高也回退；若长线程挤压短请求，先用 Token admission、长度分池或 chunked prefill 做受控实验。

过载拒绝和业务拒答仍要分开。队列预测超 SLO 时返回可重试的服务状态或异步受理；工具/规则证据不足时生成 `unknown + human_review`。前者不能计作模型拒答准确，后者不能拿基础设施 429 替代。

## 故障注入比顺利演示更能证明迁移

在运行前为每项注入写出预测，完成后记录实际与差异。

| 注入 | 应观察到的保护 | 没发生时先退回 |
|---|---|---|
| 同一订单线程跨 train/test | 谱系或近重复检查阻断 | 重做分组切分与 test 哈希 |
| 将退货期从 30 天改为 14 天 | RAG/工具版本更新即可生效，adapter 不需重训 | 事实职责和缓存失效策略 |
| 订单工具超时 | `unknown + human_review`，不得猜可退 | Prompt、工具协议与拒答集 |
| chosen 语气好但金额错 | 偏好 pair 被丢弃或重标 | DPO rubric 与事实硬门禁 |
| adapter 配到另一 base revision | 加载或发布门禁失败 | manifest 与 artifact 校验 |
| 量化后规则 ID 少一位 | 正确性回归触发回退 | 量化格式、结构约束与切片 |
| 三倍突发夹一个超长线程 | admission 生效，队列不无限长 | batched-token 预算与公平调度 |
| 跨租户复用含订单号前缀 | 缓存隔离阻断 | cache key、访问域与隐私策略 |

再加入一次 worker 中途退出和一次客户端取消。确认活跃请求的失败语义明确、不会重复真实退款动作、KV 最终释放、旧候选能恢复。因为本作业只允许 `draft_only`，即使重试也不应产生外部副作用；这正是先缩小权限再提高自动化的例子。

## 交付物应让陌生评审者重算结论

提交七件材料，而不是演示视频：任务/门禁卡；数据谱系与 split 哈希；四候选逐样本结果；适配配置和 adapter card（或拒绝微调记录）；release manifest；逐请求负载 trace 与计算脚本；canary/回退演练。每个汇总表都能回到原始 JSONL，每个线上请求都能找到模型和规则版本。

反馈分三层。数据评审者抽查订单族切分、许可、动态事实是否误入目标；模型评审者重算配对增益、语言切片、偏好分歧与回归；系统评审者重算一笔 KV、一个 p95 和 correctness-adjusted goodput，并按 runbook 执行回退。AI 可以帮助生成检查清单、对比 manifest 和聚类错误，但不能凭空补运行结果或替独立评审者打开 sealed test。

### Basic / proficient 验收 rubric

每个维度 0—2 分，共 10 分。0 分表示缺失或只有断言；1 分表示有产物但验证/边界不完整；2 分表示证据可重放、反例成立且退路清楚。

| 维度 | 1 分证据 | 2 分证据 |
|---|---|---|
| 任务与基线 | 有任务指标和一个 baseline | 门禁预注册，Base/Prompt/RAG/PEFT 同表且会拒绝复杂度 |
| 数据与适配 | 有切分或 LoRA 配置 | 谱系/独立测试完整，事实与行为分工，泄漏和 DPO 边界经注入 |
| 容量与调度 | 有吞吐和延迟 | prefill/decode、KV、混合 trace、admission 与尾延迟可重算 |
| 正确性与版本 | 跑了平均质量分 | 每请求绑定 digest，量化/batch 后重跑风险切片与 quality goodput |
| 降级与解释 | 文档写了回滚 | 语义拒答/过载分开，canary、故障和实际回退均有记录 |

**Basic（基础掌握）：**完成原政策助手或迁移场景的一次完整应用，总分至少 7/10，且“任务与基线”“正确性与版本”不得为 0；能够口头解释为什么某类错误归 RAG、LoRA 或服务层，并运行一项数值/代码实验。一次选择“不微调”或“不自托管”只要证据完整，同样可以通过。

**Proficient（熟练掌握）：**至少间隔 7 天，换一批订单/规则版本和一条未见过的突发 trace，在不照抄原决策的情况下再提交；最近两次相关作业平均至少 8.5/10。第二次必须包含一个改变结论的变式、一个失败/拒绝分支和明确外推边界，并能从原始记录重算 LoRA 参数或 KV、一个质量差异和一个尾延迟/goodput。

## 🎯 随堂检验

<Quiz question="售后助手在正确工具结果下已满足所有质量门禁，但促销时 TTFT p99 超标。最先应改什么？" :options='["把实时订单状态加入 LoRA 训练","保持模型候选冻结，检查到达 trace、prefill 干扰、Token admission 与调度","做 DPO 改善语气"]' :answer="1" explanation="当前失败位于服务队列，不是稳定行为。先隔离系统变量，避免用参数更新掩盖容量问题。" />

<Quiz question="INT4 候选的 tokens/s 更高，但西班牙语金额与规则 ID 错误增加；总体成功率仍达标。可以全量发布吗？" :options='["可以，总体达标即可","不可以，高风险语言切片和事实正确性门禁不能被平均；回退或缩小路由后再验证","只需增大 batch"]' :answer="1" explanation="服务优化不能覆盖子组正确性回归。先保持可撤销范围，再定位量化与约束输出问题。" />

## 带着失败账本进入高级 RAG

第二阶段结束时，我们仍没有证明模型在任何领域都适配良好，也没有证明某种引擎、batch 或量化在所有硬件上最快。我们证明的是一套受边界约束的决策方法：先让简单基线获得失败资格，再让复杂度购买明确增益；每次系统优化都重跑产品正确性；证据不足时拒绝、缩小或回退。

下一阶段的[高级 RAG](/advanced/ai/05-advanced-rag)将接过两类未解决问题：正确文档为什么仍召回不到，以及召回到多个版本、表格或长文档时怎样组合证据。交接包应包含检索失败样本、文档/版本谱系、引用支持结果、Prompt Token 分布、缓存失效规则和服务容量曲线。不要把 adapter 的成功误写成检索已解决，也不要用更长上下文跳过证据选择。

<EvidenceTracker lesson="advanced-ai-stage-2-review" />

## 参考资料

- Edward J. Hu 等，[LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)，2021 年。用于复核低秩适配与冻结 base 的原始定义；不将论文资源收益外推到迁移任务。
- Rafael Rafailov 等，[Direct Preference Optimization](https://arxiv.org/abs/2305.18290)，arXiv v3，2024 年。用于复核偏好目标；偏好信号不能替代订单事实和安全门禁。
- Woosuk Kwon 等，[Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)，SOSP，2023 年。用于 KV 动态内存与分页思路；实际容量和吞吐须由本地 trace 验证。
- Yinmin Zhong 等，[DistServe](https://www.usenix.org/conference/osdi24/presentation/zhong-yinmin)，OSDI，2024 年。用于 prefill/decode 干扰和 TTFT/TPOT 约束；迁移作业不预设必须采用分离架构。
- vLLM Project，[vLLM 官方文档](https://docs.vllm.ai/en/latest/)，本课程核验于 2026-09-04。用于核对当前 metrics、adapter、batch invariance 和量化支持；功能随版本变化，实验需锁定实现。
