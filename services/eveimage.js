/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const env = require('env-var')
const eveImageUrl = env.get('EVEIMAGEURL').asString()
/**
 * Returns an image for an ID.
 * @param {number} ID - The ID to provide an image for.
 * @param {string} type - The type of the link. Acceptable values are 'alliances', 'characters', 'corporations' or 'types'.
 * @return {string} - The link to the Dotlan page for the system or region.
 */
async function getEVEImageURL (ID, type) {
  switch (type) {
    case 'alliances':
    case 'corporations':
      resource = 'logo'
      break
    case 'characters':
      resource = 'portrait'
      break
    case 'types':
      resource = 'icon'
      break
  }
  let page = `${type}/${ID}/${resource}`
  let imageLink = `${eveImageUrl}/${page}`
  return imageLink
}

exports.getEVEImageURL = getEVEImageURL
