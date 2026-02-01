---
sidebar_position: 3
title: AWS
---

# AWS MCP Server

Connect your AWS infrastructure to Plugix for AI-powered cloud management and cost optimization.

## Installation

### NPX (Quick Start)

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

### Docker Compose

```yaml
version: '3.8'
services:
  mcp-aws:
    image: plugix/mcp-aws:latest
    restart: unless-stopped
    environment:
      - PLUGIX_API_KEY=plx_live_YOUR_KEY
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PLUGIX_API_KEY` | Yes | Your Plugix API key |
| `AWS_REGION` | Yes | AWS region (e.g., us-east-1) |
| `AWS_ACCESS_KEY_ID` | Yes* | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Yes* | AWS secret key |
| `AWS_PROFILE` | No | AWS profile name |
| `INSTANCE_NAME` | No | Name shown in dashboard |

*Not required if using IAM roles or `~/.aws/credentials`

### Using IAM Roles

On EC2 instances with IAM roles:

```bash
docker run -d \
  --name plugix-mcp-aws \
  -e PLUGIX_API_KEY=plx_live_xxx \
  -e AWS_REGION=us-east-1 \
  plugix/mcp-aws:latest
```

### Multi-Region

Run separate instances per region:

```bash
# US East
docker run -d --name mcp-aws-us-east \
  -e AWS_REGION=us-east-1 \
  -e INSTANCE_NAME="AWS US East" ...

# EU West
docker run -d --name mcp-aws-eu-west \
  -e AWS_REGION=eu-west-1 \
  -e INSTANCE_NAME="AWS EU West" ...
```

## AWS IAM Permissions

### Recommended Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "cloudwatch:GetMetricData",
        "rds:Describe*",
        "elasticache:Describe*",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "WriteAccess",
      "Effect": "Allow",
      "Action": [
        "ec2:StopInstances",
        "ec2:StartInstances",
        "ec2:DeleteVolume",
        "ec2:DeleteSnapshot"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/ManagedBy": "plugix"
        }
      }
    }
  ]
}
```

### Minimal Read-Only

For cost analysis only:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ce:GetCostAndUsage",
        "ce:GetCostForecast"
      ],
      "Resource": "*"
    }
  ]
}
```

## Available Tools

### get_ec2_instances

List EC2 instances with details.

**Input:**
```json
{
  "state": "running",
  "tags": { "Environment": "production" }
}
```

**Output:**
```json
{
  "instances": [
    {
      "instanceId": "i-1234567890",
      "type": "t3.medium",
      "state": "running",
      "name": "web-server-1",
      "launchTime": "2024-01-01T00:00:00Z",
      "privateIp": "10.0.1.100",
      "tags": { "Environment": "production" }
    }
  ]
}
```

### get_cost_report

Get AWS cost analysis.

**Input:**
```json
{
  "period": "last_month",
  "groupBy": "SERVICE"
}
```

**Output:**
```json
{
  "totalCost": 1523.45,
  "currency": "USD",
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "byService": [
    { "service": "EC2", "cost": 850.00 },
    { "service": "RDS", "cost": 320.50 },
    { "service": "S3", "cost": 45.00 }
  ]
}
```

### get_idle_resources

Find unused resources.

**Output:**
```json
{
  "idleResources": [
    {
      "type": "EC2",
      "resourceId": "i-1234567890",
      "name": "test-server",
      "reason": "CPU < 5% for 14 days",
      "monthlyCost": 35.00
    },
    {
      "type": "EBS",
      "resourceId": "vol-abc123",
      "reason": "Unattached volume",
      "monthlyCost": 10.00
    }
  ],
  "potentialSavings": 45.00
}
```

### stop_instances

Stop EC2 instances.

:::caution Requires Confirmation
This tool stops running instances and requires user confirmation.
:::

**Input:**
```json
{
  "instanceIds": ["i-1234567890", "i-0987654321"]
}
```

### delete_volumes

Delete EBS volumes.

:::danger High Risk
This tool permanently deletes data and requires explicit confirmation.
:::

**Input:**
```json
{
  "volumeIds": ["vol-abc123"]
}
```

## Example Prompts

### Cost Analysis

```
What are my AWS costs for last month? Break down by service.
```

### Find Waste

```
Find all idle EC2 instances and unattached EBS volumes.
How much could I save by removing them?
```

### Resource Overview

```
List all running EC2 instances in production.
Include instance type, launch time, and monthly cost estimate.
```

### Cost Optimization

```
Analyze my EC2 usage and recommend right-sizing opportunities.
Which instances are over-provisioned?
```

### Cleanup

```
Find all EBS snapshots older than 90 days.
How much storage are they using?
```

## Troubleshooting

### Authentication Error

```
Error: Unable to authenticate with AWS
```

- Verify AWS credentials are correct
- Check IAM user/role has required permissions
- Ensure region is correctly specified

### Access Denied

```
Error: Access Denied for operation DescribeInstances
```

- IAM policy missing required permissions
- Check resource-level restrictions

### Cost Explorer Not Enabled

```
Error: Cost Explorer is not enabled
```

- Enable Cost Explorer in AWS Console
- Wait 24 hours for data to populate

## Advanced Configuration

### Cost Allocation Tags

Track costs by custom tags:

```bash
AWS_COST_ALLOCATION_TAGS=Project,Environment,Team
```

### Excluded Resources

Exclude specific resources from recommendations:

```bash
AWS_EXCLUDE_RESOURCES=i-keepthis,vol-important
```

### Custom Metrics

Define idle thresholds:

```bash
AWS_IDLE_CPU_THRESHOLD=10  # percent
AWS_IDLE_DAYS=7            # days
```
