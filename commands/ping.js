/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = {
  name: 'ping',
  description: 'Asks the bot to return a confirmation that it\'s online.',
  usage: '',
  cooldown: 10,
  /**
   * Provides a simple reply to confirm operation.
   * @return {null}
   */
  run (client, message, args) {
    message.channel.send('pong!').catch(console.error)
  }
}
