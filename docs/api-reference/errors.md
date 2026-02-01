---
sidebar_position: 5
title: Error Handling
---

# Error Handling

All Plugix API errors follow a consistent format.

## Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

## HTTP Status Codes

| Status | Description |
|--------|-------------|
| `200` | Success |
| `400` | Bad Request - Invalid input |
| `401` | Unauthorized - Invalid or missing API key |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `422` | Unprocessable Entity - Validation failed |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |
| `503` | Service Unavailable - Maintenance or overload |

## Error Codes

### Authentication Errors

| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | API key lacks permission |
| `API_KEY_REVOKED` | 401 | API key has been revoked |

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

### Validation Errors

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_INPUT` | 400 | Invalid input format |
| `MISSING_FIELD` | 400 | Required field missing |

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": "message",
      "issue": "Required field is missing"
    }
  }
}
```

### Resource Errors

| Code | HTTP | Description |
|------|------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `ALREADY_EXISTS` | 409 | Resource already exists |

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Session not found"
  }
}
```

### MCP Connection Errors

| Code | HTTP | Description |
|------|------|-------------|
| `NO_CONNECTION` | 400 | No MCP server connected |
| `CONNECTION_ERROR` | 500 | MCP connection failed |
| `TOOL_ERROR` | 500 | Tool execution failed |
| `TOOL_TIMEOUT` | 504 | Tool execution timed out |

```json
{
  "success": false,
  "error": {
    "code": "NO_CONNECTION",
    "message": "No MCP server connected for platform: pimcore"
  }
}
```

### Rate Limiting

| Code | HTTP | Description |
|------|------|-------------|
| `RATE_LIMITED` | 429 | Too many requests |

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "details": {
      "retryAfter": 30,
      "limit": 60,
      "remaining": 0,
      "reset": 1640000000
    }
  }
}
```

### Billing Errors

| Code | HTTP | Description |
|------|------|-------------|
| `QUOTA_EXCEEDED` | 402 | Usage quota exceeded |
| `PAYMENT_REQUIRED` | 402 | Payment required |
| `SUBSCRIPTION_INACTIVE` | 403 | Subscription not active |

```json
{
  "success": false,
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Monthly request limit exceeded",
    "details": {
      "used": 10000,
      "limit": 10000,
      "upgradeUrl": "https://plugix.ai/upgrade"
    }
  }
}
```

### AI Provider Errors

| Code | HTTP | Description |
|------|------|-------------|
| `AI_ERROR` | 500 | AI provider error |
| `AI_OVERLOADED` | 503 | AI provider overloaded |

```json
{
  "success": false,
  "error": {
    "code": "AI_OVERLOADED",
    "message": "AI service temporarily unavailable",
    "details": {
      "retryAfter": 10
    }
  }
}
```

## Error Handling Best Practices

### Retry Logic

Implement exponential backoff for retryable errors:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  let delay = 1000;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);

      if (response.status === 429 || response.status === 503) {
        const data = await response.json();
        const retryAfter = data.error?.details?.retryAfter || delay / 1000;
        await sleep(retryAfter * 1000);
        delay *= 2;
        continue;
      }

      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay);
      delay *= 2;
    }
  }
}
```

### Error Classification

```javascript
function isRetryable(error) {
  const retryableCodes = [
    'RATE_LIMITED',
    'AI_OVERLOADED',
    'CONNECTION_ERROR',
    'TOOL_TIMEOUT'
  ];
  return retryableCodes.includes(error.code);
}

function requiresUpgrade(error) {
  return ['QUOTA_EXCEEDED', 'PAYMENT_REQUIRED'].includes(error.code);
}
```

### Logging

Always log error details for debugging:

```javascript
function handleError(error) {
  console.error('API Error:', {
    code: error.code,
    message: error.message,
    details: error.details,
    timestamp: new Date().toISOString()
  });
}
```
