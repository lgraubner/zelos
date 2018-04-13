#!/usr/bin/env node

const mri = require('mri');

const help = require('./commands/help');
const validateCommand = require('./utils/validateCommand');

global.publicPath = `${process.cwd()}/public`;

const main = async argv_ => {
  const argv = mri(argv_, {
    boolean: ['help', 'version'],
    alias: {
      help: 'h',
      version: 'V'
    }
  });

  if (argv.version) {
    console.log(require('../package').version);
    return 0;
  }

  if (argv.help) {
    help();
  }

  const target = argv._[1];
  // @TODO: better mechanism, pass args
  const command = validateCommand(argv._[0]);

  command(target);
};

main(process.argv.slice(2));
