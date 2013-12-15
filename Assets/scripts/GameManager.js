﻿#pragma strict

class GameManager extends ScriptableObject {
  static var _instance : GameManager;
  var _levelManager : LevelManager;

  enum GameState { Menu, Game };
  var _state : GameState;

  static function Instance() {
    if (!_instance) {
      _instance = ScriptableObject.CreateInstance('GameManager') as GameManager;
    }
    return _instance;
  }

  function OnEnable() {
    _levelManager = LevelManager.Instance(this);
    SetState(GameState.Game);
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
        _levelManager.StartLevel(2, 3);
        break;
    }
    _state = nextState;
  }

  function GetState() : GameState {
    return _state;
  }
}