class Screen2D {
  static function worldWidth() : float {
    return Camera.main.ViewportToWorldPoint(Vector3(1,0,0)).x;
  }
  static function worldHeight() : float {
    return Camera.main.ViewportToWorldPoint(Vector3(0,1,0)).y;
  }
}
