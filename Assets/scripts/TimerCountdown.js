#pragma strict

var timeCapacity : float;
var _startedAt = 0;
var _timeText : TextMesh;
var _timeTextDark : TextMesh;

function Start () {
  _startedAt = Time.time;
  _timeText = transform.Find('TimerText').GetComponent('TextMesh') as TextMesh;
  _timeTextDark = transform.Find('TimerTextDark').GetComponent('TextMesh') as TextMesh;
}

function Update () {
  var timeLeft = (timeCapacity - (Time.time - _startedAt));
  _timeText.text = timeLeft.ToString('f1');
  _timeTextDark.text = timeLeft.ToString('00.0');
}
