/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const Math = require('../utils/math')
module.exports = {
  name: 'ping',
  description: 'Asks the bot to return a confirmation that it\'s online along with it\'s message and API latency figures.',
  usage: '',
  cooldown: 10,
  /**
   * Provides a simple reply to confirm operation.
   * @return {null}
   */
  async run (client, message, args) {
    const msg = await message.channel.send("Ping?");
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }
}