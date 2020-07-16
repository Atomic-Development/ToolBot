/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const config = require('../config.json')
const _ = require('underscore')
exports.run = (client, message, args) => {
  if (!args || args.length < 1) return message.reply('Must provide a command name to reload.')
  const commandName = args[0]
  const memberID = message.member.id
  // Check if the command exists and is valid
  if (!client.commands.has(commandName)) {
    return message.reply('That command does not exist')
  }
  var administrators = config.administrators
  if (_.contains(administrators, memberID)) {
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${commandName}.js`)]
    // We also need to delete and reload the command from the client.commands Enmap
    client.commands.delete(commandName)
    const props = require(`./${commandName}.js`)
    client.commands.set(commandName, props)
    message.reply(`The command ${commandName} has been reloaded`)
    console.log(`The command ${commandName} was reloaded by ${memberID}`)
  } else {
    message.reply("You're not authorised to reload commands")
    console.log(`User ${memberID} tried to reload ${commandName} but I said no!`)
  }
}
