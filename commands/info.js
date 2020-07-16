/**
 * Copyright (c) Max Tsero. All rights reserved.
 * Licensed under the MIT License.
 */
const alias = require('../utils/systemaliases')
const esi = require('../services/esiservice')
const { round, between } = require('../utils/math')
const Discord = require('discord.js')
const rp = require('request-promise')
const parser = require('cheerio')
const tabletojson = require('tabletojson').Tabletojson
const _ = require('underscore')

function makeDotlanLink (ID, type) {
  var dotlanUrl = 'https://evemaps.dotlan.net'
  var page = `${type}/${ID}`
  var dllink = `${dotlanUrl}/${page}`
  return dllink
}

function makeZkillboardLink (ID) {
  var zKillboardUrl = 'https://zkillboard.com'
  var page = `system/${ID}`
  var zklink = `${zKillboardUrl}/${page}`
  return zklink
}

function makeAnoikisLink (name) {
  var anoikisUrl = 'http://anoik.is'
  var page = `systems/${name}`
  var aklink = `${anoikisUrl}/${page}`
  return aklink
}

exports.run = async (client, message, args) => {
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
      var systemID = systemSearch['solar_system'].shift()
      var systemInfo = await esi.getSystemInfo(systemID)
      // console.log("System Information:", systemInfo);
      var systemName = systemInfo.name
      // console.log("System Name:", systemName);
      var systemConstellationID = systemInfo.constellation_id
      var systemConstellationInfo = await esi.getConstellationInfo(systemConstellationID)
      // console.log("System Constellation Info", systemConstellationInfo);
      var systemConstellationName = systemConstellationInfo.name
      // console.log("System Constellation Name:", systemConstellationName);
      var systemRegionID = systemConstellationInfo.region_id
      var systemRegionInfo = await esi.getRegionInfo(systemRegionID)
      // console.log("System Region Info:", systemRegionInfo);
      var systemRegionName = systemRegionInfo.name
      // console.log("System Region Name:", systemRegionName);
      var systemSecurity = round(systemInfo['security_status'], 1)
      var securityClass = systemInfo['security_class']
      let secLevel = setSystemSecurity(systemSecurity, securityClass)
      // console.log("Security Level:", secLevel);
      var trueSec = round(systemInfo['security_status'], 5)
      // console.log("Security Status:", systemSecurity);
      var allSystemKills = await esi.getAllSystemKills()
      // console.log("All System Kills", allSystemKills);
      var systemKills = await esi.getSystemKills(systemID, allSystemKills)
      // console.log("System Kills:", systemKills);
      var systemKillsObject = systemKills.shift()
      var systemDotlanLink = makeDotlanLink(systemID, 'system')
      var regionDotlanLink = makeDotlanLink(systemRegionID, 'region')
      var regionNameLinked = `[${systemRegionName}](${regionDotlanLink})`
      var systemzKillboardLink = makeZkillboardLink(systemID)
      var zkillboardLinked = `[zKillBoard](${systemzKillboardLink})`
      let dotlanScrape = await rp(systemDotlanLink)
      // console.log("Scraper result:", dotlanScrape);
      let dotlanParser = parser.load(dotlanScrape, { xmlMode: true })
      // console.log("Parser result:", dotlanParser);

      let jsonTable = await tabletojson.convertUrl(systemDotlanLink)
      // console.log("Parsed table", jsonTable);
      var systemNPCKills
      var systemPodKills
      var systemShipKills
      var systemImage
      var pirates
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
        var systemJumpsObject = systemJumpsAPI.shift()
        var systemJumps = systemJumpsObject['ship_jumps']
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
      var faction = jsonTable[1][4][2]
      console.log(jsonTable)
      var minerals = jsonTable[1][5][2]
      var systemInfoMessage = new Discord.MessageEmbed()
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
      }
      if (secLevel === 'Wormhole') {
        systemInfoMessage.addField('Anoik.is Link', anoikisLinked, true)
      }
      message.channel.send(systemInfoMessage)
    }
  }
}
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
