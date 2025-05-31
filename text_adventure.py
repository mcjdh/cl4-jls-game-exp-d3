#!/usr/bin/env python3

import sys

# --- Game Data ---
current_location = "forest_entrance"
inventory = []

locations = {
    "forest_entrance": {
        "description": "You are at the entrance of a dark forest. A narrow path leads north into the woods. To the south is a sunny meadow.",
        "exits": {"north": "deep_forest", "south": "meadow"},
        "items": ["rusty_key"]
    },
    "deep_forest": {
        "description": "You are deep in the forest. Sunlight barely filters through the canopy. There's a small, locked chest here. The path continues east. You can go back south.",
        "exits": {"east": "ancient_ruin", "south": "forest_entrance"},
        "items": ["locked_chest"],
        "locked_chest_opened": False
    },
    "meadow": {
        "description": "You are in a bright, sunny meadow. Flowers bloom everywhere. A path leads back north to the forest entrance.",
        "exits": {"north": "forest_entrance"},
        "items": ["shiny_stone"]
    },
    "ancient_ruin": {
        "description": "You've found an ancient, crumbling ruin. There's an altar in the center. You can go back west.",
        "exits": {"west": "deep_forest"},
        "items": []
    }
}

# --- Helper Functions ---
def print_location():
    loc_data = locations[current_location]
    print(f"\n--- {current_location.replace('_', ' ').title()} ---")
    print(loc_data["description"])
    if loc_data["items"]:
        print("You see: " + ", ".join(loc_data["items"]))
    exits = ", ".join(loc_data["exits"].keys())
    print(f"Exits: {exits}")

def handle_go(direction):
    global current_location
    loc_data = locations[current_location]
    if direction in loc_data["exits"]:
        current_location = loc_data["exits"][direction]
        print_location()
    else:
        print(f"You can't go {direction}.")

def handle_look():
    print_location()

def handle_take(item_name):
    global inventory
    loc_data = locations[current_location]
    if item_name in loc_data["items"]:
        if item_name == "locked_chest" and not loc_data.get("locked_chest_opened", False):
            print("The chest is too heavy to take, and it seems locked.")
            return
        loc_data["items"].remove(item_name)
        inventory.append(item_name)
        print(f"You took the {item_name}.")
    else:
        print(f"You don't see a {item_name} here.")

def handle_inventory():
    if inventory:
        print("You are carrying: " + ", ".join(inventory))
    else:
        print("Your inventory is empty.")

def handle_use(item_name):
    global locations
    if item_name == "rusty_key" and "rusty_key" in inventory:
        if current_location == "deep_forest" and "locked_chest" in locations["deep_forest"]["items"]:
            print("You use the rusty_key on the locked_chest. It clicks open!")
            locations["deep_forest"]["items"].remove("locked_chest")
            locations["deep_forest"]["items"].append("opened_chest")
            locations["deep_forest"]["items"].append("ancient_scroll") # Item inside the chest
            locations["deep_forest"]["locked_chest_opened"] = True
            inventory.remove("rusty_key")
            print("Inside the chest, you find an ancient_scroll.")
        else:
            print(f"You can't use the {item_name} here.")
    elif item_name == "ancient_scroll" and "ancient_scroll" in inventory:
        if current_location == "ancient_ruin":
            print("\nAs you read the ancient_scroll on the altar, a blinding light envelops you!")
            print("The ruins resonate with power, and a hidden inscription glows on the altar:")
            print("'THE PATH TO VICTORY IS UNDERSTANDING THE PAST.'")
            print("\nCongratulations! You have found the 'victory' condition by using the scroll in the ruin.")
            print("--- GAME OVER ---")
            sys.exit(0) # End the game
        else:
            print("You read the scroll, but nothing happens here. It speaks of ancient power and a specific place.")
    else:
        print(f"You can't use '{item_name}' or you don't have it.")

def handle_quit():
    print("Quitting the game. Goodbye!")
    sys.exit(0)

# --- Main Game Loop ---
def main():
    print("Welcome to the Text Adventure!")
    print_location()

    while True:
        try:
            command = input("> ").strip().lower().split()
            if not command:
                continue

            action = command[0]
            args = command[1:]

            if action == "go" and args:
                handle_go(args[0])
            elif action == "look":
                handle_look()
            elif action == "take" and args:
                handle_take(args[0])
            elif action == "inventory" or action == "i":
                handle_inventory()
            elif action == "use" and args:
                handle_use(args[0])
            elif action == "quit" or action == "exit":
                handle_quit()
            else:
                print("Unknown command. Try: go [direction], look, take [item], use [item], inventory, quit")
        except EOFError: # Handle EOF for non-interactive execution
            print("\nEOF reached. Quitting game.")
            break
        except KeyboardInterrupt:
            print("\nQuitting game due to interrupt.")
            break

if __name__ == "__main__":
    main()
