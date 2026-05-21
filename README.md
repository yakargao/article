# 🚀 软件开发成神之路

> 52 篇费曼风格技术文章 · 暗色主题 · SVG 配图 · Go 代码实战 · 口播总结

覆盖 **系统设计、中间件、AI Agent、计算机基础、组成原理、高级开发实战** 七大领域，每篇文章都遵循「费曼类比 → 核心原理 → SVG 图解 → 代码实战 → QA 问答 → 口播总结」的学习闭环。

---

## 🔧 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动本地服务
node server.js

# 3. 打开浏览器
# → http://localhost:10085
```

**运行环境：** Node.js 18+，单文件无数据库依赖。启动后通过 `http://localhost:10085` 访问首页，下拉分类筛选或搜索定位文章。

---

## 📚 文章总览

### 🤖 AI Agent（8 篇）

从 AI Agent 四大范式到完整实战，覆盖工具调用、记忆管理、MCP 协议、多 Agent 协作、可观测性等核心主题。

| 文章 | 配图 | 亮点 |
|------|:----:|------|
| [LangChain + LangGraph](./public/langgraph.html) | 3 | Chain/StateGraph/Agent 实战 |
| [AI Agent 架构原理](./public/ai-agent-arch.html) | 8 | 4 大范式对比 + 状态机 + Go 实现 |
| [工具调用与 Function Calling](./public/ai-agent-tools.html) | 9 | FC 协议差异/并行调用/Failover |
| [AI Agent 记忆系统](./public/ai-agent-memory.html) | 7 | 三层记忆 + 上下文窗口 + MemGPT |
| [MCP 协议深度解析](./public/ai-agent-mcp.html) | 6 | stdio/SSE/WebSocket + A2A |
| [多 Agent 协作模式](./public/ai-agent-multi.html) | 7 | Orchestrator/Swarm/Debate |
| [Agent 可观测性与安全](./public/ai-agent-observability.html) | 7 | Tracing/Guardrails/注入防护 |
| [实战：装修管理 AI Agent](./public/ai-agent-practice.html) | 7 | 千问 + MCP + 三模式状态机 |

### ⚡ 高级开发实战（13 篇）

面向进阶开发者，每个主题包含架构演进 + 实战场景 + Go 代码示例。

| 文章 | 核心内容 |
|------|----------|
| [Kubernetes 实战](./public/k8s.html) | Pod/Service/Ingress/Operator/CNI/调度策略 |
| [微服务架构实战](./public/microservice.html) | 服务拆分/注册发现/gRPC/API Gateway/Service Mesh |
| [可观测性实战](./public/observability.html) | OpenTelemetry/Prometheus/Grafana/ELK 全栈 |
| [CI/CD 与 GitOps](./public/cicd.html) | GitHub Actions/ArgoCD/蓝绿发布/金丝雀 |
| [分布式事务实战](./public/distributed-tx.html) | 2PC/TCC/Saga/事务消息 + Go 开源库对比 |
| [数据库分片实战](./public/db-sharding.html) | 分片键设计/扩容/跨分片查询/分布式 ID |
| [Kafka 进阶实战](./public/kafka-deep.html) | 存储原理/ISR/幂等/事务/重平衡/集群迁移 |
| [缓存架构设计](./public/cache-arch.html) | 多级缓存/Cache Aside/穿透/击穿/雪崩/一致性 |
| [NoSQL 数据库实战](./public/nosql.html) | Redis/MongoDB/Cassandra/选型对比 |
| [安全攻防实战](./public/security.html) | SQL 注入/XSS/CSRF/SSRF/JWT/OAuth 2.1 |
| [性能调优实战](./public/performance-tuning.html) | pprof/火焰图/GC 优化/锁优化/零拷贝 |
| [系统设计实战案例](./public/system-design-cases.html) | 短链/秒杀/IM/Feed 流/视频网站 |
| [Go 工程实践](./public/go-engineering.html) | 模块化/错误处理/测试/依赖注入/Cobra |

### 🏛️ 系统设计（12 篇）

基础知识与经典论文解读，帮你建立系统设计全景认知。

| 文章 | 核心内容 |
|------|----------|
| [高可用服务设计](./public/ha.html) | 冗余/熔断/限流/CAP/多活 |
| [高性能系统设计](./public/performance.html) | 多级缓存/零拷贝/批处理/pprof |
| [高可扩展性系统设计](./public/scalability.html) | 水平扩展/无状态/事件驱动/CQRS |
| [阿姆达尔定律](./public/amdahl.html) | 加速比/并发/并行 |
| [领域驱动设计 DDD](./public/ddd.html) | 限界上下文/聚合/事件风暴 |
| [分布式锁](./public/distributed-lock.html) | Redis/etcd/ZK 实现对比 |
| [分布式数据一致性](./public/distributed-consistency.html) | CAP/BASE/Paxos/Raft |
| [高并发系统设计](./public/concurrency.html) | 并发模型/线程池/协程 |
| [分布式一致性协议](./public/consensus.html) | Paxos/Raft/ZAB/Gossip |
| [DDIA · 数据密集型应用](./public/ddia.html) | 数据模型/存储引擎/复制/分区/事务 |
| [系统设计方法论](./public/system-design.html) | 4S 分析法/估算/演进式架构 |
| [软件开发中的权衡与取舍](./public/tradeoffs.html) | CAP/一致性成本/技术债务 |

