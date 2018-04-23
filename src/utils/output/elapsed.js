const ms = require('ms')
const chalk = require('chalk')

// Returns a time delta with the right color
// example: `[103ms]`

const elapsed = start => chalk.gray(`[${ms(new Date() - start)}]`)

module.exports = elapsed
