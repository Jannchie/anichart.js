const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "anichart.js",
    path: path.resolve(__dirname, "dist"),
    library: "anichart",
    libraryTarget: "umd",
    globalObject: "this"
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
        exclude: "/node_modules/",
      },
    ],
  },
  externals: {
    fs: "fs",
    canvas: "canvas",
  }
};
