// @flow
const imagemin = require('imagemin')
const imageminOptipng = require('imagemin-optipng')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminSvgo = require('imagemin-svgo')
const spinner = require('ora')
const fs = require('fs-extra')
const { resolve } = require('path')

const error = require('../utils/output/error')

const optimizeImages = async (ctx: Object) => {
  const { paths } = ctx

  const srcPath = resolve(paths.assets, 'images')
  const destPath = resolve(paths.public, 'images')

  const exists = await fs.pathExists(srcPath)
  if (!exists) {
    return
  }

  const output = spinner('optimizing images').start()

  try {
    await imagemin([`${srcPath}/**/*.{jpg,png,svg}`], destPath, {
      plugins: [imageminOptipng(), imageminMozjpeg(), imageminSvgo()]
    })
    output.succeed()
  } catch (err) {
    output.fail()
    error('An unexpected error occured while optimizing images.')
  }
}

module.exports = optimizeImages
