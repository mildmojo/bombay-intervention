private var _completeCallback : function();
private var _dismissCallback : function();
private var _text : TextMesh;

function Start() {
  _text = transform.Find('Text').GetComponent.<TextMesh>();
}

function OnMouseDown() {
  hide();
}

function setText(text) {
  _text.text = text;
}

function show() {
Debug.Log('MOVI');
  var centerPosition = Vector3(Camera.main.transform.position.x, Camera.main.transform.position.y, transform.position.z);
  iTween.MoveTo(gameObject, iTween.Hash(
    'position', centerPosition
    ,'easetype', 'easeInOutBack'
    ,'time', 1.0
    ,'oncomplete', 'onComplete'
  ));
}

function hide() {
  Debug.Log('HIDE');
  iTween.MoveTo(gameObject, iTween.Hash(
    'position', transform.position - Vector3(0, Screen2D.worldHeight() * 2, 0)
    ,'easetype', 'easeInOutBack'
    ,'time', 1.0
    ,'oncomplete', 'onDismiss'
  ));
}

function registerCompleteCallback(callback : function()) {
  _completeCallback = callback;
}

function registerDismissCallback(callback : function()) {
  _dismissCallback = callback;
}

function onComplete() {
  if (_completeCallback) {
    _completeCallback();
    _dismissCallback = null;
  }
}

function onDismiss() {
  if (_dismissCallback) {
    _dismissCallback();
    _dismissCallback = null;
  }
}
