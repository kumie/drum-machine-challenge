/**
 * Creates and returns new instances of each instrument passed in
 * @param {Array} instruments
 * @returns {Array}
 * @example new SongInstrumentFactory([ 'HiHat' ]) => [ { methodName: 'hiHat', constructor: constructor } ]
 * @constructor
 */
var SongInstrumentFactory = function(instruments) {
  return instruments.map(function(instrument) {
    var constructor = capitalize(instrument),
        methodName = toCamelCase(instrument);

    if (constructor && typeof window[constructor] === 'function') {
      return { methodName: methodName, constructor: new window[constructor]() };
    }
  }.bind(this));
};