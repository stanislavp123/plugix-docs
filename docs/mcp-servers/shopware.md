---
sidebar_position: 4
title: Shopware
---

# Shopware MCP Server

Connect your Shopware 6 store to Plugix for AI-powered product management and content generation.

## Installation

### NPX (Quick Start)

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

### Docker Compose

```yaml
version: '3.8'
services:
  mcp-shopware:
    image: plugix/mcp-shopware:latest
    restart: unless-stopped
    environment:
      - PLUGIX_API_KEY=plx_live_YOUR_KEY
      - SHOPWARE_URL=https://your-shop.com
      - SHOPWARE_CLIENT_ID=${SHOPWARE_CLIENT_ID}
      - SHOPWARE_CLIENT_SECRET=${SHOPWARE_CLIENT_SECRET}
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGIX_API_KEY` | Yes | Your Plugix API key |
| `SHOPWARE_URL` | Yes | Shopware store URL |
| `SHOPWARE_CLIENT_ID` | Yes | Integration client ID |
| `SHOPWARE_CLIENT_SECRET` | Yes | Integration client secret |
| `INSTANCE_NAME` | No | Name shown in dashboard |
| `LOG_LEVEL` | No | debug, info, warn, error |

## Shopware Integration Setup

### Create Integration

1. Log in to Shopware Admin
2. Go to **Settings → System → Integrations**
3. Click **Add integration**
4. Enter a label (e.g., "Plugix")
5. **Important**: Enable required permissions
6. Click **Save**
7. Copy the **Access key ID** and **Secret access key**

### Required Permissions

Enable these permissions for the integration:

**Products:**
- product:read
- product:write

**Categories:**
- category:read

**Media:**
- media:read

**Properties:**
- property_group:read
- property_group_option:read

## Available Tools

### get_products

Fetch products from your store.

**Input:**
```json
{
  "categoryId": "abc123",
  "limit": 50,
  "filters": {
    "active": true,
    "stock": { "gt": 0 }
  }
}
```

**Output:**
```json
{
  "total": 150,
  "products": [
    {
      "id": "abc123",
      "productNumber": "SW-001",
      "name": "Example Product",
      "description": "Product description...",
      "price": 29.99,
      "stock": 100,
      "active": true
    }
  ]
}
```

### get_categories

List product categories.

**Output:**
```json
{
  "categories": [
    {
      "id": "abc123",
      "name": "Clothing",
      "path": "Clothing",
      "productCount": 250,
      "children": [
        { "id": "def456", "name": "T-Shirts" }
      ]
    }
  ]
}
```

### get_stats

Get store statistics.

**Output:**
```json
{
  "totalProducts": 5000,
  "activeProducts": 4500,
  "categories": 45,
  "productsWithoutDescription": 320,
  "lowStockProducts": 85
}
```

### save_products

Update product data.

:::caution Requires Confirmation
This tool modifies products and requires user confirmation.
:::

**Input:**
```json
{
  "products": [
    {
      "id": "abc123",
      "description": "Updated description...",
      "metaTitle": "SEO Title",
      "metaDescription": "SEO description..."
    }
  ]
}
```

### get_low_stock

Find products with low stock.

**Input:**
```json
{
  "threshold": 10
}
```

**Output:**
```json
{
  "products": [
    {
      "id": "abc123",
      "name": "Popular Item",
      "stock": 5,
      "minStock": 10
    }
  ]
}
```

## Example Prompts

### Generate Descriptions

```
Generate engaging product descriptions for all products
in the "New Arrivals" category. Use a friendly,
conversational tone.
```

### SEO Optimization

```
Create SEO meta titles and descriptions for products
that are missing them. Focus on the main keywords
for each product category.
```

### Inventory Check

```
Which products have less than 10 items in stock?
Sort by sales velocity.
```

### Content Audit

```
Find all products without descriptions or with
descriptions shorter than 100 characters.
```

### Bulk Translation

```
Translate all product descriptions from German to English.
Maintain the brand voice and marketing style.
```

## Troubleshooting

### Authentication Failed

```
Error: Invalid client credentials
```

- Verify Client ID and Secret are correct
- Check integration is active in Shopware
- Ensure URL doesn't have trailing slash

### Permission Denied

```
Error: Missing required privilege: product:write
```

- Update integration permissions in Shopware Admin
- Re-save integration to apply changes

### Rate Limited

```
Error: Too many requests
```

Shopware has built-in rate limiting. The MCP server handles this automatically with exponential backoff.

### Connection Timeout

```
Error: Connection timeout
```

- Check Shopware server is accessible
- Verify firewall allows outbound connections
- Check for maintenance mode

## Advanced Configuration

### Sales Channel

Specify sales channel for products:

```bash
SHOPWARE_SALES_CHANNEL_ID=abc123
```

### Language

Set default language:

```bash
SHOPWARE_LANGUAGE_ID=def456
```

### Custom Fields

Include custom fields in product data:

```bash
SHOPWARE_CUSTOM_FIELDS=customField1,customField2
```

### Batch Size

Configure batch size for bulk operations:

```bash
SHOPWARE_BATCH_SIZE=100
```
