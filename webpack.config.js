const nodeExternals = require('webpack-node-externals')
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'zelos.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['shebang-loader', 'babel-loader']
      }
    ]
  },
  plugins: [
    new FlowBabelWebpackPlugin(),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      entryOnly: true
    })
  ]
}
