const { promisify } = require('util');
const glob = promisify(require('glob'));
const render = promisify(require('ejs').renderFile);
const path = require('path');
const fs = require('fs');
const mkdirp = promisify(require('mkdirp'));
const rimraf = promisify(require('rimraf'));

const writeFile = promisify(fs.writeFile);

const renderContent = async (file, type) => {
  if (type === 'ejs') {
    return await render(file);
  } else if (type = )
};

const build = async () => {
  const src = './example';
  const dest = './public';

  await rimraf(`${dest}/**`);

  const files = await glob('**/*.(md|ejs|html)', { cwd: `${src}/pages` });

  files.forEach(async f => {
    const fileData = path.parse(f);
    const fileDir = path.join(dest, fileData.dir, fileData.name);

    await mkdirp(fileDir);

    const content = await renderContent(`${src}/pages/${f}`, fileData.ext);
    const page = await render(`${src}/layouts/default.ejs`, { body: content });

    await writeFile(`${fileDir}/index.html`, page);
  });
};

module.exports = build;
