/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
// We're going to use the `discord-command-parser` library!
const parser = require('discord-command-parser')
module.exports = (client, message) => {
  const prefix = client.config.prefix
  // Ignore all bots
  if (message.author.bot) return
  // Ignore messages not starting with the prefix (in config.json)
  if (message.content.indexOf(prefix) !== 0) return
  const parsed = parser.parse(message, prefix)
  if (!parsed.success) return
  // Our standard argument/command name definition.
  const args = parsed.arguments
  const command = parsed.command
  // Grab the command data from the client.commands Enmap
  const cmd = client.commands.get(command)
  // If that command doesn't exist, silently exit and do nothing
  if (!cmd) return
  // Run the command
  cmd.run(client, message, args)
}
