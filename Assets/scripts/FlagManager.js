#pragma strict

var flagSprite : Transform;

@HideInInspector
var countryName = '';

function Start() {
  flagSprite = transform.Find('Flag');
}

function setFlag(flag : Sprite) {
  countryName = flag.texture.name;

  flagSprite.GetComponent.<SpriteRenderer>().sprite = flag;
}
