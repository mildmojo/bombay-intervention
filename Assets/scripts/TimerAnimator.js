#pragma strict

var destroyTime = 0.7;

function Start () {

}

function Update () {

}

function animRecycle(callback : function()) {
  var oldScale = transform.localScale;
  iTween.ShakePosition(gameObject, iTween.Hash(
    'amount', transform.renderer.bounds.size * 0.1
    ,'time', destroyTime * 0.3
  ));
  iTween.ScaleTo(gameObject, iTween.Hash(
    'scale', Vector3(0,0,0)
    ,'delay', destroyTime * 0.3
    ,'time', destroyTime * 0.7
    ,'easetype', 'easeOutQuint'
  ));
  yield WaitForSeconds(destroyTime);
  callback();
  iTween.ScaleTo(gameObject, iTween.Hash(
    'scale', oldScale
    ,'time', destroyTime
    ,'easetype', 'easeOutBack'
  ));
}

function animDestroy() {
  iTween.ShakePosition(gameObject, iTween.Hash(
    'amount', transform.renderer.bounds.size * 0.1
    ,'time', destroyTime * 0.3
  ));
  iTween.ScaleTo(gameObject, iTween.Hash(
    'scale', Vector3(0,0,0)
    ,'delay', destroyTime * 0.3
    ,'time', destroyTime * 0.7
    ,'easetype', 'easeOutQuint'
    ,'oncomplete', 'DestroyMe'
  ));
}

function animShake() {
  iTween.ShakePosition(gameObject, {
    'amount': transform.renderer.bounds.size * 0.1
    ,'time': 0.2
  });
}

function DestroyMe() {
  Destroy(gameObject);
}
