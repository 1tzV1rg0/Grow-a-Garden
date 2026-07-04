# Sprout Market Garden

Sprout Market Garden is a complete browser farming game inspired by Grow a Garden. It is built with plain HTML, CSS, and JavaScript, with no external frameworks or downloads.

## How to Play

Open index.html in a browser.

For the online leaderboard, run the included server instead:

```bash
node server.js
```

Then open the URL printed in the terminal. It starts with `http://127.0.0.1:4177/`, and if that port is already busy the server automatically tries the next available port.

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
- Fruit weight rolls on harvest, with heavier crops selling for more.
- Seed shop, Gear Shop, and Pet Shop eggs with limited shared restocks, Quick Buy quantity input, crop inventory, selling, and seed selection.
- Visible pets that wander around the garden and level up from duplicates.
- Optional generated music that changes to match the current weather.
- Weekly Events tab, ready for rotating events.
- Upgrades for more plots, faster growth, and bigger harvests.
- Responsive layout for desktop, tablet, and mobile screens.
- Automatic localStorage saving every few seconds and before the page closes.
- Manual Save Game and Reset Game controls.
- Online leaderboard when hosted with `server.js`, ranked by coins, coins earned, and seeds planted.

## Saved Progress

The game saves coins, seeds, harvested crops, planted crops, growth times, selected upgrades, unlocked plot count, current Seed Shop stock, Gear Shop stock, Pet Shop egg stock, pet levels, pet garden positions, restock timing, lifetime coins earned, lifetime seeds planted, and leaderboard name in the browser's localStorage. Refreshing or closing the page keeps your farm progress on the same browser and device.


## Gear Shop

The Gear Shop sells premium consumable tools with Quick Buy support. Gear stock is limited and restocks every 5 minutes on the same shared timer for everyone:

- Shovel: removes a planted crop from a plot.
- Watering Can: bought in bundles of 10 and halves the remaining growth time of a planted crop.
- Reclaimer: removes a planted crop and returns one matching seed.
- Basic Sprinkler, Advanced Sprinkler, and Master Sprinkler: water a 3x3 plot area, speed up growth, increase fruit size for heavier harvests, and boost mutation rates.

## Daily Quests

Daily quests reset each day and track planting seeds plus coins earned from selling crops. Completing quests awards seed packs such as Starter Seed Pack, Fruit Seed Pack, and Rare Seed Pack.

## Weekly Events

Events rotate once a week from the Events tab. This week's event is Nighttime.

Nighttime adds Night Time weather during the first 5 minutes of every hour, which can give plants the Moonlit mutation for a x4 value multiplier. Weather is shared by time window, so every player sees the same weather at the same time. Weather events rotate every 5 minutes, can last 5 to 10 minutes, and up to two weather events can overlap. The event shop restocks every 10 minutes with the same restock time and stock for everyone. It has limited stock for Moon Blossom, Moonbloom, Owl, and Night Seed Packs. The Owl is a Divine event pet that makes a planted crop Moonlit every 5 minutes. Night Seed Packs can contain Orchid, Lavender, Mulberry, Nightshade, Black Apple, or Dark Blossom.


## Upgrade Progression

Upgrades now use generated level-based progression up to Level 50. More Plots adds one plot per level, Growth Speed gradually shortens new crop timers with a 4 second minimum, and Harvest Yield adds one bonus crop every two levels. Upgrade costs rise deterministically as levels increase.


## Multi-Harvest Crops

Some fruit crops now stay planted after harvest and regrow for additional harvests. Strawberry, Blueberry, Apple, Grape, Mango, Dragonfruit, Starfruit, and Moon Melon can all produce more than once before the plot clears.

The garden now starts with 12 plots, and plot upgrades add one additional plot per level after that.

## Fruit Weight

Each harvest rolls a fruit weight. Heavier crops receive a higher sell multiplier, and harvested inventory shows the weight and value multiplier for each stack. Mutations and pet coin bonuses stack with weight value.

Sprinklers can increase the next harvest's fruit weight by adding a size boost to plants in a 3x3 area. They also add a temporary mutation boost that can help plants gain Gold, Rainbow, and active weather mutations while growing. Temporary growth speed boosts are cleared after harvest or regrowth, so sped-up crops do not keep saving that boost forever.


## Plant Mutations and Weather

Plants can now gain stackable mutations. Gold and Rainbow can appear naturally, and shared active weather can add weather mutations such as Wet, Frozen, Windblown, Celestial, Shocked from Thunderstorms, or Moonlit during the first 5 minutes of each hour in the Nighttime event. Shocked has a x10 value multiplier. Crops also get a one-time final mutation roll when growth finishes, and harvest triggers that final roll if it has not happened yet. Mutated harvests sell for more coins, and multiple mutations can stack on the same plant.

Use the Music button in Game Controls to turn on generated background music. Browsers require a click before sound can start, so music stays off until the player enables it. The active weather controls the notes, and overlapping weather mixes two small themes.

## More Fruits and Rarities

The crop roster now includes Peach, Pineapple, Sugar Apple, Sun Pear, Crystal Coconut, Prism Berry, Aurora Fruit, Lemon, Cherry, Banana, Kiwi, Papaya, Bamboo, Pomegranate, Cacao Pod, Lychee, Durian, Lotus Fruit, Ambrosia Plum, Nebula Orange, and Infinity Fig. Divine and Prismatic rarities sit above Mythic. Seed prices and unlock points were increased heavily, with Prismatic seed prices now reaching into the millions, and sell values are balanced around multi-harvest and mutation stacking so progression lasts longer.

## Seed Pack Exclusives and Animation

Some fruits are seed-pack exclusive and never appear in the seed shop: Candy Apple, Cloudberry, Ember Fig, Royal Kiwi, and Prism Plum. Quest rewards now open with a seed pack reveal animation before the awarded seeds are collected.

## Seed Shop Restocks

The Seed Shop restocks every 5 minutes and each restock has a limited number of seeds available. Restock rolls are shared by time window, so every player sees the same fresh stock during the same 5-minute period, while each player's purchases still reduce their own local stock. Seeds are displayed by rarity and price. Rarer seeds appear less often, and Prismatic seeds have only a 0.05% chance to appear in stock. Use Quick Buy on a stocked seed to type how many seeds you want to purchase at once.

## Pet Shop

The Pet Shop sells eggs that hatch into pets. Egg stock is limited and restocks every 10 minutes on the same shared timer for everyone. More expensive eggs have lower stock chances. Eggs are premium purchases, with the original egg prices increased by 100x and new Orchard, Royal, and Prism eggs added. Owned pets appear around the garden, sometimes moving and sometimes stopping. Duplicate pets raise that pet type's level, improving passive abilities by 12% per level and reducing cooldowns for cooldown-based pets such as the Owl. Pets can improve mutation chances, add bonus coins from sales, speed up growth, increase harvest yield, and add extra harvests to planted crops.

## Online Leaderboard

The Leaderboard tab can submit and refresh online scores when the game is opened through `server.js`. Scores are stored in `leaderboard.json` and ranked by current coins, then lifetime coins earned, then lifetime seeds planted. If the game is opened directly as `index.html` or through GitHub Pages, the leaderboard tab will explain that the local server needs to be running.

Update game website

<!-- Trigger GitHub Pages redeploy -->
