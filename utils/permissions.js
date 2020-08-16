/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const _ = require('underscore')
const env = require('env-var')
const administrators = env.get('ADMINISTRATORS').asJsonArray()
const banned = env.get('BANNED').asJsonArray()
/**
 * Checks if the specified user ID exists in the administrators config array.
 * @param {number} id - The user's Discord ID.
 * @return {boolean} - True or false depending on the input ID and config value.
 */
function checkAdministrator (id) {
  if (_.isEmpty(administrators)) {
    return false
  } else {
    if (_.includes(administrators, id)) {
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
  if (_.isEmpty(banned)) {
    return false
  } else {
    if (_.includes(banned, id)) {
      return true
    } else {
      return false
    }
  }
}

exports.checkAdministrator = checkAdministrator
exports.checkBanned = checkBanned
