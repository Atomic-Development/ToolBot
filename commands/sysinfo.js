/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const env = require('env-var')
const imagesURL = env.get('EVEIMAGES').asString()
const alias = require('../utils/systemaliases')
const esi = require('../services/esiservice')
const { round, between } = require('../utils/math')
const Discord = require('discord.js')
const _ = require('underscore')
const sdeSolarSystems = require('../sde/solarSystems.json')
const sdeConstellations = require('../sde/constellations.json')
const sdeRegions = require('../sde/regions.json')
const sdeFactions = require('../sde/factions.json')

module.exports = {
  name: 'sysinfo',
  description: 'Provides information on a given system name.',
  aliases: ['systeminfo'],
  usage: '[systemname]',
  cooldown: 5,
  /**
   * Provides information on a solar system.
   * @param {object} client - An object containing the Discord client information.
   * @param {object} message - An object containing the message the bot is reponding to.
   * @param {array} args - An array containing the parsed arguments for the command.
   * @return {null}
   */
  async run (client, message, args) {
    if (typeof args[0] === 'undefined') {
      message.channel.send('**WHOOPS:** You mangled it. You need to pass a system name.')
    } else if (typeof args[1] !== 'undefined') {
      message.channel.send('**WHOOPS:** This command only accepts a single system name as an argument! You may need to use quotes if the system name has spaces')
    } else {
      var system = args[0]
      if (typeof system !== 'undefined') {
        system = alias.systemChecker(system)
      }
      var systemID
      var systemSearchRegex = new RegExp(`^${system}`, "i")
      var systemSearch = await _.find(sdeSolarSystems, function (systemData) { return systemSearchRegex.exec(systemData.solarSystemName)})
      if (typeof systemSearch === 'undefined') {
        var systemSearch = await esi.getSearchResults(
          system,
          'solar_system',
          'fuzzy'
        )
        systemID = systemSearch['solar_system'].shift()
        systemInfo = _.find(sdeSolarSystems, function (systemData) { return systemData.solarSystemID === systemID })
      } else {
        systemID = systemSearch.solarSystemID
        systemInfo = systemSearch
      }
      if (_.isEmpty(systemSearch)) {
        // No search results!
        message.channel.send("**WHOOPS:** That system name didn't return any usable results!")
      } else {
        let systemName = systemInfo.solarSystemName
        let systemConstellationID = systemInfo.constellationID
        let systemConstellationInfo = await _.find(sdeConstellations, function (constellationData) { return constellationData.constellationID === systemConstellationID })
        let systemConstellationName = systemConstellationInfo.constellationName
        let systemRegionID = systemConstellationInfo.regionID
        let systemRegionInfo = await _.find(sdeRegions, function (regionData) { return regionData.regionID === systemRegionID })
        let systemRegionName = systemRegionInfo.regionName
        let systemFactionID = systemInfo.factionID
        let systemSecurity = round(systemInfo.security, 1)
        let securityClass = systemInfo.securityClass
        let secLevel = setSystemSecurity(systemSecurity, securityClass)
        let trueSec = round(systemInfo.security, 5)
        let allSystemKills = await esi.getAllSystemKills()
        let systemKills = await esi.getSystemKills(systemID, allSystemKills)
        let systemKillsObject = systemKills.shift()
        let systemDotlanLink = makeDotlanLink(systemID, 'system')
        let regionDotlanLink = makeDotlanLink(systemRegionID, 'region')
        let systemEvePrismLink = makeEvePrismLink(systemID)
        let evePrismLinked = `[EVE Prism](${systemEvePrismLink})`
        let regionNameLinked = `[${systemRegionName}](${regionDotlanLink})`
        let systemzKillboardLink = makeZkillboardLink(systemID)
        let zkillboardLinked = `[zKillBoard](${systemzKillboardLink})`
        let systemNPCKills
        let systemPodKills
        let systemShipKills
        let systemImage
        let systemJumps
        let systemLinks
        let faction
        if (secLevel !== 'Wormhole') {
          if (_.isEmpty(systemKillsObject)) {
            systemNPCKills = 'err'
            systemPodKills = 'err'
            systemShipKills = 'err'
          } else {
            systemNPCKills = systemKillsObject['npc_kills']
            systemPodKills = systemKillsObject['pod_kills']
            systemShipKills = systemKillsObject['ship_kills']
          }
          let allSystemJumps = await esi.getAllSystemJumps()
          let systemJumpsAPI = await esi.getSystemJumps(systemID, allSystemJumps)
          let systemJumpsObject = systemJumpsAPI.shift()
          let factionInfo = await _.find(sdeFactions, function (factionData) { return factionData.factionID === systemFactionID })
          faction = factionInfo.factionName
          systemJumps = systemJumpsObject['ship_jumps']
          systemImage = makeImageLink(factionInfo.factionID, 'corporations')
          systemLinks = `${zkillboardLinked} | ${evePrismLinked}`
        } else {
          category = getWormholeCategory(systemRegionName)
          systemImage = 'https://wiki.eveuniversity.org/images/e/e0/Systems.png'
          var systemAnoikisLink = makeAnoikisLink(systemName)
          var anoikisLinked = `[Anoikis](${systemAnoikisLink})`
          systemLinks = `${anoikisLinked} | ${zkillboardLinked} | ${evePrismLinked}`
        }
        let systemInfoMessage = new Discord.MessageEmbed()
          .setColor('#ffa500')
          .setTitle(systemName)
          .setThumbnail(systemImage)
          .setURL(systemDotlanLink)
          .addField('Security Level', `${systemSecurity} (${secLevel})`, true)
          .addField('True Security', `${trueSec}`, true)
          .addField('Region', regionNameLinked, true)
          .addField('Constellation', `${systemConstellationName}`, true)
          .addField('Links', `${systemLinks}`, true)
        if (secLevel !== 'Wormhole') {
          systemInfoMessage.addField('Faction', `${faction}`, true)
            .addField('Jumps (1hr)', `${systemJumps}`, true)
            .addField('Ship Kills (1hr)', `${systemShipKills}`, true)
            .addField('Pod Kills (1hr)', `${systemPodKills}`, true)
            .addField('NPC Kills (1hr)', `${systemNPCKills}`, true)
        } else {
          systemInfoMessage.addField('Category', `${category}`, true)
        }
        message.channel.send(systemInfoMessage)
      }
    }
  }
}
/**
 * Returns a dotlan link for a system or region.
 * @param {number} ID - The system or region ID to provide a link for.
 * @param {string} type - The type of the link. Acceptable values are 'system' or 'region'.
 * @return {string} - The link to the Dotlan page for the system or region.
 */
