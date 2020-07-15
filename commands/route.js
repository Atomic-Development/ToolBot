const esi = require("../services/esiservice");

exports.run = async (client, message, args) => {
    // Origin is always the first item.
    var origin = args[0];
    // Destination is the second item.
    var destination = args[1];
    // Flag is the third item.
    var flag = args[2];
// If we don't have a flag at this point we'll assume "safest".
    if (!flag) {
        var flag = "secure";
    }

    // We're gonna throw an error here if we're missing any of the three parts.
    if (!origin || !destination || !flag) {
        message.channel.send("Whoops, you mangled it. You need to pass an origin, destination and routing flag.");
    } else {
        // Search ESI for the origin system using our "fuzzy" search type which lets us use terms like 'Amy'.
        // TODO: Handle multiple results.
        let originSearch = await esi.getSearchResults(
            origin,
            "solar_system",
            "fuzzy"
        );
        // Set the Origin system ID.
        originID = originSearch["solar_system"].shift();
        // Grab the full system info from ESI.
        let originSystem = await esi.getSystemInfo(originID);
        // Setup some variables!
        var originName = originSystem.name;
        // Search ESI for the destination system using our "fuzzy" search type which lets us use terms like 'Amy'.
        // TODO: Handle multiple results.
        let destinationSearch = await esi.getSearchResults(
            destination,
            "solar_system",
            "fuzzy"
        );
        // Set the Destination system ID..
        destinationID = destinationSearch["solar_system"].shift();
        // Grab the full system info from ESI.
        let destinationSystem = await esi.getSystemInfo(destinationID);
        // Setup some variables!
        var destinationName = destinationSystem.name;
        if (
            // "Synonyms" for a "prefer safer" route search.
            flag === "safer" ||
            flag === "safe" ||
            flag === "highonly" ||
            flag === "high" ||
            flag === "prefersafer" ||
            flag === "secure"
        ) {
            var flag = "secure";
            var flagDesc = "Prefer more secure:";
        } else if (
            // "Synonyms" for a "prefer less secure" route search.
            flag === "unsafe" ||
            flag === "dangerous" ||
            flag === "lowonly" ||
            flag === "nohigh" ||
            flag === "preferlesssecure" ||
            flag === "insecure"
        ) {
            var flag = "insecure";
            var flagDesc = "Prefer less secure:";
        } else if (
            // "synonyms" for a "prefer shorter" route search.
            flag === "all" ||
            flag === "short" ||
            flag === "shortest" ||
            flag === "shorter"
        ) {
            var flag = "shortest";
            var flagDesc = "Prefer shorter:";
        }

        // We're gonna throw an error here if we're missing any of the three parts.
        if (!originID || !destinationID || !flag) {
            message.channel.send("Whoops, you mangled it. I didn't understand your origin, destination or routing flag.");
        } else if (originID == destinationID) {
            message.channel.send("I don't know what kinda shenanigans you're trying to pull - the answer to your request is clearly 0 jumps.");
        } else {
            // Lookup a route plan from ESI using the selected options.
            let routePlan = await esi.getRoutePlan(originID, destinationID, flag);
            // Count the number of system IDs in the route and remove the origin system ID to get a jumps count.
            var jumps = routePlan.length - 1;
            // Handle jump suffix based on the number of jumps.
            if (jumps == 1) {
                var jumpSuffix = "jump";
            } else {
                var jumpSuffix = "jumps";
            }
            // Construct our final output message.
            // TODO: Improve this to work in light of multiple system options.
            var messageText = `*${flagDesc}* **${originName}** ⇆ **${destinationName}** = **${jumps} ${jumpSuffix}**.`;
            message.channel.send(messageText);
        }
    }
};