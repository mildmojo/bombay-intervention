#pragma strict

var timeCapacity : float;
var timeLeft : float;
var isDying : boolean;
var isLocked : boolean;
private var _startedAt = 0;
private var _timeText : TextMesh;
private var _timeTextDark : TextMesh;
private var _timerAnimator : TimerAnimator;
private var _levelManager : LevelManager;

function Start () {
  _startedAt = Time.time;
  _timeText = transform.Find('TimerText').GetComponent('TextMesh') as TextMesh;
  _timeTextDark = transform.Find('TimerTextDark').GetComponent('TextMesh') as TextMesh;
  _timerAnimator = gameObject.GetComponent('TimerAnimator') as TimerAnimator;
  _levelManager = LevelManager.Instance();
}

function Update () {
  if (isDying) return;

  if (!isLocked) {
    timeLeft = (timeCapacity - (Time.time - _startedAt));
  }

  if (timeLeft > 0) {
    _timeText.text = timeLeft.ToString('f1');
    _timeTextDark.text = timeLeft.ToString('00.0');
  } else {
    _timerAnimator.animDestroy();
    isDying = true;
  }
}

function RandomizeCapacity(min : float, max : float) {
  timeCapacity = Random.Range(min, max);
}

function OnMouseDown() {
  if (!isLocked) {
    Lock();
    timeLeft = Mathf.Round(timeLeft);
    _levelManager.AddLockedTimer(gameObject, timeLeft);
  } else {
    Unlock();
  }
}

function Lock() {
  isLocked = true;
}

function Unlock() {
  isLocked = false;
}