function makeDotlanLink (ID, type) {
  let dotlanUrl = 'https://evemaps.dotlan.net'
  let page = `${type}/${ID}`
  let dllink = `${dotlanUrl}/${page}`
  return dllink
}
/**
 * Returns a ZKillBoard link for a system.
 * @param {number} ID - The system ID to provide a link for.
 * @return {string} - The link to the ZKillBoard page for the system or region.
 */
function makeZkillboardLink (ID) {
  let zKillboardUrl = 'https://zkillboard.com'
  let page = `system/${ID}/`
  let zklink = `${zKillboardUrl}/${page}`
  return zklink
}
/**
 * Returns an Anoikis link for a wormhole system.
 * @param {number} ID - The wormhole system name to provide a link for.
 * @return {string} - The link to the Anoikis page for the wormhole.
 */
function makeAnoikisLink (name) {
  let anoikisUrl = 'http://anoik.is'
  let page = `systems/${name}`
  let aklink = `${anoikisUrl}/${page}`
  return aklink
}
/**
 * Returns an EVE Prism link for a system.
 * @param {string} name - The system name to provide a link for.
 * @return {string} - The link to the EVE Prism page for the system. 
 */
function makeEvePrismLink (name) {
  let evePrismURL = 'https://eve-prism.com'
  let page = `?view=system&name=${name}`
  let eplink = `${evePrismURL}/${page}`
  return eplink
}
/**
 * Returns an image for an ID.
 * @param {number} ID - The ID to provide an image for.
 * @param {string} type - The type of the link. Acceptable values are 'alliances', 'characters', 'corporations' or 'types'.
 * @return {string} - The link to the Dotlan page for the system or region.
 */
function makeImageLink (ID, type) {
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
  let dllink = `${dotlanUrl}/${page}`
  return dllink
}
/**
 * Returns a human-friendly security designation for a system.
 * @param {number} systemSecurity - The rounded system security value for the system.
 * @param {string} securityClass - The security class value/identifier for a system.
 * @return {string} - The link to the Anoikis page for the wormhole.
 */
function setSystemSecurity (systemSecurity, securityClass) {
  var secLevel
  if (systemSecurity > '0.5') {
    secLevel = 'High'
  } else if (between(systemSecurity, '0.1', '0.4')) {
    secLevel = 'Low'
  } else if (between(systemSecurity, '-1.0', '0.0')) {
    if (securityClass === null) {
      secLevel = 'Wormhole'
    } else {
      secLevel = 'Null'
    }
  }
  return secLevel
}

/**
 * Returns the Category of a wormhole system.
 * @param {string} regionName - The name of the region to get the category for.
 * @return {string} - The category for the WH. 
 */
function getWormholeCategory (regionName) {
  var wormholeCategory
  switch (regionName.charAt(0)) {
    case 'A':
      wormholeCategory === 'C1'
      break
    case 'B':
      wormholeCategory === 'C2'
      break
    case 'C':
      wormholeCategory === 'C3'
      break
    case 'D':
      wormholeCategory === 'C4'
      break
    case 'E':
      wormholeCategory === 'C5'
      break
    case 'F':
      wormholeCategory === 'C6'
      break
    case 'G':
      wormholeCategory === 'Thera'
      break
    case 'H':
      wormholeCategory === 'C13'
      break
    case 'K':
      wormholeCategory === 'Drifter'
      break
  }
  return wormholeCategory
} 