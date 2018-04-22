// @flow
const postcss = require('postcss')
const fs = require('fs-extra')
const { resolve, basename } = require('path')
const cssnano = require('cssnano')
const atImport = require('postcss-import')
const cssnext = require('postcss-cssnext')
const crypto = require('crypto')
const glob = require('globby')

const processStyles = async (ctx: Object): Promise<any> => {
  const { paths, config } = ctx

  const srcPath = resolve(paths.assets, 'css')
  const srcFiles = await glob(`${srcPath}/*.css`)

  const plugins = [atImport, cssnext({ warnForDuplicates: false })]

  if (config.minify) {
    plugins.push(cssnano)
  }

  const transformer = postcss(plugins)

  const manifest = {}
  await Promise.all(
    srcFiles.map(async file => {
      const cssContent = await fs.readFile(file, 'utf8')
      const fileName = basename(file, '.css')

      const result = await transformer.process(cssContent, {
        from: file,
        to: `${paths.public}/${fileName}.css`
      })

      const hash = await crypto.createHash('md5')
      hash.update(result.css)

      const hashFileName = `${fileName}_${hash.digest('hex').slice(0, 20)}.css`
      const destPath = resolve(paths.public, hashFileName)

      manifest[fileName] = `/${hashFileName}`
      return fs.outputFile(destPath, result.css)
    })
  )

  return manifest
}

module.exports = processStyles
