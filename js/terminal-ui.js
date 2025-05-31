class TerminalUI {
  constructor(element, engine, commandButtons) {
    this.element = element;
    this.engine = engine;
    this.commandButtons = commandButtons;
    this.inputBuffer = '';
    this.isMobile = window.innerWidth <= 768;
    this.lastLocation = null;
    
    // Set up engine output callback
    this.engine.outputCallback = (text) => this.writeLine(text);
    
    // Mobile-specific enhancements
    if (this.isMobile) {
      this.setupMobileEnhancements();
    }
  }

  setupMobileEnhancements() {
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
      document.head.appendChild(viewport);
    }

    // Update context help based on game state
    this.updateContextHelp();
    
    // Listen for game state changes
    if (this.engine && this.engine.gameState) {
      this.observeGameState();
    }
  }

  updateContextHelp() {
    const contextHelp = document.querySelector('.context-help');
    if (!contextHelp || !this.isMobile) return;
    
    const currentLocation = this.engine?.getCurrentLocation?.();
    if (!currentLocation) return;
    
    let helpText = '💡 ';
    
    // Check available connections
    const connections = currentLocation.connections || {};
    const directions = Object.keys(connections);
    
    if (directions.length > 0) {
      helpText += `You can go: ${directions.map(dir => dir.toUpperCase()).join(', ')} • `;
    }
    
    // Check for items
    if (currentLocation.items && currentLocation.items.length > 0) {
      helpText += `Items here: ${currentLocation.items.join(', ')} • `;
    }
    
    // Check for NPCs
    if (currentLocation.npcs && currentLocation.npcs.length > 0) {
      helpText += `People: ${currentLocation.npcs.join(', ')} • `;
    }
    
    helpText += 'Tap LOOK for details';
    
    contextHelp.innerHTML = helpText;
  }

  observeGameState() {
    // Simple observer for location changes
    const checkLocationChange = () => {
      const currentLocation = this.engine?.getCurrentLocation?.();
      if (currentLocation && currentLocation.id !== this.lastLocation) {
        this.lastLocation = currentLocation.id;
        setTimeout(() => this.updateContextHelp(), 100);
        this.updateAvailableButtons(currentLocation);
      }
    };
    
    // Check periodically for changes
    setInterval(checkLocationChange, 500);
  }

  updateAvailableButtons(location) {
    if (!this.isMobile) return;
    
    // Show/hide contextual buttons
    const talkButton = document.querySelector('button[data-command="talk"]');
    if (talkButton) {
      if (location.npcs && location.npcs.length > 0) {
        talkButton.style.display = 'flex';
      } else {
        talkButton.style.display = 'none';
      }
    }
    
    // Update movement buttons availability
    const connections = location.connections || {};
    const movementButtons = document.querySelectorAll('.movement-grid button, .vertical-movement button');
    
    movementButtons.forEach(button => {
      const direction = button.getAttribute('data-command');
      if (connections[direction]) {
        button.style.opacity = '1';
        button.disabled = false;
      } else {
        button.style.opacity = '0.3';
        button.disabled = true;
      }
    });
  }

  init() {
    // Clear terminal
    if (this.element) {
      this.element.innerHTML = '';
    }
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
    }
    
    // Set up command buttons
    this.setupButtons();
    
    // Set up keyboard input (disabled on mobile for better experience)
    if (!this.isMobile) {
      this.setupKeyboardInput();
    }
    
    // Show prompt only on desktop
    if (!this.isMobile) {
      this.showPrompt();
    } else {
      // Add helpful mobile intro
      this.writeLine("🐐 Welcome to G.O.A.T. Mystery!");
      this.writeLine("Tap the green buttons below to play.");
      this.writeLine("Start by tapping LOOK to examine your surroundings.");
      this.writeLine("");
    }
  }

  setupButtons() {
    if (!this.commandButtons || !Array.isArray(this.commandButtons)) {
      return;
    }
    
    this.commandButtons.forEach(button => {
      if (button && typeof button.addEventListener === 'function') {
        button.addEventListener('click', () => {
          const command = button.getAttribute('data-command');
          if (command) {
            this.processInput(command);
          }
        });
      }
    });
  }

  setupKeyboardInput() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.processInput(this.inputBuffer);
        this.inputBuffer = '';
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        this.inputBuffer = this.inputBuffer.slice(0, -1);
        this.updateCurrentLine();
      } else if (e.key.length === 1) {
        this.inputBuffer += e.key;
        this.updateCurrentLine();
      }
    });
  }  writeLine(text) {
    if (!this.element) {
      return;
    }
    
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text || '';
    this.element.appendChild(line);
    this.element.scrollTop = this.element.scrollHeight;
  }

  showPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'terminal-line terminal-prompt';
    prompt.innerHTML = '> <span class="terminal-input"></span><span class="terminal-cursor">_</span>';
    this.element.appendChild(prompt);
    this.element.scrollTop = this.element.scrollHeight;
  }

  updateCurrentLine() {
    const inputSpan = this.element.querySelector('.terminal-prompt .terminal-input');
    if (inputSpan) {
      inputSpan.textContent = this.inputBuffer;
    }
  }  processInput(input) {
    if (!input || typeof input !== 'string' || !input.trim()) {
      return;
    }
    
    const cleanInput = input.trim();
    
    // For mobile, show the command in the terminal
    if (this.isMobile) {
      this.writeLine(`> ${cleanInput}`);
    } else {
      // Desktop behavior - remove current prompt
      const prompt = this.element.querySelector('.terminal-prompt');
      if (prompt) {
        prompt.classList.remove('terminal-prompt');
        prompt.innerHTML = '> ' + cleanInput;
      }
    }
    
    // Process command
    try {
      this.engine.parseCommand(cleanInput);
    } catch (error) {
      this.writeLine("Error processing command. Please try again.");
    }
    
    // Show new prompt only on desktop
    if (!this.isMobile) {
      this.showPrompt();
    } else {
      // Update mobile context after command
      setTimeout(() => this.updateContextHelp(), 200);
    }
    
    // Add spacing for mobile readability
    if (this.isMobile) {
      this.writeLine("");
    }
  }
}
