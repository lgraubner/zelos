#!/usr/bin/env node
// @flow

const mri = require('mri');

const main = async argv_ => {
  const argv = mri(argv_, {});
  // eslint-disable-next-line
  console.log(argv);
};

main(process.argv);
