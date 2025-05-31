// Main entry point - connects all game systems
(function() {
  let engine;
  let terminalUI;

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Initialize game engine
      engine = new GameEngine();
      
      // Initialize terminal UI
      const terminalElement = document.getElementById('terminal');
      const commandButtons = Array.from(document.querySelectorAll('#button-row button'));
      
      // Create terminal UI
      terminalUI = new TerminalUI(terminalElement, engine, commandButtons);
      terminalUI.init();
        // Load saved state if available
      if (typeof GameState !== 'undefined') {
        const savedState = GameState.loadState();
        if (savedState.currentLocation) {
          // Merge saved state with engine state
          Object.assign(engine.gameState, savedState);
        }
      }
      
      // Load level 1
      if (window.levelData_level1) {
        engine.loadLevel(window.levelData_level1);
      } else {
        engine.display("Error: Could not load level data.");
        engine.display("Please check that all files are loaded correctly.");
      }
      
    } catch (error) {
      console.error('Game initialization error:', error);
      if (terminalUI) {
        terminalUI.writeLine("Error initializing game: " + error.message);
      }
    }
  });
})();
