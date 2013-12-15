#pragma strict

var pixelsPerUnit : float;
var zoom = 1.0;

function Awake () {
  //zoom = (Camera.main.orthographicSize * 2) / Camera.main.pixelHeight * 30;
// Debug.Log(Camera.main.orthographicSize);
Debug.Log('CameraController start');
  Camera.main.orthographicSize = Screen.height / 2f / pixelsPerUnit / zoom;
  var topRight = Camera.main.ViewportToWorldPoint(Vector3(1,1,0));
  Debug.Log(topRight);
  transform.position = Vector3(topRight.x, topRight.y, transform.position.z);

  // Camera.main.transform.position.x = 0.5;
  // Camera.main.transform.position.y = 0.5;
}
