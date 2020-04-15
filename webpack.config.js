const path = require("path")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  target: "node",
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    filename: "index.js",
    path: path.join(process.cwd(), "lib"),
    library: "MarkDiff",
    libraryTarget: "commonjs2",
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
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
}
