/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const esi = require('../services/esiservice')
const alias = require('../utils/systemaliases')
const _ = require('underscore')
module.exports = {
  name: 'route',
  description: 'Provides information on the route between two given systems. The final argument is the routing flag, examples include **safe**, **unsafe** and **short**. Many synonyms are accepted.',
  usage: '[origin] [destination] [flag]',
  cooldown: 5,
  /**
   * Provides a route between two systems.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  async run (client, message, args) {
    // Origin is always the first item.
    var origin = args[0]
    // Destination is the second item.
    var destination = args[1]
    // Flag is the third item.
    var flag = args[2]

    if (typeof args[3] !== 'undefined') {
      message.channel.send('**WHOOPS:** This command only accepts three parameters. If the system name you\'re looking for has spaces enclose it in quotation marks.')
      return
    }
    // If we don't have a flag at this point we'll assume 'safest'.
    if (!flag) {
      flag = 'secure'
    }
    if (typeof origin !== 'undefined') {
      origin = alias.systemChecker(origin)
    }
    if (typeof destination !== 'undefined') {
      destination = alias.systemChecker(destination)
    }
    // We're gonna throw an error here if we're missing any of the three parts.
    if (!origin || !destination || !flag) {
      message.channel.send('**WHOOPS:** You mangled it. You need to pass an origin, destination and routing flag.')
    } else {
      // Search ESI for the origin system using our 'fuzzy' search type which lets us use terms like 'Amy'.
      let originSearch = await esi.getSearchResults(
        origin,
        'solar_system',
        'fuzzy'
      )
      if (_.isEmpty(originSearch)) {
        // No search results!
        message.channel.send('**WHOOPS:** Your origin system name didn\'t return any usable results!')
        return
      } else {
        // Set the Origin system ID.
        var originID = originSearch['solar_system'].shift()
        // Grab the full system info from ESI.
        let originSystem = await esi.getSystemInfo(originID)
        // Setup some variables!
        var originName = originSystem.name
      }
      // Search ESI for the destination system using our 'fuzzy' search type which lets us use terms like 'Amy'.
      let destinationSearch = await esi.getSearchResults(
        destination,
        'solar_system',
        'fuzzy'
      )
      if (_.isEmpty(destinationSearch)) {
        // No search results!
        message.channel.send('**WHOOPS:** Your destination system name didn\'t return any usable results!')
        return
      } else {
        // Set the Destination system ID..
        var destinationID = destinationSearch['solar_system'].shift()
        // Grab the full system info from ESI.
        let destinationSystem = await esi.getSystemInfo(destinationID)
        // Setup some variables!
        var destinationName = destinationSystem.name
      }
      if (
        // 'Synonyms' for a 'prefer safer' route search.
        flag === 'safer' ||
        flag === 'safe' ||
        flag === 'safest' ||
        flag === 'highonly' ||
        flag === 'high' ||
        flag === 'prefersafer' ||
        flag === 'secure'
      ) {
        flag = 'secure'
        var flagDesc = 'Prefer more secure:'
      } else if (
        // 'Synonyms' for a 'prefer less secure' route search.
        flag === 'unsafe' ||
        flag === 'dangerous' ||
        flag === 'lowonly' ||
        flag === 'nohigh' ||
        flag === 'preferlesssecure' ||
        flag === 'insecure'
      ) {
        flag = 'insecure'
        flagDesc = 'Prefer less secure:'
      } else if (
        // 'synonyms' for a 'prefer shorter' route search.
        flag === 'all' ||
        flag === 'short' ||
        flag === 'shortest' ||
        flag === 'shorter'
      ) {
        flag = 'shortest'
        flagDesc = 'Prefer shorter:'
      } else {
        message.channel.send('**WHOOPS:** Your routing flag wasn\'t understood. Acceptable values include \'secure\', \'insecure\' and \'shortest\'.')
        return
      }
      // We're gonna throw an error here if we're missing any of the three parts.
      if (typeof originID === 'undefined' || typeof destinationID === 'undefined' || typeof flag === 'undefined') {
        message.channel.send('**WHOOPS:** You mangled it. I didn\'t understand your origin, destination and/or routing flag.')
      } else if (originID === destinationID) {
        message.channel.send('**WHOOPS:** I don\'t know what kinda shenanigans you\'re trying to pull - the answer to your request is clearly 0 jumps.')
      } else {
        // Lookup a route plan from ESI using the selected options.
        let routePlan = await esi.getRoutePlan(originID, destinationID, flag)
        // Count the number of system IDs in the route and remove the origin system ID to get a jumps count.
        if (typeof routePlan === 'undefined') {
          message.channel.send('**WHOOPS:** ESI is unable to route between those systems! :exploding_head: :cry:.')
        } else {
          var jumps = routePlan.length - 1
          var jumpSuffix
          // Handle jump suffix based on the number of jumps.
          if (jumps === 1) {
            jumpSuffix = 'jump'
          } else {
            jumpSuffix = 'jumps'
          }
          // Build a dotlan link for the route.
          // Construct our final output message.
          var messageText = `**ROUTE:** *${flagDesc}* **${originName}** ⇆ **${destinationName}** = **${jumps} ${jumpSuffix}**.`
          message.channel.send(messageText)
        }
      }
    }
  }
}
