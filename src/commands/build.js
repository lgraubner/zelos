const { promisify } = require('util');
const render = promisify(require('ejs').renderFile);
const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');

const copyStaticDirectory = require('../utils/copyStaticDirectory');

const pagesPath = `${process.cwd()}/example/pages`;
const layoutPath = `${process.cwd()}/example/layouts`;

const renderContent = async (file, type) => {
  // @TODO: html => copy, md => convert
  if (type === 'ejs') {
    return await render(file);
  } else if (type === 'md') {
    //
  }
};

const compile = async filePath => {
  const relativePath = filePath.replace(pagesPath, '');
  const ext = path.extname(filePath);
  const basename = path.basename(relativePath, ext);
  const fileDir = path.join(global.publicPath, basename);

  await fs.ensureDir(fileDir);

  const content = await renderContent(filePath, ext);
  const page = await render(`${layoutPath}/default.ejs`, {
    body: content
  });

  await fs.writeFile(`${fileDir}/index.html`, page);
};

const build = async () => {
  // clear destination folder
  await fs.emptyDir(global.publicPath);

  await copyStaticDirectory();

  chokidar
    .watch(`${pagesPath}/**/*`, {
      persistent: false
    })
    .on('add', compile)
    .on('change', compile);
};

module.exports = build;
