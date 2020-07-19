function keyExists(key, search) {
  if (!search || (search.constructor !== Array && search.constructor !== Object)) {
      return false;
  }
  for (var i = 0; i < search.length; i++) {
      if (search[i] === key) {
          return true;
      }
  }
  return key in search;
}

exports.keyExists = keyExists