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
private var _lastCapacityMin : float;
private var _lastCapacityMax : float;

function Start () {
  _startedAt = Time.time;
  _timeText = transform.Find('TimerText').GetComponent('TextMesh') as TextMesh;
  _timeTextDark = transform.Find('TimerTextDark').GetComponent('TextMesh') as TextMesh;
  _timerAnimator = gameObject.GetComponent('TimerAnimator') as TimerAnimator;
  _highlight = transform.Find('Highlight').GetComponent('SpriteRenderer') as SpriteRenderer;
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
    isDying = true;
    _timerAnimator.animRecycle(function(){
      _levelManager.RecycleTimer(gameObject);
      isDying = false;
      isLocked = false;
    });
  }
}

function RandomizeCapacity(min : float, max : float) {
  _lastCapacityMin = min;
  _lastCapacityMax = max;
  timeCapacity = Random.Range(min, max);
}

function OnMouseDown() {
  if (!isLocked) {
    Lock();
  } else {
    Unlock();
  }
}

function Lock() {
  isLocked = true;
  timeLeft = Mathf.Round(timeLeft);
  ShowHighlight();
  _levelManager.AddLockedTimer(gameObject);
}

function Unlock() {
  isLocked = false;
  timeCapacity = timeLeft;
  Restart();
  HideHighlight();
  _levelManager.RemoveLockedTimer(gameObject);
}

function Restart() {
  _startedAt = Time.time;
}

function ShowHighlight() {
  _highlight.enabled = true;
}

function HideHighlight() {
  _highlight.enabled = false;
}
