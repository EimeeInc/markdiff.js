const path = require("path")
const nodeExternals = require("webpack-node-externals")

const isProd = process.NODE_ENV === "production"

module.exports = {
  mode: isProd ? "production" : "development",
  target: "node",
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, "src/index.ts"),
  output: {
    path: path.join(process.cwd(), "lib"),
    library: "markdiff",
    libraryTarget: "umd",
  },
  devtool: isProd ? "source-map" : false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts"],
  },
  optimization: {
    minimize: isProd,
  },
}
