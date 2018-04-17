const fs = require('fs-extra')
const chokidar = require('chokidar')
const path = require('path')

const copyFile = filePath => {
  const relativePath = path.relative(global.staticPath, filePath)
  fs.copy(filePath, `${global.publicPath}/${relativePath}`)
}

module.exports = (watch = false) =>
  chokidar
    .watch(global.staticPath, {
      ignored: /(^|[/\\])\../,
      persistent: watch
    })
    .on('add', copyFile)
    .on('change', copyFile)
