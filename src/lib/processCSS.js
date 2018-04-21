// @flow
const postcss = require('postcss')
const fs = require('fs-extra')
const { resolve } = require('path')
const cssnano = require('cssnano')
const atImport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const spinner = require('ora')

const exit = require('../utils/exit')
const error = require('../utils/output/error')

const processCSS = async (ctx: Object) => {
  const { paths } = ctx

  const srcPath = resolve(paths.assets, 'css/main.css')
  const destPath = resolve(paths.public, 'css/app.css')

  try {
    const cssContent = await fs.readFile(srcPath, 'utf8')
    const output = spinner('processing CSS').start()

    await postcss([atImport, cssnext({ warnForDuplicates: false }), cssnano])
      .process(cssContent, {
        from: srcPath,
        to: destPath
      })
      .then(async (result: Object) => {
        await fs.outputFile(destPath, result.css)
        output.succeed()
      })
  } catch (err) {
    if (err.code !== 'ENOENT') {
      error('An unexpected error occured while processing css.', err.message)
      exit(1)
    }
  }
}

module.exports = processCSS
