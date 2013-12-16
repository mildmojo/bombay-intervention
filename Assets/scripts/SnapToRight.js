#pragma strict

// Zero to one
var paddingPercent : float = 0;

function Start() {
  SnapToViewportRight();
}

function SnapToViewportRight() {
  var frame = new TwoDee(gameObject);
  var x = Screen2D.worldWidth() - frame.width * paddingPercent; // works for right-anchored objects
  var textMesh = transform.GetComponent.<TextMesh>();
  if (textMesh) {
    switch(textMesh.anchor) {
      case TextAnchor.UpperCenter:
      case TextAnchor.MiddleCenter:
      case TextAnchor.LowerCenter:
        x -= frame.width / 2.0;
        break;
      case TextAnchor.UpperLeft:
      case TextAnchor.MiddleLeft:
      case TextAnchor.LowerLeft:
        x -= frame.width;
        break;
    }
  }
Debug.Log('snapping X to ' + x);
  var oldPos = frame.position;
  transform.position = Vector3(x, oldPos.y, oldPos.z);
}
