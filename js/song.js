'use strict';

var Song = Stapes.subclass({

  model: null,

  tempo: null,

  volumeController: null,

  instruments: [],

  constructor: function(config) {
    this.model = new Model({
      bpm: config.bpm,
      title: config.title,
      repeat: config.repeat
    });

    this.volumeController = document.querySelector('[data-behavior="set-volume"]');
    this.createInstruments();
    this.bindEvents();

    if (config.autoPlay) {
      this.play();
    }
  },

  play: function() {
    var beats = this.getBeats(),
        tempo = Math.floor(this.model.getTempo() * 1000);

    if (!beats) {
      return;
    }
    this.emit(Song.EVENTS.START);

    this.tempo = window.setInterval(function() {
      this.setKitClassName(beats[0]);
      beats.shift();

      if (!beats.length) {
        this.emit(Song.EVENTS.DONE);
      }
    }.bind(this), tempo);
  },

  getBeats: function() {
    return this.model.notes.map(function(notes) {
      var instrument;

      if (typeof notes === 'string') {
        instrument = this.getInstrument(notes);
        if (instrument) {
          return instrument.play();
        }
      } else if (notes instanceof Array) {
        var output = '',
            i = 0,
            notesLen = notes.length,
            note;

        for (; i < notesLen; i++) {
          note = notes[i];
          instrument = this.getInstrument(note);

          if (instrument) {
            output += instrument.play();
          }
          if (i !== notesLen - 1) {
            output += ' ';
          }
        }

        return output;
      }
    }.bind(this));
  },

  stop: function() {
    window.clearInterval(this.tempo);
    this.setKitClassName();
  },


  /**
   * Creates new instrument objects and attaches them to the prototype
   * @example of what is created -- this.kick = new Kick();
   */
  createInstruments: function() {
    var instruments = _.chain(this.model.notes)
        .flatten()
        .uniq()
        .value();

    new InstrumentFactory(instruments).forEach(function(Instrument) {
      var instance,
          methodName;

      if (typeof Instrument === 'function') {
        instance = new Instrument();
        methodName = toCamelCase(instance.name);

        this.instruments[methodName] = instance;
      }
    }.bind(this));
  },

  getInstrument: function(instrument) {
    return this.instruments[toCamelCase(instrument)];
  },

  setKitClassName: function(suffix) {
    suffix = suffix || '';

    var kit = document.querySelector(Song.$CSS.KIT);
    if (kit) {
      kit.className = Song.CSS.KIT + ' ' + suffix;
    }
  },

  bindEvents: function() {
    this.on(Song.EVENTS.DONE, function() {
      this.stop();
      console.timeEnd('play time');
      if (this.model.repeat) {
        this.replay();
      }
    }.bind(this));

    this.on(Song.EVENTS.START, function() {
      console.time('play time');
    });

    if (this.volumeController) {
      this.volumeController.onchange = function(evt){
        this.setVolume(evt.currentTarget.value);
      }.bind(this);
    }

    this.model.on('change:volume', function(volume) {
      console.log('volume is at ' + volume);
    });
  },

  replay: function() {
    this.play();
  },
  
  setVolume: function(value) {
    this.model.setVolume({ value: value });
  }

});

Song.CSS = {
  KIT: 'kit'
};

Song.$CSS = {
  KIT: '.' + Song.CSS.KIT
};

Song.EVENTS = {
  DONE: 'playDone',
  START: 'playStart'
};