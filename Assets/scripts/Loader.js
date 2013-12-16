#pragma strict

private var _gameManager : GameManager;

function Awake () {
  // Start the game manager, which starts everything else.
  _gameManager = GameManager.Instance();
}

function Update() {
  _gameManager.Update();
}
