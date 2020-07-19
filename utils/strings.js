/**
 * Copyright (c) EVE University. All rights reserved.
 * Licensed under the MIT License.
 */
const numeral = require('numeral')
/**
 * Formats a number as a price in ISK.
 * @param {number} price - The price to format.
 * @return {string} - The formatted string (price + ISK).
 */
function priceFormat (price) {
  price = numeral(price).format('0,0.0')
  return `${price} ISK`
}

exports.priceFormat = priceFormat
