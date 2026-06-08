# agentgateway介绍


<!--more-->
参考:
- https://github.com/agentgateway/agentgateway
- https://agentgateway.dev/
- https://www.linuxfoundation.org/press/linux-foundation-welcomes-agentgateway-project-to-accelerate-ai-agent-adoption-while-maintaining-security-observability-and-governance

### 一、agentgateway是什么

agentgateway 是一个开源的 AI 原生代理网关，由 Solo.io 开发并捐赠给 Linux Foundation。它是专门为 AI Agent 设计的数据平面代理，支持 MCP（Model Context Protocol）和 A2A（Agent-to-Agent）协议。

简单来说，它能统一处理：
- 传统 HTTP/gRPC 服务流量
- LLM（大模型）流量
- MCP 工具调用流量
- Agent 之间通信流量

之前我们可能需要多个网关来处理不同类型的流量，现在一个 agentgateway 就搞定了。

### 二、核心功能

#### 1. LLM Gateway
统一的 OpenAI 兼容 API，支持多家 LLM 提供商：
- OpenAI
- Anthropic (Claude)
- Google Gemini / Vertex AI
- AWS Bedrock
- Azure OpenAI
- Cohere
- 自托管模型（如 Llama）

支持负载均衡和故障转移。

#### 2. MCP Gateway
把 MCP Server 当成微服务来管理：
- 工具发现和联邦
- 支持 stdio/HTTP/SSE/Streamable HTTP 多种传输方式
- OpenAPI 集成
- OAuth 认证
- RBAC 权限控制
- 审计日志

#### 3. A2A Gateway
Agent 之间的安全通信：
- 能力发现
- 模态协商
- 任务协作
- 支持 LangChain、CrewAI、ADK 等框架

#### 4. Inference Routing
对接 Kubernetes Gateway API Inference Extension，实现自托管模型的智能路由：
- 支持 InferencePool 资源
- 通过 EPP（Endpoint Picker Extension）选择最优的模型服务端点
- 支持 Gateway API 的流量分割和路由匹配

#### 5. Guardrails（护栏）
多层内容过滤：
- 正则匹配
- OpenAI Moderation
- AWS Bedrock Guardrails
- Google Model Armor
- 自定义 Webhook

#### 6. 安全与可观测性
- 认证：JWT、API Key、MCP Authentication（支持 Auth0、Keycloak 等外部 Provider）
- 授权：RBAC 权限控制、外部授权服务（extAuthz）
- 限流：本地限流和分布式限流
- TLS/mTLS
- 内置指标和链路追踪

### 三、架构

agentgateway 使用 Rust 编写，性能很高。架构上分为：
- **Control Plane**：配置管理、策略决策
- **Data Plane**：实际的流量代理

代码组成：
- Rust: 61.5%
- Go: 26.7%（Kubernetes controller）
- TypeScript: 9.4%（UI）

### 四、快速开始

#### 方式一：二进制安装
```bash
# 安装
curl -sL https://agentgateway.dev/install | bash

# 下载示例配置
curl -sL https://raw.githubusercontent.com/agentgateway/agentgateway/main/examples/basic/config.yaml -o config.yaml

# 启动
agentgateway -f config.yaml
# INFO agentgateway: Listening on 0.0.0.0:3000
# INFO agentgateway: Admin UI at http://localhost:15000/ui/
```

#### 方式二：Docker
```bash
docker run -p 3000:3000 -p 15000:15000 \
  -v $(pwd)/config.yaml:/etc/agentgateway/config.yaml \
  ghcr.io/agentgateway/agentgateway:latest \
  -f /etc/agentgateway/config.yaml
```

#### 方式三：Kubernetes
```bash
# 安装 Gateway API CRDs
kubectl apply --server-side --force-conflicts \
  -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.5.0/standard-install.yaml

# 安装 agentgateway CRDs
helm upgrade -i agentgateway-crds \
  oci://cr.agentgateway.dev/charts/agentgateway-crds \
  --create-namespace --namespace agentgateway-system \
  --version v1.2.1

# 安装 agentgateway
helm upgrade -i agentgateway \
  oci://cr.agentgateway.dev/charts/agentgateway \
  --namespace agentgateway-system \
  --version v1.2.1 \
  --wait
```

启动后访问 `http://localhost:15000/ui/` 可以看到自带的管理界面。

### 五、CLI参数说明

```bash
agentgateway -f config.yaml
```
> `-f`: 指定配置文件路径

