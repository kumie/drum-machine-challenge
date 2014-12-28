'use strict';

var Song = Stapes.subclass({

  model: null,

  kick: null,

  hiHat: null,

  snare: null,

  tempo: null,

  constructor: function(config) {
    this.model = new Model({
      bpm: config.bpm,
      title: config.song,
      repeat: config.repeat
    });

    this.kick  = new Kick();
    this.hiHat = new HiHat();
    this.snare = new Snare();

    this.bindEvents();
    this.play();
  },

  getBeats: function() {
    return this.model.notes.map(function(notes) {
      if (_.isString(notes)) {
        return this.getInstrument(notes).play();
      } else if (_.isArray(notes)) {
        var output = '',
            i = 0,
            notesLen = notes.length;

        for (; i < notesLen; i++) {
          var note = notes[i];
          output += this.getInstrument(note).play();
          if (i !== notesLen - 1) {
            output += ' ';
          }
        }

        return output;
      }
    }.bind(this));
  },

  play: function() {
    var beats = this.getBeats(),
        tempo = this.model.getTempo() * 1000;

    this.emit('playStart');

    this.tempo = window.setInterval(function() {
      this.setKitClass(beats[0]);
      beats.shift();

      if (!beats.length) {
        this.emit('playDone');
      }
    }.bind(this), tempo);
  },

  stop: function() {
    window.clearInterval(this.tempo);
    this.setKitClass();
    console.timeEnd('play time');
  },

  setKitClass: function(suffix) {
    suffix = suffix || '';

    var kit = document.querySelector(Song.$CSS.KIT);
    kit.className = Song.CSS.KIT + ' ' + suffix;
  },

  bindEvents: function() {
    this.on('playDone', function() {
      this.stop();
      if (this.model.repeat) {
        this.replay();
      }
    }.bind(this));

    this.on('playStart', function() {
      console.time('play time');
    });
  },

  getInstrument: function(instrument) {
    var table = {
      Kick: this.kick,
      HiHat: this.hiHat,
      Snare: this.snare
    };

    return table[instrument];
  },

  replay: function() {
    this.play();
  }

});

Song.CSS = {
  KIT: 'kit'
};

Song.$CSS = {
  KIT: '.' + Song.CSS.KIT
};