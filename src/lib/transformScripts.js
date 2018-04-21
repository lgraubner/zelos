// @flow
const path = require('path')
const spinner = require('ora')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const glob = require('glob')

const exit = require('../utils/exit')
const error = require('../utils/output/error')
const plain = require('../utils/output/plain')

const transformScripts = (ctx: Object) =>
  new Promise(async (resolve: Function) => {
    const { paths } = ctx

    const srcPath = path.resolve(paths.assets, 'js')
    const srcFiles = glob.sync(`${srcPath}/*.js`)
    const entries = srcFiles.reduce((obj, file) => {
      obj[path.basename(file, '.js')] = file
      return obj
    }, {})

    if (!srcFiles.length) {
      return resolve({})
    }

    const output = spinner('transforming js')

    webpack(
      {
        entry: entries,
        target: 'web',
        output: {
          path: paths.public,
          filename: '[name]_[chunkhash].js'
        },
        mode: 'production',
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loaders: ['babel-loader']
            },
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'eslint-loader'
            }
          ]
        },
        plugins: [new UglifyJsPlugin()]
      },
      (err, stats) => {
        if (err) {
          error(
            'An unexpected error occured while transforming js.',
            err.message
          )
          exit(1)
        }

        if (stats.hasErrors()) {
          output.fail()
          plain(stats.toString('errors-only'))
          exit(1)
        }

        const res = stats.toJson()

        output.succeed()

        const manifest = res.assets.reduce((obj, chunk) => {
          obj[`${chunk.chunkNames[0]}.js`] = `/${chunk.name}`
          return obj
        }, {})

        resolve(manifest)
      }
    )
  })

module.exports = transformScripts
