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

module.exports = {
  name: 'message',
  async listen (client, message) {
    var id = message.author.id
    var tag = message.author.tag
    // Ignore all bots
    if (message.author.bot) return
    if (_.includes(banned, id)) {
      console.log(`Banned user ${tag} (${id}) tried to use the bot.`)
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
    var cooldownResult = await cooldownCheck(command, message)
    console.log(cooldownResult)
    if (typeof cooldownResult !== 'object' || cooldownResult.status === 'no-cooldown') {
      command.run(client, message, args)
    } else {
      message.reply(cooldownResult.msg)
    }
  }
}

async function cooldownCheck (command, message) {
  var cooldowns = global.cooldowns
  let reply
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
    console.log('Cooldown Set:', cooldowns)
  }

  var now = Date.now()
  var timestamps = cooldowns.get(command.name)
  console.log('Timestamps:', timestamps)
  var cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    var expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      console.log('Cooldown Triggered')
      var timeLeft = (expirationTime - now) / 1000
      reply = {
        'msg': `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`
      }
      return reply
    }
  } else {
    console.log('No Cooldown')
    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    reply = {
      'status': 'no-cooldown'
    }
    return reply
  }
}
