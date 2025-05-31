class Game {
  constructor() {
    this.terminal = document.getElementById('terminal');
    this.state = {
      location: 'farm',
      inventory: [],
      goatFound: false,
      talkedToFarmer: false
    };
    this.levelData = null;
  }

  init() {
    // Load level data
    if (window.levelData_level1) {
      this.levelData = window.levelData_level1;
      this.state.location = this.levelData.startLocation;
      
      // Load saved state
      this.load();
      
      // Setup controls
      this.setupControls();
      
      // Update context buttons
      this.updateContextButtons();
      
      // Start game
      this.display("=== " + this.levelData.name + " ===");
      this.display(this.levelData.opening_message);
      this.display("");
      this.look();
    } else {
      this.display("Error: Could not load game data.");
    }
  }

  setupControls() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('button[data-command]')) {
        const command = e.target.getAttribute('data-command');
        this.handleCommand(command);
      }
    });

    // Show/hide up/down buttons based on location
    this.updateMovementButtons();
  }

  updateMovementButtons() {
    const loc = this.getLocation();
    const upBtn = document.querySelector('[data-command="up"]');
    const downBtn = document.querySelector('[data-command="down"]');
    
    if (loc && loc.connections) {
      upBtn.style.display = loc.connections.up ? 'block' : 'none';
      downBtn.style.display = loc.connections.down ? 'block' : 'none';
    }
  }

  updateContextButtons() {
    const loc = this.getLocation();
    const takeBtn = document.getElementById('take-btn');
    const talkBtn = document.getElementById('talk-btn');
    
    if (loc) {
      takeBtn.style.display = (loc.items && loc.items.length > 0) ? 'block' : 'none';
      talkBtn.style.display = (loc.npcs && loc.npcs.length > 0) ? 'block' : 'none';
    }
  }

  handleCommand(command) {
    switch(command) {
      case 'look':
        this.look();
        break;
      case 'inventory':
        this.showInventory();
        break;
      case 'help':
        this.showHelp();
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
        this.takeItem();
        break;
      case 'talk':
        this.talk();
        break;
    }
    
    // Auto-save after each action
    this.save();
  }

  look() {
    const loc = this.getLocation();
    if (!loc) return;

    this.display(`📍 ${loc.name}`, 'location');
    this.display(loc.description);
    
    // Show items
    if (loc.items && loc.items.length > 0) {
      this.display("");
      this.display(`You see: ${loc.items.join(', ')}`, 'highlight');
    }
    
    // Show NPCs
    if (loc.npcs && loc.npcs.length > 0) {
      this.display(`People here: ${loc.npcs.join(', ')}`, 'highlight');
    }
    
    // Check win condition
    if (loc.special === 'goat_found' && !this.state.goatFound) {
      this.foundGoat();
    }
    
    this.display("");
    this.updateContextButtons();
    this.updateMovementButtons();
  }

  move(direction) {
    const loc = this.getLocation();
    if (!loc || !loc.connections || !loc.connections[direction]) {
      this.display(`You can't go ${direction} from here.`, 'error');
      return;
    }
    
    this.state.location = loc.connections[direction];
    this.display(`You go ${direction}...`);
    this.display("");
    this.look();
  }

  takeItem() {
    const loc = this.getLocation();
    if (!loc || !loc.items || loc.items.length === 0) {
      this.display("Nothing to take here.", 'error');
      return;
    }
    
    const item = loc.items[0];
    loc.items.splice(0, 1);
    this.state.inventory.push(item);
    this.display(`You take the ${item}.`, 'success');
    this.updateContextButtons();
  }

  talk() {
    const loc = this.getLocation();
    if (!loc || !loc.npcs || loc.npcs.length === 0) {
      this.display("No one to talk to here.", 'error');
      return;
    }
    
    const npcId = loc.npcs[0];
    const npc = this.levelData.npcs[npcId];
    
    if (npc) {
      let dialogue = npc.dialogue.initial;
      
      if (this.state.goatFound) {
        dialogue = npc.dialogue.goatFound || dialogue;
      } else if (this.state.inventory.length > 0) {
        dialogue = npc.dialogue.foundClue1 || dialogue;
      }
      
      this.display(`${npc.name}: "${dialogue}"`, 'dialogue');
      this.state.talkedToFarmer = true;
    }
  }

  showInventory() {
    this.display("=== INVENTORY ===", 'header');
    if (this.state.inventory.length === 0) {
      this.display("Your bag is empty.");
    } else {
      this.state.inventory.forEach(item => {
        this.display(`• ${item}`);
      });
    }
    this.display("");
  }

  showHelp() {
    this.display("=== HOW TO PLAY ===", 'header');
    this.display("LOOK - See what's around");
    this.display("Arrow buttons - Move around");
    this.display("TAKE - Pick up items");
    this.display("TALK - Speak to people");
    this.display("ITEMS - Check your bag");
    this.display("");
    this.display("Find Geraldine the goat!", 'highlight');
    this.display("");
  }

  foundGoat() {
    this.state.goatFound = true;
    this.display("");
    this.display("🎉 YOU FOUND GERALDINE! 🎉", 'victory');
    this.display("");
    
    if (this.levelData.onComplete) {
      const victory = this.levelData.onComplete(this.state);
      this.display(victory.message, 'success');
    }
    
    // Show restart option
    setTimeout(() => {
      if (confirm("Great job! Would you like to play again?")) {
        this.restart();
      }
    }, 1000);
  }

  restart() {
    this.state = {
      location: 'farm',
      inventory: [],
      goatFound: false,
      talkedToFarmer: false
    };
    localStorage.removeItem('goatGame');
    this.terminal.innerHTML = '';
    this.init();
  }

  getLocation() {
    return this.levelData?.locations?.[this.state.location];
  }

  display(text, className = '') {
    const line = document.createElement('div');
    line.className = 'line' + (className ? ' ' + className : '');
    line.textContent = text;
    this.terminal.appendChild(line);
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  save() {
    try {
      localStorage.setItem('goatGame', JSON.stringify(this.state));
    } catch (e) {
      console.error('Save failed:', e);
    }
  }

  load() {
    try {
      const saved = localStorage.getItem('goatGame');
      if (saved) {
        const loadedState = JSON.parse(saved);
        // Restore state but ensure level data items are properly restored
        this.state = loadedState;
        
        // Remove items from locations that are in inventory
        if (this.state.inventory.length > 0) {
          Object.values(this.levelData.locations).forEach(loc => {
            if (loc.items) {
              loc.items = loc.items.filter(item => !this.state.inventory.includes(item));
            }
          });
        }
      }
    } catch (e) {
      console.error('Load failed:', e);
    }
  }
}

// Initialize game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
  window.game.init();
});
