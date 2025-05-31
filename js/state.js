// js/state.js

// Initialize gameState from localStorage or with default values
let gameState = {
  currentLocation: null, // Will be set by levelLoader or engine after level loads
  inventory: [],
  collectedClues: [],
  flags: {}
};

const GAME_STATE_KEY = 'goatMysteryGameState';

// Function to get the current game state
function getGameState() {
  return { ...gameState }; // Return a copy to prevent direct modification
}

// Function to update the current location
function updateLocation(newLocation) {
  if (typeof newLocation === 'string') {
    gameState.currentLocation = newLocation;
    console.log(`State: Location updated to ${newLocation}`);
    // Consider calling saveState() here if auto-save on location change is desired
  } else {
    console.error('State: updateLocation expects a string argument.');
  }
}

// Function to add an item to inventory (and treat as a clue for now)
function addItemToInventory(itemId) {
  if (typeof itemId === 'string' && !gameState.inventory.includes(itemId)) {
    gameState.inventory.push(itemId);
    console.log(`State: ${itemId} added to inventory.`);
    // For QUICK-005, all inventory items that are clues are also added to collectedClues
    // A more sophisticated system might differentiate them.
    if (itemId.startsWith('clue')) {
        if (!gameState.collectedClues.includes(itemId)) {
            gameState.collectedClues.push(itemId);
            console.log(`State: ${itemId} recorded as collected clue.`);
        }
    }
    // Consider calling saveState() here
  } else {
    if (typeof itemId !== 'string') console.error('State: addItemToInventory expects a string argument.');
    else console.warn(`State: ${itemId} already in inventory or invalid.`);
  }
}


// Function to add a collected clue
// For the MVP, clues are items. addItemToInventory will handle adding to both.
// This function can be expanded later if clues become distinct from inventory items.
function addClue(clueId) {
  if (typeof clueId === 'string' && !gameState.collectedClues.includes(clueId)) {
    gameState.collectedClues.push(clueId);
    // Also add to general inventory for simplicity in QUICK-005
    if (!gameState.inventory.includes(clueId)) {
      gameState.inventory.push(clueId);
      console.log(`State: ${clueId} added to inventory as part of clue collection.`);
    }
    console.log(`State: ${clueId} added to collectedClues.`);
    // Consider calling saveState() here
  } else {
     if (typeof clueId !== 'string') console.error('State: addClue expects a string argument.');
    else console.warn(`State: ${clueId} already in collectedClues or invalid.`);
  }
}

// Function to save the game state to localStorage
function saveState() {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
    console.log('State: Game state saved to localStorage.');
  } catch (error) {
    console.error('State: Error saving game state to localStorage:', error);
  }
}

// Function to load the game state from localStorage
function loadState() {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);      // Basic validation of the loaded state
      if (parsedState && typeof parsedState.currentLocation !== 'undefined' && Array.isArray(parsedState.inventory) && Array.isArray(parsedState.collectedClues)) {
        // Ensure flags property exists
        if (!parsedState.flags) parsedState.flags = {};
        gameState = parsedState;
        console.log('State: Game state loaded from localStorage.');
      } else {
        console.warn('State: Invalid state format in localStorage. Using default state.');
        // Initialize with default if format is bad, to prevent errors.
        gameState = { currentLocation: null, inventory: [], collectedClues: [], flags: {} };
        saveState(); // Optionally save the fresh default state
      }
    } else {
      console.log('State: No saved game state found in localStorage. Using default state.');
      // Initialize with default if no state found.
      gameState = { currentLocation: null, inventory: [], collectedClues: [] };
      // Optionally save the fresh default state immediately
      // saveState();
    }
  } catch (error) {
    console.error('State: Error loading game state from localStorage:', error);
    // Fallback to default state in case of any error
    gameState = { currentLocation: null, inventory: [], collectedClues: [] };
  }
  return getGameState(); // Return the loaded (or default) state
}

// Function to reset game state (useful for starting a new game)
function resetState(initialLocation = null) {
    gameState.currentLocation = initialLocation;
    gameState.inventory = [];
    gameState.collectedClues = [];
    console.log('State: Game state has been reset.');
    saveState(); // Save the reset state
}


// Attempt to load state when the script is loaded
// This ensures that any previously saved state is available immediately.
loadState();

// Export functions for use by other modules (e.g., engine.js, levelLoader.js)
// Using a revealing module pattern like structure for clarity if not using ES6 modules directly in browser
const GameState = {
  getGameState,
  updateLocation,
  addItemToInventory,
  addClue,
  saveState,
  loadState,
  resetState
};

// If using ES6 modules (e.g. via a bundler or for modern browsers that support it in <script type="module">)
// export { getGameState, updateLocation, addItemToInventory, addClue, saveState, loadState, resetState, gameState as _gameStateForTestingOnly };

// For non-ES6 module environments, functions will be global or attached to a global object if desired.
// For the QUICK build, assuming functions might be globally accessible or explicitly imported/managed by an engine.
// If this script is directly included via <script> tag, GameState object would be global.
// If a more sophisticated module loader is in place (like one within engine.js), it would manage exports.
