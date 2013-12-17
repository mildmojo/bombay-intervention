#pragma strict

@HideInInspector
public var isRunning = false;

public var timeCapacity : int;
public var timeLeft : float;

private var _levelManager : LevelManager;
private var _startedAt : float;
private var _timeText : TextMesh;
private var _timeTextDark : TextMesh;

function Start () {
  _levelManager = LevelManager.Instance();
  _timeText = transform.GetComponent.<TextMesh>();
  _timeTextDark = transform.Find('Shadow').GetComponent.<TextMesh>();
}

function Update () {
  if (isRunning) {
    timeLeft = (timeCapacity - (Time.time - _startedAt));

    if (timeLeft <= 0) {
      _levelManager.LevelTimerExpired();
      timeLeft = 0;
      isRunning = false;
    }

    var mins = parseInt(timeLeft / 60);
    var secs = parseInt(timeLeft % 60);
    _timeText.text = String.Format('{0:0}', mins) + ':' + String.Format('{0:00}', secs);
    _timeTextDark.text = String.Format('{0:00}', mins) + ':' + String.Format('{0:00}', secs);
  }
}

function startTimer() {
  isRunning = true;
}

function stopTimer() {
  isRunning = false;
}

function countdownFrom(timeLimit : int) {
  timeCapacity = timeLimit;
  _startedAt = Time.time;
  startTimer();
}
