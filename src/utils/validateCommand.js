const help = require('../commands/help');
const build = require('../commands/build');

const validateCommand = c =>
  ({
    build
  }[c] || help);

module.exports = validateCommand;
