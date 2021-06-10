/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = {
  name: 'ready',
  listen (client) {
    client.logger.log('info',`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`)
    client.user.setPresence({
      status: 'online'
    })
  }
}
