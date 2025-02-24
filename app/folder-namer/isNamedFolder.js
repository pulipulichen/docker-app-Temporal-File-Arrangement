const path = require('path');

const pattern1 = /^\d{8}$/;           // Matches YYYYMMDD
const pattern2 = /^\d{8}-\d{2}$/;     // Matches YYMMDD-HH

const isNamedFolder = function (name) {
  if (name.indexOf('/') > -1) {
    name = path.basename(name);
  }

  return !(pattern1.test(name) || pattern2.test(name))
}

module.exports = isNamedFolder