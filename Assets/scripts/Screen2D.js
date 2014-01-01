class Screen2D {
  static function worldWidth() : float {
    return Camera.main.ViewportToWorldPoint(Vector3(1,0,0)).x;
  }
  static function worldHeight() : float {
    return Camera.main.ViewportToWorldPoint(Vector3(0,1,0)).y;
  }
  static function worldCenter() {
    return worldCenterAtZ(0);
  }
  static function worldCenterAtZ(gameObject : GameObject) {
    return worldCenterAtZ(gameObject.transform.position.z);
  }
  static function worldCenterAtZ(z) {
    return Vector3(Camera.main.transform.position.x, Camera.main.transform.position.y, z);
  }
}
