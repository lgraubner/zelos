// @flow
const { resolve } = require('path')
const swPrecache = require('sw-precache')
const spinner = require('ora')

const info = require('../utils/output/info')
const error = require('../utils/output/error')
const exit = require('../utils/exit')

const generateServiceWorker = async (ctx: Object) => {
  const { paths } = ctx

  const output = spinner('generating service worker').start()
  const swPath = resolve(paths.public, 'sw.js')

  try {
    await swPrecache.write(swPath, {
      staticFileGlobs: [`${paths.public}/**/*.{html,css,js,xml}`],
      stripPrefix: paths.public,
      logger: (msg: string) => {
        output.succeed()
        info(msg, true)
      }
    })
  } catch (err) {
    output.fail()
    error(
      'An unexpected error occured while generating the service worker.',
      err
    )
    exit(1)
  }
}

module.exports = generateServiceWorker
