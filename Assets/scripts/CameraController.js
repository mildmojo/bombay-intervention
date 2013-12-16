#pragma strict

var pixelsPerUnit : float;
var zoom = 1.0;

private var _orthoScale : float;

function Awake () {
  //zoom = (Camera.main.orthographicSize * 2) / Camera.main.pixelHeight * 30;
// Debug.Log(Camera.main.orthographicSize);
Debug.Log('CameraController start');
  var newOrthoSize = Screen.height / 2f / pixelsPerUnit / zoom;
  _orthoScale = newOrthoSize / Camera.main.orthographicSize;
  Camera.main.orthographicSize = newOrthoSize;
  var topRight = Camera.main.ViewportToWorldPoint(Vector3(1,1,0));
  Debug.Log(topRight);
  transform.position = Vector3(topRight.x, topRight.y, transform.position.z);

  // Camera.main.transform.position.x = 0.5;
  // Camera.main.transform.position.y = 0.5;
}

function Start() {
  transform.Find('Splash').localScale *= _orthoScale;
}
