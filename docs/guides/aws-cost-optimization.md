---
sidebar_position: 2
title: AWS Cost Optimization Guide
---

# AWS Cost Optimization Guide

Use Plugix to analyze your AWS infrastructure and identify cost-saving opportunities.

## Overview

Plugix helps you:

- **Find idle resources** - EC2, EBS, RDS not being used
- **Analyze costs** - Breakdown by service, tag, time period
- **Right-size instances** - Identify over-provisioned resources
- **Clean up waste** - Orphaned snapshots, unattached volumes
- **Forecast spending** - Predict future costs

## Prerequisites

- AWS account with Cost Explorer enabled
- IAM user/role with read permissions
- Plugix account with API key

## Step 1: Enable Cost Explorer

Cost Explorer must be enabled to analyze costs:

1. Go to AWS Console → **Billing** → **Cost Explorer**
2. Click **Enable Cost Explorer**
3. Wait 24 hours for data to populate

## Step 2: Create IAM Policy

### Recommended Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CostAnalysis",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetReservationUtilization",
        "ce:GetSavingsPlansCoverage"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ResourceDiscovery",
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "rds:Describe*",
        "elasticache:Describe*",
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation",
        "cloudwatch:GetMetricData",
        "cloudwatch:GetMetricStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

### Create IAM User

1. Go to IAM → Users → Add User
2. Name: `plugix-cost-analyzer`
3. Attach the policy above
4. Create access keys

## Step 3: Install MCP Server

```bash
npx @plugix/mcp-aws \
  --api-key plx_live_YOUR_PLUGIX_KEY \
  --region us-east-1
```

With explicit credentials:

```bash
AWS_ACCESS_KEY_ID=xxx \
AWS_SECRET_ACCESS_KEY=xxx \
npx @plugix/mcp-aws \
  --api-key plx_live_YOUR_PLUGIX_KEY \
  --region us-east-1
```

## Cost Analysis Examples

### Monthly Cost Breakdown

**Prompt**:
```
What were my AWS costs last month?
Break down by service and show the top 5.
```

**Response**:
```
AWS Costs for January 2024: $2,847.52

Top 5 Services:
| Service | Cost | % of Total |
|---------|------|------------|
| EC2 | $1,245.00 | 43.7% |
| RDS | $680.50 | 23.9% |
| S3 | $412.30 | 14.5% |
| Lambda | $289.00 | 10.1% |
| CloudWatch | $156.72 | 5.5% |

EC2 is your largest expense. Want me to analyze
EC2 usage for optimization opportunities?
```

### Compare Months

**Prompt**:
```
Compare my AWS costs between December and January.
What increased the most?
```

### Cost by Tag

**Prompt**:
```
Show costs broken down by the "Environment" tag.
Which environment costs the most?
```

## Finding Waste

### Idle EC2 Instances

**Prompt**:
```
Find EC2 instances with average CPU below 10%
over the last 2 weeks.
```

**Response**:
```
Found 5 potentially idle EC2 instances:

| Instance | Type | Avg CPU | Monthly Cost |
|----------|------|---------|--------------|
| i-abc123 (dev-server) | t3.large | 2.1% | $60.74 |
| i-def456 (test-env) | t3.medium | 4.5% | $30.37 |
| i-ghi789 (old-api) | t3.small | 1.2% | $15.18 |

Potential savings: $106.29/month

These appear to be non-production servers.
Should I provide recommendations?
```

### Unattached EBS Volumes

**Prompt**:
```
Find all EBS volumes that aren't attached to any instance.
How much do they cost?
```

### Old Snapshots

**Prompt**:
```
List EBS snapshots older than 90 days.
How much storage are they using?
```

### Unused Elastic IPs

**Prompt**:
```
Find Elastic IPs that aren't associated with running instances.
```

## Right-Sizing Recommendations

**Prompt**:
```
Analyze my EC2 instances and recommend right-sizing.
Which instances are over-provisioned?
```

**Response**:
```
Right-Sizing Analysis:

Over-Provisioned Instances:
| Instance | Current | Recommended | Savings |
|----------|---------|-------------|---------|
| i-web01 | m5.xlarge | m5.large | $73/mo |
| i-api02 | c5.2xlarge | c5.xlarge | $124/mo |
| i-db01 | r5.2xlarge | r5.xlarge | $167/mo |

These instances consistently use <40% of their CPU
and memory. Downsizing would save ~$364/month.

Shall I show the detailed metrics for each?
```

## Reserved Instances Analysis

**Prompt**:
```
Analyze my EC2 usage for Reserved Instance recommendations.
Which instances would benefit from RIs?
```

## Taking Action

### Stop Idle Instances

**Prompt**:
```
Stop the idle dev instances we identified.
I'll restart them when needed.
```

:::caution
Stopping instances requires write permissions and your confirmation.
:::

### Delete Unattached Volumes

**Prompt**:
```
Delete the unattached EBS volumes from the cleanup list.
I've verified they're not needed.
```

:::danger
Volume deletion is permanent. Always verify before confirming.
:::

## Automated Reports

### Weekly Cost Report

Set up a weekly cost summary:

**Prompt**:
```
Create a weekly cost report for my AWS account.
Include:
1. Total spend vs last week
2. Top 3 cost drivers
3. Any new idle resources
4. Forecast for month-end
```

### Budget Alerts

**Prompt**:
```
I want to stay under $3,000/month for AWS.
What's my current trajectory?
If I'm on track to exceed, what should I cut?
```

## Best Practices

### 1. Start with Visibility

Before optimizing, understand your costs:

```
Give me a complete overview of my AWS spending:
- By service
- By environment (using tags)
- By team (if tagged)
- Trends over last 3 months
```

### 2. Tag Everything

Ensure resources are tagged for analysis:

```
Find resources without an "Environment" or "Team" tag.
```

### 3. Review Regularly

Monthly cost reviews catch problems early:

```
Compare this month's costs to our baseline.
Flag anything that increased more than 20%.
```

### 4. Automate Cleanup

Regular cleanup prevents waste:

```
What resources were created more than 30 days ago
and haven't been used since?
```

## Multi-Region Setup

For multiple AWS regions:

```yaml
# docker-compose.yml
services:
  mcp-aws-us:
    image: plugix/mcp-aws:latest
    environment:
      - AWS_REGION=us-east-1
      - INSTANCE_NAME=AWS US East

  mcp-aws-eu:
    image: plugix/mcp-aws:latest
    environment:
      - AWS_REGION=eu-west-1
      - INSTANCE_NAME=AWS EU West
```

Then in chat:
```
Compare costs between US East and EU West regions.
```

## Next Steps

- [AWS MCP Server](/mcp-servers/aws) - Detailed configuration
- [Security Guide](/guides/security) - IAM best practices
- [API Reference](/api-reference/authentication) - Direct API access
