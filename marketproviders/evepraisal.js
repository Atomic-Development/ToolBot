/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const got = require('got')
const { priceFormat } = require('../utils/strings')
const _ = require('underscore')
const moment = require('moment')
const env = require('env-var')
const epItemURL = env.get('EPITEMURL').asString()
const eveImages = env.get('EVEIMAGES').asString()
/**
 * Collates information from Evepraisal's API into an object.
 * @param {string} market - The location/market to lookup pricing in.
 * @param {number} itemType - The ID of the item/type to get information for.
 * @return {object} - The collected item/pricing information.
 */
async function evepraisalLookup (market, itemType) {
  // Initialising empty variables to hold the objects later.
  let marketSearchResults
  let marketLookupResult
  var itemTypeID = itemType.typeID
  var itemName = itemType.typeName
  const result = await evepraisalGetItemPrices(itemTypeID)
  if (typeof result === 'undefined') {
    marketSearchResults = {
      'status': 'error',
      'errorMsg': '**WHOOPS:** An unknown error occured. Please contact Atomic Development on Discord: https://discord.gg/uwdsKW.',
      'source': 'EVE Tools'
    }
  } else if ('error_message' in result) {
    marketSearchResults = {
      'status': 'error',
      'errorMsg': `${result.error_title} - ${result.error_message}`,
      'source': 'Evepraisal'
    }
    return marketSearchResults
  } else {
    var summaries = result.summaries
    if (summaries !== null && _.contains(summaries[0], market)) {
      var marketData = summaries.find(data => data.market_name = market)
      if (typeof marketData === 'undefined' || marketData === null) {
        marketSearchResults = {
          'status': 'error',
          'errorMsg': 'Could not parse market data.',
          'source': 'EVE Tools'
        }
      } else {
        var marketName = marketData.market_display_name
        var prices = marketData.prices
        var buyPrices = prices.buy
        var sellPrices = prices.sell
        var imageURL = `${eveImages}/types/${itemTypeID}/icon`
        var link = `[Evepraisal](https://evepraisal.com/item/${itemTypeID})`
        var updated = prices.updated
        var updatedFormatted = moment.utc(updated).format('dddd, Do MMMM YYYY, H:mm:ss')
        marketSearchResults = {
          'status': 'ok'
        }
        marketLookupResult = {
          'itemName': itemName,
          'marketName': marketName,
          'typeID': itemTypeID,
          'buyMax': priceFormat(buyPrices.max),
          'buyPer': priceFormat(buyPrices.percentile),
          'sellMin': priceFormat(sellPrices.min),
          'sellPer': priceFormat(sellPrices.percentile),
          'imageURL': imageURL,
          'link': link,
          'provider': 'Evepraisal',
          'updated': updatedFormatted
        }
      }
    } else {
      marketSearchResults = {
        'status': 'error',
        'errorMsg': `Could not find prices for market ${market} or could not find item.`,
        'source': 'EVE Tools'
      }
    }
  }
  if (!_.isEmpty(marketLookupResult)) {
    Object.assign(marketSearchResults, marketLookupResult)
  }
  return marketSearchResults
}
/**
 * Performs a lookup against Evepraisal's price database.
 * @param {number} itemTypeID - The ID of the item/type to get pricing for.
 * @return {object} - The collected item/pricing information.
 */
async function evepraisalGetItemPrices (itemTypeID) {
  let fullURL = `${epItemURL}/${itemTypeID}.json`
  try {
    const response = await got.get(fullURL, {
      responseType: 'json'
    })
    return response.body
  } catch (error) {
    client.logger.log('error',error.response.body)
  }
}
/**
* This was the original Evepraisal lookup function. However the json file method in evepraisalGetItemPrices() is faster for us and for Evepraisal.
* If, at any point in the future, we re-add this function we'll need to re-require the epAppraisalURL config parameter.
*
* async function evepraisalAPICall (market, search) {
*   let fullURL = `${epAppraisalURL}/?market=${market}&raw_textarea=${search}&persist=no`
*   try {
*     const response = await got.post(fullURL, {
*       responseType: 'json'
*     })
*     return response.body
*   } catch (error) {
*     client.logger.log('error',error.response.body)
*   }
* }
*/

exports.evepraisalLookup = evepraisalLookup
