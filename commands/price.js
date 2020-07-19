/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const Discord = require('discord.js')
const { getTypebyName } = require('../services/typeid')
const { evemarketerLookup } = require('../marketproviders/evemarketer')
const { evepraisalLookup } = require('../marketproviders/evepraisal')
const { fuzzworkLookup } = require('../marketproviders/fuzzwork')
const _ = require('underscore')
module.exports = {
  name: 'price',
  description: 'Provides price information for an item in a given trade hub or location. Note that acceptable values for the location are: **Jita**, **Universe**, **Dodixie**, **Amarr**, **Hek** and **Rens**.',
  usage: '[location] [item]',
  cooldown: 5,
  /**v
   * Provides price information for an item, possibly restricted to a region.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  async run (client, message, args) {
    // First argument is which market provider to use.
    let provider = args[0]
    let providerNames = [
      'evepraisal',
      'ep',
      'evemarketer',
      'em',
      'fuzzwork',
      'fw'
    ]
    let needLocation = [
      'evepraisal',
      'ep',
      'fuzzwork',
      'fw'
    ]
    let search = args[1]
    let location = args[2]
    let marketLookup
    let providerName
    if (!provider || !search) {
      return message.channel.send('**WHOOPS:** You need to pass a provider and a search string (quoted if it has spaces!).')
    } else if (_.includes(needLocation, provider && !location)) {
      return message.channel.send('**WHOOPS:** The provider you\'re using requires a location parameter')
    } else {
      if (!_.includes(providerNames, provider)) {
        message.channel.send(`**WHOOPS:** Sorry, currently only the following market providers are supported: ${providerNames.toString()}. You can use either the full name or shorthand.`)
      }
      // Easter Egg!
      var itemType = await getTypebyName(search)
      if (itemType.typeID === '28848' && message.author.id === '426704588926615554') {
        return message.channel.send('Remember Jilo, fly a Rhea instead! Anshars suck.')
      }
      switch (provider) {
        case 'evepraisal':
        case 'ep':
          providerName = 'Evepraisal'
          marketLookup = await evepraisalLookup(location, itemType)
          break
        case 'evemarketer':
        case 'em':
          providerName = 'EVEMarketer'
          marketLookup = await evemarketerLookup(itemType)
          break
        case 'fuzzwork':
        case 'fw':
          providerName = 'Fuzzwork'
          marketLookup = await fuzzworkLookup(location, itemType)
          break
        default:
          marketLookup = await evemarketerLookup(itemType)
          break
      }
      console.log('Market Lookup:', marketLookup)
      if (_.contains(marketLookup, 'error')) {
        return message.channel.send(`**WHOOPS:** ${marketLookup.source} returned an error: \n> ${marketLookup.errorMsg}`)
      } else if (typeof marketLookup === 'undefined') {
        return message.channel.send('**WHOOPS:** An unknown error occured. Please [contact Atomic Development on Discord](https://discord.gg/uwdsKW).')
      } else {
        var systemInfoMessage = new Discord.MessageEmbed()
          .setColor('#3F704D')
          .setTitle(marketLookup.itemName)
          .setDescription(`Price/market information for ${marketLookup.itemName} in ${marketLookup.marketName}. Information comes from ${providerName}`)
          .setThumbnail(marketLookup.imageURL)
          .addField('Highest Buy', `${marketLookup.buyMax}`, true)
          .addField('98th Percentile Buy', `${marketLookup.buyPer}`, true)
          .addField('** **', '** **', true)
          .addField('Lowest Sell Price', `${marketLookup.sellMin}`, true)
          .addField('98th Percentile Sell', `${marketLookup.sellPer}`, true)
          .addField('** **', '** **', true)
          .addField('Links', `${marketLookup.link}`)
          .setFooter(`Price information was current at ${marketLookup.updated}.`)
        message.channel.send(systemInfoMessage)
      }
    }
  }
}
