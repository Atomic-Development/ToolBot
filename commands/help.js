/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const config = require('../config.json')
module.exports = {
  name: 'help',
  description: 'List all commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command]',
  cooldown: 5,
  /**
   * Provides help information for the bot's commands.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  run (client, message, args) {
    const data = []
    const prefix = config.prefix
    const { commands } = message.client

    if (!args.length) {
      data.push('Here\'s a list of all my commands:')
      data.push(commands.map(command => command.name).join(', '))
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)
      return message.author.send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return
          message.reply('I\'ve sent you a DM with all my commands!')
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
          message.reply('it seems like I can\'t DM you! Do you have DMs disabled?')
        })
    } else {
      const name = args[0].toLowerCase()
      const command = commands.get(name) || commands.find(command => command.aliases && command.aliases.includes(name))

      if (!command) {
        return message.reply('**WHOOPS** That\'s not a valid command!')
      }

      data.push(`**Name:** ${command.name}`)

      if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
      if (command.description) data.push(`**Description:** ${command.description}`)
      if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`)

      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

      message.channel.send(data, { split: true })
    }
  }
}
