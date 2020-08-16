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
      var systemSearch = await sdeSolarSystems.find(systemData => systemData.solarSystemName = system)
      if (typeof systemSearch === 'undefined') {
        var systemSearch = await esi.getSearchResults(
          system,
          'solar_system',
          'fuzzy'
        )
        systemID = systemSearch['solar_system'].shift()
        systemInfo = sdeSolarSystems.find(systemData => systemData.solarSystemID = systemID)
      } else {
        systemID = systemSearch.solarSystemID
        systemInfo = systemSearch
      }
      if (_.isEmpty(systemSearch)) {
        // No search results!
        message.channel.send("**WHOOPS:** That system name didn't return any usable results!")
      } else {
        // console.log("Search result(s):", systemSearch);
        let systemName = systemInfo.solarSystemName
        // console.log("System Name:", systemName);
        let systemConstellationID = systemInfo.constellationID
        let systemConstellationInfo = await sdeConstellations.find(constellationData => constellationData.constellationID = systemConstellationID)
        // console.log("System Constellation Info", systemConstellationInfo);
        let systemConstellationName = systemConstellationInfo.constellationName
        // console.log("System Constellation Name:", systemConstellationName);
        let systemRegionID = systemConstellationInfo.regionID
        let systemRegionInfo = await sdeRegions.find(regionData => regionData.regionID = systemRegionID)
        // console.log("System Region Info:", systemRegionInfo);
        let systemRegionName = systemRegionInfo.regionName
        // console.log("System Region Name:", systemRegionName);
        let systemFactionID = systemInfo.factionID
        let systemSecurity = round(systemInfo.security, 1)
        let securityClass = systemInfo.securityClass
        let secLevel = setSystemSecurity(systemSecurity, securityClass)
        // console.log("Security Level:", secLevel);
        let trueSec = round(systemInfo.security, 5)
        // console.log("Security Status:", systemSecurity);
        let allSystemKills = await esi.getAllSystemKills()
        // console.log("All System Kills", allSystemKills);
        let systemKills = await esi.getSystemKills(systemID, allSystemKills)
        // console.log("System Kills:", systemKills);
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
        let faction
        if (secLevel !== 'Wormhole') {
          if (_.isEmpty(systemKillsObject)) {
            systemNPCKills = 'err'
            // console.log("NPC Kills:", systemNPCKills);
            systemPodKills = 'err'
            // console.log("Pod Kills:", systemPodKills);
            systemShipKills = 'err'
          } else {
            systemNPCKills = systemKillsObject['npc_kills']
            // console.log("NPC Kills:", systemNPCKills);
            systemPodKills = systemKillsObject['pod_kills']
            // console.log("Pod Kills:", systemPodKills);
            systemShipKills = systemKillsObject['ship_kills']
            // console.log("Ship Kills:", systemShipKills);
          }
          let allSystemJumps = await esi.getAllSystemJumps()
          // console.log("All System Jumps:", allSystemJumps);
          let systemJumpsAPI = await esi.getSystemJumps(systemID, allSystemJumps)
          let systemJumpsObject = systemJumpsAPI.shift()
          let factionInfo = sdeFactions.find(factionData => factionData.factionID = systemFactionID)
          faction = factionInfo.factionName
          systemJumps = systemJumpsObject['ship_jumps']
          systemImage = `${}`
        } else {
          systemImage = 'https://wiki.eveuniversity.org/images/e/e0/Systems.png'
        }
        if (secLevel === 'Wormhole') {
          var systemAnoikisLink = makeAnoikisLink(systemName)
          var anoikisLinked = `[Anoikis](${systemAnoikisLink})`
        }
        let systemInfoMessage = new Discord.MessageEmbed()
          .setColor('#ffa500')
          .setTitle(systemName)
          .setDescription(`System information from ESI for ${systemName}.`)
          // .setImage(systemImage)
          .setThumbnail(systemImage)
          .setURL(systemDotlanLink)
          .addField('Security Level', `${systemSecurity} (${secLevel})`, true)
          .addField('True Security', `${trueSec}`, true)
          .addField('Region', regionNameLinked, true)
          .addField('Constellation', `${systemConstellationName}`, true)
          .addField('Faction', `${faction}`, true)
          .addField('ZKillBoard', `${zkillboardLinked}`, true)
          .addField('EVE Prism', `${evePrismLinked}`, true)
        if (secLevel !== 'Wormhole') {
          systemInfoMessage.addField('Jumps (1hr)', `${systemJumps}`, true)
            .addField('Ship Kills (1hr)', `${systemShipKills}`, true)
            .addField('Pod Kills (1hr)', `${systemPodKills}`, true)
            .addField('NPC Kills (1hr)', `${systemNPCKills}`, true)
        } else {
          systemInfoMessage.addField('Anoik.is Link', anoikisLinked, true)
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
  let page = `system/${ID}`
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
  let eplink = `${evePrismURL}`/`${page}`
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
  let page = `${type}/${ID}`
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
    if (typeof securityClass === 'undefined') {
      secLevel = 'Wormhole'
    } else {
      secLevel = 'Null'
    }
  }
  return secLevel
}
