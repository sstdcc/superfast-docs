import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  mainSidebar: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/introduction",
        "getting-started/system-requirements",
        "getting-started/installation",
        "getting-started/quick-start",
      ],
    },
    {
      type: "category",
      label: "User Guide",
      collapsed: false,
      items: [
        "user-guide/dashboard",
        "user-guide/customers",
        "user-guide/suppliers",
        "user-guide/transactions",
        "user-guide/reminders",
        "user-guide/reports",
        "user-guide/whatsapp",
        "user-guide/settings",
      ],
    },
    {
      type: "category",
      label: "Sync & Offline",
      collapsed: false,
      items: [
        "sync/overview",
        "sync/cloud-sync",
        "sync/offline-mode",
        "sync/multi-device",
      ],
    },
    {
      type: "category",
      label: "API Reference",
      collapsed: false,
      items: [
        "api/overview",
        "api/authentication",
        "api/customers",
        "api/suppliers",
        "api/sync",
        "api/whatsapp",
        "api/server-metrics",
      ],
    },
    {
      type: "category",
      label: "Developer Guide",
      collapsed: false,
      items: [
        "developer/architecture",
        "developer/local-setup",
        "developer/database-schema",
        "developer/sync-engine",
        "developer/building-apk",
      ],
    },
    {
      type: "category",
      label: "Deployment",
      collapsed: false,
      items: [
        "deployment/docker",
        "deployment/environment-variables",
        "deployment/nginx-ssl",
        "deployment/server-dashboard",
      ],
    },
  ],
};

export default sidebars;
