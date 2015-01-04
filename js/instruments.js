var availableInstruments = [
  { name: 'HiHat', className: 'hi-hat' },
  { name: 'Kick',  className: 'kick' },
  { name: 'Snare', className: 'snare' }
];

var InstrumentFactory = function(instruments) {
  return instruments.map(function(instrument) {
    var constructor,
        chosenInstrument = _.findWhere(availableInstruments, { name: instrument });

    if (chosenInstrument) {
      constructor = function(){
        this.className = chosenInstrument.className;

        this.name = chosenInstrument.name;

        this.play = function() {
          return this.className;
        };
      };
    }

    return constructor;
  }.bind(this));
};