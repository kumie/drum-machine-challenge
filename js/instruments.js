var Instrument = Stapes.subclass({

  play: function() {
    return this.className;
  }

});

var HiHat = Instrument.subclass({

  label: 'Hi Hat',

  className: 'hi-hat'

});

var Kick = Instrument.subclass({

  label: 'Kick',

  className: 'kick'

});

var Snare = Instrument.subclass({

  label: 'Snare',

  className: 'snare'

});

/**
 * Creates and returns an array containing an object of each instrument passed in.
 * @example new InstrumentFactory([ 'HiHat' ]) => [ { methodName: 'hiHat', constructor: constructor } ]
 * @param {Array} instruments
 * @returns {Array}
 * @constructor
 */
var InstrumentFactory = function(instruments) {
  return instruments.map(function(instrument) {
    var constructor = capitalize(instrument),
        methodName = toCamelCase(instrument);

    return { methodName: methodName, constructor: constructor };
  }.bind(this));
};