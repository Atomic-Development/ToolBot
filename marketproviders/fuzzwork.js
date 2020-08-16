/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const got = require('got')
const { priceFormat } = require('../utils/strings')
const moment = require('moment')
const _ = require('underscore')
const { keyExists } = require('../utils/collections')
const env = require('env-var')
const fwMarketURL = env.get('FWMARKETURL').asString()
const eveImages = env.get('EVEIMAGES').asString()
/**
 * Collates information from Fuzzwork's API into an object.
 * @param {string} location - The location/market to lookup pricing in.
 * @param {number} itemType - The ID of the item/type to get information for.
 * @return {object} - The collected item/pricing information.
 */
async function fuzzworkLookup (location, itemType) {
  let marketSearchResults
  var itemTypeID = itemType.typeID
  var itemName = itemType.typeName
  let locationObject = fuzzworkLocationChecker(location)
  let locationID = locationObject.id
  let locationName = locationObject.name
  var marketData = await fuzzworkGetItemPrices(locationID, itemTypeID)
  if (typeof marketData === 'undefined') {
    marketSearchResults = {
      'status': 'error',
      'errorMsg': '**WHOOPS:** An unknown error occured. Please contact Atomic Development on Discord: https://discord.gg/uwdsKW.',
      'source': 'EVE Tools'
    }
  } else if (keyExists('message', marketData)) {
    marketSearchResults = {
      'status': 'error',
      'errormsg': `${marketData.message}`,
      'source': 'Fuzzwork'
    }
    return marketSearchResults
  }
  let itemData = marketData[itemTypeID]
  let buyPrices = itemData.buy
  let sellPrices = itemData.sell
  let imageURL = `${eveImages}/types/${itemTypeID}/icon`
  let link = `[Fuzzwork](https://www.fuzzwork.co.uk/info/?typeid=${itemTypeID})`
  let updatedFormatted = moment().format('dddd, Do MMMM YYYY, H:mm')
  marketSearchResults = {
    'status': 'ok',
    'itemName': itemName,
    'marketName': locationName,
    'typeID': itemTypeID,
    'buyMax': priceFormat(buyPrices.max),
    'buyPer': priceFormat(buyPrices.percentile),
    'sellMin': priceFormat(sellPrices.min),
    'sellPer': priceFormat(sellPrices.percentile),
    'imageURL': imageURL,
    'link': link,
    'provider': 'Fuzzwork',
    'updated': updatedFormatted
  }
  return marketSearchResults
}
/**
 * Checks that the location provided is acceptable to Fuzzwork.
 * @param {string} market - The name of the market to check.
 * @return {object} - An object containing the ID and name of the market/location on Fuzzwork.
 */
function fuzzworkLocationChecker (market) {
  let region = {}
  switch (market) {
    case 'jita':
      region['id'] = '30000142'
      region['name'] = 'Jita'
      break
    case 'perimeter':
      region['id'] = '30000144'
      region['name'] = 'Perimeter'
      break
    case 'amarr':
      region['id'] = '60008494'
      region['name'] = 'Amarr'
      break
    case 'dodixie':
      region['id'] = '60004588'
      region['name'] = 'Dodixie'
      break
    case 'rens':
      region['id'] = '60004588'
      region['name'] = 'Rens'
      break
    case 'hek':
      region['id'] = '60005686'
      region['name'] = 'Hek'
      break
    default:
      region['id'] = '0'
      region['name'] = 'Universe'
      break
  }
  return region
}
/**
 * Performs a lookup against Fuzzwork's price database.
 * @param {number} itemTypeID - The ID of the item/type to get pricing for.
 * @return {object} - The collected item/pricing information.
 */
async function fuzzworkGetItemPrices (regionID, typeID) {
  let fullURL = `${fwMarketURL}/?region=${regionID}&types=${typeID}`
  try {
    const response = await got.get(fullURL, {
      responseType: 'json'
    }) 
    return response.body
  } catch (error) {
    console.log(error.response.body)
  }
}

exports.fuzzworkLookup = fuzzworkLookup
