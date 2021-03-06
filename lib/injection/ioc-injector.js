
//core
const util = require('util');

//project
const {$core, $deps, mappedPkgJSONDeps} = require('../injection/$core-n-$deps');

/////////////////////////////////////////////////////////////////

module.exports = function ($iocData) {

  return function (names) {

    return names.map(function (n) {

      if (n === '$core') {
        return $core;
      }

      if (n === '$deps') {
        return $deps;
      }

      if (n === '$iocData') {
        return $iocData || 'ioc=data=shabama'
      }

      if (n === '$data') {
        return $iocData || 'ioc=data=shabama'
      }

      try {
        return require(n);
      }
      catch (err) {
        console.error(' => Cannot require dependency with name => ' + n);
        return {'suman-usage-error': err};
      }

    });

  }

};
