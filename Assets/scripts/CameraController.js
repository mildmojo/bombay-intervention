#pragma strict

var pixelsPerUnit : float;
var zoom = 1;

function Start () {
  Camera.main.orthographicSize = Screen.height / 2f / pixelsPerUnit / zoom;
}