更多参数可以通过 `agentgateway --help` 查看。启动后默认在 15000 端口提供管理界面。

### 六、配置文件详解

#### 1. 配置文件结构说明

agentgateway 的配置文件使用 `binds:` 作为顶层字段，它是一个列表。每个 bind 元素包含：
- `port`: 监听端口
- `listeners`: 监听器列表（可以有多个）
- `routes`: 路由规则（嵌套在 listeners 下）

```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
binds:
- port: 3000                # 监听端口
  listeners:                # 监听器列表
  - routes:                 # 路由规则
    - backends:             # 后端配置
      - ...
```

`binds` 是列表，因为可以同时绑定多个端口。比如一个端口处理 HTTP，另一个端口处理 gRPC。如果只需要一个端口，写一个元素就行。

`listeners` 也是列表，每个 listener 可以配置不同的策略（如 CORS、认证等）。如果不需要特殊策略，写一个就行。

#### 2. LLM 代理配置

官方提供了简化的 LLM 配置格式：
```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
llm:
  models:
  - name: gpt-3.5-turbo        # 模型名称，自定义
    provider: openAI            # 提供商，支持 openAI/anthropic/bedrock/gemini 等
    params:
      model: gpt-3.5-turbo     # 实际调用的模型名
      apiKey: "$OPENAI_API_KEY" # API Key，支持环境变量
```

> `llm`: 顶层 LLM 配置块
>
> `models`: 模型列表，可以配置多个模型
>
> `name`: 模型名称，用于日志和 UI 显示
>
> `provider`: 提供商类型
>
> `params.model`: 实际调用的模型名，需要和提供商的 API 一致
>
> `params.apiKey`: API Key，`$OPENAI_API_KEY` 会从环境变量读取

如果需要更精细的控制（如负载均衡、CORS），可以使用完整的 binds 格式：
```yaml
binds:
- port: 3000
  listeners:
  - routes:
    - policies:
        cors:
          allowOrigins:
          - '*'
      backends:
      - openAI:
          model: gpt-3.5-turbo
          apiKey: "$OPENAI_API_KEY"
```

#### 3. MCP Server 代理配置

官方提供了简化的 MCP 配置格式：
```yaml
# yaml-language-server: $schema=https://agentgateway.dev/schema/config
mcp:
  port: 3000                    # 监听端口
  targets:                      # MCP Server 列表
  - name: server-everything     # 名称，用于日志和 UI 显示
    stdio:                      # 通过 stdio 方式连接本地 MCP Server
      cmd: npx                  # 启动命令
      args:                     # 命令参数
      - -y
      - "@modelcontextprotocol/server-everything"
```

> `mcp`: 顶层 MCP 配置块
>
> `port`: 监听端口
>
> `targets`: MCP Server 列表，可以配置多个
>
> `name`: 名称，用于日志和 UI 显示
>
> `stdio`: 通过标准输入输出连接本地 MCP Server
>
> `stdio.cmd`: 启动命令
>
> `stdio.args`: 命令参数

连接远程 MCP Server：
```yaml
mcp:
  port: 3000
  targets:
  - name: remote-mcp
    mcp:                        # 通过 HTTP 方式连接远程 MCP Server
      host: http://localhost:3005/mcp/  # 远程 MCP Server 地址
```

如果需要更精细的控制（如 CORS、认证），可以使用完整的 binds 格式：
```yaml
binds:
- port: 3000
  listeners:
  - routes:
    - policies:
        cors:
          allowOrigins:
          - '*'
          allowHeaders:
          - mcp-protocol-version
          - content-type
          - cache-control
          - mcp-session-id
      backends:
      - mcp:
          targets:
          - name: server-everything
            stdio:
              cmd: npx
              args: ["@modelcontextprotocol/server-everything"]
```

#### 4. A2A 代理配置

A2A（Agent-to-Agent）是 Google 提出的 Agent 间通信协议。agentgateway 原生支持 A2A，可以代理 Agent 之间的请求。

```yaml
config:
  logging:
    format: json
binds:
- port: 3000                          # 监听端口
  listeners:
  - routes:
    - policies:
        cors:                         # CORS 策略，A2A 客户端通常需要跨域
          allowOrigins:
          - '*'
          allowHeaders:
          - content-type
          - cache-control
        a2a: {}                       # 标记这条路由为 A2A 流量，关键配置
      backends:
      - host: localhost:9999          # 后端 Agent 的地址
```

