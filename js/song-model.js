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
    var song = _.findWhere(songCollection, title);

    if (song) {
      this.notes = song.Notes;
      this.title = song.Title;
    }
  },

  getTempo: function() {
    //4/4 time signature
    return (( 60 / this.bpm ) * 4) / 8;
  }

});

