// @flow
const imagemin = require('imagemin')
const imageminOptipng = require('imagemin-optipng')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminSvgo = require('imagemin-svgo')
const spinner = require('ora')

const error = require('../utils/output/error')

const optimizeImages = async (ctx: Object) => {
  const { paths } = ctx
  const output = spinner('optimizing images').start()

  try {
    await imagemin(
      [`${paths.assets}/images/**/*.{jpg,png,svg}`],
      `${paths.public}/images`,
      {
        plugins: [imageminOptipng(), imageminMozjpeg(), imageminSvgo()]
      }
    )
    output.succeed()
  } catch (err) {
    output.fail()
    error('An unexpected error occured while optimizing images.')
  }
}

module.exports = optimizeImages
