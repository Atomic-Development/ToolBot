/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const moment = require('moment')
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
    var eveDate = moment.utc().format('dddd, Do MMMM YYYY')
    var eveTime = moment.utc().format('H:mm')
    // Construct our final output message.
    var messageText = `The time in EVE is currently: **${eveTime}**. \n The date in EVE is currently: **${eveDate}**.`
    message.channel.send(messageText)
  }
}
