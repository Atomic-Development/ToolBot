/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const config = require('../config.json')
const _ = require('underscore')
/**
 * Checks if the specified user ID exists in the administrators config array.
 * @param {number} id - The user's Discord ID.
 * @return {boolean} - True or false depending on the input ID and config value.
 */
function checkAdministrator (id) {
  if (_.isEmpty(config.administrators)) {
    return false
  } else {
    if (_.includes(config.administrators, id)) {
      return true
    } else {
      return false
    }
  }
}
/**
 * Checks if the specified user ID exists in the banned config array.
 * @param {number} id - The user's Discord ID.
 * @return {boolean} - True or false depending on the input ID and config value.
 */
function checkBanned (id) {
  if (_.isEmpty(config.banned)) {
    return false
  } else {
    if (_.includes(config.banned, id)) {
      return true
    } else {
      return false
    }
  }
}

exports.checkAdministrator = checkAdministrator
exports.checkBanned = checkBanned