> `a2a: {}` 是关键配置，告诉 agentgateway 这条路由处理的是 A2A 协议流量。agentgateway 会自动处理 A2A 协议的细节，包括：
>
> - Agent Card 发现：自动代理 `/.well-known/agent.json` 端点，并把 URL 重写为指向 agentgateway 自身
> - 任务管理：代理 A2A 的 task 创建、查询、取消等请求
> - 流式通信：支持 A2A 的 SSE 流式响应
> - 能力协商：处理 Agent 之间的能力发现和模态协商

启动后，客户端通过 agentgateway 访问 Agent：
```bash
# 直接访问 Agent 的 Agent Card
curl localhost:3000/.well-known/agent.json | jq
```
返回的 JSON 中，`url` 字段会被 agentgateway 自动重写为 `http://localhost:3000`，而不是后端 Agent 的原始地址。这样客户端只需要知道 agentgateway 的地址就行。

用 A2A 客户端测试：
```bash
# 假设后端是一个 Hello World Agent
uv run --directory a2a-samples/samples/python/hosts/cli . --agent http://localhost:3000
```
> `--agent`: 指向 agentgateway 的地址，而不是直接指向 Agent

agentgateway 的日志会记录 A2A 请求：
```
info  request  gateway=bind/3000 route=route0 endpoint=localhost:9999 
  http.method=POST http.path=/ a2a.method=message/stream duration=3ms
```
> `a2a.method=message/stream`: 表示这是一个 A2A 的流式消息请求

#### 5. 多后端配置

在一个 binds 下配置多个路由，分别代理不同的后端：
```yaml
binds:
- port: 3000
  listeners:
  - routes:
    # LLM 路由
    - policies:
        cors:
          allowOrigins:
          - '*'
      backends:
      - openAI:
          model: gpt-3.5-turbo
          apiKey: "$OPENAI_API_KEY"
    # MCP 路由
    - policies:
        cors:
          allowOrigins:
          - '*'
          allowHeaders:
          - mcp-protocol-version
          - content-type
      backends:
      - mcp:
          targets:
          - name: my-mcp-server
            mcp:
              host: https://mcp.github.com
```

如果 LLM 和 MCP 需要不同的端口，可以配置多个 binds：
```yaml
binds:
- port: 3000                    # LLM 端口
  listeners:
  - routes:
    - backends:
      - openAI:
          model: gpt-3.5-turbo
          apiKey: "$OPENAI_API_KEY"
- port: 3001                    # MCP 端口
  listeners:
  - routes:
    - backends:
      - mcp:
          targets:
          - name: my-mcp-server
            mcp:
              host: https://mcp.github.com
```

### 七、为什么需要agentgateway

之前我们在做 AI Agent 开发时，面临几个问题：

1. **协议碎片化**：HTTP、gRPC、MCP、A2A 各自为政，需要不同的网关
2. **安全缺失**：MCP Server 的安全基本靠自觉，没有统一的认证授权
3. **可观测性差**：Agent 调用链路不透明，出了问题难以排查
4. **治理困难**：没有统一的限流、审计、策略管理

agentgateway 把这些都统一到一个二进制文件里，用一个配置文件管理，还能对接 Kubernetes Gateway API，对平台团队来说很友好。

### 八、与其他网关的区别

| 对比项 | agentgateway | Envoy/APISIX | Kong |
|--------|-------------|--------------|------|
| AI 原生协议 | 原生支持 MCP/A2A | 需要插件 | 需要插件 |
| LLM 路由 | 内置 | 需要扩展 | 需要扩展 |
| 语言 | Rust | C++/Lua | Lua/Go |
| 适用场景 | AI Agent | 通用 | 通用 |

简单说，如果你的场景主要是 AI Agent 相关的流量，agentgateway 是目前最合适的网关。如果是传统微服务，Envoy/APISIX/Kong 依然更成熟。

### 总结

1. agentgateway 是 Linux Foundation 下的开源项目，专门为 AI Agent 设计的网关
2. 统一了 LLM、MCP、A2A、传统服务的流量管理
3. Rust 编写，性能好，自带 Web UI
4. 支持 Standalone 和 Kubernetes 两种部署方式
5. 目前还在积极开发中（v1.3.0-alpha），API 可能会有变化

如果你正在做 AI Agent 相关的开发，值得关注一下这个项目。


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/agentgateway%E4%BB%8B%E7%BB%8D/  

