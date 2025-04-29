import type { Config } from "@staticcms/core";

const config: Config = {
  backend: { name: "git-gateway", branch: "main" },

  media_folder: "public/images",
  public_folder: "/images",

  collections: [
    {
      name: "albums",
      label: "Albums",
      folder: "content/albums/",
      extension: "mdx",
      format: "frontmatter",
      create: true,
      slug: "{{slug}}",
      identifier_field: "slug",
      summary: "{{title}}",
      fields: [
        { label: "Slug", name: "slug", widget: "string" },
        { label: "Title", name: "title", widget: "string" },
        { label: "Artist", name: "artist", widget: "string" },
        { label: "Year", name: "year", widget: "number" },
        { label: "Ranking", name: "ranking", widget: "number" },
        {
          label: "Cover Image",
          name: "cover",
          widget: "image",
        },
        {
          label: "Comment",
          name: "body",
          widget: "markdown",
        },
      ],
    },
  ],
};

export default config;
