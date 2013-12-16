class MultitrackAudio {
  public var clips : AudioClip[];

  private var _clipDeck : ShuffleDeck;

  function get clipDeck() {
    if (!_clipDeck) {
      _clipDeck = new ShuffleDeck(clips);
    }
    return _clipDeck;
  }
}
