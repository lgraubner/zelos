// @flow
const { resolve } = require('path')
const swPrecache = require('sw-precache')

const generateServiceWorker = (ctx: Object) => {
  const { paths } = ctx

  const swPath = resolve(paths.public, 'sw.js')

  return swPrecache.write(swPath, {
    staticFileGlobs: [`${paths.public}/**/*`],
    stripPrefix: paths.public
  })
}

module.exports = generateServiceWorker
