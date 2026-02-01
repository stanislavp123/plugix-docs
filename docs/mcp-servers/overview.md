---
sidebar_position: 1
title: Overview
---

# MCP Servers Overview

MCP (Model Context Protocol) servers are lightweight agents that run in your infrastructure and connect your systems to Plugix.

## Architecture

```
YOUR INFRASTRUCTURE                    PLUGIX CLOUD
┌─────────────────────────┐           ┌─────────────────────────┐
│                         │           │                         │
│  ┌─────────────────┐    │  WSS      │  ┌─────────────────┐   │
│  │   MCP Server    │────┼──────────→│  │   AI Engine     │   │
│  │  (runs locally) │    │ outbound  │  │  (Claude/GPT)   │   │
│  └────────┬────────┘    │           │  └─────────────────┘   │
│           │             │           │                         │
│  ┌────────▼────────┐    │           │                         │
│  │   Your System   │    │           │                         │
│  │  (Pimcore/AWS)  │    │           │                         │
│  └─────────────────┘    │           │                         │
│                         │           │                         │
│  🔒 CREDENTIALS STAY    │           │  API Keys, Prompts     │
│     IN YOUR INFRA       │           │  Billing, Usage        │
└─────────────────────────┘           └─────────────────────────┘
```

## Key Security Features

### Credentials Stay Local

Your sensitive credentials (database passwords, API tokens, AWS keys) **never leave your infrastructure**. The MCP server:

- Stores credentials locally
- Connects **outbound** to Plugix (no inbound ports needed)
- Only transmits tool results, not credentials

### What Data Is Transmitted?

| Transmitted | NOT Transmitted |
|-------------|-----------------|
| Tool results (e.g., product list) | Database passwords |
| Tool call requests | API tokens |
| Connection heartbeats | AWS credentials |
| | System credentials |

## Available MCP Servers

| Server | Platform | Status |
|--------|----------|--------|
| [@plugix/mcp-pimcore](/mcp-servers/pimcore) | Pimcore PIM/DAM | ✅ Available |
| [@plugix/mcp-aws](/mcp-servers/aws) | Amazon Web Services | ✅ Available |
| [@plugix/mcp-shopware](/mcp-servers/shopware) | Shopware 6 | ✅ Available |
| @plugix/mcp-zendesk | Zendesk | 🔜 Coming Soon |
| @plugix/mcp-sap | SAP | 🔜 Coming Soon |

## Installation Methods

### NPX (Quick Start)

```bash
npx @plugix/mcp-pimcore --api-key plx_live_xxx ...
```

### NPM Global Install

```bash
npm install -g @plugix/mcp-pimcore
mcp-pimcore --api-key plx_live_xxx ...
```

### Docker

```bash
docker run -d \
  --name mcp-pimcore \
  --restart unless-stopped \
  -e PLUGIX_API_KEY=plx_live_xxx \
  plugix/mcp-pimcore:latest
```

## Common Configuration

All MCP servers support these options:

| Option | Environment | Description |
|--------|-------------|-------------|
| `--api-key` | `PLUGIX_API_KEY` | Your Plugix API key |
| `--api-url` | `PLUGIX_API_URL` | API URL (default: wss://api.plugix.ai) |
| `--instance-name` | `INSTANCE_NAME` | Name shown in dashboard |
| `--log-level` | `LOG_LEVEL` | Logging: debug, info, warn, error |

## Connection Lifecycle

### 1. Startup

```
MCP Server starts
  → Loads configuration
  → Validates credentials
  → Discovers available tools
```

### 2. Connection

```
Connects to Plugix
  → WebSocket: wss://api.plugix.ai/mcp/connect
  → Authenticates with API key
  → Sends available tools list
```

### 3. Ready

```
Connection established
  → Appears in Dashboard → Connections
  → Status: Active
  → Ready to receive tool calls
```

### 4. Tool Execution

```
AI requests tool
  → Plugix sends tool_call
  → MCP executes locally
  → Returns result to Plugix
```

### 5. Reconnection

```
Connection lost
  → Automatic reconnection
  → Exponential backoff (1s → 2s → 4s → ... → 30s)
  → Maintains state
```

## Monitoring

### Dashboard

Go to **Dashboard → Connections** to see:

- Connection status (Active, Disconnected)
- Available tools
- Last heartbeat time
- Tool call statistics

### Logs

Enable debug logging:

```bash
LOG_LEVEL=debug mcp-pimcore --api-key xxx ...
```

### Health Checks

MCP servers expose local health endpoint:

```bash
curl http://localhost:3001/health
```

## Firewall Configuration

MCP servers only require **outbound** connectivity:

| Destination | Port | Protocol |
|-------------|------|----------|
| api.plugix.ai | 443 | WSS (WebSocket Secure) |

**No inbound ports** need to be opened.

## Custom MCP Servers

Build your own MCP server for custom integrations:

```typescript
import { createMcpServer } from '@plugix/mcp-sdk';

const server = createMcpServer({
  apiKey: process.env.PLUGIX_API_KEY,
  platform: 'custom',
  tools: [
    {
      name: 'my_tool',
      description: 'Does something',
      inputSchema: { ... },
      handler: async (input) => {
        // Your implementation
        return result;
      }
    }
  ]
});

server.start();
```

See the [MCP SDK documentation](https://github.com/plugix/mcp-sdk) for details.
