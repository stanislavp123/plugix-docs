---
sidebar_position: 2
title: Chat API
---

# Chat API

The Chat API provides a conversational interface to interact with your connected systems.

## Send Message

Send a message to the AI assistant.

```http
POST /v1/chat/message
```

### Request

```json
{
  "message": "What products do I have in category Electronics?",
  "sessionId": "sess_abc123",
  "platform": "pimcore"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | string | Yes | User message |
| `sessionId` | string | No | Continue existing session |
| `platform` | string | No | Target platform (auto-detected if omitted) |

### Response

```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123",
    "response": "I found 24 products in the Electronics category...",
    "toolCalls": [
      {
        "tool": "get_products",
        "input": { "category": "Electronics" },
        "result": { "count": 24, "products": [...] }
      }
    ],
    "usage": {
      "inputTokens": 150,
      "outputTokens": 200
    }
  }
}
```

### Example

```bash
curl -X POST https://api.plugix.ai/v1/chat/message \
  -H "Authorization: Bearer plx_live_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Generate SEO descriptions for products without descriptions",
    "platform": "pimcore"
  }'
```

## List Sessions

Get all chat sessions.

```http
GET /v1/chat/sessions
```

### Response

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "sess_abc123",
        "platform": "pimcore",
        "messageCount": 5,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T11:00:00Z"
      }
    ]
  }
}
```

## Get Session

Retrieve a specific session with messages.

```http
GET /v1/chat/sessions/:sessionId
```

### Response

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "sess_abc123",
      "platform": "pimcore",
      "messages": [
        {
          "role": "user",
          "content": "What products need descriptions?"
        },
        {
          "role": "assistant",
          "content": "I found 15 products without descriptions...",
          "toolCalls": [...]
        }
      ],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Delete Session

Delete a chat session.

```http
DELETE /v1/chat/sessions/:sessionId
```

### Response

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

## Tool Calls

When the AI uses tools to interact with your systems, the response includes `toolCalls`:

```json
{
  "toolCalls": [
    {
      "tool": "get_products",
      "input": {
        "category": "Electronics",
        "limit": 10
      },
      "result": {
        "count": 10,
        "products": [
          { "id": "123", "name": "Laptop Pro", "sku": "LP-001" }
        ]
      }
    }
  ]
}
```

## Confirmation Flow

Destructive operations require user confirmation:

### 1. AI Proposes Action

```json
{
  "response": "I've prepared SEO descriptions for 15 products. Would you like me to save them?",
  "pendingAction": {
    "tool": "save_descriptions",
    "items": [...],
    "requiresConfirmation": true
  }
}
```

### 2. User Confirms

```json
{
  "message": "Yes, save them",
  "sessionId": "sess_abc123"
}
```

### 3. Action Executed

```json
{
  "response": "Done! I've updated 15 product descriptions.",
  "toolCalls": [
    {
      "tool": "save_descriptions",
      "result": { "updated": 15 }
    }
  ]
}
```

## Streaming (Coming Soon)

Real-time streaming responses:

```http
POST /v1/chat/message/stream
```

Response uses Server-Sent Events (SSE):

```
data: {"type": "text", "content": "I found "}
data: {"type": "text", "content": "24 products..."}
data: {"type": "tool_call", "tool": "get_products", ...}
data: {"type": "done"}
```

## Error Handling

### No MCP Connection

```json
{
  "success": false,
  "error": {
    "code": "NO_CONNECTION",
    "message": "No MCP server connected for platform: pimcore"
  }
}
```

### Tool Execution Error

```json
{
  "success": true,
  "data": {
    "response": "I encountered an error fetching products: Connection timeout",
    "toolCalls": [
      {
        "tool": "get_products",
        "error": "Connection timeout"
      }
    ]
  }
}
```
