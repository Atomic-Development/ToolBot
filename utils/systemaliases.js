/**
 * Copyright (c) EVE University. All rights reserved.
 * Licensed under the MIT License.
 */
const env = require('env-var')
const systemAliases = env.get('SYSTEMALIASES').asJsonObject()
function systemChecker (systemName) {
  var systemLower = systemName.toLowerCase()
  var aliases = systemAliases
  var aliasesResult = aliases[systemLower]
  if (typeof aliasesResult === 'undefined') {
    return systemLower
  } else {
    return aliasesResult
  }
}
exports.systemChecker = systemChecker
