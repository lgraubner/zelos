// @flow
const fs = require('fs-extra')
const { resolve } = require('path')

const readConfigFile = async (): Promise<string> => {
  const configPath = resolve(process.cwd(), 'config.json')
  return fs.readJson(configPath)
}

module.exports = readConfigFile
