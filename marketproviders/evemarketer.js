/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const got = require('got')
const { emURL, eveImages } = require('../config.json')
const { priceFormat } = require('../utils/strings')
const moment = require('moment')
const _ = require('underscore')
/**
 * Collates information from EVEMarketer's API into an object.
 * @param {number} itemType - The ID of the item/type to get information for.
 * @return {object} - The collected item/pricing information.
 */
async function evemarketerLookup (itemType) {
  let marketSearchResults
  var itemTypeID = itemType.typeID
  var itemName = itemType.typeName
  let result = await eveMarketerGetItemPrices(itemTypeID)
  if (_.includes(result, 'error_title')) {
    marketSearchResults = {
      'status': 'error',
      'errorMsg': `${result.error_title} - ${result.error_message}`,
      'source': 'EVEMarketer'
    }
    return marketSearchResults
  }
  console.log('Result:', result)
  let buyPrices = result[0].buy
  console.log('Buy:', buyPrices)
  let sellPrices = result[0].sell
  console.log('Sell:', sellPrices)
  let imageURL = `${eveImages}/types/${itemTypeID}/icon`
  let link = `[EveMarketer](https://evemarketer.com/types/${itemTypeID})`
  let updatedFormatted = moment.utc().format('dddd, Do MMMM YYYY, H:mm:ss')
  marketSearchResults = {
    'status': 'ok',
    'itemName': itemName,
    'marketName': 'N/A',
    'typeID': itemTypeID,
    'buyMax': priceFormat(buyPrices.max),
    'buyPer': priceFormat(buyPrices.fivePercent),
    'sellMin': priceFormat(sellPrices.min),
    'sellPer': priceFormat(sellPrices.fivePercent),
    'imageURL': imageURL,
    'link': link,
    'provider': 'EveMarketer',
    'updated': updatedFormatted
  }
  return marketSearchResults
}
/**
 * Performs a lookup against EVEMarketer's price database.
 * @param {number} itemTypeID - The ID of the item/type to get pricing for.
 * @return {object} - The collected item/pricing information.
 */
async function eveMarketerGetItemPrices (itemTypeID) {
  let fullURL = `${emURL}?typeid=${itemTypeID}`
  try {
    const response = await got.post(fullURL, {
      responseType: 'json'
    })
    return response.body
  } catch (error) {
    console.log(error.response.body)
  }
}

exports.evemarketerLookup = evemarketerLookup
