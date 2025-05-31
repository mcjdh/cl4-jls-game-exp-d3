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
    // Consider calling saveState() here if auto-save on location change is desired
  }
}

// Function to add an item to inventory (and treat as a clue for now)
function addItemToInventory(itemId) {
  if (typeof itemId === 'string' && !gameState.inventory.includes(itemId)) {
    gameState.inventory.push(itemId);
    // For QUICK-005, all inventory items that are clues are also added to collectedClues
    // A more sophisticated system might differentiate them.
    if (itemId.startsWith('clue')) {
        if (!gameState.collectedClues.includes(itemId)) {
            gameState.collectedClues.push(itemId);
        }
    }
    // Consider calling saveState() here
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
    }
    // Consider calling saveState() here
  }
}

// Function to save the game state to localStorage
function saveState() {
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
  } catch (error) {
    // Silently fail if localStorage is not available
  }
}

// Function to load the game state from localStorage
function loadState() {
  try {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Basic validation of the loaded state
      if (parsedState && typeof parsedState.currentLocation !== 'undefined' && Array.isArray(parsedState.inventory) && Array.isArray(parsedState.collectedClues)) {        // Ensure flags property exists
        if (!parsedState.flags) parsedState.flags = {};
        gameState = parsedState;
      } else {
        // Initialize with default if format is bad, to prevent errors.
        gameState = { currentLocation: null, inventory: [], collectedClues: [], flags: {} };
        saveState(); // Optionally save the fresh default state
      }    } else {
      // Initialize with default if no state found.
      gameState = { currentLocation: null, inventory: [], collectedClues: [], flags: {} };
      // Optionally save the fresh default state immediately
      // saveState();
    }
  } catch (error) {
    // Fallback to default state in case of any error
    gameState = { currentLocation: null, inventory: [], collectedClues: [], flags: {} };
  }
  return getGameState(); // Return the loaded (or default) state
}

// Function to reset game state (useful for starting a new game)
function resetState(initialLocation = null) {
    gameState.currentLocation = initialLocation;
    gameState.inventory = [];
    gameState.collectedClues = [];
    gameState.flags = {};
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
