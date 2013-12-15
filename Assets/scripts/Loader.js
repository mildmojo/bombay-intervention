#pragma strict

private var _gameManager : GameManager;

function Start () {
  // Start the game manager, which starts everything else.
  _gameManager = GameManager.Instance();
  test(function() {
    Debug.Log('hi');
  });
}

function Update() {
  _gameManager.Update();
}

function test(func : function()) {
  func();
}
