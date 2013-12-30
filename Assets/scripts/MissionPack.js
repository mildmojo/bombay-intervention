#pragma strict
import MiniJSON;
import System.Collections.Generic;

class MissionPack {
  class Mission {
    var year = 0;
    var city = '';
    var crisis = '';
    var timeLimit = 120;
    var rows = 0;
    var cols = 0;
    var stageCount = 4;
    var currentStage = 0;
    var matchesRequired = 3;
    var flagCount = 2;

    static function fromDict(dict : Dictionary.<String, System.Object>) {
      var mission = new Mission();
      for (var key in dict.Keys) {
        switch(key) {
          case 'year':
            mission.year = dict[key];
            break;
          case 'city':
            mission.city = dict[key];
            break;
          case 'crisis':
            mission.crisis = dict[key];
            break;
          case 'timeLimit':
            mission.timeLimit = dict[key];
            break;
          case 'rows':
            mission.rows = dict[key];
            break;
          case 'cols':
            mission.cols = dict[key];
            break;
          case 'stageCount':
            mission.stageCount = dict[key];
            break;
          case 'currentStage':
            mission.currentStage = dict[key];
            break;
          case 'matchesRequired':
            mission.matchesRequired = dict[key];
            break;
          case 'flagCount':
            mission.flagCount = dict[key];
            break;
        }
      }
      return mission;
    }

    function name() { return city + ' ' + crisis; }
  }

  static var Missions = (function(){
    var missions = new List.<Mission>();
    var missionAsset = Resources.Load.<TextAsset>('missions');
    var json = missionAsset.text;
    var missionObjects = Json.Deserialize(json) as List.<System.Object>;
    for (var missionObject : Dictionary.<String, System.Object> in missionObjects) {
      missions.Add(Mission.fromDict(missionObject));
    }
    return missions;
  })();

  static var Cities = new ShuffleDeck([
    'Tokyo'
    ,'Seoul'
    ,'Pyongyang'
    ,'Ulan Bator'
    ,'Beijing'
    ,'Taipei'
    ,'Manila'
    ,'Hanoi'
    ,'Vientian'
    ,'Bangkok'
    ,'Singapore'
    ,'Jakarta'
    ,'Katmandu'
    ,'New Delhi'
    ,'Islamabad'
    ,'Baghdad'
    ,'Jerusalem'
    ,'Cairo'
    ,'Casablanca'
    ,'Istanbul'
    ,'Athens'
    ,'Kiev'
    ,'Moscow'
    ,'Rome'
    ,'Paris'
    ,'Berlin'
    ,'London'
    ,'Madrid'
    ,'Lisbon'
    ,'Washington D.C.'
    ,'San Francisco'
    ,'Mexico City'
    ,'Buenos Aires'
    ,'Santiago'
  ]);

  static var Crises = new ShuffleDeck([
    'Disaster'
    ,'Calamity'
    ,'Misadventure'
    ,'Mischance'
    ,'Misfortune'
    ,'Mishap'
    ,'Visitation'
    ,'Adversity'
    ,'Destruction'
    ,'Devastation'
    ,'Hardship'
    ,'Accident'
    ,'Catastrophe'
    ,'Conflict'
    ,'Confusion'
    ,'Crisis'
    ,'Disturbance'
    ,'Event'
    ,'Misery'
    ,'Revolution'
    ,'Debacle'
    ,'Meltdown'
    ,'Mischief'
  ]);

  static var MinorEvents = new ShuffleDeck([
    "You have won admission to the Olympic Games as a discus thrower."
    ,"Your disguise as a homeless madman passes scrutiny."
    ,"With minor surgery you smuggle a gun in your wooden leg."
    ,"The prime minister promises an invitation to dinner… for a kiss."
    ,"The guard dog eats the drugged peanut butter sandwich."
    ,"You have infiltrated the ninja compound."
    ,"You hide in a lifeboat as the ship weighs anchor."
    ,"By painting your skin gold, you infiltrate the club."
    ,"You penetrate the bunker through the air vents."
    ,"No one notices as you change your wig and clothes."
    ,"Your dancing grace wins the eye of the minister of defense."
    ,"Your tracking device makes tailing the suspect easy."
    ,"You find a hidden cache of weapons."
    ,"The clowns never even see you coming."
    ,"You do a cartwheel over the laser light."
    ,"Your vaccinations prove adequate."
    ,"Someone has placed a note in your suit pocket."
    ,"Your disguise as a doughboy passes muster."
    ,"The leaden fedora successfully shields your thoughts."
    ,"Why yes, you do know the tango."
    ,"You swipe a confidential cable."
    ,"Your pursuers dance on a floor full of marbles."
  ]);

  static var MajorEvents = new ShuffleDeck([
    "You throw a discus with supreme skill, killing the killer bear."
    ,"With a casual grace, you fling your coffee into the computer port."
    ,"You bludgeon the ninja assassin with your wooden leg."
    ,"The poison lipstick works!"
    ,"You open the door with your credit card."
    ,"With the snip of a wire, you defuse the bomb."
    ,"You have guessed the disarm code!"
    ,"The explosion doesn’t quite kill you!"
    ,"You pull out the cleverly hidden handcuff key."
    ,"With a flick of the wrist you have a third Ace."
    ,"You tightrope walk from one building to the next."
    ,"Your parachute opens just in time!"
    ,"With a sweep of your leg you disarm the robot!"
    ,"The electric eel is eaten by the shark! You swim to safety."
    ,"You replace the detonator with a fake!"
    ,"The antidote starts to take effect. Your head clears!"
    ,"You wreck the steering mechanism!"
    ,"The boiling oil misses you entirely!"
    ,"The ambassador falls for your fakery."
    ,"You engage the power plant's emergency shutdown."
  ]);

  static var Failures = new ShuffleDeck([
    "Ravening bears flood the city streets!"
    ,"Nuclear meltdown floods the city with radiation!"
    ,"Ninjas assassinate the Pope!"
    ,"El Presidente has been kidnapped!"
    ,"The missile is launched!"
    ,"With a cough and a sniffle you are the first to succumb to disease!"
    ,"Your skin melts as acid pours from the ceiling!"
    ,"The poison gas reaches the air circulator!"
    ,"The paratroopers have landed!"
    ,"The volcano explodes, burying the city in ash and fire!"
    ,"An earthquake heaves and the city is shattered!"
    ,"The city is swallowed by the sea!"
    ,"Sharks eat your legs!"
    ,"The zombies eat your brains!"
    ,"Cthulu rises!"
    ,"Martians have mind-controlled the Pope!"
    ,"The world's economies collapse! Again!"
    ,"Sunshine scorches the ozone-depleted planet!"
  ]);
}
