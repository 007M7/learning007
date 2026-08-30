# 03 · 静态检查、制品与容器

<div class="lesson-meta"><span>Q07—Q09</span><span>必修核心</span><span>预计 3 × 50 分钟</span><span>前置：SW03、Q02</span></div>

## 本章可观察目标

你能建立格式、类型、lint、依赖与安全检查；产生可追溯的构建制品；解释镜像、容器、网络、卷和进程的边界。

## Q07 · 快反馈质量门

推荐从便宜到昂贵运行：格式 → lint → 类型 → 单元 → 集成 → 构建 → E2E/安全扫描。锁定依赖并提交 lockfile；自动更新仍需测试和变更审查。密钥扫描、依赖漏洞和许可证检查属于供应链输入检查，但扫描“没有发现”不等于绝对安全。

AI 生成依赖前要问：为什么需要、维护状态、许可证、最小版本、替代方案、锁文件变化。不要允许它为一个简单函数引入重量级库。

## Q08 · 可重复、可追溯的制品

部署单位应是 CI 构建并验证过的同一制品，不要生产服务器现场拉源码再构建。制品至少带：提交 SHA、版本、构建时间、依赖锁、来源/签名或 provenance。配置与密钥在部署时注入，不烘焙进镜像。

版本号说明兼容意图；真正兼容还需契约测试。数据库 Schema 与应用版本需建立兼容矩阵。

## Q09 · 容器不是虚拟机

镜像是只读分层模板，容器是受隔离的进程；多个容器共享宿主内核。容器内 `localhost` 指当前容器，不是数据库容器。持久数据放卷或外部服务，不写容器可写层。

```dockerfile
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

生产镜像应最小化：固定基础镜像版本/摘要，非 root 用户，只有运行依赖，健康检查区分“进程活着”和“可接流量”，响应终止信号并有关闭期限。

## 练习：从提交到镜像

为任务服务建立命令矩阵和多阶段 Dockerfile：全新目录仅凭 lockfile 构建；镜像标签包含 SHA；非 root 运行；配置从环境注入；数据库在独立网络服务；清空本机缓存后仍可重建。

常见误区：使用未固定 `latest`；把 `.env` 复制进镜像；一个容器跑数据库＋应用＋代理；容器日志写本地永久文件；开发热更新配置直接用于生产。

<EvidenceTracker lesson="quality-03-build" />

## 本章完成标准

在干净环境从同一提交得到可运行制品；能回答制品来自哪个 SHA、含哪些依赖、由谁构建、怎样验证；容器重建后业务数据仍在且密钥不在镜像层。

<div class="source-note">主要来源（访问于 2026-08-31）：<a href="https://docs.docker.com/get-started/">Docker Get Started</a>、<a href="https://semver.org/">Semantic Versioning 2.0.0</a>、<a href="https://slsa.dev/spec/v1.2/">SLSA 1.2</a>。</div>
