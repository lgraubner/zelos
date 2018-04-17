// @flow
// $FlowFixMe
const { red } = require('chalk')

const error = (...msgs: any): any =>
  console.error(`${red('> Error!')} ${msgs.join('\n')}`)

module.exports = error
