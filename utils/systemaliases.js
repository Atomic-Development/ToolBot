/**
 * Copyright (c) EVE University. All rights reserved.
 * Licensed under the MIT License.
 */
const config = require("../config.json");
const _ = require("underscore");

function systemChecker(systemName) {
    systemLower = systemName.toLowerCase()
    aliases = config.systemAliases;

    aliasesResult = aliases[systemLower];
    
    if (typeof aliasesResult == 'undefined') {
        console.log("No alias for:", systemLower);
        return systemLower
    } else {
        console.log("Matched system to alias:", aliasesResult);
        return aliasesResult
    }
};

exports.systemChecker = systemChecker;