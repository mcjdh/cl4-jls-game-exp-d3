// js/levelLoader.js

// Attempt to import level data from level-1.js
// This assumes level-1.js makes its 'level' object available,
// possibly globally for a simple MVP, or via an ES module system if set up.

let level1Data = null;

// Option 1: If level-1.js assigns its data to a global variable (e.g., window.level1Data_level1)
if (typeof window !== 'undefined' && window.levelData_level1) {
  level1Data = window.levelData_level1;
} else {
  // Fallback or placeholder:
  // In a more complex setup, this might dynamically load or await the level script.
  // For QUICK-005, we'll use a minimal placeholder if it's not found globally.
  // The actual level-1.js provided seems to use 'export default level',
  // which is ES6 module syntax. If not using ES modules in the browser directly,
  // it would need to be adapted or loaded differently (e.g. by the GameEngine).
  
  // As a placeholder for structure, we can define a minimal dummy level object.
  level1Data = {
    id: 'level-1-placeholder',
    name: 'Placeholder Level',
    startLocation: 'placeholder-start',
    endCondition: function(gs) {
      return false;
    },
    // other properties from level-1.js structure...
    locations: {},
    npcs: {},
    items: {}
  };
}


/**
 * Returns the loaded data for level 1.
 * For the MVP, this directly returns the level1Data object.
 * Future versions might involve dynamic loading.
 * @returns {object|null} The level data object or null if not loaded.
 */
function loadLevel1Data() {
  try {
    if (!level1Data || level1Data.id === 'level-1-placeholder') {
      // Try to re-access if it became available globally after initial load
      if (typeof window !== 'undefined' && window.levelData_level1) {
        level1Data = window.levelData_level1;
      } else {
        return null; // Or return the placeholder if that's preferred
      }
    }
    return level1Data;
  } catch (error) {
    return null;
  }
}

/**
 * Checks the win condition for the currently loaded level (level-1 for now).
 * @param {object} gameState - The current game state object, typically from state.js.
 *                             Expected to have properties like 'inventory' and 'currentLocation'.
 * @returns {boolean} True if the win condition is met, false otherwise.
 */
function checkWinCondition(gameState) {
  const currentLevelData = loadLevel1Data();

  if (!currentLevelData) {
    return false;
  }

  if (typeof currentLevelData.endCondition !== 'function') {
    return false;
  }

  if (!gameState) {
    return false;
  }

  try {
    // Call the endCondition function from the level data
    return currentLevelData.endCondition(gameState);
  } catch (error) {
    return false;
  }
}

// For non-ES6 module environments, make functions available.
// If this script is directly included via <script> tag, LevelLoader object would be global.
const LevelLoader = {
  loadLevel1Data,
  checkWinCondition,
  // Expose level1Data for debugging or direct access if needed by engine
  _getLevel1DataForTesting: () => level1Data
};

// To use this with the provided levels/level-1.js that uses 'export default level;',
// levels/level-1.js would need to be changed to assign to a global, e.g.:
// window.levelData_level1 = { ...level object... };
// OR the game engine would need to handle ES6 module loading.

// Example of how levels/level-1.js might be adapted for non-module global access:
/*
// In levels/level-1.js, instead of 'export default level', you might have:
window.levelData_level1 = {
  id: 'level-1',
  name: 'The Missing Goat',
  // ... all other properties ...
  endCondition: function(gameState) {
    // ... logic ...
    if (!gameState || !gameState.inventory || !gameState.currentLocation) return false;
    const hasClue1 = gameState.inventory.includes('clue1_wool');
    const hasClue2 = gameState.inventory.includes('clue2_tracks');
    const hasClue3 = gameState.inventory.includes('clue3_sound'); // Assuming this is how sound clue is identified
    const inBarnLoft = gameState.currentLocation === 'barn-loft';
    return hasClue1 && hasClue2 && hasClue3 && inBarnLoft;
  },
  // ...
};
*/
