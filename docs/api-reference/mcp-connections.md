---
sidebar_position: 3
title: MCP Connections
---

# MCP Connections API

Manage and monitor MCP server connections.

## List Connections

Get all active MCP connections for your account.

```http
GET /v1/mcp/connections
```

### Response

```json
{
  "success": true,
  "data": {
    "connections": [
      {
        "connectionId": "conn_abc123",
        "platform": "pimcore",
        "instanceId": "inst_xyz",
        "instanceName": "Production Pimcore",
        "status": "connected",
        "toolCount": 6,
        "connectedAt": "2024-01-15T10:00:00Z",
        "lastHeartbeatAt": "2024-01-15T12:30:00Z"
      }
    ]
  }
}
```

### Connection Fields

| Field | Type | Description |
|-------|------|-------------|
| `connectionId` | string | Unique connection identifier |
| `platform` | string | Platform type (pimcore, aws, shopware) |
| `instanceId` | string | MCP server instance ID |
| `instanceName` | string | Human-readable name |
| `status` | string | Connection status |
| `toolCount` | number | Number of available tools |
| `connectedAt` | string | Connection established time |
| `lastHeartbeatAt` | string | Last heartbeat received |

### Connection Status

| Status | Description |
|--------|-------------|
| `connected` | Active and healthy |
| `connecting` | Establishing connection |
| `disconnected` | Not connected |
| `error` | Connection error |

## Get Connection Details

Get detailed information about a specific connection.

```http
GET /v1/mcp/connections/:connectionId
```

### Response

```json
{
  "success": true,
  "data": {
    "connection": {
      "connectionId": "conn_abc123",
      "platform": "pimcore",
      "instanceName": "Production Pimcore",
      "status": "connected",
      "tools": [
        {
          "name": "get_products",
          "description": "Fetch products with filters",
          "inputSchema": {
            "type": "object",
            "properties": {
              "category": { "type": "string" },
              "limit": { "type": "number" }
            }
          }
        },
        {
          "name": "save_descriptions",
          "description": "Update product descriptions",
          "requiresConfirmation": true
        }
      ],
      "connectedAt": "2024-01-15T10:00:00Z",
      "stats": {
        "toolCalls": 150,
        "lastToolCall": "2024-01-15T12:25:00Z"
      }
    }
  }
}
```

## Connection Status Endpoint

Check MCP connection status (lightweight health check).

```http
GET /v1/mcp/status
```

### Response

```json
{
  "success": true,
  "data": {
    "hasActiveConnections": true,
    "platforms": ["pimcore", "aws"],
    "connectionCount": 2
  }
}
```

## WebSocket Connection (MCP Servers)

MCP servers connect via WebSocket:

```
wss://api.plugix.ai/mcp/connect
```

### Connection Handshake

1. **Connect with API key:**
   ```
   wss://api.plugix.ai/mcp/connect?apiKey=plx_live_xxx
   ```

2. **Send initialization:**
   ```json
   {
     "type": "init",
     "platform": "pimcore",
     "instanceName": "Production",
     "tools": [...]
   }
   ```

3. **Receive confirmation:**
   ```json
   {
     "type": "connected",
     "connectionId": "conn_abc123"
   }
   ```

### Message Types

#### Tool Call (Server → MCP)

```json
{
  "type": "tool_call",
  "id": "call_123",
  "tool": "get_products",
  "input": { "category": "Electronics" }
}
```

#### Tool Result (MCP → Server)

```json
{
  "type": "tool_result",
  "id": "call_123",
  "result": { "count": 24, "products": [...] }
}
```

#### Heartbeat

```json
{
  "type": "ping"
}
```

```json
{
  "type": "pong"
}
```

### Reconnection

MCP servers should implement automatic reconnection:

```javascript
let reconnectDelay = 1000;

function connect() {
  const ws = new WebSocket(url);

  ws.onclose = () => {
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  };

  ws.onopen = () => {
    reconnectDelay = 1000;
  };
}
```

## Errors

### No Connections

```json
{
  "success": true,
  "data": {
    "connections": []
  }
}
```

### Connection Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Connection not found"
  }
}
```
