/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
/**
 * Checks if a specific key exists in an array, object or array of object
 * @param {string} key - The key to search for.
 * @param {object} search - The array to search within.
 * @return {boolean} - True/False based on search results.
 */
function keyExists(key, search) {
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
      return false;
  }
  for (var i = 0; i < search.length; i++) {
      if (search[i] === key) {
          return true;
      }
  }
  return key in search;
}

exports.keyExists = keyExists