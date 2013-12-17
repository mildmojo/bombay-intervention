#pragma strict

private var _gameManager : GameManager;

function Start() {
  _gameManager = GameManager.Instance();
}

function Update() {

}

function OnMouseDown() {
Debug.Log('clicked');
  _gameManager.SetState(GameManager.GameState.Game);
}
