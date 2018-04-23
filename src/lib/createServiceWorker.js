// @flow
const { resolve } = require('path')
const swPrecache = require('sw-precache')

const createServiceWorker = async (ctx: Object) => {
  const { paths } = ctx

  const swPath = resolve(paths.public, 'sw.js')

  let result = ''
  return swPrecache
    .write(swPath, {
      staticFileGlobs: [`${paths.public}/**/*.{html,css,js,xml}`],
      stripPrefix: paths.public,
      logger: (msg: string) => {
        result = msg
      }
    })
    .then(() => result)
}

module.exports = createServiceWorker
