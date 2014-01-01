#pragma strict

var BUCKET_ASPECT_RATIO = 1.0 / 1.25; // x / y
var MARGIN_MULT_X = 1.05;
var MARGIN_MULT_Y = 1.05;

class LevelManager extends ScriptableObject {
  static var _instance : LevelManager;
  var _gameManager : GameManager;
  var _levelTimerText : TextMesh;
  var _sfx : SoundEffects;
  var _bannerText : BannerTextManager;
  var _root : GameObject;
  var _instanceInitialized = false;
  var _lockedTimers = new ArrayList();
  var _timerMinTime = 15.0;
  var _timerMaxTime = 25.0;
  var _mission = new MissionPack.Mission();
  var _missionNum = 0;
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
      _sfx = Camera.main.GetComponent.<SoundEffects>();
      _bannerText = Camera.main.transform.Find('BannerText').GetComponent.<BannerTextManager>();
    }
  }

  function StartLevel(missionNum : int) {
    Debug.Log('Level is starting!');
    resetBoard();
    resetLevelState();
    selectMission(missionNum);
    selectFlags(_mission.flagCount);
    var startMessage = 'MISSION No. ' + (missionNum + 1) + '\n' +
                       'The year: ' + _mission.year + '.' +
                       ' Expected target: ' + _mission.city + '.';
    showBannerText(startMessage, function() {
      Debug.Log('Grid size: ' + _mission.cols + ' x ' + _mission.rows);
      drawTimers(_mission.rows, _mission.cols);
      startLevelTimer();
      startMusic();
    });
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

  function LevelTimerExpired() {
    // Do stuff when level timer expires. fail mission.
    failMission();
  }

  function stopLevelTimer() {
    if (_levelTimerText) {
      var countdown = _levelTimerText.gameObject.GetComponent.<LevelTimerCountdown>();
      countdown.stopTimer();
    }
  }

  function destroyLevelTimer() {
    if (_levelTimerText) {
      Destroy(_levelTimerText.gameObject);
    }
  }

  private function checkMatch() {
    var allTimersMatch = lockedTimersMatch();
    var enoughPicked = _lockedTimers.Count == _mission.matchesRequired;

    // Three possible states:
    // - They don't match (fail)
    // - Haven't picked 3 yet (do nothing)
    // - Picked 3 and they match (win)
    if (allTimersMatch) {
      if (enoughPicked) {
        _sfx.play('MatchSuccess');
        nextStage();
      }
    } else {
      _sfx.play('MatchFail');
      failMatch();
    }
  }

  private function nextStage() {
    _mission.currentStage++;
    Debug.Log('STAGE ' + _mission.currentStage);

    if (_mission.currentStage >= _mission.stageCount) {
      victoryCelebrate(function() {
        nextMission();
      });
    } else {
      for (var timer : GameObject in _lockedTimers) {
        timer.SendMessage('RecycleTimer');
      }
      unlockAllTimers();
      _musicManager.playMore();
    }
  }

  private function nextMission() {
    if (++_missionNum < MissionPack.Missions.Count) {
      StartLevel(_missionNum);
    } else {
      showGameSuccess(function() {
        _gameManager.SetState(GameManager.GameState.Menu);
      });
    }
  }

  private function victoryCelebrate(callback : function()) {
    // If all stages complete, show mission victory message/animation, go to
    //   next level.
    stopMusic();
    nextMusic();
    _sfx.play('MissionSuccess');
    Debug.Log('WIN!');
    iTween.Stop();
    _root.BroadcastMessage('animDestroy');
    stopLevelTimer();
    showMissionSuccess(callback);
  }

  private function showMissionSuccess(callback : function()) {
    var text = 'You have averted the ' + _mission.name() + '!';
    showBannerText(text, callback);
  }

  private function showGameSuccess(callback : function()) {
    var text = 'All interventions successful! Congratulations!';
    showBannerText(text, callback);
  }

  private function failMatch() {
    unlockAllTimers();
  }

  private function failMission() {
    // TODO: bad stuff when mission fails. back to menu.
    stopMusic();
    nextMusic();
    _sfx.play('MissionFail');
    Debug.Log('FAIL!');
    iTween.Stop();
    _root.BroadcastMessage('animDestroy');
    stopLevelTimer();
    showMissionFail();
  }

  private function showMissionFail() {
    var failMessage = MissionPack.Failures.draw();
    showBannerText(failMessage, function() {
      resetBoard();
      _gameManager.SetState(GameManager.GameState.Menu);
    });
  }

  private function showBannerText(text, callback) {
    _bannerText.registerDismissCallback(callback);
    _bannerText.setText(text);
    _bannerText.show();
  }


  private function lockedTimersMatch() : boolean {
    var allMatch = true;
    var firstTimer = _lockedTimers[0] as GameObject;
    var targetTime : int = firstTimer.GetComponent.<TimerCountdown>().timeLeft;
    var targetCountry = firstTimer.GetComponent.<FlagManager>().countryName;

    for (var gameObject : GameObject in _lockedTimers) {
      var lockedTime : int = gameObject.GetComponent.<TimerCountdown>().timeLeft;
      var diff = Mathf.Abs(lockedTime - targetTime);
      var country = gameObject.GetComponent.<FlagManager>().countryName;
      allMatch = allMatch && diff <= 0.1 && country == targetCountry;
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
  function resetBoard() {
    Debug.Log('Resetting board state.');
    _root = GameObject.Find('TimerRoot') as GameObject;
    if (_root) {
      Destroy(_root);
    }
    _root = new GameObject('TimerRoot');
    destroyLevelTimer();
  }

  private function resetLevelState() {
    _mission.currentStage = 1;
    _lockedTimers.Clear();
  }

  private function selectFlags(count) {
    _currentFlags = new Sprite[count];
    _flagDeck.draw(count).CopyTo(_currentFlags);
  }

  private function selectMission(missionNum) {
    _missionNum = missionNum;
    _mission = MissionPack.Missions[_missionNum];
    _mission.city = _mission.city != '' ? _mission.city : MissionPack.Cities.draw();
    _mission.crisis = _mission.crisis != '' ? _mission.crisis : MissionPack.Crises.draw();
    _mission.year = _mission.year != 0 ? _mission.year : Random.Range(1850, 1996);
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
  var timerCountdown = timer.GetComponent.<TimerCountdown>();
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

private function startLevelTimer() {
  if (!_levelTimerText) {
    var levelTimer : GameObject = GameObject.Instantiate(Resources.Load('LevelTimer'));
    _levelTimerText = levelTimer.GetComponent.<TextMesh>();
    var box = new TwoDee(_levelTimerText.gameObject);
    box.x = Screen2D.worldWidth() + box.width;
    box.y = Screen2D.worldHeight() + box.height;
  }
  var countdown = _levelTimerText.gameObject.GetComponent.<LevelTimerCountdown>();
  countdown.countdownFrom(_mission.timeLimit);
}

private function startMusic() {
  _musicManager.play();
}

private function stopMusic() {
  _musicManager.fadeStop();
}

private function nextMusic() {
  _musicManager.cueNextTrack();
}
