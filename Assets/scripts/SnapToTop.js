#pragma strict

// Zero to one
var paddingPercent : float = 0;

function Start() {
  SnapToViewportTop();
}

function SnapToViewportTop() {
  var frame = new TwoDee(gameObject);
  var y = Screen2D.worldHeight() - frame.height * paddingPercent; // works for top-anchored objects
  var textMesh = transform.GetComponent.<TextMesh>();
  if (textMesh) {
    switch(textMesh.anchor) {
      case TextAnchor.MiddleLeft:
      case TextAnchor.MiddleCenter:
      case TextAnchor.MiddleRight:
        y -= frame.height / 2.0;
        break;
      case TextAnchor.LowerLeft:
      case TextAnchor.LowerCenter:
      case TextAnchor.LowerRight:
        y -= frame.height;
        break;
    }
  }
Debug.Log('snapping Y to ' + y);
  var oldPos = transform.position;
  transform.position = Vector3(oldPos.x, y, oldPos.z);
}
