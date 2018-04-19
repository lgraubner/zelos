// @flow
const ora = require('ora')

const spinner = async (msg: string) => ora(msg).start()

module.exports = spinner
