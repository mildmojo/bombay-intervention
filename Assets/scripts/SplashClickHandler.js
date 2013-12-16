#pragma strict

private var _gameManager : GameManager;
private var _isTriggered = false;

function Start() {
  _gameManager = GameManager.Instance();
}

function Update() {

}

function OnMouseDown() {
  if (!_isTriggered) {
    rollAway();
    _isTriggered = true;
  }
}

private function rollAway() {
  iTween.RotateBy(gameObject, iTween.Hash(
    'amount', Vector3(0,0,0.05)
    ,'easetype', 'easeInOutBack'
    ,'time', 1.0
  ));
  iTween.MoveTo(gameObject, iTween.Hash(
    'position', transform.position + Vector3(-Screen2D.worldWidth(),0,0)
    ,'easetype', 'easeInOutBack'
    ,'time', 1.0
  ));
  yield WaitForSeconds(0.5);
  _gameManager.SetState(GameManager.GameState.Game);
}
