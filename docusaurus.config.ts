import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const SITE_URL_INPUT =
  process.env.SITE_URL ?? 'https://kristaps.me/my-website/';

// Docusaurus requires `url` to be an origin only (no sub-path). If the user
// provides a full path in SITE_URL, we strip it and use the pathname for
// baseUrl instead.
let SITE_URL_ORIGIN = 'https://kristaps.me';
let SITE_BASE_URL_INFERRED = '/';
try {
  const u = new URL(SITE_URL_INPUT);
  SITE_URL_ORIGIN = u.origin;
  const pathname = u.pathname || '/';
  SITE_BASE_URL_INFERRED = pathname.endsWith('/') ? pathname : `${pathname}/`;
} catch {
  // Fallback to defaults if SITE_URL_INPUT isn't a valid URL.
  SITE_URL_ORIGIN = 'https://kristaps.me';
  SITE_BASE_URL_INFERRED = '/my-website/';
}

const SITE_URL = SITE_URL_ORIGIN;
const SITE_BASE_URL = process.env.SITE_BASE_URL ?? SITE_BASE_URL_INFERRED;
const MCP_SERVER_NAME = process.env.MCP_SERVER_NAME ?? 'my-docs';
const MCP_SERVER_VERSION = process.env.MCP_SERVER_VERSION ?? '1.0.0';

const config: Config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: SITE_URL,
  baseUrl: SITE_BASE_URL,

  organizationName: 'facebook',
  projectName: 'docusaurus',

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
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  // ✅ ADD THIS BLOCK
  plugins: [
    [
      'docusaurus-plugin-mcp-server',
      {
        server: {
          name: "my-website",
          version: "1.0.0",
        },
      },
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {to: '/blog', label: 'Blog', position: 'left'},

        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [{label: 'Tutorial', to: '/docs/intro'}],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Blog', to: '/blog'},
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;