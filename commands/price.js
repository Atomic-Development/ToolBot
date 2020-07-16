const Discord = require("discord.js");
const getEvePraisal = require ("../services/evepraisal");
const imgUrlBase = "https://imageserver.eveonline.com/Type/";
const numeral = require("numeral");
const moment = require("moment");

exports.run = async (client, message, args) => {
    // Location type is always the first item.
    var market = args[0];
    // Location name is the second item.
    var search = args[1];

    if (!market || !search ) {
        message.channel.send("Whoops, you mangled it. You need to pass a market to check and a search string (quoted if it has spaces!).");
    } else {
        // Create an EVEPraisal
        marketLower = market.toLowerCase()
        searchLower = search.toLowerCase()
        evePraisal = await getEvePraisal(marketLower, searchLower);
        //console.log("EvePraisal result:", evePraisal);
        appraisalID = evePraisal.appraisal.id;
        //console.log("Appraisal ID:", appraisalID);
        epItems = evePraisal.appraisal.items.shift();
        console.log("Items Object;", epItems);
        itemName = epItems.typeName;
        marketName = evePraisal.appraisal.market_name;
        pricesObject = epItems.prices;
        buyPrices = pricesObject.buy;
        sellPrices = pricesObject.sell;
        //console.log("Buy Prices :", buyPrices);
        //console.log("Sell Prices;", sellPrices);
        buyMax = buyPrices.max;
        buyMaxFormatted = numeral(buyMax).format('0,0');
        buyMaxString = `${buyMaxFormatted} ISK`;
        buyPer = buyPrices.percentile;
        buyPerFormatted = numeral(buyPer).format('0,0');
        buyPerString = `${buyPerFormatted} ISK`;
        sellMin = sellPrices.min;
        sellMinFormatted = numeral(sellMin).format('0,0');
        sellMinString = `${sellMinFormatted} ISK`;
        sellPer = sellPrices.percentile;
        sellPerFormatted = numeral(sellPer).format('0,0');
        sellPerString = `${sellPerFormatted} ISK`;
        itemTypeID = epItems.typeID;
        imageFile = `${itemTypeID}_128.png`;
        imageURL = `${imgUrlBase}/${imageFile}`;

        pricesUpdated = pricesObject.updated;
        prettyUpdatedDate = moment(pricesUpdated).format("dddd, Do MMMM YYYY, H:mm:ss");

        evePraisalLink = `https://evepraisal.com/a/${appraisalID}`
        
        systemInfoMessage = new Discord.MessageEmbed()
            .setColor('#3F704D')
            .setTitle(itemName)
            .setDescription(`Price/market information for ${itemName} in ${marketName}.`)
            .setThumbnail(imageURL)
            .addField('Highest Buy', `${buyMaxString}`, true)
            .addField('98th Percentile Buy', `${buyPerString}`, true)
            .addField('** **', '** **', true)
            .addField('Lowest Sell Price', `${sellMinString}`, true)
            .addField('98th Percentile Sell', `${sellPerString}`,true)
            .addField('** **', '** **', true)
            .addField('Evepraisal Link', evePraisalLink)
            .setFooter(`Prices were last updated ${prettyUpdatedDate}.`)
        message.channel.send(systemInfoMessage);
    }
}
