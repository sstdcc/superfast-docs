import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "SuperFast by SSTD",
  tagline: "Supermarket Debt & Supplier Management System — by SSTD",
  favicon: "img/favicon.ico",

  url: "https://docs.sstd.cc",
  baseUrl: "/superfast/",

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
          showLastUpdateTime: true,
          // editUrl removed — repository is private
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
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 8,
      },
    ],
  ],

  themeConfig: {
    announcementBar: {
      id: "superfast_v1",
      content:
        '🚀 <strong>SuperFast v1.0</strong> is live — <a href="/superfast/getting-started/quick-start" style="color:#93c5fd;font-weight:600">Get started in 5 minutes →</a>',
      backgroundColor: "#0f172a",
      textColor: "#e2e8f0",
      isCloseable: true,
    },

    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },

    image: "img/logo-128.png",

    metadata: [
      {
        name: "description",
        content:
          "Official documentation for SuperFast — supermarket debt & supplier management system, a product of SSTD.",
      },
      { property: "og:site_name", content: "SuperFast by SSTD" },
      {
        property: "og:description",
        content:
          "Official documentation for SuperFast — supermarket debt & supplier management system, a product of SSTD.",
      },
    ],

    navbar: {
      title: "SuperFast",
      style: "dark",
      // "by SSTD" subtitle injected via CSS ::after on .navbar__title
      logo: {
        alt: "SuperFast Logo",
        src: "img/logo.png",
        srcDark: "img/logo.png",
        width: 36,
        height: 36,
        style: { borderRadius: "10px" },
      },
      hideOnScroll: false,
      items: [
        {
          type: "docSidebar",
          sidebarId: "mainSidebar",
          position: "left",
          label: "Docs",
        },
        {
          to: "/api/overview",
          label: "API",
          position: "left",
        },
        {
          to: "/deployment/docker",
          label: "Deploy",
          position: "left",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://www.sstd.cc",
          position: "right",
          className: "header-sstd-link",
          "aria-label": "SSTD website",
        },
      ],
    },

    // Footer replaced by src/theme/Footer/index.tsx
    footer: undefined,

    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["bash", "json", "go", "sql", "nginx", "docker", "yaml"],
      defaultLanguage: "bash",
    },

    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
