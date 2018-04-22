// @flow
const imagemin = require('imagemin')
const imageminOptipng = require('imagemin-optipng')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminSvgo = require('imagemin-svgo')
const { resolve } = require('path')

// const error = require('../utils/output/error')

const optimizeImages = (ctx: Object) => {
  const { paths } = ctx

  const srcPath = resolve(paths.assets, 'images')
  const destPath = resolve(paths.public, 'images')

  return imagemin([`${srcPath}/**/*.{jpg,png,svg}`], destPath, {
    plugins: [imageminOptipng(), imageminMozjpeg(), imageminSvgo()]
  })
  // try {
  // } catch (err) {
  //   output.fail()
  //   error('An unexpected error occured while optimizing images.')
  // }
}

module.exports = optimizeImages
