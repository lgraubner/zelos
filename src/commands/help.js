const { bold } = require('chalk');

const help = () =>
  console.log(`
  ${bold('Simple static site generator')}

  Commands:

    -V, --version       Output version number
    -h, --help          Display help
`);

module.exports = help;
