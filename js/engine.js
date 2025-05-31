class GameEngine {
  constructor() {
    this.currentScene = null;
    this.outputArea = document.getElementById('output'); // Assuming an HTML element with id 'output' for displaying text
  }

  loadLevel(levelData) {
    // TODO: Implement level loading logic
    // For now, let's assume levelData is an object with a starting scene
    if (levelData && levelData.startingScene) {
      this.currentScene = levelData.startingScene;
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
        break;
      case "MOVE":
        if (argument) {
          // TODO: Implement MOVE logic (e.g., change currentScene based on direction)
          this.display(`You try to move ${argument}.`);
        } else {
          this.display("Move where?");
        }
        break;
      case "TAKE":
        if (argument) {
          // TODO: Implement TAKE logic (e.g., add item to inventory)
          this.display(`You try to take ${argument}.`);
        } else {
          this.display("Take what?");
        }
        break;
      default:
        this.display("Unknown command.");
    }
  }

  // Basic scene management
  getCurrentScene() {
    return this.currentScene;
  }

  setCurrentScene(sceneName) {
    this.currentScene = sceneName;
    this.display(`Moved to: ${sceneName}`);
  }
}
