// @flow
const fs = require('fs-extra')
const { resolve } = require('path')

const readConfigFile = async (filePath: string = 'config.js'): Promise<any> => {
  const configPath = resolve(process.cwd(), filePath)
  try {
    const config = await fs.readJson(configPath)
    return config
  } catch (err) {
    return {}
  }
}

module.exports = readConfigFile
