// @flow
const ora = require('ora')
// $FlowFixMe
const { red, green, blue } = require('chalk')

const elapsed = require('./elapsed')

const spinner = () => {
  const instance = ora()
  let start = new Date()
  return {
    start(text: string) {
      start = new Date()
      instance.start(text)
    },
    fail(text: string = instance.text) {
      instance.stopAndPersist({
        symbol: red('error'),
        text
      })
    },
    succeed(text: string = instance.text) {
      instance.stopAndPersist({
        symbol: green('success'),
        text: `${text} ${elapsed(start)}`
      })
    },
    info(text: string = instance.text) {
      instance.stopAndPersist({
        symbol: blue('info'),
        text
      })
    }
  }
}

module.exports = spinner
