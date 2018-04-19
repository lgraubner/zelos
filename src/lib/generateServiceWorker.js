// @flow
const { resolve } = require('path')
const swPrecache = require('sw-precache')
const spinner = require('ora')

const info = require('../utils/output/info')
const logError = require('../utils/logError')

const generateServiceWorker = async (ctx: Object) => {
  const { paths } = ctx

  const output = spinner('generating service worker').start()
  const swPath = resolve(paths.public, 'sw.js')

  try {
    await swPrecache.write(swPath, {
      staticFileGlobs: [`${paths.public}/**/*`],
      stripPrefix: paths.public,
      logger: (msg: string) => {
        output.succeed()
        info(msg, true)
      }
    })
  } catch (err) {
    output.fail()
    logError(err)
  }
}

module.exports = generateServiceWorker
