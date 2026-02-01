# Plugix Documentation

Documentation site for Plugix - AI Integration for Business Systems.

**Live site:** https://docs.plugix.ai

## Development

```bash
npm install
npm run start
```

Opens at http://localhost:3000

## Build

```bash
npm run build
```

Output in `build/` directory.

## Deployment

Automatic deployment via GitHub Actions on push to `main`.

### Setup GitHub Pages

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Push to main triggers deploy

### Custom Domain

1. Add `docs.plugix.ai` in Settings → Pages → Custom domain
2. DNS: CNAME `docs` → `stanislavp123.github.io`

## Structure

```
docs/
├── intro.md              # Homepage
├── getting-started/      # Quick start guides
├── api-reference/        # API documentation
├── mcp-servers/          # MCP server docs
└── guides/               # Integration guides
```

## License

Copyright © 2024 Plugix
