#pragma strict

class GameManager extends ScriptableObject {
  enum GameState { Menu, Game };

  private static var _instance : GameManager;
  private var _levelManager : LevelManager;
  private var _audioOutput : AudioListener;
  private var _musicManager : MusicManager;
  private var _splash : GameObject;
  private var _state : GameState;
  private var _instanceInitialized = false;
  private var _stateInitialized = false;

  static function Instance() {
    if (!_instance) {
      _instance = ScriptableObject.CreateInstance('GameManager') as GameManager;
    }
    return _instance;
  }

  function OnEnable() {
    if (!_instanceInitialized) {
      _levelManager = LevelManager.Instance(this);
      _audioOutput = Camera.main.GetComponent.<AudioListener>();
      _musicManager = Camera.main.GetComponent.<MusicManager>();
      _splash = GameObject.Find('Splash');
    }
  }

  function Update() {
    if (!_stateInitialized && _musicManager.isLoaded) {
      SetState(GameState.Menu);
      _stateInitialized = true;
    }
    // Quit on Escape.
    if (Input.GetKeyDown(KeyCode.Escape)) {
      Application.Quit();
    }
    if (Input.GetKeyDown(KeyCode.M)) {
      _audioOutput.volume = 1 - _audioOutput.volume;
    }
  }

  function SetState(nextState : GameState) {
    Debug.Log('Game state: ' + nextState.ToString());
    switch(nextState) {
      case GameState.Menu:
        showMenu();
        break;
      case GameState.Game:
        _musicManager.fadeStop(function(){
          _musicManager.cueNextTrack(function() {
            _musicManager.maxVolume = 0.9;
            hideMenu();
            _levelManager.StartLevel(3, 4);
          });
        });
        break;
    }
    _state = nextState;
  }

  function GetState() : GameState {
    return _state;
  }

  private function showMenu() {
    iTween.CameraFadeAdd();
    iTween.CameraFadeFrom(1.0, 1.0);
    _musicManager.maxVolume = 0.5;
    _musicManager.fadePlay(function(){
      _musicManager.playMore();
    });
  }

  private function hideMenu() {
Debug.Log('splash: ' + _splash);
    // iTween.RotateBy(_splash, iTween.Hash(
    //   'amount', Vector3(0,0,0.05)
    //   ,'easetype', 'easeInOutBack'
    //   ,'time', 1.0
    // ));
    // iTween.MoveTo(_splash, iTween.Hash(
    //   'position', _splash.transform.position + Vector3(-Screen2D.worldWidth() * 1.5,0,0)
    //   ,'easetype', 'easeInOutBack'
    //   ,'time', 1.0
    // ));
    iTween.MoveTo(_splash, iTween.Hash(
      'position', _splash.transform.position + Vector3(0,Screen2D.worldHeight() * 1.5,0)
      ,'easetype', 'easeInOutBack'
      ,'time', 1.0
    ));
  }
}
