# GOAT Mystery: Terminal Tales - One-Hour MVP Build

## Overview
Optimized for rapid development with 3 agents working in parallel 20-minute waves. Focus: Get a playable demo with one complete level.

## Wave Structure (3 x 20-minute waves = 1 hour)

### WAVE 1: Foundation (Minutes 0-20)
**Goal**: Terminal UI, basic engine, first level content

#### Agent A: HTML/CSS Terminal
**Task**: QUICK-001
**Output**: `index.html`, `css/terminal.css`
```
- Basic HTML shell with terminal div
- Green-on-black terminal CSS
- Mobile viewport setup
- Simple button row for commands
- No animations (save time)
```

#### Agent B: Core Engine
**Task**: QUICK-002  
**Output**: `js/engine.js`
```
- Minimal GameEngine class
- Simple command parser (LOOK, MOVE, TAKE)
- Basic scene manager
- Text output function
- Hook for level loading
```

#### Agent C: Level 1 Content
**Task**: QUICK-003
**Output**: `levels/level-1.js`
```
- Write opening: "The prized goat is missing!"
- Create 3 locations: Farm, Barn, Field
- Add 1 NPC: Worried Farmer
- Simple puzzle: Find 3 clues
- Victory: Discover goat is in barn loft
```

---

### WAVE 2: Integration (Minutes 20-40)
**Goal**: Connect everything, make it playable

#### Agent A: Terminal Controller
**Task**: QUICK-004
**Dependencies**: QUICK-001, QUICK-002
**Output**: `js/terminal.js`
```
- Wire up terminal to engine
- Handle button clicks
- Display text with typewriter effect
- Show current location
- Process player commands
```

#### Agent B: State & Level Loader
**Task**: QUICK-005
**Dependencies**: QUICK-002, QUICK-003
**Output**: `js/state.js`, `js/levelLoader.js`
```
- Simple state object (location, inventory)
- Load level-1.js data
- Track collected clues
- Check win condition
- Basic save to localStorage
```

#### Agent C: ASCII Art Pack
**Task**: QUICK-006
**Output**: `assets/ascii/quick-art.js`
```
- Farm ASCII header (5 lines)
- Barn ASCII (5 lines)  
- Field ASCII (5 lines)
- Goat ASCII (3 lines)
- Victory screen (8 lines)
```

---

### WAVE 3: Polish & Ship (Minutes 40-60)
**Goal**: Bug fixes, mobile optimization, final touches

#### Agent A: Mobile Optimization
**Task**: QUICK-007
**Dependencies**: All previous
**Output**: Updates to CSS/JS files
```
- Fix button sizes for mobile
- Add touch event handlers
- Ensure text is readable
- Test on phone simulator
- Add loading screen
```

#### Agent B: Game Flow Polish
**Task**: QUICK-008
**Dependencies**: All previous
**Output**: Updates to engine.js, level-1.js
```
- Add intro sequence
- Smooth transitions
- Victory celebration
- Add 3 hidden easter eggs
- Credits screen
```

#### Agent C: Quick Test & Deploy
**Task**: QUICK-009
**Dependencies**: All previous
**Output**: `README.md`, bug fixes
```
- Play through entire game
- Fix any breaking bugs
- Write quick-start guide
- Set up GitHub Pages
- Share playable link
```

---

## Simplified File Structure
```
gaot-rpg/
├── index.html          # Main game (Wave 1)
├── css/
│   └── terminal.css    # Minimal styles (Wave 1)
├── js/
│   ├── engine.js       # Core engine (Wave 1)
│   ├── terminal.js     # UI controller (Wave 2)
│   ├── state.js        # State manager (Wave 2)
│   └── levelLoader.js  # Level loader (Wave 2)
├── levels/
│   └── level-1.js      # Demo level (Wave 1)
└── assets/
    └── ascii/
        └── quick-art.js # ASCII art (Wave 2)
```

## Core Features Only
- ✅ Terminal interface
- ✅ Basic commands (LOOK, MOVE, TAKE)
- ✅ One complete level
- ✅ Simple puzzle
- ✅ Mobile responsive
- ✅ Save state

## Cut for Later
- ❌ Multiple levels
- ❌ Complex animations
- ❌ Achievement system
- ❌ Multiple endings
- ❌ Sound effects
- ❌ Advanced puzzles

## Communication Protocol
1. **Wave Start**: All 3 agents begin simultaneously
2. **10-min check**: Quick status in chat
3. **Wave End**: Commit code, hand off to next wave
4. **No blockers**: Work around issues, document for later

## Success Metrics
- **Wave 1**: See terminal, read story
- **Wave 2**: Can play through level
- **Wave 3**: Polished, mobile-ready, shared link

## Emergency Simplifications
If running behind, cut:
1. Typewriter effect → Instant text
2. 3 locations → 2 locations  
3. ASCII art → Text headers
4. Save system → Session only
5. Mobile polish → Desktop only

