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

### Manual Deploy

1. Set up Vercel secrets in GitHub repository:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

2. Push to main:
   ```bash
   git push origin main
   ```

### Custom Domain

Configure `docs.plugix.ai` in Vercel:

1. Go to Vercel project settings
2. Add domain `docs.plugix.ai`
3. Update DNS: CNAME `docs` → `cname.vercel-dns.com`

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
