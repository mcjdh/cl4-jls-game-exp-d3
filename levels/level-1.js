const level = {
  id: 'level-1',
  name: 'The Missing Goat',
  opening_message: "The prized goat is missing!",
  locations: {
    'farm': {
      id: 'farm',
      name: 'The Farm',
      description: 'A sprawling farm, strangely quiet. The main gate hangs open.',
      connections: {
        north: 'field',
        east: 'barn'
      },
      items: ['clue1_wool'],
      npcs: ['farmer']
    },
    'barn': {
      id: 'barn',
      name: 'The Barn',
      description: 'An old wooden barn. It smells of hay and animals. There\'s a ladder leading up.',
      connections: {
        west: 'farm',
        up: 'barn-loft'
      },
      items: ['clue3_sound'],
      npcs: []
    },
    'field': {
      id: 'field',
      name: 'The Field',
      description: 'A wide, open field adjacent to the farm. The grass is trampled in places.',
      connections: {
        south: 'farm'
      },
      items: ['clue2_tracks'],
      npcs: []
    },
    'barn-loft': {
      id: 'barn-loft',
      name: 'The Barn Loft',
      description: 'A dusty barn loft. It\'s dark and filled with old equipment. After a moment, your eyes adjust and you spot Geraldine, the goat, huddled in the corner!',
      connections: {
        down: 'barn'
      },
      items: [],
      npcs: []
    }
  },
  npcs: {
    'farmer': {
      id: 'farmer',
      name: 'Worried Farmer',
      location: 'farm',
      dialogue: {
        initial: "Oh, thank goodness you're here! My prized goat, Geraldine, is missing! She's the G.O.A.T. around here! Please, you have to help me find her. Look around for any clues!",
        foundClue1: "You found a tuft of her wool near the barn door? Interesting... where could that lead?",
        foundClue2: "Tracks leading from the field towards the barn? Hmm, I didn't check up in the loft...",
        foundAllClues: "You've found several clues pointing to the barn! Maybe check the loft thoroughly?",
        goatFound: "You found her! Oh, Geraldine! Thank you, thank you!"
      }
    }
  },
  items: {
    'clue1_wool': {
      id: 'clue1_wool',
      name: 'Tuft of Wool',
      description: 'A small tuft of coarse white wool, caught on the barn door hinge. It feels familiar.',
      on_take: "You pocket the tuft of wool. It looks just like Geraldine's."
    },
    'clue2_tracks': {
      id: 'clue2_tracks',
      name: 'Animal Tracks',
      description: 'Sets of small, cloven hoof prints in the soft earth, leading from the field towards the barn.',
      on_take: "The tracks are definitely goat-sized and head towards the barn."
    },
    'clue3_sound': {
      id: 'clue3_sound',
      name: 'Faint Sound',
      description: 'Standing at the base of the ladder in the barn, you hear a faint bleating sound from above.',
      on_take: "It's hard to be sure, but that sounds like a goat... and it's coming from the loft."
    }
  },
  puzzles: {},
  ascii: {},
  startLocation: 'farm',
  endCondition: function(gameState) {
    if (!gameState || !gameState.inventory || !gameState.currentLocation) {
      return false;
    }
    const hasClue1 = gameState.inventory.includes('clue1_wool');
    const hasClue2 = gameState.inventory.includes('clue2_tracks');
    const hasClue3 = gameState.inventory.includes('clue3_sound');
    const inBarnLoft = gameState.currentLocation === 'barn-loft';

    if (hasClue1 && hasClue2 && hasClue3 && inBarnLoft) {
      return true;
    }
    return false;
  },
  onComplete: function(gameState) {
    // The game engine calls this function when endCondition returns true.
    // This is where level-specific completion logic happens.

    // For QUICK-003, the main requirement is discovering the goat.
    // A message is good for now. The engine might handle more complex UI updates.
    const victoryMessage = "Victory! You found Geraldine, the prized goat, hiding in the barn loft! The Worried Farmer will be overjoyed.";
    console.log(victoryMessage);

    // Game engine integration point:
    // The engine could now:
    // 1. Display this message in the game's UI.
    // 2. Update the Worried Farmer's NPC state to use the 'goatFound' dialogue.
    //    Example: if (gameState && this.npcs.farmer) {
    //               gameState.setNpcDialogueState('farmer', 'goatFound');
    //            }
    // 3. Potentially unlock new areas, items, or the next level.
    // 4. Save the game state marking this level as complete.

    // For the purpose of this QUICK-003 task, the console log and clear indication of
    // where engine integration would occur is sufficient.
    return {
        message: victoryMessage,
        nextActions: ["updateFarmerDialogueToFound", "triggerLevelEndSequence"] // Example data for engine
    };
  }
};

export default level;
