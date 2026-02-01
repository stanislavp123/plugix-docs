---
sidebar_position: 2
title: Create API Key
---

# Create API Key

API keys authenticate your MCP servers and API requests to Plugix.

## Creating Your First Key

1. Log in to [plugix.ai/dashboard](https://plugix.ai/dashboard)
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Enter a descriptive name (e.g., "Production Pimcore", "Dev AWS")
5. Click **Create**

## Important: Save Your Key

:::caution
Your API key is only shown **once** when created. Copy and save it immediately!
:::

The key looks like:

```
plx_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx...
```

## Key Prefixes

| Prefix | Environment |
|--------|-------------|
| `plx_live_` | Production |
| `sk_test_` | Testing (coming soon) |

## Managing Keys

### View Keys

Go to **Dashboard → API Keys** to see all your keys:

- Name
- Created date
- Last used
- Status (Active/Revoked)

### Revoke a Key

If a key is compromised:

1. Go to **API Keys**
2. Click the **⋮** menu next to the key
3. Select **Revoke**
4. Confirm the action

:::warning
Revoking a key immediately disconnects any MCP servers using it.
:::

## Best Practices

### Use Separate Keys Per Environment

```bash
# Development
PLUGIX_API_KEY=plx_live_dev_xxx

# Staging
PLUGIX_API_KEY=plx_live_staging_xxx

# Production
PLUGIX_API_KEY=plx_live_prod_xxx
```

### Rotate Keys Regularly

1. Create a new key
2. Update your MCP server configuration
3. Verify the new key works
4. Revoke the old key

### Never Commit Keys

Add to `.gitignore`:

```gitignore
.env
.env.local
*.env
```

Use environment variables or secrets management:

```bash
# Docker
docker run -e PLUGIX_API_KEY=$PLUGIX_API_KEY ...

# Kubernetes
kubectl create secret generic plugix --from-literal=api-key=plx_live_xxx
```

## Next Steps

- [Install MCP Server](/getting-started/install-mcp-server) - Connect your first system
