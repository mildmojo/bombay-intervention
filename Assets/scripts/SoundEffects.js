var LockedTimer : AudioClip;
var MissionSuccess : AudioClip;
var MissionFail: AudioClip;
var MatchSuccess : AudioClip;
var MatchFail : AudioClip;
var UnlockedTimer : AudioClip;

function play(clipName) {
  var clip : AudioClip;
  switch(clipName) {
    case 'LockedTimer':
      clip = LockedTimer;
      break;
    case 'MissionSuccess':
      clip = MissionSuccess;
      break;
    case 'MissionFail':
      clip = MissionFail;
      break;
    case 'MatchSuccess':
      clip = MatchSuccess;
      break;
    case 'MatchFail':
      clip = MatchFail;
      break;
    case 'UnlockedTimer':
      clip = UnlockedTimer;
      break;
  };
  audio.PlayOneShot(clip);
}
