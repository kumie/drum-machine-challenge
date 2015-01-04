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

  describe('Model', function() {
    it('Should add a new song to the model', function() {
      expect(model.notes.length).not.toBe(0);
      expect(model.title).toBe(songTitle);
    });

    it('Should throw an exception when you set a song\'s data if no song was found', function() {
      expect(model.setSongData.bind(null, 'title')).toThrow();
    });

    it('Should get the correct tempo of a song', function() {
      //at 128 bpm
      expect(model.getTempo()).toBe(0.234375);

      model.bpm = 60;
      expect(model.getTempo()).toBe(.5);
    });

    it('Should change the volume of a song', function() {
      expect(song.model.get('volume')).toBe(10);

      song.model.setVolume({ direction: 'up' });
      expect(song.model.get('volume')).toBe(11);

      song.model.setVolume({ direction: 'down' });
      expect(song.model.get('volume')).toBe(10);

      song.model.setVolume({ value: 20 });
      expect(song.model.get('volume')).toBe(20);

      song.model.setVolume({ value: 21 });
      expect(song.model.get('volume')).toBe(20);

      song.model.setVolume({ value: -1 });
      expect(song.model.get('volume')).toBe(20);
    });
  });

  describe('View', function() {
    var fixtures,
        kitEl;

    beforeEach(function() {
      fixtures = addDOMFixtures();
      kitEl = fixtures.querySelector('.kit');
    });

    afterEach(function() {
      removeDOMFixtures();
    });

    it('Should get the beats from a song', function() {
      song.model.notes = [  'Kick', 'HiHat', [ 'Kick', 'Snare' ] ];
      expect(song.getBeats().length).toBe(3);
    });

    it('Should create instrument objects and add them to the song\'s instruments array', function() {
      expect(song.instruments.hiHat).toBeDefined();
      expect(song.instruments.kick).toBeDefined();
      expect(song.instruments.snare.play).toBeDefined();
    });

    it('Should replay the song when the repeat flag is set', function() {
      var song = new Song({
        bpm: 128,
        title: songTitle,
        repeat: true,
        autoPlay: false
      });

      spyOn(song, 'replay');

      song.emit(Song.EVENTS.DONE);
      expect(song.replay).toHaveBeenCalled();
    });

    it('Should add a class name to the kit in the DOM', function() {
      song.setKitClassName('snare kick');

      expect(kitEl.className).toContain('snare');
      expect(kitEl.className).toContain('kick');
    });

    it('Should set the volume value in the DOM when it is changed', function() {
      var volumeValueEl  = document.querySelector('.volume-value'),
          newVolume = 15;

      volumeValueEl.value = newVolume;
      expect(volumeValueEl.value).toBe(newVolume);
    });

  });

  var addDOMFixtures = function() {
    var container = document.createElement('div'),
        kit = document.createElement('div'),
        body = document.getElementsByTagName('body')[0],
        volumeController = document.createElement('input'),
        volumeValue = document.createElement('div');

    container.className = 'container';
    body.appendChild(container);

    //drum kit
    kit.className = 'kit';
    container.appendChild(kit);

    //volume stuff
    volumeValue.className = 'volume-value';
    container.appendChild(volumeValue);

    volumeController.type = 'range';
    volumeController.setAttribute('data-behavior', 'set-volume');
    volumeController.value = Song.DEFAULT_VOLUME;
    container.appendChild(volumeController);

    return container;
  };

  var removeDOMFixtures = function() {
    var container = document.querySelector('.container');

    if (container) {
      container.parentNode.removeChild(container);
    }
  };

});