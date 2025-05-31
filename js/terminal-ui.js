class TerminalUI {
  constructor(element, engine, commandButtons) {
    this.element = element;
    this.engine = engine;
    this.commandButtons = commandButtons;
    this.inputBuffer = '';
    
    // Set up engine output callback
    this.engine.outputCallback = (text) => this.writeLine(text);
  }

  init() {
    // Clear terminal
    this.element.innerHTML = '';
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 1000);
    }
    
    // Set up command buttons
    this.setupButtons();
    
    // Set up keyboard input
    this.setupKeyboardInput();
    
    // Show prompt
    this.showPrompt();
  }

  setupButtons() {
    this.commandButtons.forEach(button => {
      button.addEventListener('click', () => {
        const command = button.getAttribute('data-command');
        if (command) {
          this.processInput(command);
        }
      });
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
  }

  writeLine(text) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
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
  }

  processInput(input) {
    if (!input.trim()) return;
    
    // Remove current prompt
    const prompt = this.element.querySelector('.terminal-prompt');
    if (prompt) {
      prompt.classList.remove('terminal-prompt');
      prompt.innerHTML = '> ' + input;
    }
    
    // Process command
    this.engine.parseCommand(input);
    
    // Show new prompt
    this.showPrompt();
  }
}
