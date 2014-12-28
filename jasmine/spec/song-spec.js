describe('Song', function() {

  var song,
      model,
      songTitle = 'Animal Rights';

  beforeEach(function() {
    song = new Song({
      bpm: 128,
      title: songTitle,
      repeat: false,
      autoPlay: true
    });
    model = song.model;
  });

  afterEach(function() {
    song.stop();
  });

  it ('Should add a new song to the model', function() {
    expect(model.notes.length).not.toBe(0);
    expect(model.title).toBe(songTitle);
  });

  it('Should throw an exception when you set a song\'s data if no song was found', function() {
    expect(model.setSongData.bind(null, 'title')).toThrow();
  });

  describe('View', function() {
    it('Should get the beats from a song', function() {
      var notes = _.flatten(songCollection[0].Notes);
      expect(song.getBeats().length).toBe(notes.length - 1);
    });

    it('Should replay the song when on repeat', function() {
      var song = new Song({
        bpm: 128,
        title: songTitle,
        repeat: true,
        autoPlay: false
      });

      spyOn(song, 'replay');

      song.emit('playDone');
      expect(song.replay).toHaveBeenCalled();
    });

    it('Should add a class name to the kit in the DOM', function() {
      var kit = addDOMFixture(),
          song;

      song = new Song({
        bpm: 128,
        title: songTitle,
        repeat: false,
        autoPlay: false
      });

      song.setKitClass('snare kick');

      expect(kit.className).toContain('snare');
      expect(kit.className).toContain('kick');
    });

    var addDOMFixture = function() {
      var kit = document.createElement('div'),
          body = document.getElementsByTagName('body')[0];

      kit.className = 'kit';
      body.appendChild(kit);

      return kit;
    };

  });
});