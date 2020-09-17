const path = require("path");
module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "anichart.js",
    path: path.resolve(__dirname, "dist"),
    library: "anichart",
    libraryTarget: "var",
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
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
};
