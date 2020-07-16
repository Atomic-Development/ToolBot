/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const esiJS = require('esijs')
const _ = require('underscore')
// Function to perform searches against ESI.
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
};
// Function to get constellation info from ESI.
function getConstellationInfo (constellationID) {
  return new Promise((resolve, reject) => {
    let constellationInfo = esiJS.universe.constellations
      .constellationInfo(constellationID)
      .catch(function (e) {
        reject(e)
      })
    resolve(constellationInfo)
  })
};
// Function to get region info from ESI.
function getRegionInfo (regionID) {
  return new Promise((resolve, reject) => {
    let regionInfo = esiJS.universe.regions
      .regionInfo(regionID)
      .catch(function (e) {
        reject(e)
      })
    resolve(regionInfo)
  })
};
// Function to get a route plan from ESI.
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
};
// Function to get system information from ESI.
function getSystemInfo (systemID) {
  return new Promise((resolve, reject) => {
    let systemInfo = esiJS.universe.systems
      .systemInfo(systemID)
      .catch(function (e) {
        reject(e)
      })
    resolve(systemInfo)
  })
};
// Function to get all system jump counts from ESI.
function getAllSystemJumps () {
  return new Promise((resolve, reject) => {
    let allSystemJumps = esiJS.universe.systems
      .systemJumps()
      .catch(function (e) {
        reject(e)
      })
    resolve(allSystemJumps)
  })
};
// Function to search all system kills for a specific system's results.
function getSystemJumps (systemID, allSystemJumps) {
  return new Promise((resolve, reject) => {
    let systemJumps = _.where(allSystemJumps, { system_id: systemID })
    resolve(systemJumps)
  })
};
// Function to get a listing of all system kills
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
// Function to search all system kills for a specfic system's results.
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
