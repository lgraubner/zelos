// @flow
const path = require('path')
const { promisify } = require('util')
const webpack = promisify(require('webpack'))
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const glob = require('globby')

const transformScripts = async (ctx: Object) => {
  const { paths, config } = ctx

  const srcPath = path.resolve(paths.assets, 'js')
  const srcFiles = await glob(`${srcPath}/*.js`)
  const entries = srcFiles.reduce((obj, file) => {
    obj[path.basename(file, '.js')] = file
    return obj
  }, {})

  const plugins = []
  if (config.minify) {
    plugins.push(new UglifyJsPlugin())
  }

  const stats = await webpack({
    entry: entries,
    target: 'web',
    output: {
      path: paths.public,
      filename: '[name]_[chunkhash].js'
    },
    mode: config.minify ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    targets: {
                      browsers: ['>0.25%', 'not ie 11', 'not op_mini all']
                    }
                  }
                ]
              ]
            }
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        }
      ]
    },
    plugins: plugins
  })

  if (stats.hasErrors()) {
    throw new Error(stats.toString('errors-only'))
  }

  const res = stats.toJson()

  const manifest = res.assets.reduce((obj, chunk) => {
    obj[chunk.chunkNames[0]] = `/${chunk.name}`
    return obj
  }, {})

  return manifest
}

module.exports = transformScripts
