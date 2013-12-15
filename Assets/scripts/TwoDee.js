#pragma strict

class TwoDee {
  var gameObject : GameObject;

  function TwoDee(newGameObj : GameObject) {
    gameObject = newGameObj;
  }

  function get x() : float          { return gameObject.transform.position.x; }
  function set x(value : float)     { gameObject.transform.position.x = value; }
  function get y() : float          { return gameObject.transform.position.y; }
  function set y(value : float)     { gameObject.transform.position.y = value; }
  function get left() : float       { return x - width / 2; }
  function set left(value : float)  { x = value + width / 2; }
  function get top() : float        { return y + height / 2; }
  function set top(value : float)   { y = value - height / 2; }
  function get position() : Vector3 { return gameObject.transform.position; }
  function set position(value)      { gameObject.transform.position = value; return value; }
  function get height() : float     { return dimensions().y; }
  function get width() : float      { return dimensions().x; }
  function get parent() : Transform { return gameObject.transform.parent; }
  function set parent(value)        { gameObject.transform.parent = value; }

  // These threw some kind of "Invalid IL instruction" error on set. No idea why.

  function scale(multiplier : float) {
    gameObject.transform.localScale *= multiplier;
  }

  private function dimensions() {
    return gameObject.renderer.bounds.size;
  }
}
