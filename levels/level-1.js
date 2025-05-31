// Make level data globally accessible for the MVP
window.levelData_level1 = {
  id: 'level-1',
  name: 'The Missing Goat',
  opening_message: "The prized goat is missing! You must help the farmer find Geraldine.",
  startLocation: 'farm',
  locations: {
    'farm': {
      id: 'farm',
      name: 'The Farm',
      description: 'A sprawling farm, strangely quiet. The main gate hangs open. You can go NORTH to the field or EAST to the barn.',
      connections: {
        north: 'field',
        east: 'barn'
      },
      items: ['wool'],
      npcs: ['farmer']
    },
    'barn': {
      id: 'barn',
      name: 'The Barn',
      description: 'An old wooden barn. It smells of hay and animals. There\'s a ladder leading UP to the loft. You can go WEST back to the farm.',
      connections: {
        west: 'farm',
        up: 'loft'
      },
      items: [],
      npcs: []
    },
    'field': {
      id: 'field',
      name: 'The Field',
      description: 'A wide, open field. The grass is trampled in places. You notice some tracks. You can go SOUTH back to the farm.',
      connections: {
        south: 'farm'
      },
      items: ['tracks'],
      npcs: []
    },    'loft': {
      id: 'loft',
      name: 'The Barn Loft',
      description: 'A dusty barn loft filled with hay. Wait... is that movement in the corner? It\'s Geraldine the goat! You can go DOWN to the barn.',
      connections: {
        down: 'barn'
      },
      items: [],
      npcs: [],
      special: 'goat_found'
    }
  },
  npcs: {
    'farmer': {
      id: 'farmer',
      name: 'Worried Farmer',
      location: 'farm',
      dialogue: {
        initial: "Oh, thank goodness you're here! My prized goat, Geraldine, is missing! She's the G.O.A.T. around here! Please, you have to help me find her. Look around for any clues!",
        foundClue1: "You found a tuft of her wool? Interesting... maybe she went towards the barn?",
        foundClue2: "Tracks leading from the field towards the barn? I should have checked the loft!",
        goatFound: "You found her! Oh, Geraldine! Thank you so much!"
      }
    }
  },
  items: {
    'wool': {
      id: 'wool',
      name: 'tuft of wool',
      description: 'A small tuft of white goat wool.',
      takeable: true
    },
    'tracks': {
      id: 'tracks',
      name: 'goat tracks',
      description: 'Fresh goat tracks leading toward the barn.',
      takeable: false
    }
  },
  puzzles: {},
  ascii: {},  endCondition: function(gameState) {
    return gameState.currentLocation === 'loft' && gameState.goatFound;
  },
  onComplete: function(gameState) {
    return {
      title: "--- VICTORY! ---",
      message: "You found Geraldine, the prized goat, hiding in the barn loft! The Worried Farmer is overjoyed!",
      asciiArtKey: "GOAT_VICTORY_ART"
    };
  }
};
