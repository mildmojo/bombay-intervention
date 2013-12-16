#pragma strict

private var _gameManager : GameManager;
private var _isTriggered = false;

function Start() {
  _gameManager = GameManager.Instance();
}

function Update() {

}

function OnMouseDown() {
Debug.Log('clicked');
  if (!_isTriggered) {
    _gameManager.SetState(GameManager.GameState.Game);
    _isTriggered = true;
  }
}
