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
  }  lookAround() {
    const location = this.getCurrentLocation();
    if (!location) {
      this.display("You are nowhere...");
      return;
    }
    
    // Enhanced location display for better mobile experience
    this.display("📍 " + location.name);
    this.display(location.description);
    this.display("");
    
    // Available exits with clear mobile-friendly formatting
    const connections = location.connections || {};
    const exits = Object.keys(connections);
    if (exits.length > 0) {
      this.display("🧭 You can go: " + exits.map(exit => exit.toUpperCase()).join(", "));
    } else {
      this.display("🚫 No obvious exits from here.");
    }
    
    // Items with better visibility
    if (location.items && location.items.length > 0) {
      this.display("👀 You see: " + location.items.join(", "));
      this.display("💡 Tip: Try 'take [item name]' to pick up items");
    }
    
    // NPCs with interaction hints
    if (location.npcs && location.npcs.length > 0) {
      this.display("👥 People here: " + location.npcs.join(", "));
      this.display("💬 Tip: Try 'talk [person name]' to speak with them");
    }
    
    // Special events
    if (location.special === 'goat_found' && !this.gameState.goatFound) {
      this.gameState.goatFound = true;
      this.display("");
      this.display("🐐 *** You found Geraldine the goat! ***");
      this.checkVictory();
    }
    
    this.display("");
  }getCurrentLocation() {
    if (!this.currentLevel || !this.gameState.currentLocation) {
      return null;
    }
    const location = this.currentLevel.locations[this.gameState.currentLocation];
    if (!location) {
      return null;
    }
    return location;
  }
  parseCommand(input) {
    if (!input || typeof input !== 'string') {
      this.display("Invalid command. Type 'help' for available commands.");
      return;
    }
    
    const parts = input.trim().toLowerCase().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    switch (command) {
      case 'look':
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
  }  move(direction) {
    const location = this.getCurrentLocation();
    if (!location) return;
    
    if (location.connections && location.connections[direction]) {
      this.gameState.currentLocation = location.connections[direction];
      this.display("🚶 You go " + direction.toUpperCase() + "...");
      this.display("");
      this.lookAround();
      
      // Update game state
      if (typeof GameState !== 'undefined') {
        GameState.updateLocation(this.gameState.currentLocation);
        GameState.saveState();
      }    } else {
      const availableExits = Object.keys(location.connections || {});
      if (availableExits.length > 0) {
        this.display("❌ You can't go " + direction.toUpperCase() + " from here.");
        this.display("🧭 Available directions: " + availableExits.map(exit => exit.toUpperCase()).join(", "));
      } else {
        this.display("❌ There are no exits from this location.");
      }
    }
  }

  takeItem(itemName) {
    const location = this.getCurrentLocation();
    if (!location || !location.items) {
      this.display("There's nothing to take here.");
      return;
    }
    
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
            const externalState = GameState.getGameState();
            Object.assign(externalState.flags, this.gameState.flags);
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
              const externalState = GameState.getGameState();
              if (externalState && externalState.flags) { // Ensure externalState.flags exists
                Object.assign(externalState.flags, this.gameState.flags);
              } else if (externalState) { // Initialize flags if it doesn't exist
                externalState.flags = { ...this.gameState.flags };
              }
            }
            GameState.saveState();
          }
        }
      } else {
        this.display("You look at the " + itemName + ", but there's nothing more to see."); // Changed message for undefined item
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

  talkTo(npcName) {
    const location = this.getCurrentLocation();
    if (!location || !location.npcs || !location.npcs.includes(npcName)) {
      this.display(`There is no one named '${npcName}' here.`);
      return;
    }

    const npc = this.currentLevel.npcs[npcName];
    if (npc && npc.dialogue) {
      this.display(`${npc.name} says: "${npc.dialogue}"`);
      // Potentially trigger flags or events based on dialogue
      if (npc.triggersFlag) {
        this.gameState.flags[npc.triggersFlag] = true;
        if (typeof GameState !== 'undefined') {
          const externalState = GameState.getGameState();
          if (externalState && externalState.flags) {
            externalState.flags[npc.triggersFlag] = true;
          } else if (externalState) {
            externalState.flags = { [npc.triggersFlag]: true };
          }
          GameState.saveState();
        }
      }
    } else {
      this.display(npcName + " doesn't have much to say.");
    }
  }
  showInventory() {
    this.display("🎒 YOUR INVENTORY:");
    if (this.gameState.inventory.length === 0) {
      this.display("Your backpack is empty.");
      this.display("💡 Tip: Look around and take items to help solve the mystery!");
    } else {
      this.display("You are carrying: " + this.gameState.inventory.join(", "));
      this.display("📦 Total items: " + this.gameState.inventory.length);
    }
    this.display("");
  }
  showHelp() {
    this.display("🎮 GAME COMMANDS:");
    this.display("");
    this.display("🔍 LOOK/EXAMINE - Look around or examine an item");
    this.display("   Example: 'look' or 'examine wool'");
    this.display("");
    this.display("🚶 MOVEMENT - Move in any direction");
    this.display("   Use the direction buttons or type: north, south, east, west, up, down");
    this.display("");
    this.display("✋ TAKE/GET - Pick up items");
    this.display("   Example: 'take wool' or 'get tracks'");
    this.display("");
    this.display("💬 TALK - Speak with people");
    this.display("   Example: 'talk farmer'");
    this.display("");
    this.display("🎒 INVENTORY - Check what you're carrying");
    this.display("   Shows all items in your possession");
    this.display("");
    this.display("📱 MOBILE TIP: Use the green buttons for easy play!");
    this.display("Start with LOOK to examine your surroundings.");
    this.display("");
  }

  checkVictory() {
    // This method should be implemented based on the game's win conditions.
    // For example, checking if a certain flag is set or item is possessed.
    if (this.currentLevel && typeof this.currentLevel.endCondition === 'function') {
      if (this.currentLevel.endCondition(this.gameState)) {
        this.display("\n*** Congratulations! You have won! ***");
        // Potentially end the game or move to a new state
      }
    } else if (this.gameState.goatFound) { // Fallback for original goatFound logic
        this.display("\n*** You completed the current objectives! ***");
    }
  }

  // Example of a simple flag system
}
