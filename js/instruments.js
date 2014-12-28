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