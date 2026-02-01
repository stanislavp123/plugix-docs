import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Plugix Documentation',
  tagline: 'AI Integration for Business Systems',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.plugix.ai',
  baseUrl: '/',

  organizationName: 'stanislavp123',
  projectName: 'plugix-docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/stanislavp123/plugix-docs/tree/main/',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/plugix-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Plugix',
      logo: {
        alt: 'Plugix Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://plugix.ai',
          label: 'Dashboard',
          position: 'left',
        },
        {
          href: 'https://github.com/stanislavp123/plugix-api',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'API Reference',
              to: '/api-reference',
            },
            {
              label: 'MCP Servers',
              to: '/mcp-servers',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Dashboard',
              href: 'https://plugix.ai/dashboard',
            },
            {
              label: 'Pricing',
              href: 'https://plugix.ai/pricing',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/stanislavp123/plugix-api',
            },
            {
              label: 'Support',
              href: 'mailto:support@plugix.ai',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Plugix. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
