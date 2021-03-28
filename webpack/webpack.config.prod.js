const Webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  stats: 'errors-only',
  bail: true,
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [ 
          {
            loader: 'style-loader',
            options: { 
                insert: 'body', // insert style tag inside of <head>
                injectType: 'singletonStyleTag' // this is for wrap all your style in just one style tag
            },
          },
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
          },
        }
          // { loader: 'style-loader', options: { injectType: 'styleTag' } },
          // 'css-loader',
        //   { loader: "style-loader" }, 
        // {
        //   loader: 'css-loader',
        //   options: {
        //     modules: true,
        //     importLoaders: 1,
        //   },
        // }
      ],
      },
    ],
  },
});
