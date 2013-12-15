class ShuffleDeck {
  var lastReshuffle = 0;
  var _cards : ArrayList;
  var _nextCard = 0;

  function ShuffleDeck(list) {
    _cards = new ArrayList();
    for (var item in list) {
      _cards.Add(item);
    }
    reshuffle();
  }

  function get Count() : int { return _cards.Count; }
  function Add(item) { _cards.Add(item); return this; }
  function Remove(item) { _cards.Remove(item); return this; }
  function Sort() { _cards.Sort(); return this; }

  function reshuffle() {
    var newDeck = new ArrayList();
    var random = new Random();
    while (_cards.Count > 0) {
      var idx = Random.Range(0, _cards.Count);
      newDeck.Add(_cards[idx]);
      _cards.RemoveAt(idx);
    }
    _cards = newDeck;
    _nextCard = 0;
    lastReshuffle++;
  }

  function draw(count : int) : ArrayList {
    var hand = new ArrayList();
    if (count > _cards.Count) count = _cards.Count;

    while (hand.Count < count) {
      var card = draw();
      hand.Add(card);
    }

    return hand;
  }

  function draw() {
    if (_nextCard >= _cards.Count) {
      reshuffle();
    }

    return _cards[_nextCard++];
  }
}
