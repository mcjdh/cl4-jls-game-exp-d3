window.levelData_level1 = {
  id: 'level-1',
  name: 'Find the Missing Goat',
  opening_message: 'The farmer needs your help! Geraldine the goat has gone missing.',
  startLocation: 'farm',
  
  locations: {
    'farm': {
      id: 'farm',
      name: 'The Farm',
      description: 'A quiet farm with an open gate. The farmer looks worried.',
      connections: { north: 'field', east: 'barn' },
      items: ['wool'],
      npcs: ['farmer']
    },
    'barn': {
      id: 'barn',
      name: 'The Old Barn',
      description: 'A dusty barn that smells of hay. A ladder leads up to the loft.',
      connections: { west: 'farm', up: 'loft' },
      items: [],
      npcs: []
    },
    'field': {
      id: 'field',
      name: 'The Field',
      description: 'A grassy field with trampled paths. You notice some tracks.',
      connections: { south: 'farm' },
      items: ['tracks'],
      npcs: []
    },
    'loft': {
      id: 'loft',
      name: 'The Barn Loft',
      description: 'A cozy loft filled with hay bales. Wait... something moves in the corner!',
      connections: { down: 'barn' },
      items: [],
      npcs: [],
      special: 'goat_found'
    }
  },
  
  npcs: {
    'farmer': {
      name: 'Farmer Joe',
      dialogue: {
        initial: "Please help me find Geraldine! She's my prize goat. Check around the farm for clues.",
        foundClue1: "You found something? Great! Keep looking, she might be hiding somewhere high up.",
        goatFound: "Oh thank you! You found Geraldine! She always did love that barn loft."
      }
    }
  },
  
  items: {
    'wool': { 
      name: 'tuft of wool', 
      description: 'Soft white goat wool caught on the gate.' 
    },
    'tracks': { 
      name: 'goat tracks', 
      description: 'Fresh hoof prints leading toward the barn.' 
    }
  },
  
  onComplete: function(state) {
    return {
      message: "🐐 Geraldine bleats happily as the farmer gives you a big thank you hug!"
    };
  }
};
