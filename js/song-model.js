'use strict';

var Model = Stapes.subclass({

  notes: [],

  title: '',

  bpm: null,

  repeat: false,

  constructor: function(config) {
    this.bpm = config.bpm || 128;
    this.repeat = config.repeat || false;

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
  }

});

