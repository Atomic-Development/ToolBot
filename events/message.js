/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const Discord = require('discord.js')
const env = require('env-var')
const parser = require('discord-command-parser')
const _ = require('underscore')

const prefix = env.get('PREFIX').asString()
const banned = env.get('BANNED').asJsonArray()

const system = require('../utils/system')

module.exports = {
  name: 'message',
  async listen (client, message) {
    var id = message.author.id
    var tag = message.author.tag
    // Ignore all bots
    if (message.author.bot) return
    if (_.includes(banned, id)) {
      client.logger.log('warn',`Banned user ${tag} (${id}) tried to use the bot.`)
      return
    }
    // Ignore messages not starting with the prefix.
    if (!message.content.startsWith(prefix) || message.author.bot) return
    var parsed = parser.parse(message, prefix)
    if (!parsed.success) return
    // Our standard argument/command name definition.
    var args = parsed.arguments
    var commandName = parsed.command
    // Grab the command data from the client.commands collection.
    var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    // If that command doesn't exist, silently exit and do nothing
    if (!command) return
    // Run the command
    var cooldownResult = await system.checkCooldown(client, command, message)
    if (typeof cooldownResult !== 'object' || cooldownResult.status === 'no-cooldown') {
      command.run(client, message, args)
    } else {
      message.reply(cooldownResult.msg)
    }
  }
}
