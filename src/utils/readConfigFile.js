// @flow
const fs = require('fs-extra')
const { resolve } = require('path')

const readConfigFile = async (): Promise<any> => {
  const configPath = resolve(process.cwd(), 'config.json')
  try {
    const config = await fs.readJson(configPath)
    return config
  } catch (err) {
    return {}
  }
}

module.exports = readConfigFile
