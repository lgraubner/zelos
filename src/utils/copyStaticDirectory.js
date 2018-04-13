const fs = require('fs-extra');
const chokidar = require('chokidar');
const path = require('path');

const staticPath = `${process.cwd()}/static`;

const copyFile = filePath => {
  const relativePath = path.relative(staticPath, filePath);
  fs.copy(filePath, `${global.publicPath}/${relativePath}`);
};

module.exports = (watch = false) =>
  chokidar
    .watch(staticPath, {
      ignored: /\.[^/\\]+$/,
      persistent: watch
    })
    .on('add', copyFile)
    .on('change', copyFile);
