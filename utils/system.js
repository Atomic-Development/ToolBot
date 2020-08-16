/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const _ = require('underscore')
const env = require('env-var')
const commands = env.get('COMMANDS').asJsonArray()

/**
 * Checks if the specified command exists in the commands config array.
 * @param {string} commandName - The command name.
 * @return {boolean} - True or false depending on the input ID and config value.
 */
function checkCommand (commandName) {
  if (_.isEmpty(commands)) {
    return false
  } else {
    if (_.includes(commands, commandName)) {
      return true
    } else {
      return false
    }
  }
}

exports.checkCommand = checkCommand