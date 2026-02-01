---
sidebar_position: 1
title: Quick Start
---

# Quick Start

Get Plugix running with your system in under 10 minutes.

## Prerequisites

- Node.js 18+ or Docker
- Access to your target system (Pimcore, AWS, etc.)
- A Plugix account

## Step 1: Create an Account

Go to [plugix.ai/register](https://plugix.ai/register) and sign up with email or Google.

## Step 2: Generate an API Key

1. Go to **Dashboard → API Keys**
2. Click **Create Key**
3. Name your key (e.g., "Production")
4. **Copy and save the key** - you'll only see it once!

```
plx_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx...
```

## Step 3: Install MCP Server

Choose your platform:

### Pimcore

```bash
npx @plugix/mcp-pimcore \
  --api-key plx_live_YOUR_KEY \
  --pimcore-url https://your-pimcore.com \
  --pimcore-token YOUR_PIMCORE_API_TOKEN
```

### AWS

```bash
npx @plugix/mcp-aws \
  --api-key plx_live_YOUR_KEY \
  --region us-east-1
```

### Shopware

```bash
npx @plugix/mcp-shopware \
  --api-key plx_live_YOUR_KEY \
  --shopware-url https://your-shop.com \
  --client-id YOUR_CLIENT_ID \
  --client-secret YOUR_CLIENT_SECRET
```

## Step 4: Verify Connection

1. Go to **Dashboard → Connections**
2. Your MCP server should appear with status **Active**
3. You'll see the number of available tools

## Step 5: Try the Chat

1. Go to **Dashboard → Chat**
2. Ask something like:

```
What products do I have in my catalog?
```

The AI will use your connected MCP server to fetch real data from your system.

## Example Prompts

### Pimcore
- "Generate SEO descriptions for products in category Electronics"
- "Translate all German product descriptions to English"
- "Find products without images"

### AWS
- "What EC2 instances are running?"
- "Find unused EBS volumes I can delete"
- "Show me my AWS costs for last month"

### Shopware
- "Update all product descriptions to be more SEO-friendly"
- "Find products with low stock"

## Next Steps

- [API Reference](/api-reference/authentication) - Integrate directly
- [MCP Server Configuration](/mcp-servers/overview) - Advanced setup
- [Security Guide](/guides/security) - Best practices
