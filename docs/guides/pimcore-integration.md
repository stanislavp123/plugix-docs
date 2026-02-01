---
sidebar_position: 1
title: Pimcore Integration Guide
---

# Pimcore Integration Guide

Complete guide to integrating Plugix with your Pimcore PIM/DAM system for AI-powered product management.

## Overview

With Plugix and Pimcore, you can:

- **Generate descriptions** - Create engaging product descriptions in seconds
- **Translate content** - Multi-language translations preserving brand voice
- **Optimize SEO** - Meta titles, descriptions, and keywords
- **Clean data** - Find missing fields, duplicates, inconsistencies
- **Bulk updates** - Process thousands of products efficiently

## Prerequisites

- Pimcore 10+ or Pimcore 11
- Pimcore Admin API access
- Plugix account with API key

## Step 1: Create Pimcore API User

### Create User

1. Log in to Pimcore Admin
2. Go to **Settings → Users / Roles → Users**
3. Click **Add User**
4. Set username (e.g., `plugix-api`)
5. Enable **Admin** or set specific permissions

### Enable API Access

1. Edit the user
2. Go to **API Keys** tab
3. Click **Generate API Key**
4. Copy the key

### Set Permissions

For full functionality, the user needs:

| Permission | Read | Write | Description |
|------------|------|-------|-------------|
| Data Objects | ✅ | ✅ | Products, categories |
| Assets | ✅ | ❌ | Product images |
| Documents | ✅ | ❌ | CMS pages (optional) |

## Step 2: Install MCP Server

### Quick Start

```bash
npx @plugix/mcp-pimcore \
  --api-key plx_live_YOUR_PLUGIX_KEY \
  --pimcore-url https://your-pimcore.com \
  --pimcore-token YOUR_PIMCORE_TOKEN
```

### Production Docker Setup

```yaml
# docker-compose.yml
version: '3.8'
services:
  mcp-pimcore:
    image: plugix/mcp-pimcore:latest
    restart: unless-stopped
    environment:
      - PLUGIX_API_KEY=${PLUGIX_API_KEY}
      - PIMCORE_URL=${PIMCORE_URL}
      - PIMCORE_TOKEN=${PIMCORE_TOKEN}
      - INSTANCE_NAME=Production Pimcore
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

```bash
# .env
PLUGIX_API_KEY=plx_live_xxx
PIMCORE_URL=https://pimcore.yourcompany.com
PIMCORE_TOKEN=your_pimcore_api_key
```

## Step 3: Verify Connection

1. Go to [plugix.ai/dashboard/connections](https://plugix.ai/dashboard/connections)
2. Your Pimcore server should show as **Active**
3. You should see 6 tools available

## Use Cases

### 1. Generate Product Descriptions

**Scenario**: You have 500 products without descriptions.

**Prompt**:
```
Find all products without descriptions in the Electronics category.
Generate engaging, SEO-friendly descriptions for them.
Keep them between 100-200 words.
```

**AI Response**:
```
I found 47 products without descriptions in Electronics.

Here's what I'll generate:
- Professional, informative tone
- Key features and benefits highlighted
- SEO keywords naturally included

Shall I generate and show you samples first?
```

After confirmation, descriptions are saved directly to Pimcore.

### 2. Multi-Language Translation

**Scenario**: Product descriptions exist in German, need English and French.

**Prompt**:
```
Translate all German product descriptions to English and French.
Maintain the professional tone and marketing style.
Focus on the Fashion category first.
```

**AI Response**:
```
I found 120 products in Fashion with German descriptions.

Translation approach:
- Preserve marketing language and brand voice
- Adapt cultural references appropriately
- Maintain SEO keyword density

Ready to proceed?
```

### 3. SEO Optimization

**Scenario**: Products need meta titles and descriptions for better search ranking.

**Prompt**:
```
Create SEO meta titles and descriptions for products in Shoes.
- Meta titles: max 60 characters, include brand + key feature
- Meta descriptions: 150-160 characters, include call to action
- Focus on keywords: comfortable, stylish, durable
```

### 4. Data Quality Audit

**Scenario**: Identify products with missing or incomplete data.

**Prompt**:
```
Audit the product catalog and find:
1. Products without images
2. Products with descriptions under 50 characters
3. Products missing price
4. Duplicate SKUs
```

**AI Response**:
```
Audit complete:

| Issue | Count |
|-------|-------|
| No images | 23 |
| Short descriptions | 156 |
| Missing price | 8 |
| Duplicate SKUs | 4 |

Would you like details on any category?
```

### 5. Bulk Category Updates

**Scenario**: Reorganize products into new category structure.

**Prompt**:
```
Move all products tagged "summer-2024" to the new
"Summer Collection" category. Keep them in their
original categories too (multi-category).
```

## Best Practices

### 1. Start with Small Batches

Test with a few products before bulk updates:

```
Generate descriptions for 5 products in Electronics.
Show me the results before we continue.
```

### 2. Use Confirmation Wisely

All write operations require confirmation. Review changes:

```
Show me a sample of 3 translations before saving all.
```

### 3. Preserve Brand Voice

Include style guidelines in prompts:

```
Use our brand voice: professional but friendly,
focus on quality and craftsmanship.
Avoid: cheap, discount, basic.
Prefer: premium, artisan, curated.
```

### 4. Schedule Large Jobs

For thousands of products, break into batches:

```
Process the first 100 products in Clothing.
We'll do the rest in batches.
```

## Troubleshooting

### "No products found"

- Check category name is exact
- Verify API user has read permissions
- Check if products are published

### "Failed to save"

- API user needs write permissions
- Check product isn't locked
- Verify field exists in class definition

### "Connection lost"

- Check Pimcore is accessible
- Verify API token is valid
- Check firewall allows outbound WSS

## Advanced: Custom Class Mapping

If your Pimcore uses custom class names:

```bash
# Map custom class to standard product
PIMCORE_PRODUCT_CLASS=CustomProduct

# Map custom fields
PIMCORE_FIELD_MAPPING='{"title":"name","text":"description"}'
```

## Next Steps

- [MCP Server Configuration](/mcp-servers/pimcore) - Detailed options
- [API Reference](/api-reference/chat) - Direct API integration
- [Security Guide](/guides/security) - Best practices
