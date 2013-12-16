#pragma strict

var timeCapacity : float;
var timeLeft : float;
var isDying : boolean;
var isLocked : boolean;
private var _startedAt = 0;
private var _timeText : TextMesh;
private var _timeTextDark : TextMesh;
private var _timerAnimator : TimerAnimator;
private var _highlight : SpriteRenderer;
private var _levelManager : LevelManager;
private var _flagManager : FlagManager;
private var _lastCapacityMin : float;
private var _lastCapacityMax : float;

function Start () {
  _timeText = transform.Find('TimerText').GetComponent.<TextMesh>();
  _timeTextDark = transform.Find('TimerTextDark').GetComponent.<TextMesh>();
  _timerAnimator = gameObject.GetComponent.<TimerAnimator>();
  _flagManager = gameObject.GetComponent.<FlagManager>();
  _highlight = transform.Find('Highlight').GetComponent.<SpriteRenderer>();
  _levelManager = LevelManager.Instance();
  resetTimerSettings();
}

function Update () {
  if (!isLocked && !isDying) {
    timeLeft = (timeCapacity - (Time.time - _startedAt));
  }

  if (timeLeft > 0) {
    var timeDisplay = isLocked ? parseInt(timeLeft) : timeLeft;
    _timeText.text = timeDisplay.ToString('f1');
    _timeTextDark.text = timeDisplay.ToString('00.0');
  } else if (!isDying) {
    RecycleTimer();
  }
}

function RecycleTimer() {
  isDying = true;
  _timerAnimator.animRecycle(function(){
    resetTimerSettings();
  });
}

function RandomizeCapacity(min : float, max : float) {
  _lastCapacityMin = min;
  _lastCapacityMax = max;
  timeCapacity = Random.Range(min, max);
}

function OnMouseDown() {
Debug.Log('isLocked: ' + isLocked);
  if (!isLocked) {
    Lock();
  } else {
    Unlock();
  }
}

function Lock() {
  if (!isDying) {
    isLocked = true;
    ShowHighlight();
    _levelManager.AddLockedTimer(gameObject);
  }
}

function Unlock() {
  if (!isDying) {
    _startedAt = Time.time - (timeCapacity - timeLeft);
    HideHighlight();
    _levelManager.RemoveLockedTimer(gameObject);
    isLocked = false;
  }
}

function ShowHighlight() {
  _highlight.enabled = true;
}

function HideHighlight() {
  _highlight.enabled = false;
}

private function resetTimerSettings() {
  isDying = false;
  isLocked = false;
  HideHighlight();
  var newFlag = _levelManager.GetTimerFlag();
  _flagManager.setFlag(newFlag);
  timeCapacity = _levelManager.GetTimerCapacity();
  _startedAt = Time.time;
}
