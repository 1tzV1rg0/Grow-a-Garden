(function () {
  // This fallback lets the game open directly from public/index.html even if
  // the browser blocks local JSON fetches from the data folder.
  var DEFAULT_DATA = {
    player: {
      startingCoins: 80,
      gardenSize: 12
    },
    plants: [
      { "id": "carrot", "name": "Carrot", "emoji": "🥕", "seedPrice": 10, "growTimeSeconds": 8, "sellValue": 18 },
      { "id": "strawberry", "name": "Strawberry", "emoji": "🍓", "seedPrice": 18, "growTimeSeconds": 14, "sellValue": 34 },
      { "id": "tomato", "name": "Tomato", "emoji": "🍅", "seedPrice": 28, "growTimeSeconds": 22, "sellValue": 55 },
      { "id": "sunflower", "name": "Sunflower", "emoji": "🌻", "seedPrice": 45, "growTimeSeconds": 35, "sellValue": 92 },
      { "id": "watermelon", "name": "Watermelon", "emoji": "🍉", "seedPrice": 70, "growTimeSeconds": 50, "sellValue": 150 }
    ],
    inventory: {
      seeds: {
        carrot: 3,
        strawberry: 1
      },
      crops: {}
    }
  };

  function createInitialState(data, savedState) {
    if (savedState && Array.isArray(savedState.garden)) {
      savedState.plants = data.plants;
      return savedState;
    }

    return {
      coins: data.player.startingCoins,
      plants: data.plants,
      seedInventory: copyObject(data.inventory.seeds),
      cropInventory: copyObject(data.inventory.crops),
      garden: createGarden(data.player.gardenSize)
    };
  }

  function createGarden(size) {
    var plots = [];
    for (var i = 0; i < size; i += 1) {
      plots.push(null);
    }
    return plots;
  }

  function indexPlants(plants) {
    return plants.reduce(function (lookup, plant) {
      lookup[plant.id] = plant;
      return lookup;
    }, {});
  }

  function inventoryEntries(inventory, plantLookup) {
    return Object.keys(inventory)
      .filter(function (plantId) {
        return inventory[plantId] > 0 && plantLookup[plantId];
      })
      .map(function (plantId) {
        return {
          plant: plantLookup[plantId],
          count: inventory[plantId]
        };
      });
  }

  function copyObject(source) {
    return JSON.parse(JSON.stringify(source || {}));
  }

  window.GameRules = {
    DEFAULT_DATA: DEFAULT_DATA,
    createInitialState: createInitialState,
    indexPlants: indexPlants,
    inventoryEntries: inventoryEntries
  };
})();
