const esi = require("../services/esiservice");
const { round } = require("../utils/math");
const Discord = require("discord.js");
const rp = require("request-promise");
const parser = require("cheerio");
const tabletojson = require('tabletojson').Tabletojson;
const urlMetadata = require('url-metadata');
const { link } = require("fs");

function makeDotlanLink(ID, type) {
    dotlanUrl = "https://evemaps.dotlan.net";
    page = `${type}/${ID}`;
    dllink = `${dotlanUrl}/${page}`;
    return dllink;
}

function makeZkillboardLink(ID) {
    zKillboardUrl = "https://zkillboard.com";
    page = `system/${ID}`;
    zklink = `${zKillboardUrl}/${page}`;
    return zklink;
}

function makeAnoikisLink(name) {
    anoikisUrl = "http://anoik.is";
    page = `systems/${name}`;
    aklink = `${zKillboardUrl}/${page}`;
    return aklink;
}

exports.run = async (client, message, args) => {
    var system = args[0];
    if (!system) {
        message.channel.send("Whoops, you mangled it. You need to pass a system name.");
    } else {
        if (system == "innu" || system == "innuendo" || system == "Innu" || system == "Innuendo") {
            system = "J211936";
        }
        var systemSearch = await esi.getSearchResults(
            system,
            "solar_system",
            "fuzzy"
        ); 
        //console.log("Search result(s):", systemSearch);
        systemID = systemSearch["solar_system"].shift();
        systemInfo = await esi.getSystemInfo(systemID);
        //console.log("System Information:", systemInfo);
        systemName = systemInfo.name;
        //console.log("System Name:", systemName);
        systemConstellationID = systemInfo.constellation_id;
        systemConstellationInfo = await esi.getConstellationInfo(systemConstellationID);
        //console.log("System Constellation Info", systemConstellationInfo);
        systemConstellationName = systemConstellationInfo.name;
        //console.log("System Constellation Name:", systemConstellationName);
        systemRegionID = systemConstellationInfo.region_id;
        systemRegionInfo = await esi.getRegionInfo(systemRegionID);
        //console.log("System Region Info:", systemRegionInfo);
        systemRegionName = systemRegionInfo.name;
        //console.log("System Region Name:", systemRegionName);
        systemSecurity = round(systemInfo["security_status"], 1);
        securityClass = systemInfo["security_class"];
        if (systemSecurity > "0.5") {
            secLevel = "High";
        } else if (systemSecurity <= "0.4" && systemSecurity >="0.1") {
            secLevel = "Low";
        } else if (systemSecurity <= "0.0" && systemSecurity >= "-1.0") {
            if (typeof securityClass === "undefined") {
                secLevel = "Wormhole";
            } else {
                secLevel = "Null";
            }
        }
        //console.log("Security Level:", secLevel);
        trueSec = round(systemInfo["security_status"], 5);
        //console.log("Security Status:", systemSecurity);
        allSystemKills = await esi.getAllSystemKills();
        //console.log("All System Kills", allSystemKills);
        systemKills = await esi.getSystemKills(systemID, allSystemKills);
        //console.log("System Kills:", systemKills);
        systemKillsObject = systemKills.shift();
        systemDotlanLink = makeDotlanLink(systemID, 'system');
        regionDotlanLink = makeDotlanLink(systemRegionID, 'region');
        regionNameLinked = `[${systemRegionName}](${regionDotlanLink})`;
        systemzKillboardLink = makeZkillboardLink(systemID);
        zkillboardLinked = `[zKillBoard](${systemzKillboardLink})`;
        let dotlanScrape = await rp(systemDotlanLink);
        //console.log("Scraper result:", dotlanScrape);
        let dotlanParser = parser.load(dotlanScrape, { xmlMode: true});
        //console.log("Parser result:", dotlanParser);
        
        jsonTable = await tabletojson.convertUrl(systemDotlanLink);
        //console.log("Parsed table", jsonTable);
        if (secLevel != "Wormhole") {
            systemNPCKills = systemKillsObject["npc_kills"];
            //console.log("NPC Kills:", systemNPCKills);
            systemPodKills = systemKillsObject['pod_kills'];
            //console.log("Pod Kills:", systemPodKills);
            systemShipKills = systemKillsObject['ship_kills'];
            //console.log("Ship Kills:", systemShipKills);
            allSystemJumps = await esi.getAllSystemJumps();
            //console.log("All System Jumps:", allSystemJumps);
            systemJumpsAPI = await esi.getSystemJumps(systemID, allSystemJumps);
            systemJumpsObject = systemJumpsAPI.shift();
            systemJumps = systemJumpsObject["ship_jumps"];
            //console.log("System Jumps:", systemJumps);
            dayJumps = jsonTable[1][0][7];
            dayShipKills = jsonTable[1][1][7];
            dayNPCKills = jsonTable[1][2][7];
            dayPodKills = jsonTable[1][3][7];
            systemImage = dotlanParser('link[rel=image_src]').attr("href");
            //console.log("System image", systemImage);
            pirates = jsonTable[1][4][4];
        } else {
            systemImage = "https://wiki.eveuniversity.org/images/e/e0/Systems.png";
            //console.log("System image", systemImage);
            pirates = "Sleepers";
        }
        if (secLevel == "Wormhole") {
            systemAnoikisLink = makeAnoikisLink(systemName);
            anoikisLinked = `[Anoikis](${systemAnoikisLink})`;
        }
        faction = jsonTable[1][4][2];
        minerals = jsonTable[1][4][2];
        metadata =  await urlMetadata(systemDotlanLink, {fromEmail: 'max.tsero@outlook.com', userAgent: 'EVETools', ensureSecureImageRequest: true});
        systemInfoMessage = new Discord.MessageEmbed()
            .setColor('#ffa500')
            .setTitle(systemName)
            .setDescription(`System information from ESI and DotLAN for ${systemName}. See detailed/more accurate kill information on ${zkillboardLinked}`)
            //.setImage(systemImage)
            .setThumbnail(systemImage)
            .setURL(systemDotlanLink)
            .addField('Security Level', `${systemSecurity} (${secLevel})`, true)
            .addField('True Security', `${trueSec}`, true)
            .addField('Local Pirates', `${pirates}`, true)
            .addField('Region', regionNameLinked, true )
            .addField('Constellation', `${systemConstellationName}`, true )
            if (secLevel != "Wormhole") {
                systemInfoMessage.addField('Jumps', `**1hr** - ${systemJumps} \n **24hrs** - ${dayJumps}`, true)
                    .addField('Ship Kills', `**1hr** - ${systemShipKills} \n **24hrs** - ${dayShipKills}`, true)
                    .addField('Pod Kills', `**1hr** - ${systemPodKills} \n **24hrs** - ${dayPodKills}`, true)
                    .addField('NPC Kills', `**1hr** - ${systemNPCKills} \n **24hrs** - ${dayNPCKills}`, true)
            }
            if (secLevel == "Wormhole") {
                systemInfoMessage.addField('Anoik.is Link', anoikisLinked, true )
            }
        message.channel.send(systemInfoMessage);
    }
}