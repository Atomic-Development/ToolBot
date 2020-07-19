/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const alias = require('../utils/systemaliases')
const esi = require('../services/esiservice')
const { round, between } = require('../utils/math')
const Discord = require('discord.js')
const got = require('got')
const parser = require('cheerio')
const tabletojson = require('tabletojson').Tabletojson
const _ = require('underscore')

module.exports = {
  name: 'info',
  description: 'Provides information on a given system name.',
  aliases: ['sysinfo'],
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
      var systemSearch = await esi.getSearchResults(
        system,
        'solar_system',
        'fuzzy'
      )
      if (_.isEmpty(systemSearch)) {
        // No search results!
        message.channel.send("**WHOOPS:** That system name didn't return any usable results!")
      } else {
        // console.log("Search result(s):", systemSearch);
        let systemID = systemSearch['solar_system'].shift()
        let systemInfo = await esi.getSystemInfo(systemID)
        // console.log("System Information:", systemInfo);
        let systemName = systemInfo.name
        // console.log("System Name:", systemName);
        let systemConstellationID = systemInfo.constellation_id
        let systemConstellationInfo = await esi.getConstellationInfo(systemConstellationID)
        // console.log("System Constellation Info", systemConstellationInfo);
        let systemConstellationName = systemConstellationInfo.name
        // console.log("System Constellation Name:", systemConstellationName);
        let systemRegionID = systemConstellationInfo.region_id
        let systemRegionInfo = await esi.getRegionInfo(systemRegionID)
        // console.log("System Region Info:", systemRegionInfo);
        let systemRegionName = systemRegionInfo.name
        // console.log("System Region Name:", systemRegionName);
        let systemSecurity = round(systemInfo['security_status'], 1)
        let securityClass = systemInfo['security_class']
        let secLevel = setSystemSecurity(systemSecurity, securityClass)
        // console.log("Security Level:", secLevel);
        let trueSec = round(systemInfo['security_status'], 5)
        // console.log("Security Status:", systemSecurity);
        let allSystemKills = await esi.getAllSystemKills()
        // console.log("All System Kills", allSystemKills);
        let systemKills = await esi.getSystemKills(systemID, allSystemKills)
        // console.log("System Kills:", systemKills);
        let systemKillsObject = systemKills.shift()
        let systemDotlanLink = makeDotlanLink(systemID, 'system')
        let regionDotlanLink = makeDotlanLink(systemRegionID, 'region')
        let regionNameLinked = `[${systemRegionName}](${regionDotlanLink})`
        let systemzKillboardLink = makeZkillboardLink(systemID)
        let zkillboardLinked = `[zKillBoard](${systemzKillboardLink})`
        let dotlanScrape = await got.get(systemDotlanLink)
        // console.log("Scraper result:", dotlanScrape);
        let dotlanParser = parser.load(dotlanScrape, { xmlMode: true })
        // console.log("Parser result:", dotlanParser);

        let jsonTable = await tabletojson.convertUrl(systemDotlanLink)
        // console.log("Parsed table", jsonTable);
        let systemNPCKills
        let systemPodKills
        let systemShipKills
        let systemImage
        let systemJumps
        let pirates
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
          systemJumps = systemJumpsObject['ship_jumps']
          // console.log("System Jumps:", systemJumps);
          var dayJumps = jsonTable[1][0][7]
          var dayShipKills = jsonTable[1][1][7]
          var dayNPCKills = jsonTable[1][2][7]
          var dayPodKills = jsonTable[1][3][7]
          systemImage = dotlanParser('link[rel=image_src]').attr('href')
          // console.log("System image", systemImage);
          pirates = jsonTable[1][4][4]
        } else {
          systemImage = 'https://wiki.eveuniversity.org/images/e/e0/Systems.png'
          // console.log("System image", systemImage);
          pirates = 'Sleepers'
        }
        if (secLevel === 'Wormhole') {
          var systemAnoikisLink = makeAnoikisLink(systemName)
          var anoikisLinked = `[Anoikis](${systemAnoikisLink})`
        }
        let faction = jsonTable[1][4][2]
        // console.log(jsonTable)
        let minerals = jsonTable[1][5][2]
        let systemInfoMessage = new Discord.MessageEmbed()
          .setColor('#ffa500')
          .setTitle(systemName)
          .setDescription(`System information from ESI and DotLAN for ${systemName}. See detailed/more accurate kill information on ${zkillboardLinked}`)
          // .setImage(systemImage)
          .setThumbnail(systemImage)
          .setURL(systemDotlanLink)
          .addField('Security Level', `${systemSecurity} (${secLevel})`, true)
          .addField('True Security', `${trueSec}`, true)
          .addField('Local Pirates', `${pirates}`, true)
          .addField('Region', regionNameLinked, true)
          .addField('Constellation', `${systemConstellationName}`, true)
          .addField('Faction', `${faction}`, true)
          .addField('Minerals', `${minerals}`, true)
        if (secLevel !== 'Wormhole') {
          systemInfoMessage.addField('Jumps', `**1hr** - ${systemJumps} \n **24hrs** - ${dayJumps}`, true)
            .addField('Ship Kills', `**1hr** - ${systemShipKills} \n **24hrs** - ${dayShipKills}`, true)
            .addField('Pod Kills', `**1hr** - ${systemPodKills} \n **24hrs** - ${dayPodKills}`, true)
            .addField('NPC Kills', `**1hr** - ${systemNPCKills} \n **24hrs** - ${dayNPCKills}`, true)
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
