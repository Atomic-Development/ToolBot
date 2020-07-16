/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const Discord = require('discord.js')
const getEvePraisal = require('../services/evepraisal')
const imgUrlBase = 'https://imageserver.eveonline.com/Type/'
const numeral = require('numeral')
const moment = require('moment')

exports.run = async (client, message, args) => {
  // Location type is always the first item.
  var market = args[0]
  // Location name is the second item.
  var search = args[1]

  if (!market || !search) {
    message.channel.send('Whoops, you mangled it. You need to pass a market to check and a search string (quoted if it has spaces!).')
  } else {
    // Create an EVEPraisal
    var marketLower = market.toLowerCase()
    var searchLower = search.toLowerCase()
    let evePraisal = await getEvePraisal(marketLower, searchLower)
    // console.log("EvePraisal result:", evePraisal);
    var appraisalID = evePraisal.appraisal.id
    // console.log("Appraisal ID:", appraisalID);
    var epItems = evePraisal.appraisal.items.shift()
    console.log('Items Object;', epItems)
    var itemName = epItems.typeName
    var marketName = evePraisal.appraisal.market_name
    var pricesObject = epItems.prices
    var buyPrices = pricesObject.buy
    var sellPrices = pricesObject.sell
    // console.log("Buy Prices :", buyPrices);
    // console.log("Sell Prices;", sellPrices);
    var buyMax = buyPrices.max
    var buyMaxFormatted = numeral(buyMax).format('0,0')
    var buyMaxString = `${buyMaxFormatted} ISK`
    var buyPer = buyPrices.percentile
    var buyPerFormatted = numeral(buyPer).format('0,0')
    var buyPerString = `${buyPerFormatted} ISK`
    var sellMin = sellPrices.min
    var sellMinFormatted = numeral(sellMin).format('0,0')
    var sellMinString = `${sellMinFormatted} ISK`
    var sellPer = sellPrices.percentile
    var sellPerFormatted = numeral(sellPer).format('0,0')
    var sellPerString = `${sellPerFormatted} ISK`
    var itemTypeID = epItems.typeID
    var imageFile = `${itemTypeID}_128.png`
    var imageURL = `${imgUrlBase}/${imageFile}`

    var pricesUpdated = pricesObject.updated
    var prettyUpdatedDate = moment(pricesUpdated).format('dddd, Do MMMM YYYY, H:mm:ss')

    var evePraisalLink = `https://evepraisal.com/a/${appraisalID}`

    var systemInfoMessage = new Discord.MessageEmbed()
      .setColor('#3F704D')
      .setTitle(itemName)
      .setDescription(`Price/market information for ${itemName} in ${marketName}.`)
      .setThumbnail(imageURL)
      .addField('Highest Buy', `${buyMaxString}`, true)
      .addField('98th Percentile Buy', `${buyPerString}`, true)
      .addField('** **', '** **', true)
      .addField('Lowest Sell Price', `${sellMinString}`, true)
      .addField('98th Percentile Sell', `${sellPerString}`, true)
      .addField('** **', '** **', true)
      .addField('Evepraisal Link', evePraisalLink)
      .setFooter(`Prices were last updated ${prettyUpdatedDate}.`)
    message.channel.send(systemInfoMessage)
  }
}
