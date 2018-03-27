const nodeExternals = require('webpack-node-externals');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['shebang-loader', 'babel-loader']
      }
    ]
  },
  plugins: [new FlowBabelWebpackPlugin()]
};
