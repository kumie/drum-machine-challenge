'use strict';

var availableInstruments = [
  { name: 'HiHat', className: 'hi-hat' },
  { name: 'Kick',  className: 'kick' },
  { name: 'Snare', className: 'snare' }
];

var InstrumentFactory = function(instruments) {
  return instruments.map(function(instrument) {
    var Instrument,
        chosenInstrument = _.findWhere(availableInstruments, { name: instrument });

    if (chosenInstrument) {
      Instrument = function(){
        this.className = chosenInstrument.className;

        this.name = chosenInstrument.name;

        this.play = function() {
          return this.className;
        };
      };
    }

    return Instrument;
  }.bind(this));
};