## One-Line Install
```bash
git clone [repo] && cd gaot-rpg && python -m http.server 8000
```

## Post-Hour Expansion
After MVP ships, add:
- More levels (30 min each)
- Better puzzles (20 min each)
- Polish features (as needed)

---

**Remember**: Ship something playable! Perfect is the enemy of done.
- Create multiple endings (3)
- Implement final confrontation
- Add meta-narrative elements
- Build credits sequence
```

### FEAT-002: Save System Enhancement
**Owner**: Backend Agent
**Dependencies**: FEAT-001
**Output**: Updates to `js/state.js`
```
- Add cloud save support
- Implement multiple save slots
- Create checkpoint system
- Add save corruption recovery
- Build import/export feature
```

## Phase 4: Polish & Features (Week 8-9)

### FEAT-003: Achievement System
**Owner**: Feature Agent
**Dependencies**: CORE-004
**Output**: `js/achievements.js`
```
- Design 25 achievements
- Create tracking system
- Build notification UI
- Add statistics tracking
- Implement unlockables
```

### UI-004: Accessibility Features
**Owner**: UI Agent
**Dependencies**: UI-001, UI-002
**Output**: Updates to all UI files
```
- Add screen reader support
- Implement high contrast mode
- Create font size controls
- Add colorblind modes
- Build keyboard navigation
```

### FEAT-004: Speed Run Mode
**Owner**: Feature Agent
**Dependencies**: All LEVEL tasks
**Output**: `js/speedrun.js`
```
- Create timer system
- Add ghost data recording
- Build leaderboard interface
- Implement run validation
- Add practice mode
```

### TEST-001: Cross-Platform Testing
**Owner**: QA Agent
**Dependencies**: All previous tasks
**Output**: `tests/` directory, bug reports
```
- Test on 5 mobile browsers
- Verify touch controls
- Check save system integrity
- Validate all puzzle solutions
- Performance profiling
```

## Parallel Tasks (Ongoing)

### DOC-001: API Documentation
**Owner**: Documentation Agent
**Dependencies**: Progressive
**Output**: `docs/api.md`
```
- Document all classes
- Create method references
- Add code examples
- Write integration guides
```

### DOC-002: Content Guidelines
**Owner**: Documentation Agent
**Dependencies**: LEVEL-001
**Output**: `docs/content-guide.md`
```
- ASCII art standards
- Writing style guide
- Puzzle design principles
- Balancing guidelines
```

## Task Dependencies Graph
```
CORE-001 ──┬─> CORE-002 ──┬─> UI-001 ──┬─> UI-002
           │              │            ├─> UI-003
           │              │            └─> FEAT-001
           │              │
CORE-003 ──┼─> CORE-004 ──┴─> CORE-005 ──┬─> LEVEL-001 ──┬─> LEVEL-002
           │                              │               ├─> LEVEL-003
           │                              │               ├─> LEVEL-004
           │                              │               ├─> LEVEL-005
           │                              │               └─> LEVEL-006
           │                              │
           └─> FEAT-002 ──────────────────┴─> FEAT-003
                                              FEAT-004
                                              TEST-001
```

## Success Metrics
- **Phase 1**: Terminal renders, basic navigation works
- **Phase 2**: Level 1 fully playable, evidence collection functional
- **Phase 3**: All 5 arcs complete, multiple endings work
- **Phase 4**: 95% mobile compatibility, <3s load time

## Communication Protocol
1. Claim task by updating status to "In Progress"
2. Create feature branch named after task ID
3. Update progress daily in task comments
4. Mark blockers immediately
5. Submit PR when complete

## Code Standards
- ES6+ JavaScript
- Mobile-first CSS
- Semantic HTML5
- JSDoc comments
- 2-space indentation
- Max 80 char lines (for terminal display)

## Testing Requirements
- Unit tests for all game logic
- Integration tests for level transitions
- Manual testing on 3 devices minimum
- Performance budget: 60fps on mid-range phones

## Asset Guidelines
- ASCII art max 80 chars wide
- All text content in external files
- Lazy load assets per level
- Maximum 100KB per level file

## Version Control
```
main
├── develop
│   ├── feature/CORE-XXX
│   ├── feature/UI-XXX
│   ├── feature/LEVEL-XXX
│   └── feature/FEAT-XXX
└── release/v1.0
```

## Daily Sync Points
- 9 AM: Task claim/update
- 2 PM: Blocker review
- 5 PM: Progress commit

## Delivery Schedule
- Week 1-2: Phase 1 complete
- Week 3-4: Phase 2 complete  
- Week 5-7: Phase 3 complete
- Week 8-9: Phase 4 complete
- Week 10: Final testing & launch

---

**Note**: This is a living document. Update task status and dependencies as work progresses.
