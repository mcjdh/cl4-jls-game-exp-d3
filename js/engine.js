class GameEngine {
  constructor() {
    this.currentLevel = null;
    this.gameState = {
      currentLocation: null,
      inventory: [],
      flags: {},
      goatFound: false
    };
    this.outputCallback = null;
  }

  display(text) {
    if (this.outputCallback) {
      this.outputCallback(text);
    } else {
      console.log(text);
    }
  }

  loadLevel(levelData) {
    this.currentLevel = levelData;
    this.gameState.currentLocation = levelData.startLocation;
    this.display("=== " + levelData.name + " ===");
    this.display(levelData.opening_message);
    this.display("");
    this.lookAround();
  }

  lookAround() {
    const location = this.getCurrentLocation();
    if (!location) {
      this.display("You are nowhere...");
      return;
    }
      this.display("Location: " + location.name);
    this.display(location.description);
    
    if (location.items && location.items.length > 0) {
      this.display("You see: " + location.items.join(", "));
    }
    
    if (location.npcs && location.npcs.length > 0) {
      this.display("People here: " + location.npcs.join(", "));
    }
    
    if (location.special === 'goat_found' && !this.gameState.goatFound) {
      this.gameState.goatFound = true;
      this.display("\n*** You found Geraldine the goat! ***");
      this.checkVictory();
    }
  }

  getCurrentLocation() {
    if (!this.currentLevel || !this.gameState.currentLocation) return null;
    return this.currentLevel.locations[this.gameState.currentLocation];
  }

  parseCommand(input) {
    const parts = input.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    switch (command) {      case 'look':
      case 'examine':
        if (args) {
          this.examineItem(args);
        } else {
          this.lookAround();
        }
        break;
        
      case 'go':
      case 'move':
        this.move(args);
        break;
        
      case 'north':
      case 'south':
      case 'east':
      case 'west':
      case 'up':
      case 'down':
        this.move(command);
        break;
        
      case 'take':
      case 'get':
        this.takeItem(args);
        break;
        
      case 'talk':
        this.talkTo(args);
        break;
        
      case 'inventory':
      case 'i':
        this.showInventory();
        break;
        
      case 'help':
        this.showHelp();
        break;
        
      default:
        this.display("I don't understand that command. Type 'help' for available commands.");
    }
  }

  move(direction) {
    const location = this.getCurrentLocation();
    if (!location) return;
    
    if (location.connections && location.connections[direction]) {
      this.gameState.currentLocation = location.connections[direction];
      this.display("\nYou go " + direction + "...\n");
      this.lookAround();
      
      // Update game state
      if (typeof GameState !== 'undefined') {
        GameState.updateLocation(this.gameState.currentLocation);
        GameState.saveState();
      }
    } else {
      this.display("You can't go that way.");
    }
  }

  takeItem(itemName) {
    const location = this.getCurrentLocation();
    if (!location || !location.items) return;
    
    const itemIndex = location.items.indexOf(itemName);
    if (itemIndex !== -1) {
      const item = this.currentLevel.items[itemName];
      if (item && item.takeable !== false) {
        location.items.splice(itemIndex, 1);
        this.gameState.inventory.push(itemName);
        this.display("You take the " + itemName + ".");
          // Update game state
        if (typeof GameState !== 'undefined') {
          GameState.addItemToInventory(itemName);
          // Sync flags to external state if they exist
          if (this.gameState.flags) {
            GameState.getGameState().flags = this.gameState.flags;
          }
          GameState.saveState();
        }
      } else {
        this.display("You can't take that.");
      }
    } else {
      this.display("You don't see that here.");
    }
  }

  examineItem(itemName) {
    const location = this.getCurrentLocation();
    if (!location) return;
    
    // Check if item is in current location
    if (location.items && location.items.includes(itemName)) {
      const item = this.currentLevel.items[itemName];
      if (item) {
        this.display("You examine the " + itemName + ":");
        this.display(item.description);
        
        // Set flag for examined non-takeable items
        if (item.takeable === false) {
          if (!this.gameState.flags) this.gameState.flags = {};
          this.gameState.flags['examined' + itemName.charAt(0).toUpperCase() + itemName.slice(1)] = true;
            // Save state
          if (typeof GameState !== 'undefined') {
            // Sync flags to external state
            if (this.gameState.flags) {
              const state = GameState.getGameState();
              state.flags = this.gameState.flags;
            }
            GameState.saveState();
          }
        }
      } else {
        this.display("You don't see anything special about the " + itemName + ".");
      }
    } else if (this.gameState.inventory.includes(itemName)) {
      // Check inventory
      const item = this.currentLevel.items[itemName];
      if (item) {
        this.display("You examine the " + itemName + " in your inventory:");
        this.display(item.description);
      }
    } else {
      this.display("You don't see a " + itemName + " here.");
    }
  }

  talkTo(target) {
    const location = this.getCurrentLocation();
    if (!location || !target) {
      this.display("Talk to whom?");
      return;
    }
    
    // Check if there's an NPC here
    if (location.npcs && location.npcs.includes(target)) {
      const npc = this.currentLevel.npcs[target];
      if (npc) {        // Simple dialogue based on game state
        if (this.gameState.goatFound && npc.dialogue.goatFound) {
          this.display(npc.name + ": " + npc.dialogue.goatFound);
        } else if ((this.gameState.inventory.includes('tracks') || this.gameState.flags.examinedTracks) && npc.dialogue.foundClue2) {
          this.display(npc.name + ": " + npc.dialogue.foundClue2);
        } else if (this.gameState.inventory.includes('wool') && npc.dialogue.foundClue1) {
          this.display(npc.name + ": " + npc.dialogue.foundClue1);
        } else if (npc.dialogue.initial) {
          this.display(npc.name + ": " + npc.dialogue.initial);
        }
      }
    } else {
      this.display("There's no " + target + " here to talk to.");
    }
  }

  showInventory() {
    if (this.gameState.inventory.length === 0) {
      this.display("You're not carrying anything.");
    } else {
      this.display("You are carrying: " + this.gameState.inventory.join(", "));
    }
  }  showHelp() {
    this.display("Available commands:");
    this.display("- look/examine: Look around");
    this.display("- examine [item]: Look closely at an item");
    this.display("- go [direction]: Move in a direction");
    this.display("- north/south/east/west/up/down: Move in that direction");
    this.display("- take/get [item]: Pick up an item");
    this.display("- talk [person]: Talk to someone");
    this.display("- inventory/i: Check your inventory");
    this.display("- help: Show this help");
  }

  checkVictory() {
    if (this.currentLevel && this.currentLevel.endCondition) {
      if (this.currentLevel.endCondition(this.gameState)) {
        const result = this.currentLevel.onComplete(this.gameState);
        this.display("\n" + result.title);
        this.display(result.message);
        this.display("\nThank you for playing!");
      }
    }
  }
}
