/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const { dateFormat } = require('date-fns')
module.exports = {
  name: 'time',
  description: 'Provides the current server time.',
  usage: '',
  cooldown: 5,
  /**
   * Provides the current in-game time!.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  run (client, message, args) {
    var eveTime = new Date().toUTCString()
    var eveTimeFormatted = dateFormat(eveTime, 'dddd, Do MMMM YYYY, H:mm')
    // Construct our final output message.
    var messageText = `EVE time is currently: **${eveTimeFormatted}**.`
    message.channel.send(messageText)
  }
}
