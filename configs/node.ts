import path from "path"
import type { GatsbyNode } from "gatsby"
import type { Configuration } from "webpack"

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({ stage, actions, getConfig }) => {
  // use core-js@3
  const webpackConfig: Configuration = getConfig()

  if (webpackConfig.resolve) {
    if (webpackConfig.resolve.alias) {
      delete webpackConfig.resolve.alias["core-js"]
    }

    webpackConfig.resolve.modules = [
      path.resolve(__dirname, "node_modules/gatsby/node_modules"),
      "node_modules",
    ]
  }

  actions.replaceWebpackConfig(webpackConfig)

  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(".", "src"),
        "@@": path.resolve("."),
        "types": path.resolve(".", "types"),
        ...(stage.startsWith("develop") ? {
          "react-dom": "@hot-loader/react-dom",
        } : {}),
      },
      extensions: [".ts", ".tsx"],
    },
  })
}
