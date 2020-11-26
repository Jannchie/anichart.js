const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "anichart.js",
    path: path.resolve(__dirname, "dist"),
    library: "anichart",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.ts?$/, loader: "ts-loader" },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js|.ts$/, loader: "source-map-loader" },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
        },
        exclude: "/node_modules/",
      },
    ],
  },
  externals: ["fs", "canvas"],
};
