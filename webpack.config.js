const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    contentBase: "./",
    port: 8000,
    index: "index.html",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html",
      inject: "body",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./example/config.json"),
          to: ".",
        },
        {
          from: path.resolve(__dirname, "./example/**"),
          to: "photos/",
          globOptions: {
            ignore: ["**/config.json"],
          },
        },
      ],
    }),
  ],
};
