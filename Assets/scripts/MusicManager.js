#pragma strict

// Configure track list in editor.
public var tracks : MultitrackAudio[];

@HideInInspector
public var isPlaying : boolean;

private var _gameManager : GameManager;
private var _levelManager : LevelManager;
private var _trackDeck : ShuffleDeck;
private var _turntable : GameObject;
private var _currentTrack : MultitrackAudio;
private var _currentSources : ArrayList;

function get time() : float {
  return (_currentSources[0] as AudioSource).time;
}

function Awake () {
  Debug.Log('Loading music');
  _gameManager = GameManager.Instance();
  _levelManager = LevelManager.Instance();
  _trackDeck = new ShuffleDeck(tracks);
Debug.Log('ADDED ' + _trackDeck.Count + ' tracks to track deck');
  _currentSources = new ArrayList();
  createTurntable();
}

function Update () {

}

// Creates a turntable gameobject with multiple audiosources.
// Multitrack clips are attached to audiosources at random.
function createTurntable() {
  Debug.Log('creating turntable');
  _turntable = new GameObject('turntable');
  _turntable.transform.position = Camera.main.transform.position;
  _turntable.transform.parent = Camera.main.transform;
  cueNextTrack();
}

function playNextTrack() {
  cueNextTrack(function(){
    play();
  });
}

function cueNextTrack() {
  cueNextTrack(function(){});
}
function cueNextTrack(callback : function()) {
  fadeStop(function() {
    _currentTrack = _trackDeck.draw() as MultitrackAudio;
    // Debug.Log('LOADED a track with ' + _currentTrack.clips.Length + ' clips');
    destroySources();
    createSources();
    callback();
  });
}

function play() {
  if (!isPlaying) {
    // Debug.Log('PLAYING music from ' + _currentSources.Count + ' sources');
    (_currentSources[0] as AudioSource).volume = 1.0;
    eachSource(function(source) {
      source.Play();
    });
    isPlaying = true;
  }
}

function playMore() {
  if (isPlaying) {
    Debug.Log('Playing MORE music');
    var done = false;
    eachSource(function(source) {
      if (!done && source.volume < 0.05) {
        iTween.AudioTo(_turntable, iTween.Hash(
          'audiosource', source
          ,'volume', 1.0
          ,'time', 1.0
        ));
        done = true;
      }
    });
  }
}

function playLess() {
  if (isPlaying) {
    var done = false;
    eachSourceReverse(function(source) {
      if (!done && source.volume > 0.1) {
        iTween.AudioTo(_turntable, iTween.Hash(
          'audiosource', source
          ,'volume', 1.0
          ,'time', 1.0
        ));
        done = true;
      }
    });
  }
}

function playAll() {
  eachSource(function(source) {
    source.volume = 1.0;
    source.Play();
  });
}

function pause() {
  eachSource(function(source) {
    if (isPlaying) {
      source.Pause();
    } else {
      source.Play();
    }
  });
  isPlaying = !isPlaying;
}

function stop() {
  if (isPlaying) {
    eachSource(function(source) {
      source.Stop();
    });
    isPlaying = false;
  }
}

function fadeStop() {
  fadeStop(function(){});
}
function fadeStop(callback : function()) {
  var fadeTime = isPlaying ? 0.5 : 0.0;

  for (var source in _currentSources) {
    iTween.AudioTo(_turntable, iTween.Hash(
      'audiosource', source
      ,'volume', 0
      ,'time', fadeTime
    ));
  }
  yield WaitForSeconds(fadeTime + 0.1);
  isPlaying = false;
  callback();
}

private function eachSource(callback : function(AudioSource)) {
  if (!_currentSources) return;
  for (var i = 0; i < _currentSources.Count; i++) {
    callback(_currentSources[i] as AudioSource);
  }
}

private function eachSourceReverse(callback : function(AudioSource)) {
  if (!_currentSources) return;
  for (var i = _currentSources.Count - 1; i >= 0; i--) {
    callback(_currentSources[i] as AudioSource);
  }
}

private function createSources() {
  for (var i = 0; i < _currentTrack.clips.Length; i++) {
    var source = _turntable.AddComponent('AudioSource') as AudioSource;
    source.playOnAwake = false;
    source.clip = _currentTrack.clipDeck.draw() as AudioClip;
    source.volume = 0;
    _currentSources.Add(source);
    // Debug.Log('createdSource, now have: ' + _currentSources.Count);
  }
}

private function destroySources() {
  eachSource(function(source) {
    Destroy(source);
  });
}
