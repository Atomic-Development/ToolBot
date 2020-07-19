/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const perms = require('../utils/permissions')
module.exports = {
  name: 'reload',
  description: 'Reloads a command file from disk (can also load a new command file into memory!)',
  usage: '[command name]',
  admin: true,
  cooldown: 0,
  /**
   * Provides the ability to reload commandfiles on the fly.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  run (client, message, args) {
    if (!args) {
      message.reply('Must provide a command name to reload.')
      return
    }
    const commandName = args[0]
    const memberID = message.member.id
    // Check if the command exists and is valid
    if (!client.commands.has(commandName)) {
      message.reply('That command does not exist')
      return
    }
    // We're only going to allow administrators to reload commands.
    if (perms.checkAdministrator(memberID)) {
      // The path is relative to the *current folder*, so just ./filename.js
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
}
