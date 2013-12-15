#pragma strict

var BUCKET_ASPECT_RATIO = 1.0 / 1.5; // x / y
var MARGIN_MULT_X = 1.05;
var MARGIN_MULT_Y = 1.05;

var TIMER_MATCH_MARGIN = 0.5;

class LevelManager extends ScriptableObject {
  static var _instance : LevelManager;
  var _gameManager : GameManager;
  var _root : GameObject;
  var _lockedTimers = new ArrayList();
  var _timerMinTime = 15.0;
  var _timerMaxTime = 25.0;

  static function Instance() {
    if (!_instance) {
      _instance = ScriptableObject.CreateInstance('LevelManager') as LevelManager;
    }
    return _instance;
  }

  static function Instance(gameManager : GameManager) : LevelManager {
    Instance();
    _instance._gameManager = gameManager;
    return _instance;
  }

  function StartLevel(rows : int, cols : int) {
    Debug.Log('Level is starting!');
    resetBoard();
    drawTimers(rows, cols);
  }

  function AddLockedTimer(gameObject : GameObject) {
    _lockedTimers.Add(gameObject);
    if (lockedThreeSuccess()) {
      celebrateVictory();
    } else if (lockedThreeFail()) {
      unlockAllTimers();
    }
  }

  function RemoveLockedTimer(gameObject : GameObject) {
    _lockedTimers.Remove(gameObject);
  }

  function RecycleTimer(gameObject : GameObject) {
    // TODO: change out flag/country from this level's group
    randomizeTimer(gameObject);
    restartTimer(gameObject);
  }

  private function celebrateVictory() {
    // Show victory message
    // If all victories complete, show level victory message/animation, go to
    //   next level.
    iTween.Stop();
    yield WaitForSeconds(0.1);
    _root.BroadcastMessage('animDestroy');
    Debug.Log('WIN!');
  }

  private function lockedThreeSuccess() : boolean {
    var success = _lockedTimers.Count == 3;
    var firstTimer = _lockedTimers[0] as GameObject;
    var targetTime : float = (firstTimer.GetComponent('TimerCountdown') as TimerCountdown).timeLeft;
    for (var gameObject : GameObject in _lockedTimers) {
      var lockedTime : float = (gameObject.GetComponent('TimerCountdown') as TimerCountdown).timeLeft;
      var diff = Mathf.Abs(lockedTime - targetTime);
      if (diff > TIMER_MATCH_MARGIN) {
        success = false;
      }
    }
    return success;
  }

  private function lockedThreeFail() : boolean {
    var failure = false;
    var firstTimer = _lockedTimers[0] as GameObject;
    var targetTime : float = (firstTimer.GetComponent('TimerCountdown') as TimerCountdown).timeLeft;
    for (var gameObject : GameObject in _lockedTimers) {
      var lockedTime : float = (gameObject.GetComponent('TimerCountdown') as TimerCountdown).timeLeft;
      var diff = Mathf.Abs(lockedTime - targetTime);
      if (diff > TIMER_MATCH_MARGIN) {
        failure = true;
      }
    }
    return failure;
  }

  private function unlockAllTimers() {
    // Clone list so 'Unlock' can't trigger changes to the array while iterating.
    for (var gameObject : GameObject in _lockedTimers.Clone()) {
      gameObject.SendMessage('Unlock');
    }
    _lockedTimers.Clear();
  }

  // Clear old board
  private function resetBoard() {
    _root = GameObject.Find('TimerRoot') as GameObject;
    if (_root) {
      UnityEngine.Object.Destroy(_root);
    }
    _root = new GameObject('TimerBoard');
  }

  // Instantiate timers/belts
  // Tween them into starting locations
  private function drawTimers(rowCount : int, colCount : int) {
    var belt : GameObject;
    var timer : TwoDee;
    var timerScale : float;

    for (var row = 0; row < rowCount; row++) {
      belt = createBelt();

      for (var col = 0; col < colCount; col++) {
        timer = createTimer();

        if (!timerScale) {
          timerScale = spriteScaleToFit(timer.gameObject, colCount, bucketWidth());
        }
        timer.scale(timerScale);
        timer.left = timer.width * col * MARGIN_MULT_X;
        timer.top = 0;
        timer.parent = belt.transform;
        randomizeTimer(timer.gameObject);
      }
      belt.transform.position.y = timer.height * row * MARGIN_MULT_Y;
      belt.transform.parent = _root.transform;
    }

    var boardWidth = timer.width * colCount * MARGIN_MULT_X;
    var boardHeight = timer.height * rowCount * MARGIN_MULT_Y;
    _root.transform.Translate((Screen2D.worldWidth() - boardWidth) / 2.0, 0, 0);
  }
}

private function viewportHeight() {
  return Camera.main.orthographicSize * 2;
}

private function createBelt() : GameObject {
  // TODO: attach scrolling script or instantiate scrolling prefab (meh)
  var belt = new GameObject('Belt');
  belt.transform.position = Vector2.zero;
  return belt;
}

private function createTimer() : TwoDee {
  return new TwoDee(GameObject.Instantiate(Resources.Load('TimerSprite')));
}

private function bucketWidth() : float {
  return Camera.main.ViewportToWorldPoint(Vector3(0,1,0)).y * BUCKET_ASPECT_RATIO;
}

private function spriteScaleToFit(sprite, count : int, maxWidth : float) : float {
  var targetWidth = maxWidth / count;
  var currentWidth = dimensions(sprite).x;
  return targetWidth / currentWidth;
}

private function dimensions(sprite : GameObject) {
  return sprite.renderer.bounds.size;
}

private function randomizeTimer(timer : GameObject) {
  var timerCountdown = timer.GetComponent('TimerCountdown') as TimerCountdown;
  timerCountdown.RandomizeCapacity(_timerMinTime, _timerMaxTime);
}

private function restartTimer(timer : GameObject) {
  var timerCountdown = timer.GetComponent('TimerCountdown') as TimerCountdown;
  timerCountdown.Restart();
}
