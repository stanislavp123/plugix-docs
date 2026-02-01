---
sidebar_position: 3
title: Install MCP Server
---

# Install MCP Server

MCP servers run in your infrastructure and connect your systems to Plugix.

## Choose Your Platform

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="pimcore" label="Pimcore" default>

### Quick Start

```bash
npx @plugix/mcp-pimcore \
  --api-key plx_live_YOUR_KEY \
  --pimcore-url https://your-pimcore.com \
  --pimcore-token YOUR_PIMCORE_API_TOKEN
```

### Docker

```bash
docker run -d \
  --name plugix-mcp-pimcore \
  --restart unless-stopped \
  -e PLUGIX_API_KEY=plx_live_YOUR_KEY \
  -e PIMCORE_URL=https://your-pimcore.com \
  -e PIMCORE_TOKEN=YOUR_TOKEN \
  plugix/mcp-pimcore:latest
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGIX_API_KEY` | Yes | Your Plugix API key |
| `PIMCORE_URL` | Yes | Your Pimcore installation URL |
| `PIMCORE_TOKEN` | Yes | Pimcore API token |
| `LOG_LEVEL` | No | Logging level (debug, info, warn, error) |

</TabItem>
<TabItem value="aws" label="AWS">

### Quick Start

```bash
npx @plugix/mcp-aws \
  --api-key plx_live_YOUR_KEY \
  --region us-east-1
```

Uses AWS credentials from environment or `~/.aws/credentials`.

### Docker

```bash
docker run -d \
  --name plugix-mcp-aws \
  --restart unless-stopped \
  -e PLUGIX_API_KEY=plx_live_YOUR_KEY \
  -e AWS_REGION=us-east-1 \
  -e AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY \
  -e AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY \
  plugix/mcp-aws:latest
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGIX_API_KEY` | Yes | Your Plugix API key |
| `AWS_REGION` | Yes | AWS region (e.g., us-east-1) |
| `AWS_ACCESS_KEY_ID` | Yes* | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes* | AWS secret key |

*Not required if using IAM roles or `~/.aws/credentials`

</TabItem>
<TabItem value="shopware" label="Shopware">

### Quick Start

```bash
npx @plugix/mcp-shopware \
  --api-key plx_live_YOUR_KEY \
  --shopware-url https://your-shop.com \
  --client-id YOUR_CLIENT_ID \
  --client-secret YOUR_CLIENT_SECRET
```

### Docker

```bash
docker run -d \
  --name plugix-mcp-shopware \
  --restart unless-stopped \
  -e PLUGIX_API_KEY=plx_live_YOUR_KEY \
  -e SHOPWARE_URL=https://your-shop.com \
  -e SHOPWARE_CLIENT_ID=YOUR_CLIENT_ID \
  -e SHOPWARE_CLIENT_SECRET=YOUR_CLIENT_SECRET \
  plugix/mcp-shopware:latest
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGIX_API_KEY` | Yes | Your Plugix API key |
| `SHOPWARE_URL` | Yes | Your Shopware store URL |
| `SHOPWARE_CLIENT_ID` | Yes | Integration client ID |
| `SHOPWARE_CLIENT_SECRET` | Yes | Integration client secret |

</TabItem>
</Tabs>

## Verify Connection

After starting your MCP server:

1. Go to **Dashboard → Connections**
2. Your server should appear with status **Active**
3. You'll see the available tools

## Connection Status

| Status | Description |
|--------|-------------|
| **Active** | Connected and ready |
| **Connecting** | Establishing connection |
| **Disconnected** | Not connected (check logs) |

## Troubleshooting

### Connection Failed

1. Check your API key is valid
2. Verify network connectivity to `wss://api.plugix.ai`
3. Check firewall allows outbound WebSocket (port 443)

### Server Not Appearing

```bash
# Check logs
LOG_LEVEL=debug npx @plugix/mcp-pimcore ...
```

### Authentication Error

- Verify your system credentials (Pimcore token, AWS keys, etc.)
- Check the credentials have required permissions

## Next Steps

- [Quick Start](/getting-started/quickstart) - Try the chat interface
- [MCP Server Configuration](/mcp-servers/overview) - Advanced options
