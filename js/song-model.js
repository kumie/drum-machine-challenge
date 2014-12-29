'use strict';

var Model = Stapes.subclass({

  notes: [],

  title: '',

  bpm: null,

  repeat: false,

  volume: 0, //observable property

  constructor: function(config) {
    this.bpm = config.bpm || 128;
    this.repeat = config.repeat || false;
    this.setVolume({ value: config.volume || 10 });

    this.setSongData(config.title);
  },

  setSongData: function(title) {
    var song,
        i = 0,
        songCollectionLen = songCollection.length;

    for (; i < songCollectionLen; i++) {
      if (songCollection[i].Title === title) {
        song = songCollection[i];
        break;
      }
    }

    if (song) {
      this.notes = song.Notes;
      this.title = song.Title;
    } else {
      throw new Error('Could not find song with title ' + title);
    }
  },

  getTempo: function() {
    return ( ( 60 / this.bpm ) * 4 ) / 8;     //4/4 time signature
  },

  setVolume: function(config) {
    var min = 0,
        max = 20,
        currentVolume = this.get('volume');

    if (config.direction) {
      if (config.direction === 'up' && currentVolume !== max) {
        this.set('volume', currentVolume + 1);
      } else if (config.direction === 'down' && currentVolume !== min) {
        this.set('volume', currentVolume - 1);
      }
    } else if (config.value && config.value < max + 1 && config.value > min - 1) {
      this.set('volume', config.value);
    }
  }

});

