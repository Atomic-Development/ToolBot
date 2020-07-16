/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const got = require('got')
const { epurl } = require('../config.json')
async function getEvePraisal (market, search) {
  let fullURL = `${epurl}/?market=${market}&raw_textarea=${search}`
  try {
    const response = await got.post(fullURL, {
      responseType: 'json'
    })
    return response.body
  } catch (error) {
    console.log(error.response.body)
  }
}
module.exports = getEvePraisal
