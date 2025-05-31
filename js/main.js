// Main entry point - connects all game systems with mobile optimization
(function() {
  let engine;
  let terminalUI;
  let adaptiveSettings;

  // Wait for DOM to load
  document.addEventListener('DOMContentLoaded', async function() {
    try {
      // Get adaptive settings from mobile optimizer
      adaptiveSettings = window.MobileOptimizer ? 
        window.MobileOptimizer.getAdaptiveSettings() : 
        { enableAnimations: true, maxTerminalLines: 100, enableAsciiArt: true };

      // Initialize game engine
      engine = new GameEngine();
      
      // Apply adaptive settings to engine
      if (adaptiveSettings) {
        engine.adaptiveSettings = adaptiveSettings;
      }
      
      // Initialize terminal UI
      const terminalElement = document.getElementById('terminal');
      const commandButtons = Array.from(document.querySelectorAll('#button-row button'));
      
      if (!terminalElement) {
        throw new Error('Terminal element not found');
      }

      // Create terminal UI with adaptive settings
      terminalUI = new TerminalUI(terminalElement, engine, commandButtons);
      terminalUI.adaptiveSettings = adaptiveSettings;
      terminalUI.init();
      
      // Load saved state if available
      if (typeof GameState !== 'undefined') {
        try {
          const savedState = GameState.loadState();
          if (savedState && savedState.currentLocation) {
            // Merge saved state with engine state
            Object.assign(engine.gameState, savedState);
            console.log('Game state loaded successfully');
          }
        } catch (error) {
          console.warn('Could not load saved state:', error.message);
        }
      }      // Load level 1 with error handling
      if (window.levelData_level1) {
        // Validate level data structure
        const levelData = window.levelData_level1;
        if (!levelData.startLocation || !levelData.locations || !levelData.locations[levelData.startLocation]) {
          throw new Error('Invalid level data structure - missing required properties');
        }
        
        // Ensure engine is properly initialized before loading level
        if (engine && typeof engine.loadLevel === 'function' && typeof engine.getCurrentLocation === 'function') {
          engine.loadLevel(levelData);
          console.log('Level 1 loaded successfully');
        } else {
          console.error('GameEngine not properly initialized:', engine);
          throw new Error('GameEngine methods not available - possible class definition error');
        }
      } else {
        engine.display("🎮 Game loading...");
        engine.display("Please wait while the game initializes.");
        
        // Retry loading after a short delay
        setTimeout(() => {
          if (window.levelData_level1) {
            engine.loadLevel(window.levelData_level1);
          } else {
            engine.display("❌ Error: Could not load game level.");
            engine.display("Please refresh the page to try again.");
          }
        }, 1000);
      }

      // Setup auto-save for mobile
      if (adaptiveSettings.enableAutoSave) {
        setupAutoSave();
      }

      // Setup memory cleanup for long sessions
      if (window.MobileOptimizer) {
        setInterval(() => {
          window.MobileOptimizer.cleanupMemory();
        }, 300000); // Clean up every 5 minutes
      }

      // Setup error recovery
      setupErrorRecovery();

    } catch (error) {
      console.error('Game initialization error:', error);
      if (terminalUI) {
        terminalUI.writeLine("❌ Error initializing game: " + error.message);
        terminalUI.writeLine("Please refresh the page to try again.");
      } else {
        // Fallback error display
        const terminal = document.getElementById('terminal');
        if (terminal) {
          terminal.innerHTML = `
            <div style="color: #ff6600; padding: 20px; text-align: center;">
              <p>❌ Game failed to initialize</p>
              <p>Error: ${error.message}</p>
              <p>Please refresh the page to try again.</p>
            </div>
          `;
        }
      }
    }
  });

  function setupAutoSave() {
    const saveInterval = adaptiveSettings.saveInterval || 30000;
    
    setInterval(() => {
      if (typeof GameState !== 'undefined' && engine && engine.gameState) {
        try {
          GameState.saveState();
          console.log('Auto-save completed');
        } catch (error) {
          console.warn('Auto-save failed:', error.message);
        }
      }
    }, saveInterval);
  }

  function setupErrorRecovery() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      
      if (terminalUI && terminalUI.showFeedback) {
        terminalUI.showFeedback('An error occurred. Game state saved.', 'error');
      }
      
      // Try to save current state
      if (typeof GameState !== 'undefined') {
        try {
          GameState.saveState();
        } catch (saveError) {
          console.error('Could not save state during error recovery');
        }
      }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      if (terminalUI && terminalUI.showFeedback) {
        terminalUI.showFeedback('Connection issue detected. Retrying...', 'error');
      }
    });
  }

  // Expose global functions for debugging
  window.GameDebug = {
    getEngine: () => engine,
    getTerminalUI: () => terminalUI,
    getAdaptiveSettings: () => adaptiveSettings,
    resetGame: () => {
      if (typeof GameState !== 'undefined') {
        GameState.resetState();
        location.reload();
      }
    },
    saveGame: () => {
      if (typeof GameState !== 'undefined') {
        GameState.saveState();
        console.log('Game saved manually');
      }
    }
  };
})();
