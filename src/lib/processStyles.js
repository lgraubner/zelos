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
    const manifest = {}

    for (let file of srcFiles) {
      const cssContent = await fs.readFile(file, 'utf8')
      const fileName = basename(file, '.css')

      const result = await postcss([
        atImport,
        cssnext({ warnForDuplicates: false }),
        cssnano
      ]).process(cssContent, {
        from: file,
        to: `${paths.public}/${fileName}.css`
      })

      const hash = await crypto.createHash('md5')
      hash.update(result.css)

      const hashFileName = `${fileName}_${hash.digest('hex').slice(0, 20)}.css`
      const destPath = resolve(paths.public, hashFileName)

      manifest[fileName] = `/${hashFileName}`
      await fs.outputFile(destPath, result.css)
    }

    output.succeed()
    return manifest
  } catch (err) {
    output.fail()
    error('An unexpected error occured while processing css.', err.message)
    exit(1)
  }
}

module.exports = processStyles
