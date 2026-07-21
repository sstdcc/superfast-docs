import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "SuperFast Docs",
  tagline: "Supermarket Debt & Supplier Management System",
  favicon: "img/favicon.ico",

  url: "https://docs.supersfast.com",
  baseUrl: "/",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en", "ar"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "ar"],
        indexBlog: false,
        docsRouteBasePath: "/",
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    navbar: {
      title: "SuperFast Docs",
      logo: {
        alt: "SuperFast Logo",
        src: "img/logo.png",
        srcDark: "img/logo.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          href: "https://github.com/your-org/superfast",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/",
            },
            {
              label: "API Reference",
              to: "/api/overview",
            },
            {
              label: "Deployment",
              to: "/deployment/docker",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/your-org/superfast",
            },
          ],
        },
      ],
      copyright: `© Copyright ${new Date().getFullYear()}, SuperFast. Built with Docusaurus.`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "go", "sql", "nginx", "docker"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
