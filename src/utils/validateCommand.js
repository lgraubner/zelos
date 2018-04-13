const help = require('../commands/help');
const build = require('../commands/build');
const serve = require('../commands/serve');

const validateCommand = c =>
  ({
    build,
    serve
  }[c] || help);

module.exports = validateCommand;
