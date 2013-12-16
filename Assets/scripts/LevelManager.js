#pragma strict

var BUCKET_ASPECT_RATIO = 1.0 / 1.5; // x / y
var MARGIN_MULT_X = 1.05;
var MARGIN_MULT_Y = 1.05;

var TIMER_MATCH_MARGIN = 0.5;

var FLAGS_PER_LEVEL = 2;
var MATCHES_REQUIRED = 3;

class LevelManager extends ScriptableObject {
  static var _instance : LevelManager;
  var _gameManager : GameManager;
  var _levelTimer : GameObject;
  var _root : GameObject;
  var _instanceInitialized = false;
  var _lockedTimers = new ArrayList();
  var _timerMinTime = 15.0;
  var _timerMaxTime = 25.0;
  var _stageNumber = 1;
  var _missionStageCount = 4;
  var _flagDeck : ShuffleDeck;
  var _musicManager : MusicManager;
  var _currentFlags : Sprite[];

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

  function OnEnable() {
    if (!_instanceInitialized) {
      loadFlags();
      loadMusic();
      _levelTimer = GameObject.Instantiate(Resources.Load('LevelTimer'));
    }
  }

  function StartLevel(rows : int, cols : int) {
    Debug.Log('Level is starting!');
    resetBoard();
    resetLevelState();
    selectFlags(FLAGS_PER_LEVEL);
    drawTimers(rows, cols);
    startMusic();
  }

  function AddLockedTimer(gameObject : GameObject) {
    _lockedTimers.Add(gameObject);
    checkMatch();
  }

  function RemoveLockedTimer(gameObject : GameObject) {
    _lockedTimers.Remove(gameObject);
  }

  function GetTimerCapacity() {
    return Random.Range(_timerMinTime, _timerMaxTime);
  }

  function GetTimerFlag() {
    var flag = _currentFlags[Random.Range(0, _currentFlags.Length)];
    return flag;
  }

  private function checkMatch() {
    var allTimersMatch = lockedTimersMatch();
    var enoughPicked = _lockedTimers.Count == MATCHES_REQUIRED;
Debug.Log('lockedTimers.Count: ' + _lockedTimers.Count);
Debug.Log('allTimersMatch: ' + allTimersMatch + ', enoughPicked: ' + enoughPicked);

    // Three possible states:
    // - They don't match (fail)
    // - Haven't picked 3 yet (do nothing)
    // - Picked 3 and they match (win)
    if (allTimersMatch) {
      if (enoughPicked) {
        nextStage();
      }
    } else {
      failMatch();
    }
  }

  private function nextStage() {
    _stageNumber++;
    Debug.Log('STAGE ' + _stageNumber);

    if (_stageNumber > _missionStageCount) {
      victoryCelebrate();
    } else {
      for (var timer : GameObject in _lockedTimers) {
        timer.SendMessage('RecycleTimer');
      }
      unlockAllTimers();
      _musicManager.playMore();
    }
  }

  private function victoryCelebrate() {
    // Show victory message
    // If all victories complete, show level victory message/animation, go to
    //   next level.
    Debug.Log('WIN!');
    iTween.Stop();
    _root.BroadcastMessage('animDestroy');
  }

  private function failMatch() {
    unlockAllTimers();
  }

  private function lockedTimersMatch() : boolean {
    var allMatch = true;
    var firstTimer = _lockedTimers[0] as GameObject;
    var targetTime : float = firstTimer.GetComponent.<TimerCountdown>().timeLeft;
    var targetCountry = firstTimer.GetComponent.<FlagManager>().countryName;

    for (var gameObject : GameObject in _lockedTimers) {
      var lockedTime = gameObject.GetComponent.<TimerCountdown>().timeLeft;
      var diff = Mathf.Abs(lockedTime - targetTime);
      var country = gameObject.GetComponent.<FlagManager>().countryName;
      allMatch = allMatch && diff <= TIMER_MATCH_MARGIN && country == targetCountry;
    }

    return allMatch;
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

  private function resetLevelState() {
    _stageNumber = 1;
  }

  private function selectFlags(count) {
    _currentFlags = new Sprite[count];
    _flagDeck.draw(count).CopyTo(_currentFlags);
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
      belt.transform.position.y = timer.height * (row + 1) * MARGIN_MULT_Y;
      belt.transform.parent = _root.transform;
    }

    var boardWidth = timer.width * colCount * MARGIN_MULT_X;
    var boardHeight = timer.height * rowCount * MARGIN_MULT_Y;
    _root.transform.Translate((Screen2D.worldWidth() - boardWidth) / 2.0, 0, 0);
  }
}

private function createBelt() : GameObject {
  // TODO: attach scrolling script or instantiate scrolling prefab (meh)
  var belt = new GameObject('Belt');
  belt.transform.position = Vector2.zero;
  return belt;
}

private function createTimer() : TwoDee {
  var timer = GameObject.Instantiate(Resources.Load('TimerSprite'));
  return new TwoDee(timer);
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

private function loadFlags() {
  var flags = Resources.LoadAll.<Sprite>('flags');
  for (var flag in flags) {
    flag.texture.name = flag.texture.name.Replace('_', ' ');
  }
  _flagDeck = new ShuffleDeck(flags);
  Debug.Log('FLAGS LOADED');
}

private function loadMusic() {
  _musicManager = Camera.main.GetComponent.<MusicManager>();
}

private function startMusic() {
  _musicManager.play();
}

private function stopMusic() {
  _musicManager.fadeStop();
}

private function musicNext() {
  _musicManager.cueNextTrack();
}
