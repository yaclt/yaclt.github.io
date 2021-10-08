// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Yaclt",
  tagline: "Yet Another Changelog Tool",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "yaclt", // Usually your GitHub org/user name.
  projectName: "yaclt.github.io", // Usually your repo name.

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/facebook/docusaurus/edit/main/website/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Yaclt",
        logo: {
          alt: "Yaclt Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "doc",
            docId: "yaclt/intro",
            position: "left",
            label: "Yaclt",
          },
          {
            type: "doc",
            docId: "yaclt.nvim/intro",
            position: "left",
            label: "Yaclt.nvim",
          },
          {
            href: "https://github.com/yaclt/",
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
                label: "Yaclt",
                to: "/docs/yaclt/intro",
              },
              {
                label: "Yaclt.nvim",
                to: "/docs/yaclt.nvim/intro",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/dv5x7tjqYk",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/yaclt/",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} M. Jones Software Systems, LLC. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
