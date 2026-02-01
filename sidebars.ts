import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/quickstart',
        'getting-started/create-api-key',
        'getting-started/install-mcp-server',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/authentication',
        'api-reference/chat',
        'api-reference/mcp-connections',
        'api-reference/usage',
        'api-reference/errors',
      ],
    },
    {
      type: 'category',
      label: 'MCP Servers',
      items: [
        'mcp-servers/overview',
        'mcp-servers/pimcore',
        'mcp-servers/aws',
        'mcp-servers/shopware',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/pimcore-integration',
        'guides/aws-cost-optimization',
        'guides/security',
      ],
    },
  ],
};

export default sidebars;
