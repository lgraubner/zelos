// @flow
const { resolve } = require('path')
const swPrecache = require('sw-precache')

const info = require('../utils/output/info')

const createServiceWorker = async (ctx: Object) => {
  const { paths, config } = ctx

  if (config.serviceWorker) {
    return
  }

  const swPath = resolve(paths.public, 'sw.js')

  return swPrecache.write(swPath, {
    staticFileGlobs: [`${paths.public}/**/*.{html,css,js,xml}`],
    stripPrefix: paths.public,
    logger: (msg: string) => {
      info(msg, true)
    }
  })
}

module.exports = createServiceWorker
