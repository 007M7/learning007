# 03 · 网络、浏览器与 API

<div class="lesson-meta"><span>SW07—SW09</span><span>必修核心</span><span>预计 3 × 50 分钟</span><span>前置：SW01—SW02</span></div>

## 本章可观察目标

你能画出浏览器到服务端的完整请求路径；区分传输失败、HTTP 错误和业务拒绝；设计带认证、幂等、分页、错误体和版本策略的 API 契约。

## SW07 · 一次请求经过什么

```text
URL → DNS 得到 IP → TCP 建立连接 → TLS 验证身份并加密
    → HTTP 请求 → 反向代理/网关 → 应用 → 数据库/下游
    ← HTTP 响应 ←
```

DNS 解决“名称到地址”；TCP 提供有序字节流但不懂 HTTP；TLS 提供机密性、完整性与服务端身份验证；HTTP 定义消息语义。排障时逐层验证：域名解析、端口连接、证书、HTTP 状态、应用日志、下游依赖。不要把所有 `fetch failed` 都归咎于后端代码。

超时必须分层：连接超时、首字节超时、整个请求截止时间含义不同。重试只适合可安全重放或具备幂等保护的操作，并加退避与抖动，避免故障时形成重试风暴。

## SW08 · 浏览器运行模型

浏览器解析 HTML 建 DOM，CSS 形成样式与布局，JavaScript 通过事件循环响应事件。网络回调进入任务队列；长时间同步计算会阻塞交互。前端状态至少分：服务端事实、URL 导航状态、表单临时状态、纯展示状态。不要把服务端事实复制到多个本地状态后再人工同步。

同源策略限制页面读取其他源；CORS 是服务器声明哪些跨源读取被允许，不是身份认证。Cookie、Authorization header、CSRF、XSS解决的是不同问题。

## SW09 · API 是长期契约

一个可审查 API 至少写清：

- 方法与路径的资源语义；
- 请求 Schema、单位、范围和未知字段策略；
- 成功状态码与响应 Schema；
- 统一错误码、可安全展示的信息和追踪 ID；
- 身份、权限、租户边界；
- 分页、排序、过滤与一致性；
- 幂等键、超时、限流和版本兼容。

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "库存不足",
    "request_id": "req_01...",
    "details": { "available": 2 }
  }
}
```

状态码表达协议层结果，稳定的业务错误码供程序判断。不要让前端解析自然语言错误。列表优先考虑稳定排序；数据频繁变化或规模很大时，游标分页通常比高 offset 更稳。

<Quiz question="POST 请求超时后，客户端能否直接无限重试？" :options="['可以，POST 都能重试', '不可以；先确认操作是否幂等并设置截止时间与上限', '只要换成 HTTPS 就可以']" :answer="1" explanation="超时不代表服务端未执行。写操作需幂等键或业务唯一约束，重试还要有上限和退避。" />

## 练习：任务创建 API

设计 `POST /runs`、`GET /runs/{id}`、`POST /runs/{id}:cancel`。补齐 Schema、202/200/4xx、租户校验、幂等键、状态枚举、错误体和示例。再要求 AI 从 OpenAPI 生成代码，比较实现是否遵守契约。

常见误区：把 200 当所有结果；在 URL 暴露敏感信息；只在前端做权限判断；错误体不稳定；忽略客户端断开；让服务端返回数据库实体全部字段。

<EvidenceTracker lesson="software-03-web-api" />

## 本章完成标准

能独立画出请求链并用分层检查定位一次故障；能审查一份 OpenAPI，指出验证、错误、权限、幂等和分页至少五类缺口。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://www.rfc-editor.org/rfc/rfc9110.html">RFC 9110 HTTP Semantics</a>、<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview">MDN HTTP Overview</a>、<a href="https://spec.openapis.org/oas/latest.html">OpenAPI Specification 3.2.0</a>。</div>
