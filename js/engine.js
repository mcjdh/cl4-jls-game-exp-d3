class GameEngine {
  constructor() {
    this.currentScene = null;
    this.outputArea = document.getElementById('output'); // Assuming an HTML element with id 'output' for displaying text
    this.introShown = false;
    this.gameState = { inventory: [], currentLocation: '' }; // Placeholder
    this.currentLevel = null; // To store current level data
    this.secretSequence = ["LOOK_FARM", "MOVE_FIELD", "LOOK_FIELD", "MOVE_BARN", "LOOK_BARN"];
    this.playerSequence = [];
    this.sequenceEggTriggered = false;
  }

  checkSecretSequence() {
    if (this.sequenceEggTriggered) return;

    // Keep playerSequence from growing too long (optional, but good practice)
    while (this.playerSequence.length > this.secretSequence.length) {
      this.playerSequence.shift();
    }

    if (this.playerSequence.length === this.secretSequence.length) {
      let match = true;
      for (let i = 0; i < this.secretSequence.length; i++) {
        if (this.playerSequence[i] !== this.secretSequence[i]) {
          match = false;
          break;
        }
      }

      if (match) {
        this.display("--------------------");
        this.display("SECRET FOUND!");
        this.display("As you meticulously observe your surroundings, a fleeting thought crosses your mind...");
        this.display("What if the G.O.A.T. is more than just an animal? What if it's a metaphor... or an acronym?");
        this.display("--------------------");
        this.sequenceEggTriggered = true;
        this.playerSequence = []; // Clear sequence so it doesn't re-trigger or interfere
      }
    }
  }

  showCredits() {
    this.display(" "); // Add a blank line before credits for separation
    this.display("--------------------");
    this.display("--- CREDITS ---");
    this.display("GOAT Mystery: Terminal Tales");
    this.display(" ");
    this.display("A One-Hour MVP Build Production");
    this.display(" ");
    this.display("Lead Developer & Taskmaster: The User");
    this.display(" ");
    this.display("AI Engineering Team:");
    this.display("- Agent A: HTML Structure, CSS Styling, Mobile UI");
    this.display("- Agent B: Core Game Engine, State Logic, Game Flow Polish");
    this.display("- Agent C: Level Design, ASCII Artistry, QA Testing");
    this.display(" ");
    this.display("Special Thanks to the G.O.A.T. for inspiration.");
    this.display(" ");
    this.display("Thanks for playing!");
    this.display("--------------------");
  }

  triggerVictory(victoryData) {
    this.display(victoryData.title);
    this.display("[ASCII ART: " + victoryData.asciiArtKey + "]");
    this.display(victoryData.message);
    if (victoryData.nextActions && victoryData.nextActions.includes("showCredits")) {
      this.showCredits();
    }
  }

  showIntro(levelOpeningMessage) {
    this.display("GOAT Mystery: Terminal Tales");
    this.display(levelOpeningMessage);
    this.introShown = true;
  }

  loadLevel(levelData) {
    // TODO: Implement level loading logic
    // For now, let's assume levelData is an object with a starting scene
    if (levelData && levelData.startingScene) {
      this.currentLevel = levelData; // Store level data
      this.currentScene = levelData.startingScene;
      this.gameState.currentLocation = this.currentScene; // Initialize gameState
      if (!this.introShown && levelData.opening_message) {
        this.showIntro(levelData.opening_message);
      }
      this.display(`Level loaded. Starting at: ${this.currentScene}`);
    } else {
      this.display("Error: Invalid level data.");
    }
  }

  display(text) {
    if (this.outputArea) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      this.outputArea.appendChild(paragraph);
      this.outputArea.scrollTop = this.outputArea.scrollHeight; // Scroll to the bottom
    } else {
      console.log(text); // Fallback to console if outputArea is not found
    }
  }

  parseCommand(commandString) {
    const parts = commandString.trim().toUpperCase().split(/\s+/);
    const command = parts[0];
    const argument = parts.slice(1).join(" ");

    this.display(`> ${commandString}`); // Display the original command

    switch (command) {
      case "LOOK":
        // TODO: Implement LOOK logic (e.g., describe current scene)
        this.display("You look around.");
        if (!this.sequenceEggTriggered) {
          const locationId = this.gameState.currentLocation.toUpperCase();
          this.playerSequence.push(`LOOK_${locationId}`);
          this.checkSecretSequence();
        }
        break;
      case "MOVE":
        if (argument) {
          // TODO: Implement MOVE logic (e.g., change currentScene based on direction)
          // For now, let's assume argument is a valid scene name for simplicity
          // Argument here is the *direction* or *target scene name*.
          // We need to ensure this argument is the actual scene ID for setCurrentScene.
          // For this example, we'll assume 'argument' is directly the scene ID.
          this.setCurrentScene(argument);
        } else {
          this.display("Move where?");
        }
        break;
      case "TAKE":
        if (argument) {
          // TODO: Implement TAKE logic (e.g., add item to inventory)
          // For testing, let's simplify and assume argument is item id
          if (this.currentLevel && this.currentLevel.items && this.currentLevel.items[argument.toLowerCase()]) {
            if (!this.gameState.inventory.includes(argument.toLowerCase())) {
              this.gameState.inventory.push(argument.toLowerCase());
              this.display(this.currentLevel.items[argument.toLowerCase()].on_take || `You take the ${this.currentLevel.items[argument.toLowerCase()].name}.`);
            } else {
              this.display(`You already have the ${this.currentLevel.items[argument.toLowerCase()].name}.`);
            }
          } else {
            this.display(`You try to take ${argument}, but it's not here.`);
          }
        } else {
          this.display("Take what?");
        }
        break;
      case "TEAM":
        this.display("The G.O.A.T. developers: Agent A, Agent B, Agent C send their regards!");
        this.display("    (\\__/)");
        this.display("    (='.'=)");
        this.display("    (\")_(\")"); // Simple bunny
        break;
      case "TALK":
        if (argument) {
          const currentLocationData = this.currentLevel.locations[this.gameState.currentLocation];
          if (currentLocationData &&
              currentLocationData.hiddenInteractions &&
              currentLocationData.hiddenInteractions.TALK &&
              currentLocationData.hiddenInteractions.TALK[argument.toUpperCase()]) {
            this.display(currentLocationData.hiddenInteractions.TALK[argument.toUpperCase()]);
            break;
          }
          // Default message if no hidden interaction or NPC found (NPC logic would go here)
          this.display(`You try to talk to ${argument}, but nothing happens.`);
        } else {
          this.display("Talk to whom?");
        }
        break;
      case "CREDITS":
        this.showCredits();
        break;
      default:
        this.display("Unknown command.");
    }

    // Check for end condition after processing command
    if (this.currentLevel && typeof this.currentLevel.endCondition === 'function' && this.currentLevel.endCondition(this.gameState)) {
      if (typeof this.currentLevel.onComplete === 'function') {
        const victoryData = this.currentLevel.onComplete(this.gameState);
        this.triggerVictory(victoryData);
        // TODO: Set a flag like this.levelCompleted = true; to stop further commands for this level.
      }
    }
  }

  // Basic scene management
  getCurrentScene() {
    return this.currentScene;
  }

  setCurrentScene(sceneName) {
    // TODO: Actually check if sceneName is a valid connection from currentScene
    this.currentScene = sceneName;
    this.gameState.currentLocation = sceneName; // Update gameState
    this.display("...");
    this.display(`You move to the ${sceneName}.`);
    if (!this.sequenceEggTriggered) {
      const locationId = sceneName.toUpperCase();
      this.playerSequence.push(`MOVE_${locationId}`);
      this.checkSecretSequence();
    }
  }
}
