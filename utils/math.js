/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Rounds a given number to the specified precision.
 * @param {number} value - The number to round.
 * @param {number} precision - The number of decimal places to round it to.
 * @returns {number} - The rounded number.
 */
function round (value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}
/**
 * Checks if a number falls within a given range.
 * @param {number} num - The number to test.
 * @param {number} min - The lower-bound of the range.
 * @param {number} max - The upper-bound of the range.
 * @return {boolean} - True or false depending on the input and range.
 */
function between (num, min, max) {
  return num >= min && num <= max
}

exports.round = round
exports.between = between
