// @flow
const browserify = require('browserify')
const path = require('path')
const fs = require('fs-extra')
const spinner = require('ora')

const exit = require('../utils/exit')
const error = require('../utils/output/error')

const transformJS = (ctx: Object) =>
  new Promise(async (resolve: Function) => {
    const { paths } = ctx
    const srcPath = path.resolve(paths.assets, 'js/main.js')
    const destPath = path.resolve(paths.public, 'js/app.js')

    try {
      await fs.ensureDir(path.dirname(destPath))
      const output = spinner('transforming js')

      const dest = fs.createWriteStream(destPath)

      browserify(srcPath)
        .bundle()
        .pipe(dest)

      dest.on('finish', () => {
        output.succeed()
        resolve()
      })
    } catch (err) {
      if (err.code !== 'ENOENT') {
        error('An unexpected error occured while transforming js.', err.message)
        exit(1)
      }
    }
  })

module.exports = transformJS