### 💻 语言与计算机基础（8 篇）

涵盖 Go 语言深入和操作系统核心知识。

| 文章 | 核心内容 |
|------|----------|
| [Go 数据结构](./public/go-structures.html) | Slice/Map/Chan 内存布局 + 跨语言对比 |
| [计算机网络](./public/networking.html) | OSI/TCP-IP/HTTP/TLS/DNS |
| [HTTP 协议](./public/http.html) | 请求响应/CORS/缓存/版本演进 |
| [Go 并发的艺术](./public/go-concurrency.html) | Goroutine/Channel/Sync/Context/并发模式 |
| [Go 内存与 GC](./public/go-memory.html) | GC 三色标记/内存逃逸/调优 |
| [操作系统 · 内存管理](./public/os-memory.html) | 虚拟内存/分页/Segmentation/MMU |
| [操作系统 · IO模型与文件系统](./public/os-io-filesystem.html) | IO 多路复用/零拷贝/VFS |
| [操作系统 · 进程/线程/协程](./public/os-process-thread.html) | 调度/同步/死锁/协程实现 |

### 🏗️ 计算机组成原理（7 篇）

从硬件视角理解程序是如何跑起来的。

| 文章 | 核心内容 |
|------|----------|
| [计算机系统概述](./public/computer-arch-overview.html) | 冯诺依曼/性能指标/指令周期 |
| [数据的表示与运算](./public/computer-arch-data.html) | 原码反码补码/浮点数 IEEE 754 |
| [存储系统 · Cache](./public/computer-arch-cache.html) | 缓存映射/替换策略/MESI/写策略 |
| [指令系统](./public/computer-arch-instruction.html) | CISC vs RISC/寻址方式/指令流水线 |
| [CPU · 数据通路与流水线](./public/computer-arch-cpu.html) | 单周期/多周期/流水线冒险/分支预测 |
| [总线与I/O系统](./public/computer-arch-bus-io.html) | 总线仲裁/DMA/中断/外设通信 |
| [高频真题](./public/computer-arch-qa.html) | 经典场景题解析 |

### 🔧 中间件（3 篇）

| 文章 | 核心内容 |
|------|----------|
| [MySQL](./public/mysql.html) | InnoDB/B+ 树/事务隔离/锁/索引优化/分库分表 |
| [Redis](./public/redis.html) | 数据结构/持久化/主从/集群/缓存策略 |
| [Kafka](./public/kafka.html) | 分区/副本/ISR/Exactly-Once/重平衡 |

### 🧮 算法（1 篇）

| 文章 | 核心内容 |
|------|----------|
| [LeetCode 高频模式](./public/leetcode-patterns.html) | Top 100 考点总结 |

---

## 🎨 技术特性

| 特性 | 说明 |
|------|------|
| **费曼学习法** | 每篇文章从日常类比出发，降低理解门槛 |
| **SVG 配图** | 51+ 张原创 SVG 技术图解，支持响应式缩放 |
| **暗色主题** | 护眼深色 UI，阅读体验舒适 |
| **Go 代码** | 20+ 段可运行的 Go 实战代码，语法高亮 |
| **口播总结** | 每篇文章末尾有 MP3 音频总结（部分） |
| **苏格拉底 QA** | 可折叠问答卡片，引导深度思考 |
| **筛选搜索** | 按分类/关键词快速定位文章 |
| **移动响应** | 768px 断点自适应，手机端舒适阅读 |

---

## 📁 项目结构

```
├── server.js         # Express 静态服务器（端口 10085）
├── package.json
├── README.md
└── public/
    ├── index.html          # 首页：分类筛选 + 卡片网格
    ├── *.html              # 52 篇技术文章
    ├── ebbinghaus.js       # 艾宾浩斯复习引擎
    ├── mobile.js           # 移动端适配
    ├── favicon.svg
    └── audio/              # 口播总结音频（MP3）
```

---

## 🚂 GitHub

```bash
git clone git@github.com:yakargao/article.git
cd article
npm install
node server.js
```

打开浏览器访问 `http://localhost:10085` 即可。

---

## 📝 License

MIT © 2026
