"use strict";

var Path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var HOST;
var JSX_LOADER_LIST;
var FILENAME_FORMAT;
var PRODUCTION_PLUGINS;

if ("--docker" === process.argv[process.argv.length-1]) {
  HOST = "0.0.0.0";
} else {
  HOST = "localhost";
}

if ("production" === process.env.NODE_ENV) {
  JSX_LOADER_LIST = ["babel"];
  FILENAME_FORMAT = "[name]-[chunkhash].js";
  PRODUCTION_PLUGINS = [
    // Safe effect as webpack -p
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ];
} else {
  // For webpack-dev-server and HMR!!!
  JSX_LOADER_LIST = ["react-hot", "babel"];
  // When HMR is enabled, chunkhash cannot be used.
  FILENAME_FORMAT = "[name].js";
  PRODUCTION_PLUGINS = [];
}

module.exports = {
  devServer: {
    port: 8080,
    host: HOST,
    contentBase: Path.resolve(__dirname, "../../public"),
    hot: true,
  },
  context: __dirname,
  output: {
    path: Path.resolve(__dirname, "../../public"),
    filename: FILENAME_FORMAT,
  },
  resolve: {
    alias: {
      "react": Path.resolve(__dirname, "./node_modules/react"),
    },
  },
  resolveLoader: {
    root: Path.resolve(__dirname, "./node_modules")
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style", "css!sass", {
          publicPath: ""
        }),
      },
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        loaders: JSX_LOADER_LIST,
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin("NODE_ENV"),
    new ExtractTextPlugin("[name]-[chunkhash].css", {
      disable: "production" !== process.env.NODE_ENV
    }),
  ].concat(PRODUCTION_PLUGINS),
};
