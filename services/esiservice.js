/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const esiJS = require('esijs')
const _ = require('underscore')
/**
 * Queries ESI for search results.
 * @param {string} searchTerm - The name of a type to search for.
 * @param {string} searchEndpoint - The resource to search for. Example 'solar_system'.
 * @param {string} searchType - The type of search to perform. Allowed values are 'fuzzy' or 'strict'.
 * @return {promise} - A promise object that represents the search result.
 */
function getSearchResults (searchTerm, searchEndpoint, searchType) {
  switch (searchType) {
    case 'fuzzy':
      searchType = false
      break
    case 'strict':
      searchType = true
      break
  }
  return new Promise((resolve, reject) => {
    const searchResult = esiJS.search.search(
      searchTerm,
      searchEndpoint,
      searchType)
      .catch(function (e) {
        reject(e)
      })
    resolve(searchResult)
  })
}
/**
 * Looks up information for a constellation with ESI.
 * @param {number} constellationID - The constellation ID to return information for.
 * @return {promise} - A promise object that represents the constellation information.
 */
function getConstellationInfo (constellationID) {
  return new Promise((resolve, reject) => {
    let constellationInfo = esiJS.universe.constellations
      .constellationInfo(constellationID)
      .catch(function (e) {
        reject(e)
      })
    resolve(constellationInfo)
  })
}
/**
 * Looks up information for a region with ESI.
 * @param {number} regionID - The region ID to return information for.
 * @return {promise} - A promise object that represents the region information.
 */
function getRegionInfo (regionID) {
  return new Promise((resolve, reject) => {
    let regionInfo = esiJS.universe.regions
      .regionInfo(regionID)
      .catch(function (e) {
        reject(e)
      })
    resolve(regionInfo)
  })
}
/**
 * Looks up a route plan between two systems with ESI.
 * @param {number} origin - The ID for the origin system.
 * @param {number} destination - The ID for the destination system.
 * @param {string} flag - The routing flag to determine how the route plan is calculated. Acceptable values are 'secure', 'insecure' or 'shortest'.
 * @return {promise} - A promise object that represents the route plan.
 */
function getRoutePlan (origin, destination, flag, avoids) {
  return new Promise((resolve, reject) => {
    var routePlan
    if (!avoids) {
      routePlan = esiJS.routes
        .planRoute(origin, destination, flag)
        .catch(function (e) {
          reject(e)
        })
    } else {
      routePlan = esiJS.routes
        .planRoute(origin, destination, flag, avoids)
        .catch(function (e) {
          reject(e)
        })
    }
    resolve(routePlan)
  })
}
/**
 * Looks up information for a system with ESI.
 * @param {number} systemID - The region ID to return information for.
 * @return {promise} - A promise object that represents the system information.
 */
function getSystemInfo (systemID) {
  return new Promise((resolve, reject) => {
    let systemInfo = esiJS.universe.systems
      .systemInfo(systemID)
      .catch(function (e) {
        reject(e)
      })
    resolve(systemInfo)
  })
}
/**
 * Looks up information on all system jumps in the past hour with ESI.
 * @return {promise} - A promise object that represents the jumps information.
 */
function getAllSystemJumps () {
  return new Promise((resolve, reject) => {
    let allSystemJumps = esiJS.universe.systems
      .systemJumps()
      .catch(function (e) {
        reject(e)
      })
    resolve(allSystemJumps)
  })
}
/**
 * Looks up information on a system's jumps in the past hour.
 * @param {number} systemID - The system ID to find jump information for.
 * @param {object} allSystemJumps - An object containing the output of getAllSystemJumps ().
 * @return {promise} - A promise string that represents the jump information for the system.
 */
function getSystemJumps (systemID, allSystemJumps) {
  return new Promise((resolve, reject) => {
    let systemJumps = _.where(allSystemJumps, { system_id: systemID })
    resolve(systemJumps)
  })
};
/**
 * Looks up information on all system kills in the past hour with ESI.
 * @return {promise} - A promise object that represents the kills information.
 */
function getAllSystemKills () {
  return new Promise((resolve, reject) => {
    let allSystemKills = esiJS.universe.systems
      .systemKills()
      .catch(function (e) {
        reject(e)
      })
    resolve(allSystemKills)
  })
};
/**
 * Looks up information on a system's kills in the past hour.
 * @param {number} systemID - The system ID to find kill information for.
 * @param {object} allSystemKills - An object containing the output of getAllSystemKills ().
 * @return {promise} - A promise string that represents the kill information for the system.
 */
function getSystemKills (systemID, allSystemKills) {
  return new Promise((resolve, reject) => {
    let systemKills = _.where(allSystemKills, { system_id: systemID })
    resolve(systemKills)
  })
};

exports.getConstellationInfo = getConstellationInfo
exports.getRegionInfo = getRegionInfo
exports.getRoutePlan = getRoutePlan
exports.getSearchResults = getSearchResults
exports.getSystemInfo = getSystemInfo
exports.getAllSystemJumps = getAllSystemJumps
exports.getSystemJumps = getSystemJumps
exports.getAllSystemKills = getAllSystemKills
exports.getSystemKills = getSystemKills
