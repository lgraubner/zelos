// @flow
const nanoseconds = require('nanoseconds')
const prettyMs = require('pretty-ms')

const formatExecutionTime = (
  startTime: [number, number],
  endTime: [number, number]
): string => {
  // convert to ms and round
  const nanoTime = Math.ceil(nanoseconds(endTime) / 1e9)

  return prettyMs(nanoTime)
}

module.exports = formatExecutionTime
