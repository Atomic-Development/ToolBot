/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
exports.run = (client, message, args) => {
  message.channel.send('pong!').catch(console.error)
}
