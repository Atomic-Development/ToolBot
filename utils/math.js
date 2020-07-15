/**
 * Copyright (c) EVE University. All rights reserved.
 * Licensed under the MIT License.
 */
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

exports.round = round;