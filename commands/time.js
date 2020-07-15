const moment = require('moment-timezone');

exports.run = (client, message, args) => {
    var eveTime = moment();
    var eveTimeUTC = eveTime.utc();
    var eveTimeFormatted = eveTimeUTC.format('YYYY/MM/DD - HH:mm/h:mm A');
    // Construct our final output message.
    // TODO: Improve this to work in light of multiple system options.
    var messageText = `*Current EVE date/time is* **${eveTimeFormatted}**.`;
    message.channel.send(messageText);
};