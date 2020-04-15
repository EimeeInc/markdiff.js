import { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: "markdiff.js demo",
    description: "JavaScript port of r7kamura/markdiff",
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-typescript",
    "gatsby-plugin-emotion",
    {
      resolve: "gatsby-plugin-graphql-codegen",
      options: {
        fileName: "types/graphql.d.ts",
        documentPaths: [
          "./src/**/*.{ts,tsx}",
        ],
      },
    },
  ],
}

export default config
