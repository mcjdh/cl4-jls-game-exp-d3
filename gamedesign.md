# GOAT Mystery: Terminal Tales - A Mobile ASCII RPG

## Game Overview
A mystery-driven ASCII RPG where players uncover the truth behind the legendary G.O.A.T. (Greatest Of All Time) through a mobile-optimized terminal interface. Navigate through 5 interconnected mystery arcs using simple tap controls.

## Core Mechanics
- **Terminal-style interface**: Mobile-first design with console aesthetic
- **Tap-based navigation**: Large touch targets for story progression
- **ASCII art scenes**: Minimalist visual storytelling
- **Mystery solving**: Collect clues, interrogate suspects, solve puzzles
- **Modular level system**: Easily expandable story structure
- **Evidence inventory**: Track clues and items found

## Technical Architecture

### File Structure
```
gaot-rpg/
├── index.html              # Main game interface
├── css/
│   ├── terminal.css        # Terminal styling
│   └── mobile.css          # Mobile optimizations
├── js/
│   ├── engine.js           # Core game engine
│   ├── terminal.js         # Terminal UI controller
│   ├── levelLoader.js      # Dynamic level loading
│   └── state.js            # Game state management
├── levels/
│   ├── level-template.js   # Template for new levels
│   ├── level-1.js          # Arc 1: The Missing Goat
│   ├── level-2.js          # Arc 2: The Barn Conspiracy
│   ├── level-3.js          # Arc 3: Underground Network
│   ├── level-4.js          # Arc 4: The Council
│   └── level-5.js          # Arc 5: Truth Revealed
└── assets/
    └── ascii/
        └── shared.js       # Shared ASCII art library
```

## Story Structure - Mystery Arcs

### Arc 1: The Missing Goat
- **Mystery**: The legendary G.O.A.T. has vanished
- **Locations**: Farm, Meadow, Village
- **Key Mechanic**: Learn investigation basics

### Arc 2: The Barn Conspiracy
- **Mystery**: Strange symbols found in abandoned barn
- **Locations**: Old Barn, Library, Mayor's Office
- **Key Mechanic**: Decode cryptic messages

### Arc 3: Underground Network
- **Mystery**: Secret tunnels beneath the farm
- **Locations**: Tunnels, Hidden Chamber, Archive
- **Key Mechanic**: Navigate maze-like passages

### Arc 4: The Council
- **Mystery**: Ancient goat council pulling strings
- **Locations**: Council Chamber, Records Room, Tower
- **Key Mechanic**: Dialogue trees and negotiations

### Arc 5: Truth Revealed
- **Mystery**: The real meaning of G.O.A.T.
- **Locations**: Summit, Reality Nexus, Final Confrontation
- **Key Mechanic**: Use all previous skills

## Mobile-First Design

### Terminal Interface
```
┌─────────────────────────┐
│  GOAT MYSTERY TERMINAL  │
├─────────────────────────┤
│                         │
│  [ASCII ART DISPLAY]    │
│                         │
├─────────────────────────┤
│ > Current location:     │
│   Old Barn - West Wing  │
│                         │
│ The dusty barn creaks   │
│ ominously. Strange      │
│ symbols cover the wall. │
│                         │
│ [Evidence: 3 items]     │
└─────────────────────────┘
┌─────────────────────────┐
│ [EXAMINE] [MOVE] [TALK] │
│ [INVENTORY] [MAP] [HELP]│
└─────────────────────────┘
```

### Touch Controls
- Large button areas (min 44x44px)
- Swipe gestures for navigation
- Long press for details
- Pinch to zoom ASCII art

## Level Module Structure

### Standard Level Format (level-template.js)
```javascript
const level = {
  id: 'level-x',
  name: 'Arc Name',
  locations: {},
  npcs: {},
  items: {},
  puzzles: {},
  ascii: {},
  startLocation: 'location-id',
  endCondition: function() {},
  onComplete: function() {}
};
```

### Story Beat Structure
```javascript
const storyBeat = {
  id: 'beat-id',
  text: 'Story text...',
  ascii: 'ascii-key',
  choices: [
    {
      text: 'Choice text',
      action: 'next-beat-id',
      requires: ['item-id'],
      gives: ['clue-id']
    }
  ]
};
```

## Game Features

### Terminal Commands
- `LOOK` - Examine current location
- `MOVE [direction]` - Navigate
- `TALK [npc]` - Dialogue
- `USE [item]` - Interact
- `MAP` - Show area map
- `HELP` - Command list

### Evidence System
- Clue collection
- Evidence combining
- Deduction interface
- Case file viewer

### ASCII Art System
- Location headers
- Character portraits
- Item illustrations
- Map displays
- Animation sequences

## Mobile Optimizations

### Performance
- Lazy load levels
- Minimal DOM manipulation
- CSS animations only
- Local storage for saves
- Service worker for offline

### Responsive Design
- Fluid typography (clamp())
- Flexible grid layout
- Portrait/landscape modes
- Safe area insets
- Touch-friendly spacing

### Accessibility
- High contrast mode
- Font size controls
- Screen reader support
- Keyboard navigation
- Reduced motion option

## Development Priorities

### Phase 1: Core Terminal
- Terminal UI component
- Mobile touch controls
- Basic navigation system
- Level loading framework

### Phase 2: First Mystery Arc
- Level 1 complete content
- Evidence collection system
- Basic puzzle mechanics
- Save/load functionality

### Phase 3: Full Mystery
- All 5 story arcs
- NPC dialogue system
- Complex puzzles
- Multiple endings

### Phase 4: Polish
- Achievements system
- Speed run mode
- New Game+ features
- Community levels support

## Design Principles
- **Mobile-First**: Designed for phones, scales to tablets/desktop
- **Modular**: Easy to add new levels/content
- **Accessible**: Clear text, simple controls
- **Atmospheric**: Terminal aesthetic creates mood
- **Replayable**: Multiple solutions, hidden content

## Victory Conditions
Players solve the ultimate mystery by:
- Completing all 5 story arcs
- Collecting key evidence pieces
- Making crucial deductions
- Confronting the truth about G.O.A.T.

## Expansion System
New levels can be added by:
1. Creating new level-X.js file
2. Following level template structure
3. Registering in levelLoader.js
4. No core code changes needed

## Easter Eggs
- Hidden terminal commands
- ASCII art gallery unlock
- Developer commentary mode
- Speedrun ghost data
- Secret sixth arc
