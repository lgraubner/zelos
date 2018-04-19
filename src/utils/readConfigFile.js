// @flow
const fs = require('fs-extra')
const { resolve } = require('path')

const error = require('../utils/output/error')
const info = require('../utils/output/info')
const logError = require('../utils/logError')
const exit = require('../utils/exit')

const readConfigFile = async (): Promise<string> => {
  const configPath = resolve(process.cwd(), 'config.json')
  try {
    const config = await fs.readJson(configPath)
    return config
  } catch (err) {
    if (err.code === 'ENOENT') {
      error('Config file not found.')
      info('The current working directory does not contain a config.json.')
    } else {
      logError(err)
    }

    exit(1)
  }
}

module.exports = readConfigFile
