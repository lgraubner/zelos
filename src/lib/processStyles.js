// @flow
const postcss = require('postcss')
const fs = require('fs-extra')
const { resolve, basename } = require('path')
const cssnano = require('cssnano')
const atImport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const spinner = require('ora')
const crypto = require('crypto')
const glob = require('glob')

const exit = require('../utils/exit')
const error = require('../utils/output/error')

const processStyles = async (ctx: Object) => {
  const { paths } = ctx

  const srcPath = resolve(paths.assets, 'css')
  const srcFiles = glob.sync(`${srcPath}/*.css`)

  if (!srcFiles.length) {
    return resolve({})
  }

  const output = spinner('processing CSS').start()

  try {
    const manifest = await srcFiles.reduce(async (obj, file) => {
      const cssContent = await fs.readFile(file, 'utf8')
      const fileName = basename(file, '.css')

      await postcss([atImport, cssnext({ warnForDuplicates: false }), cssnano])
        .process(cssContent, {
          from: file,
          to: `${paths.public}/${fileName}.css`
        })
        .then(async (result: Object) => {
          const hash = crypto.createHash('md5')
          hash.update(result.css)
          const destPath = resolve(
            paths.public,
            `${fileName}_${hash.digest('hex').slice(0, 20)}.css`
          )
          await fs.outputFile(destPath, result.css)
        })
    }, {})

    output.succeed()
    return manifest
  } catch (err) {
    output.fail()
    error('An unexpected error occured while processing css.', err.message)
    exit(1)
  }
}

module.exports = processStyles
