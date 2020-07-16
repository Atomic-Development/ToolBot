/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
function round (value, precision) {
  var multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
};
function between (num, min, max) {
  return num >= min && num <= max
}
exports.round = round
exports.between = between
