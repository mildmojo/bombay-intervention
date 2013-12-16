#pragma strict

function Start() {
  LockToViewportTop();
}

function LockToViewportTop() {
  var frame = new TwoDee(gameObject);
  var x = Screen2D.worldWidth() - frame.width;
  var oldPos = frame.position;
  transform.position = Vector3(x, oldPos.y, oldPos.z);
}
