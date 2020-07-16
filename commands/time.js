/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const moment = require('moment-timezone')
exports.run = (client, message, args) => {
  var eveTime = moment()
  var eveTimeUTC = eveTime.utc()
  var eveTimeFormatted = eveTimeUTC.format('dddd, Do MMMM YYYY, H:mm:ss')
  // Construct our final output message.
  var messageText = `In EVE it's currently: **${eveTimeFormatted}**.`
  message.channel.send(messageText)
}
