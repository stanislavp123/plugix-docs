---
sidebar_position: 4
title: Usage & Billing
---

# Usage & Billing API

Track API usage and manage billing.

## Get Current Usage

Get usage statistics for the current billing period.

```http
GET /v1/usage
```

### Response

```json
{
  "success": true,
  "data": {
    "currentMonth": {
      "requests": 1250,
      "tokensInput": 450000,
      "tokensOutput": 180000,
      "costCents": 1580
    },
    "limit": 10000,
    "plan": "pro"
  }
}
```

### Fields

| Field | Description |
|-------|-------------|
| `requests` | Total API requests this month |
| `tokensInput` | Input tokens processed |
| `tokensOutput` | Output tokens generated |
| `costCents` | Total cost in cents |
| `limit` | Monthly request limit |
| `plan` | Current plan (free, pro, enterprise) |

## Get Usage History

Get detailed usage history.

```http
GET /v1/usage/history?from=2024-01-01&to=2024-01-31
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `from` | string | Start date (ISO 8601) |
| `to` | string | End date (ISO 8601) |
| `groupBy` | string | Group by: day, week, month |

### Response

```json
{
  "success": true,
  "data": {
    "history": [
      {
        "date": "2024-01-15",
        "requests": 85,
        "tokensInput": 32000,
        "tokensOutput": 12000,
        "costCents": 110
      }
    ],
    "total": {
      "requests": 1250,
      "tokensInput": 450000,
      "tokensOutput": 180000,
      "costCents": 1580
    }
  }
}
```

## Get Billing Information

Get billing details and subscription status.

```http
GET /v1/usage/billing
```

### Response

```json
{
  "success": true,
  "data": {
    "plan": "pro",
    "status": "active",
    "currentPeriod": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-31T23:59:59Z"
    },
    "usage": {
      "requests": 1250,
      "limit": 10000,
      "percentUsed": 12.5
    },
    "billing": {
      "email": "billing@example.com",
      "nextInvoice": "2024-02-01T00:00:00Z",
      "amount": 4900
    }
  }
}
```

## Pricing Plans

| Plan | Monthly | Requests | Features |
|------|---------|----------|----------|
| **Free** | $0 | 100 | Basic chat, 1 MCP connection |
| **Pro** | $49 | 10,000 | Unlimited connections, priority support |
| **Enterprise** | Custom | Custom | Local AI, SLA, dedicated support |

## Usage by Endpoint

Get usage breakdown by API endpoint.

```http
GET /v1/usage/endpoints
```

### Response

```json
{
  "success": true,
  "data": {
    "endpoints": [
      {
        "endpoint": "POST /v1/chat/message",
        "requests": 800,
        "tokensInput": 350000,
        "tokensOutput": 140000
      },
      {
        "endpoint": "POST /v1/ecommerce/descriptions",
        "requests": 150,
        "tokensInput": 80000,
        "tokensOutput": 35000
      }
    ]
  }
}
```

## Usage by Platform

Get usage breakdown by connected platform.

```http
GET /v1/usage/platforms
```

### Response

```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "platform": "pimcore",
        "requests": 950,
        "toolCalls": 2100
      },
      {
        "platform": "aws",
        "requests": 300,
        "toolCalls": 450
      }
    ]
  }
}
```

## Webhooks (Enterprise)

Configure webhooks for usage alerts.

### Usage Threshold Alert

```json
{
  "event": "usage.threshold",
  "data": {
    "threshold": 80,
    "current": 8500,
    "limit": 10000
  }
}
```

### Billing Events

```json
{
  "event": "billing.invoice.paid",
  "data": {
    "invoiceId": "inv_xxx",
    "amount": 4900,
    "period": "2024-01"
  }
}
```

## Cost Estimation

Estimate costs before making API calls.

```http
POST /v1/usage/estimate
```

### Request

```json
{
  "operation": "descriptions",
  "itemCount": 100,
  "averageLength": 500
}
```

### Response

```json
{
  "success": true,
  "data": {
    "estimatedTokens": {
      "input": 50000,
      "output": 20000
    },
    "estimatedCostCents": 175
  }
}
```
