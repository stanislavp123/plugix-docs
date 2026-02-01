---
sidebar_position: 2
title: Pimcore
---

# Pimcore MCP Server

Connect your Pimcore PIM/DAM system to Plugix for AI-powered product management.

## Installation

### NPX (Quick Start)

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

### Docker Compose

```yaml
version: '3.8'
services:
  mcp-pimcore:
    image: plugix/mcp-pimcore:latest
    restart: unless-stopped
    environment:
      - PLUGIX_API_KEY=plx_live_YOUR_KEY
      - PIMCORE_URL=https://your-pimcore.com
      - PIMCORE_TOKEN=YOUR_TOKEN
      - LOG_LEVEL=info
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGIX_API_KEY` | Yes | Your Plugix API key |
| `PIMCORE_URL` | Yes | Pimcore installation URL |
| `PIMCORE_TOKEN` | Yes | Pimcore API token |
| `INSTANCE_NAME` | No | Name shown in dashboard |
| `LOG_LEVEL` | No | debug, info, warn, error |

### CLI Options

```bash
mcp-pimcore \
  --api-key plx_live_xxx \
  --pimcore-url https://pimcore.example.com \
  --pimcore-token xxx \
  --instance-name "Production" \
  --log-level info
```

## Pimcore API Token

### Create API Token in Pimcore

1. Log in to Pimcore Admin
2. Go to **Settings → Users / Roles → Users**
3. Create or select an API user
4. Enable **API Access**
5. Generate an API key

### Required Permissions

The API user needs:

- **Data Objects**: Read, Write (for products)
- **Assets**: Read (for images)
- **Classifications**: Read (for categories)

## Available Tools

### get_products

Fetch products with filters.

**Input:**
```json
{
  "category": "Electronics",
  "limit": 50,
  "offset": 0,
  "fields": ["name", "sku", "description", "price"],
  "filters": {
    "hasDescription": false
  }
}
```

**Output:**
```json
{
  "count": 24,
  "products": [
    {
      "id": "123",
      "name": "Laptop Pro",
      "sku": "LP-001",
      "description": null,
      "price": 999.99
    }
  ]
}
```

### get_categories

List product categories.

**Input:**
```json
{
  "parentId": null
}
```

**Output:**
```json
{
  "categories": [
    {
      "id": "1",
      "name": "Electronics",
      "path": "/Electronics",
      "productCount": 150
    }
  ]
}
```

### get_stats

Get catalog statistics.

**Output:**
```json
{
  "totalProducts": 5000,
  "productsWithDescriptions": 3500,
  "productsWithoutDescriptions": 1500,
  "categories": 45,
  "languages": ["en", "de", "fr"]
}
```

### save_descriptions

Update product descriptions.

:::caution Requires Confirmation
This tool modifies data and requires user confirmation.
:::

**Input:**
```json
{
  "items": [
    {
      "productId": "123",
      "description": "New product description...",
      "language": "en"
    }
  ]
}
```

**Output:**
```json
{
  "updated": 15,
  "failed": 0
}
```

### save_translations

Save product translations.

:::caution Requires Confirmation
This tool modifies data and requires user confirmation.
:::

**Input:**
```json
{
  "items": [
    {
      "productId": "123",
      "field": "description",
      "translations": {
        "de": "German description...",
        "fr": "French description..."
      }
    }
  ]
}
```

### save_seo

Update SEO metadata.

:::caution Requires Confirmation
This tool modifies data and requires user confirmation.
:::

**Input:**
```json
{
  "items": [
    {
      "productId": "123",
      "metaTitle": "Laptop Pro - Best Business Laptop",
      "metaDescription": "Powerful laptop for professionals...",
      "language": "en"
    }
  ]
}
```

## Example Prompts

Use these prompts in the Plugix chat:

### Generate Descriptions

```
Generate engaging product descriptions for all products
in the Electronics category that don't have descriptions yet.
```

### Translate Content

```
Translate all German product descriptions to English and French.
Keep the professional tone.
```

### SEO Optimization

```
Create SEO-optimized meta titles and descriptions for
products in the Shoes category. Focus on keywords like
"comfortable", "stylish", "durable".
```

### Find Missing Data

```
Which products are missing images or descriptions?
```

### Bulk Updates

```
Update all product descriptions in the Sale category to
mention the current 20% discount.
```

## Troubleshooting

### Connection Failed

```
Error: Unable to connect to Pimcore
```

- Verify `PIMCORE_URL` is correct
- Check Pimcore is accessible from MCP server
- Verify API token is valid

### Permission Denied

```
Error: API permission denied for get_products
```

- Check API user has required permissions
- Verify API token hasn't expired

### Timeout

```
Error: Request timeout
```

- Large catalogs may need pagination
- Increase timeout if needed
- Check Pimcore server performance

## Advanced Configuration

### Custom Fields

Configure additional product fields:

```bash
PIMCORE_CUSTOM_FIELDS=customField1,customField2
```

### Localization

Specify default language:

```bash
PIMCORE_DEFAULT_LANGUAGE=de
```

### Rate Limiting

Limit requests to Pimcore:

```bash
PIMCORE_RATE_LIMIT=10  # requests per second
```
