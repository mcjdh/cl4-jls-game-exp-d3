import { Terminal as XTerm } from 'xterm'; // Renamed to avoid conflict
import { FitAddon } from 'xterm-addon-fit';

export class Terminal {
  constructor(element, engine, commandButtons = []) {
    this.element = element;
    this.engine = engine; // Store the engine instance
    this.commandButtons = commandButtons; // Store command buttons

    this.xterm = new XTerm();
    this.fitAddon = new FitAddon();
    this.xterm.loadAddon(this.fitAddon);

    this.typewriterPromise = Promise.resolve(); // For queuing typewriter calls
    this.typewriterDelay = 50; // Milliseconds per character

    // Redirect engine's output to the terminal's typewriterWrite method
    if (this.engine && typeof this.engine.display === 'function') {
      this.engine.display = (text) => {
        this.typewriterWrite(text + '\n'); // Ensure newline for each display call
      };
    }
  }

  init() {
    this.xterm.open(this.element);
    this.fitAddon.fit();
    this.setupCommandButtons(); // Add event listeners for command buttons

    // Terminal to engine (for commands from xterm input)
    this.xterm.onData((data) => {
      const command = data.trim();
      if (command) {
        this.processCommand(command);
      }
    });

    // Optionally, display initial game state here if engine is ready
    // For example: this.displayInitialGameState();
    // Or this is handled by main.js after engine.loadLevel()
  }

  setupCommandButtons() {
    if (!this.commandButtons || this.commandButtons.length === 0) {
      return;
    }

    this.commandButtons.forEach(button => {
      const command = button.dataset.command; // Assumes 'data-command' attribute
      if (command) {
        button.addEventListener('click', () => {
          // When a button is clicked, process the command.
          // processCommand will send it to the engine.
          // The engine's display method (which is rerouted) will show the command and output.
          this.processCommand(command);
        });
      } else {
        console.warn('Terminal: Button found without data-command attribute:', button);
      }
    });
  }

  typewriterWrite(text) {
    const normalizedText = text.replace(/\n/g, '\r\n'); // Normalize newlines for xterm

    this.typewriterPromise = this.typewriterPromise.then(() => {
      return new Promise(resolveOuter => {
        if (normalizedText.length === 0) {
          resolveOuter();
          return;
        }

        let i = 0;
        const typeCharacter = () => {
          this.xterm.write(normalizedText[i]);
          i++;
          if (i < normalizedText.length) {
            setTimeout(typeCharacter, this.typewriterDelay);
          } else {
            resolveOuter(); // All characters of this text are written
          }
        };
        typeCharacter(); // Start typing this text
      });
    });
    return this.typewriterPromise; // Return the promise so callers could theoretically chain
  }

  showLocation() {
    // Uses engine to get current scene information and displays it.
    if (this.engine && typeof this.engine.getCurrentScene === 'function') {
      const scene = this.engine.getCurrentScene();
      // The engine's display method (now rerouted) will be used by engine commands,
      // so this method is for explicitly showing location, perhaps formatted differently.
      this.typewriterWrite(`\r\nLocation: ${scene || 'Unknown'}\r\n`);
    }
  }

  async processCommand(command) { // Made async
    // Send command to the engine
    // The engine's `parseCommand` method is expected to call `engine.display`
    // which is now rerouted to `this.typewriterWrite`.
    if (this.engine && typeof this.engine.parseCommand === 'function') {
      this.engine.parseCommand(command);
    }
    // Wait for any typewriter text from the command processing to finish
    await this.typewriterPromise;
    this.showPrompt(); // Show prompt after all text has been written
  }

  // Helper to display prompt, can be called by other methods
  showPrompt() {
    this.xterm.write('\r\n> ');
  }

  // Method to display initial game state.
  // This might be called from main.js after engine is loaded.
  async displayInitialGameState() { // Made async
    // Show the initial location using the standard format.
    // Engine loading messages (like "Level loaded...") will also be displayed via typewriter
    // due to the redirection of engine.display.
    this.showLocation();

    // Wait for an_y_ introductory messages and showLocation to finish typing
    await this.typewriterPromise;
    this.showPrompt(); // Then, display the first prompt.
  }
}
