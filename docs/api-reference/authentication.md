---
sidebar_position: 1
title: Authentication
---

# Authentication

All Plugix API requests require authentication using an API key.

## API Key Authentication

Include your API key in the `Authorization` header:

```bash
curl -X GET https://api.plugix.ai/v1/health \
  -H "Authorization: Bearer plx_live_YOUR_API_KEY"
```

## Getting an API Key

1. Log in to [plugix.ai/dashboard](https://plugix.ai/dashboard)
2. Go to **API Keys**
3. Click **Create API Key**
4. Copy and save the key (shown only once)

See [Create API Key](/getting-started/create-api-key) for detailed instructions.

## Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer plx_live_xxx` |
| `Content-Type` | Yes* | `application/json` for POST/PUT |
| `X-Platform` | No | Platform hint (pimcore, aws, shopware) |

## Authentication Errors

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or missing API key"
  }
}
```

**Causes:**
- Missing `Authorization` header
- Invalid API key
- Revoked API key

### 403 Forbidden

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "API key does not have permission for this resource"
  }
}
```

**Causes:**
- API key lacks required permissions
- Resource belongs to different tenant

## Security Best Practices

### Keep Keys Secret

- Never commit API keys to version control
- Use environment variables or secrets managers
- Rotate keys regularly

### Use HTTPS

All API requests must use HTTPS. HTTP requests are rejected.

### Minimal Permissions

Create separate API keys with minimal required permissions for each use case.

## Rate Limits

API requests are rate-limited per API key:

| Plan | Requests/minute |
|------|-----------------|
| Free | 60 |
| Pro | 300 |
| Enterprise | Custom |

Rate limit headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

### 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "retryAfter": 30
  }
}
```

## Example: Testing Authentication

```bash
# Test your API key
curl -X GET https://api.plugix.ai/v1/health \
  -H "Authorization: Bearer plx_live_YOUR_API_KEY"

# Expected response
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```
