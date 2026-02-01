---
sidebar_position: 3
title: Security Guide
---

# Security Guide

Best practices for securely deploying Plugix in your infrastructure.

## Security Architecture

### Credentials Stay Local

The core security principle of Plugix:

```
YOUR INFRASTRUCTURE                    PLUGIX CLOUD
┌─────────────────────────┐           ┌─────────────────────────┐
│                         │           │                         │
│  🔐 YOUR CREDENTIALS    │           │  ❌ NO CREDENTIALS      │
│  - Database passwords   │           │  - Only API key         │
│  - API tokens           │  WSS      │  - Tool results (data)  │
│  - AWS keys             │──────────→│  - Usage metrics        │
│                         │  outbound │                         │
│  MCP Server keeps       │           │  Plugix never receives  │
│  credentials LOCAL      │           │  your system passwords  │
└─────────────────────────┘           └─────────────────────────┘
```

### What Plugix Receives

| Data Type | Example | Transmitted? |
|-----------|---------|--------------|
| Tool results | Product list, cost data | ✅ Yes |
| Chat messages | User prompts | ✅ Yes |
| Usage metrics | Tokens, requests | ✅ Yes |
| System credentials | DB password, API token | ❌ Never |
| Raw database access | Direct SQL | ❌ Never |

### What Stays in Your Infrastructure

- Database credentials
- Pimcore API tokens
- AWS access keys
- Shopware client secrets
- All system passwords

## API Key Security

### Protect Your API Keys

API keys authenticate MCP servers and API calls:

```bash
# Good: Environment variable
export PLUGIX_API_KEY=plx_live_xxx
mcp-pimcore --api-key $PLUGIX_API_KEY

# Bad: Hardcoded in code
mcp-pimcore --api-key plx_live_abc123  # Don't do this!
```

### Key Rotation

Rotate API keys regularly:

1. Create new key in Dashboard
2. Update MCP server configuration
3. Deploy with new key
4. Verify connection
5. Revoke old key

### Separate Keys by Environment

```bash
# Development
PLUGIX_API_KEY=plx_live_dev_xxx

# Staging
PLUGIX_API_KEY=plx_live_staging_xxx

# Production
PLUGIX_API_KEY=plx_live_prod_xxx
```

### Never Commit Keys

```gitignore
# .gitignore
.env
.env.*
*.env
secrets/
```

## Network Security

### Outbound Only

MCP servers only require **outbound** connectivity:

| Direction | Port | Protocol | Destination |
|-----------|------|----------|-------------|
| Outbound | 443 | WSS | api.plugix.ai |

**No inbound ports required.**

### Firewall Rules

```bash
# Allow outbound to Plugix
iptables -A OUTPUT -p tcp --dport 443 -d api.plugix.ai -j ACCEPT
```

### Proxy Support

If using a corporate proxy:

```bash
export HTTPS_PROXY=http://proxy.company.com:8080
mcp-pimcore --api-key xxx ...
```

## Container Security

### Non-Root User

Our Docker images run as non-root:

```dockerfile
USER 1000:1000
```

### Read-Only Filesystem

Run with read-only filesystem:

```bash
docker run --read-only \
  --tmpfs /tmp \
  plugix/mcp-pimcore:latest
```

### Resource Limits

```yaml
# docker-compose.yml
services:
  mcp-pimcore:
    image: plugix/mcp-pimcore:latest
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
```

### Security Scanning

Our images are scanned for vulnerabilities:

```bash
# Verify image signature (coming soon)
docker trust inspect plugix/mcp-pimcore:latest
```

## Kubernetes Security

### Pod Security

```yaml
apiVersion: v1
kind: Pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    fsGroup: 1000
  containers:
    - name: mcp-pimcore
      image: plugix/mcp-pimcore:latest
      securityContext:
        allowPrivilegeEscalation: false
        readOnlyRootFilesystem: true
        capabilities:
          drop:
            - ALL
```

### Secrets Management

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: plugix-secrets
type: Opaque
stringData:
  api-key: plx_live_xxx
  pimcore-token: xxx
---
apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
        - name: mcp-pimcore
          envFrom:
            - secretRef:
                name: plugix-secrets
```

### Network Policy

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: mcp-egress
spec:
  podSelector:
    matchLabels:
      app: mcp-pimcore
  policyTypes:
    - Egress
  egress:
    # Allow Plugix API
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
      ports:
        - protocol: TCP
          port: 443
    # Allow your Pimcore
    - to:
        - namespaceSelector:
            matchLabels:
              name: pimcore
      ports:
        - protocol: TCP
          port: 443
```

## IAM Best Practices (AWS)

### Principle of Least Privilege

Only grant permissions needed:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOnly",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ce:GetCost*"
      ],
      "Resource": "*"
    }
  ]
}
```

### Restrict Write Actions

Use resource tags to limit scope:

```json
{
  "Sid": "LimitedWrite",
  "Effect": "Allow",
  "Action": ["ec2:StopInstances"],
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "ec2:ResourceTag/ManagedBy": "plugix"
    }
  }
}
```

### Use IAM Roles (Not Keys)

On EC2/ECS, use instance roles instead of access keys:

```bash
# Good: IAM role attached to EC2
docker run plugix/mcp-aws:latest

# Avoid: Explicit keys
docker run -e AWS_ACCESS_KEY_ID=xxx ...
```

## Data Privacy

### Data Transit

All data in transit is encrypted:

- WebSocket: WSS (TLS 1.3)
- API: HTTPS (TLS 1.3)

### Data at Rest

Plugix stores:
- Chat history (encrypted)
- Usage metrics (for billing)
- API key hashes

Plugix does NOT store:
- Your system credentials
- Raw product data (transit only)
- Tool execution logs

### GDPR Compliance

- Data processing agreement available
- EU data residency option (Enterprise)
- Data deletion on request

## Monitoring & Audit

### Connection Logs

Monitor MCP connections:

```bash
LOG_LEVEL=info mcp-pimcore --api-key xxx ...
```

### Dashboard Audit

Review in Dashboard:
- Active connections
- Tool call history
- API key usage

### Alerts

Set up alerts for:
- Connection failures
- Unusual usage patterns
- API key creation/revocation

## Incident Response

### Compromised API Key

1. **Immediately revoke** the key in Dashboard
2. Create a new API key
3. Update MCP server configuration
4. Review access logs
5. Assess impact

### Suspicious Activity

1. Check Dashboard for unusual tool calls
2. Review connection history
3. Contact support@plugix.ai if needed

## Compliance

### SOC 2

Plugix is pursuing SOC 2 Type II certification.

### GDPR

- Data processing agreement available
- EU hosting option
- Right to deletion supported

### HIPAA

Enterprise customers can sign BAA for healthcare use cases.

## Security Checklist

- [ ] API keys stored in environment variables or secrets manager
- [ ] API keys not committed to version control
- [ ] Separate API keys per environment
- [ ] MCP server running as non-root
- [ ] Network egress restricted to necessary destinations
- [ ] IAM permissions follow least privilege
- [ ] Regular API key rotation scheduled
- [ ] Monitoring/alerting configured

## Report a Vulnerability

Found a security issue? Please report responsibly:

**Email**: security@plugix.ai

We respond within 24 hours and work with researchers on coordinated disclosure.
