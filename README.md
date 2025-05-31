# GOAT Mystery: Terminal Tales - Quick Start Guide

Welcome, Investigator! Dive into "GOAT Mystery: Terminal Tales," an ASCII-art RPG where your mission is to uncover the truth behind the mysterious disappearance of G.O.A.T., the Greatest Of All Time.

## Premise

The world-renowned G.O.A.T. has vanished without a trace. As a seasoned investigator, you're called in to solve the enigma. Navigate a text-based world, gather clues, interact with characters (if any), and piece together the puzzle to find G.O.A.T.

## Basic Commands

You'll interact with the game using simple text commands. Here are some of the basic ones to get you started:

*   `LOOK`: Describes your current location and any visible items or points of interest.
*   `GO [direction]`: Moves your character in the specified direction (e.g., `GO NORTH`, `GO EAST`, `GO INSIDE`).
*   `TAKE [item]`: Picks up an item from your current location and adds it to your inventory (e.g., `TAKE KEY`).
*   `USE [item]`: Attempts to use an item from your inventory, sometimes with a target (e.g., `USE KEY ON CHEST`, `USE COMPUTER`).
*   `INVENTORY` (or `I`): Shows a list of items you are currently carrying.
*   `HELP`: Provides a list of available commands or hints about what you can do.

*(More commands might be discoverable as you progress!)*

## Objective

Your main objective is to solve the mystery of the missing G.O.A.T. This involves:
*   **Exploring** different locations.
*   **Collecting** clues and useful items.
*   **Solving** puzzles by using items and interacting with the environment.
*   Ultimately, uncovering what happened to G.O.A.T.

## How to Play Locally (Example)

To play this game locally on your computer:

1.  **Clone the repository:**
    ```bash
    git clone [replace_with_actual_repository_url] goat-rpg
    ```
2.  **Navigate to the game directory:**
    ```bash
    cd goat-rpg
    ```
3.  **Start a local web server:**
    If the game is browser-based (e.g., uses HTML, CSS, JavaScript), you can often run it using Python's built-in HTTP server.
    ```bash
    python -m http.server 8000
    ```
    (If you have Python 2, the command might be `python -m SimpleHTTPServer 8000`)

4.  **Open the game in your browser:**
    Open your web browser and go to `http://localhost:8000`.

Good luck, Investigator! The truth is out there in the ASCII.
