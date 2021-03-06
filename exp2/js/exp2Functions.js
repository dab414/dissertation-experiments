function generateTransitionArray(nSwitches) {
  // Takes as input the number of switches that should occur out of 16 total transitions
  // Returns an array of length 17 where each element is string containing a color: 'red' or 'blue'
    // Where the number of switches between colors equals nSwitches

  // Initialize array with values 1:16 to use as indices
  var indicesContainer = []
  for (i = 1; i < 17; i++) {
    indicesContainer[i-1] = i; 
  }

  // Initialize out vector with random starting color
  var out = [];
  out[0] = Math.random(1) > .5 ? 'blue' : 'red';

  // Start everything at repeat
  for (i = 0; i < 17; i++) {
    if (i) {
      out[i] = 'repeat';
    }
  }

  // Randomly set nSwitch number of elements in out to switch
  for (i = 0; i < nSwitches; i++) {
    out[getRandomFromBucket(indicesContainer)] = 'switch';
  }

  // Convert 'switch' and 'repeat' to their color values based on the starting color
  for (i = 1; i < out.length; i++) {
    if (out[i] == 'repeat') {
      out[i] = out[i-1];
    } else {
      out[i] = out[i-1] == 'red' ? 'blue' : 'red';
    }
  }

  return out;

} // end generateTransitionArray()

function getRandomFromBucket(bucket) {
  var randomIndex = Math.floor(Math.random()*bucket.length);
  return bucket.splice(randomIndex, 1)[0];
}


function createConditionOrder() {
  // Returns an array of dicts
  // Where each dict:
    // {'id': 'HE', 'pSwitch': {'safe': 11, 'risky': 14}}

  var conditionHolder = [
    {
      'name': 'HE',
      'pSwitch': {'safe': 11, 'risky': 14}
    },

    {
      'name': 'HM',
      'pSwitch': {'safe': 10, 'risky': 12}
    },

    {
      'name': 'EE',
      'pSwitch': {'safe': 5, 'risky': 2}
    },

    {
      'name': 'EM',
      'pSwitch': {'safe': 6, 'risky': 4}
    }
  ]

  var conditionOrder = []

  for (i = 0; i < 4; i++) {
    conditionOrder.push(getRandomFromBucket(conditionHolder));
  }

  return conditionOrder;

}

function getDeckCode(currentCondition) {
  // Takes in current condition (see above)
  // Returns an object sorting the current condition by deck parameters
    // {'left': {'name:' 'risky', 'pSwitch': {'top': 8, 'bottom': 14}}}

  // Initialize the two decks
  var riskyDeck = {'name': 'riskyDeck'};
  var safeDeck = {'name': 'safeDeck', 'pSwitch': {'top': currentCondition['pSwitch']['safe']}};

  // Determine the location (top / bottom) for the two outcomes of the risky deck randomly
  var top = Math.random() > .5 ? 8 : currentCondition['pSwitch']['risky'];
  var bottom = top == 8 ? currentCondition['pSwitch']['risky'] : 8;

  // Assign them to riskyDeck
  riskyDeck['pSwitch'] = {'top': top, 'bottom': bottom};

  // Shuffle left/right and return
  return getDeckLocation(riskyDeck, safeDeck, '', 2);

}


function determineOutcomePswitch(chosenDeckLocation, deckCode) {
  // Takes in the chosen deck location and deckCode (obv)
  // Returns dict containing selected pSwitch and the spatial position of the selected outcome:
    // {'pSwitch': 8, 'horizontal': 'left', 'vertical': 'top'}

  var out = {'horizontal': chosenDeckLocation};

  if (deckCode[chosenDeckLocation]['name'] == 'safeDeck') {
    out['vertical'] = 'Top';
    out['pSwitch'] = deckCode[chosenDeckLocation]['pSwitch']['top'];
  } else {
    if (Math.random() > .5) {
      out['pSwitch'] = deckCode[chosenDeckLocation]['pSwitch']['top']
      out['vertical'] = 'Top';
    } else {
      out['pSwitch'] = deckCode[chosenDeckLocation]['pSwitch']['bottom']
      out['vertical'] = 'Bottom';
    }
  }

  return out;

}

