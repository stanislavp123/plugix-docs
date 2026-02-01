---
slug: /
sidebar_position: 1
title: Introduction
---

# Plugix Documentation

Welcome to Plugix - the AI integration platform for business systems.

## What is Plugix?

Plugix brings AI capabilities to your existing business systems through **MCP (Model Context Protocol)**. Connect your Pimcore, AWS, Shopware, or other platforms and let AI help with:

- 📝 **Product descriptions** - Generate, translate, optimize SEO
- 💰 **Cost optimization** - Find idle AWS resources, reduce cloud spend
- 🎯 **Data management** - Categorize products, clean data, bulk updates
- 🤖 **Automation** - Let AI handle repetitive tasks

## How It Works

```
YOUR INFRASTRUCTURE                    PLUGIX CLOUD
┌─────────────────────────┐           ┌─────────────────────────┐
│                         │           │                         │
│  ┌─────────────────┐    │  WSS      │  ┌─────────────────┐   │
│  │   MCP Server    │────┼──────────→│  │   AI Engine     │   │
│  │  (runs locally) │    │ outbound  │  │  (Claude/GPT)   │   │
│  └────────┬────────┘    │           │  └─────────────────┘   │
│           │             │           │                         │
│  ┌────────▼────────┐    │           │                         │
│  │   Your System   │    │           │                         │
│  │  (Pimcore/AWS)  │    │           │                         │
│  └─────────────────┘    │           │                         │
│                         │           │                         │
│  🔒 CREDENTIALS STAY    │           │  API Keys, Prompts     │
│     IN YOUR INFRA       │           │  Billing, Usage        │
└─────────────────────────┘           └─────────────────────────┘
```

**Key Security Feature**: Your credentials (database passwords, API tokens) **never leave your infrastructure**. The MCP server runs locally and connects outbound to Plugix.

## Supported Platforms

| Platform | Status | Use Cases |
|----------|--------|-----------|
| **Pimcore** | ✅ Available | Product descriptions, translations, SEO |
| **Shopware** | ✅ Available | Product management, content generation |
| **AWS** | ✅ Available | Cost optimization, resource management |
| **Zendesk** | 🔜 Coming Soon | Customer support automation |
| **SAP** | 🔜 Coming Soon | ERP data management |

## Quick Start

Get started in 5 minutes:

1. [Create an account](https://plugix.ai/register)
2. [Generate an API key](/getting-started/create-api-key)
3. [Install MCP server](/getting-started/install-mcp-server)
4. Start using AI with your data!

→ [**Get Started →**](/getting-started/quickstart)

## Need Help?

- 📖 Browse the [API Reference](/api-reference/authentication)
- 💬 Email us at support@plugix.ai
- 🐛 Report issues on [GitHub](https://github.com/stanislavp123/plugix-api/issues)
