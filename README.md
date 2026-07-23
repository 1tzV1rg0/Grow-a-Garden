# Grow a Garden

Grow a Garden is a colorful browser farming game made with plain HTML, CSS, and JavaScript. Players buy seeds, plant them in a garden grid, wait for crops to grow, harvest them, and sell the harvest for coins.

## How to Run

Open `public/index.html` in a web browser.

The game is designed to run directly from the file. Some browsers block direct loading of local JSON files, so the game includes a matching fallback copy of the starter data. If you serve the folder with a small local web server, the game will load the JSON files from the `data` folder.

## Folder Structure

```text
public/
  index.html
  style.css
  script.js
src/
  gameRules.js
  plantRules.js
  shopRules.js
data/
  players.json
  plants.json
  inventory.json
README.md
```

## What Each Folder Is For

`public` contains the browser page, styles, and the main game controller script.

`src` contains JavaScript rule files. These files decide how planting, growth, selling, inventory, and shop actions work.

`data` contains starter game data in JSON. JSON files store numbers and lists, not gameplay logic.

## Game Data Files

`data/players.json` stores the starting player setup:

- `startingCoins`: how many coins a new player begins with
- `gardenSize`: how many plots appear in the garden grid

`data/plants.json` stores plant stats:

- `id`: unique plant key used by inventory and rules
- `name`: display name
- `emoji`: plant icon shown in the game
- `seedPrice`: coin cost to buy one seed
- `growTimeSeconds`: how long the crop takes to become ready
- `sellValue`: coins earned for selling one harvested crop

`data/inventory.json` stores starter inventory:

- `seeds`: starting seed counts by plant id
- `crops`: starting harvested crop counts by plant id

## How to Add New Plants

Add a new object to the `plants` array in `data/plants.json`:

```json
{
  "id": "blueberry",
  "name": "Blueberry",
  "emoji": "🫐",
  "seedPrice": 35,
  "growTimeSeconds": 26,
  "sellValue": 72
}
```

To give the player starter seeds for that plant, add the same id to `data/inventory.json`:

```json
{
  "seeds": {
    "carrot": 3,
    "strawberry": 1,
    "blueberry": 2
  },
  "crops": {}
}
```

No rule changes are needed for a basic plant. The shop, garden, inventory, harvesting, and selling systems read the plant list automatically.

## Save and Load

Starter data comes from the JSON files. Player progress is saved in the browser with `localStorage`, including coins, seeds, harvested crops, and planted garden plots. Use the Save Game button to save manually, or let the game autosave while playing.

