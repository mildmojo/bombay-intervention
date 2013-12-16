#pragma strict

class GameManager extends ScriptableObject {
  enum GameState { Menu, Game };

  private static var _instance : GameManager;
  private var _levelManager : LevelManager;
  private var _state : GameState;
  private var _instanceInitialized = false;

  static function Instance() {
    if (!_instance) {
      _instance = ScriptableObject.CreateInstance('GameManager') as GameManager;
    }
    return _instance;
  }

  function OnEnable() {
    if (!_instanceInitialized) {
      _levelManager = LevelManager.Instance(this);
      SetState(GameState.Menu);
    }
  }

  function Update() {
    // Quit on Escape.
    if (Input.GetKeyDown(KeyCode.Escape)) {
      Application.Quit();
    }
  }

  function SetState(nextState : GameState) {
    Debug.Log('Game state: ' + nextState.ToString());
    switch(nextState) {
      case GameState.Menu:
        break;
      case GameState.Game:
        _levelManager.StartLevel(4, 3);
        break;
    }
    _state = nextState;
  }

  function GetState() : GameState {
    return _state;
  }
}
