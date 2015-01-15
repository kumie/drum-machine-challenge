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

    this.model.setVolume({ value: Song.DEFAULT_VOLUME });
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

      if (_.isString(notes)) {
        instrument = this.getInstrument(notes);
        if (instrument) {
          return instrument.play();
        }
      } else if (_.isArray(notes)) {
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
   * Creates new instrument objects and adds them to the instruments array
   * @example of what is created -- this.instruments.kick = new Kick();
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

    this.model.on('change:volume', function(volume) {
      this.setVolumeValueEl(volume);
    }.bind(this));

    if (this.volumeController) {
      this.volumeController.onchange = function(evt){
        this.model.setVolume({ value: evt.currentTarget.value });
      }.bind(this);
    }
  },

  replay: function() {
    this.play();
  },

  setVolumeValueEl: function(volume) {
    var volumeValueEl = document.querySelector(Song.$CSS.VOLUME);

    if (volumeValueEl) {
      volumeValueEl.innerHTML = volume;
    }
  }

});

Song.CSS = {
  KIT: 'kit'
};

Song.$CSS = {
  KIT: '.' + Song.CSS.KIT,
  VOLUME: '.volume-value'
};

Song.EVENTS = {
  DONE: 'playDone',
  START: 'playStart'
};

Song.DEFAULT_VOLUME = 10;