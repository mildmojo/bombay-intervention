#pragma strict

function Start() {
  LockToViewportTop();
}

function LockToViewportTop() {
  var y = Screen2D.worldHeight();
  var oldPos = transform.position;
  transform.position = Vector3(oldPos.x, y, oldPos.z);
}
