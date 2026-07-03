# Sprout Market Garden

Sprout Market Garden is a complete browser farming game inspired by Grow a Garden. It is built with plain HTML, CSS, and JavaScript, with no external frameworks or downloads.

## How to Play

Open index.html in a browser.

For the online leaderboard, run the included server instead:

```bash
node server.js
```

Then open `http://127.0.0.1:4177/`.

1. Buy seeds from the Seed Shop.
2. Select a seed, then click an empty garden plot to plant it.
3. Wait for the crop timer to finish.
4. Click a ready crop to harvest it.
5. Sell harvested crops for coins.
6. Use coins to buy better seeds and upgrades.

## Features

- Expanded crop roster with vegetables and fruits, including Strawberry, Lemon, Cherry, Banana, Kiwi, Papaya, Bamboo, Pomegranate, Lychee, Durian, Lotus Fruit, Nebula Orange, Infinity Fig, and more.
- Rarity tiers from Common through Mythic, shown in the shop and inventory.
- Garden plots with live growth timers and animated crop growth.
- Seed shop with 5-minute limited restocks, Quick Buy quantity input, crop inventory, selling, and seed selection.
- Upgrades for more plots, faster growth, and bigger harvests.
- Responsive layout for desktop, tablet, and mobile screens.
- Automatic localStorage saving every few seconds and before the page closes.
- Manual Save Game and Reset Game controls.
- Online leaderboard when hosted with `server.js`, ranked by coins, coins earned, and seeds planted.

## Saved Progress

The game saves coins, seeds, harvested crops, planted crops, growth times, selected upgrades, unlocked plot count, current Seed Shop stock, restock timing, lifetime coins earned, lifetime seeds planted, and leaderboard name in the browser's localStorage. Refreshing or closing the page keeps your farm progress on the same browser and device.


## Gear Shop

The Gear Shop sells consumable tools:

- Shovel: removes a planted crop from a plot.
- Watering Can: halves the remaining growth time of a planted crop.
- Reclaimer: removes a planted crop and returns one matching seed.

## Daily Quests

Daily quests reset each day and track planting seeds plus coins earned from selling crops. Completing quests awards seed packs such as Starter Seed Pack, Fruit Seed Pack, and Rare Seed Pack.


## Upgrade Progression

Upgrades now use generated level-based progression up to Level 50. More Plots adds one plot per level, Growth Speed gradually shortens new crop timers with a 4 second minimum, and Harvest Yield adds one bonus crop every two levels. Upgrade costs rise deterministically as levels increase.


## Multi-Harvest Crops

Some fruit crops now stay planted after harvest and regrow for additional harvests. Strawberry, Blueberry, Apple, Grape, Mango, Dragonfruit, Starfruit, and Moon Melon can all produce more than once before the plot clears.

The garden now starts with 12 plots, and plot upgrades add one additional plot per level after that.


## Plant Mutations and Weather

Plants can now gain stackable mutations. Gold and Rainbow can appear naturally, and active weather can add weather mutations such as Wet, Frozen, Windblown, or Celestial. Mutated harvests sell for more coins, and multiple mutations can stack on the same plant.

## More Fruits and Rarities

The crop roster now includes Peach, Pineapple, Sugar Apple, Sun Pear, Crystal Coconut, Prism Berry, Aurora Fruit, Lemon, Cherry, Banana, Kiwi, Papaya, Bamboo, Pomegranate, Cacao Pod, Lychee, Durian, Lotus Fruit, Ambrosia Plum, Nebula Orange, and Infinity Fig. Divine and Prismatic rarities sit above Mythic. Seed prices and unlock points were increased heavily, with Prismatic seed prices now reaching into the millions, and sell values are balanced around multi-harvest and mutation stacking so progression lasts longer.

## Seed Pack Exclusives and Animation

Some fruits are seed-pack exclusive and never appear in the seed shop: Candy Apple, Cloudberry, Ember Fig, Royal Kiwi, and Prism Plum. Quest rewards now open with a seed pack reveal animation before the awarded seeds are collected.

## Seed Shop Restocks

The Seed Shop restocks every 5 minutes and each restock has a limited number of seeds available. Seeds are displayed by rarity and price. Rarer seeds appear less often, and Prismatic seeds have only a 0.05% chance to appear in stock. Use Quick Buy on a stocked seed to type how many seeds you want to purchase at once.

## Pet Shop

The Pet Shop sells eggs that hatch into pets. Eggs are premium purchases, with the original egg prices increased by 100x and new Orchard, Royal, and Prism eggs added. Owned pets stack passive bonuses automatically. Pets can improve mutation chances, add bonus coins from sales, speed up growth, increase harvest yield, and add extra harvests to planted crops.

## Online Leaderboard

The Leaderboard tab can submit and refresh online scores when the game is opened through `server.js`. Scores are stored in `leaderboard.json` and ranked by current coins, then lifetime coins earned, then lifetime seeds planted. If the game is opened directly as `index.html`, the leaderboard tab will explain that the server needs to be running.

Update game website

<!-- Trigger GitHub Pages redeploy -->
