(function () {
  var SAVE_KEY = "growAGardenSaveV1";
  var AUTOSAVE_MS = 5000;

  var state = null;
  var selectedSeedId = null;
  var plantLookup = {};
  var autosaveTimer = null;
  var gardenTimer = null;

  var els = {
    coins: document.getElementById("coinCount"),
    selectedSeed: document.getElementById("selectedSeedLabel"),
    gardenStatus: document.getElementById("gardenStatus"),
    saveStatus: document.getElementById("saveStatus"),
    garden: document.getElementById("gardenGrid"),
    shop: document.getElementById("shopList"),
    seedInventory: document.getElementById("seedInventory"),
    cropInventory: document.getElementById("cropInventory"),
    harvestReady: document.getElementById("harvestReadyBtn"),
    sellAll: document.getElementById("sellAllBtn"),
    save: document.getElementById("saveBtn"),
    reset: document.getElementById("resetBtn")
  };

  startGame();

  function startGame() {
    loadStarterData().then(function (starterData) {
      plantLookup = window.GameRules.indexPlants(starterData.plants);
      state = window.GameRules.createInitialState(starterData, loadSavedState());
      ensureSelectedSeed();
      bindEvents();
      render();
      startClock();
      markSaveStatus("Ready");
    });
  }

  function bindEvents() {
    els.harvestReady.onclick = harvestReadyPlots;
    els.sellAll.onclick = sellAllCrops;
    els.save.onclick = function () {
      saveGame();
      markSaveStatus("Saved");
    };
    els.reset.onclick = resetGame;
  }

  function startClock() {
    if (autosaveTimer) clearInterval(autosaveTimer);
    if (gardenTimer) clearInterval(gardenTimer);

    // Re-rendering the garden once a second keeps growth bars and timers fresh.
    gardenTimer = setInterval(renderGarden, 1000);
    autosaveTimer = setInterval(saveGame, AUTOSAVE_MS);
    window.onbeforeunload = saveGame;
  }

  function loadStarterData() {
    return Promise.all([
      fetchJson("../data/players.json"),
      fetchJson("../data/plants.json"),
      fetchJson("../data/inventory.json")
    ]).then(function (files) {
      return {
        player: files[0],
        plants: files[1].plants,
        inventory: files[2]
      };
    }).catch(function () {
      // Some browsers block local JSON fetches when index.html is opened directly.
      // The fallback mirrors the JSON files so the game still runs from a file.
      return window.GameRules.DEFAULT_DATA;
    });
  }

  function fetchJson(path) {
    return fetch(path).then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load " + path);
      }
      return response.json();
    });
  }

  function loadSavedState() {
    try {
      return JSON.parse(localStorage.getItem(SAVE_KEY));
    } catch (error) {
      return null;
    }
  }

  function saveGame() {
    if (!state) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    markSaveStatus("Saved");
  }

  function resetGame() {
    if (!confirm("Reset your garden and start over?")) return;
    localStorage.removeItem(SAVE_KEY);
    selectedSeedId = null;
    startGame();
  }

  function render() {
    els.coins.textContent = state.coins;
    renderGarden();
    renderShop();
    renderInventories();
  }

  function renderGarden() {
    var plantedCount = state.garden.filter(Boolean).length;
    els.gardenStatus.textContent = plantedCount + " planted";
    els.garden.innerHTML = "";

    state.garden.forEach(function (plot, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "plot";
      button.onclick = function () {
        handlePlotClick(index);
      };

      if (!plot) {
        button.classList.add("empty");
        button.innerHTML = "<span class=\"plant-emoji\">+</span><span class=\"plant-name\">Plant Seed</span>";
      } else {
        var plant = plantLookup[plot.plantId];
        var growth = window.PlantRules.getGrowthStatus(plot, plant, Date.now());
        button.classList.toggle("ready", growth.ready);
        button.innerHTML =
          "<span class=\"plant-emoji\">" + plant.emoji + "</span>" +
          "<span class=\"plant-name\">" + plant.name + "</span>" +
          "<span class=\"plant-meta\">" + growth.label + "</span>" +
          "<span class=\"progress\"><span style=\"width:" + growth.percent + "%\"></span></span>";
      }

      els.garden.appendChild(button);
    });
  }

  function renderShop() {
    els.shop.innerHTML = "";
    state.plants.forEach(function (plant) {
      var row = document.createElement("div");
      row.className = "shop-item";
      row.innerHTML =
        "<span class=\"item-icon\">" + plant.emoji + "</span>" +
        "<div><div class=\"item-name\">" + plant.name + " Seed</div>" +
        "<div class=\"item-meta\">Buy " + plant.seedPrice + " coins | Sell " + plant.sellValue + " | " + plant.growTimeSeconds + "s</div></div>";

      var buy = document.createElement("button");
      buy.type = "button";
      buy.className = "buy-btn";
      buy.textContent = "Buy";
      buy.disabled = !window.ShopRules.canBuySeed(state, plant);
      buy.onclick = function () {
        window.ShopRules.buySeed(state, plant);
        selectedSeedId = plant.id;
        render();
      };

      row.appendChild(buy);
      els.shop.appendChild(row);
    });
  }

  function renderInventories() {
    renderSeedInventory();
    renderCropInventory();
    var selectedPlant = plantLookup[selectedSeedId];
    els.selectedSeed.textContent = selectedPlant ? selectedPlant.name : "None";
  }

  function renderSeedInventory() {
    els.seedInventory.innerHTML = "";
    var seedEntries = window.GameRules.inventoryEntries(state.seedInventory, plantLookup);

    if (!seedEntries.length) {
      els.seedInventory.innerHTML = "<p class=\"empty-note\">No seeds yet. Visit the shop.</p>";
      return;
    }

    seedEntries.forEach(function (entry) {
      var row = document.createElement("div");
      row.className = "inventory-item";
      row.innerHTML =
        "<span class=\"item-icon\">" + entry.plant.emoji + "</span>" +
        "<div><div class=\"item-name\">" + entry.plant.name + "</div>" +
        "<div class=\"item-meta\">" + entry.count + " seed" + plural(entry.count) + "</div></div>";

      var select = document.createElement("button");
      select.type = "button";
      select.className = "select-btn" + (selectedSeedId === entry.plant.id ? " active" : "");
      select.textContent = selectedSeedId === entry.plant.id ? "Selected" : "Select";
      select.onclick = function () {
        selectedSeedId = entry.plant.id;
        renderInventories();
      };

      row.appendChild(select);
      els.seedInventory.appendChild(row);
    });
  }

  function renderCropInventory() {
    els.cropInventory.innerHTML = "";
    var cropEntries = window.GameRules.inventoryEntries(state.cropInventory, plantLookup);

    if (!cropEntries.length) {
      els.cropInventory.innerHTML = "<p class=\"empty-note\">Harvested crops appear here.</p>";
      return;
    }

    cropEntries.forEach(function (entry) {
      var row = document.createElement("div");
      row.className = "inventory-item";
      row.innerHTML =
        "<span class=\"item-icon\">" + entry.plant.emoji + "</span>" +
        "<div><div class=\"item-name\">" + entry.plant.name + "</div>" +
        "<div class=\"item-meta\">" + entry.count + " crop" + plural(entry.count) + " | " + entry.plant.sellValue + " coins each</div></div>";
      els.cropInventory.appendChild(row);
    });
  }

  function handlePlotClick(index) {
    var plot = state.garden[index];

    if (plot) {
      harvestPlot(index);
      return;
    }

    if (!selectedSeedId) {
      alert("Select a seed first.");
      return;
    }

    var result = window.PlantRules.plantSeed(state, index, selectedSeedId);
    if (!result.ok) {
      alert(result.message);
      return;
    }

    ensureSelectedSeed();
    render();
  }

  function harvestPlot(index) {
    var result = window.PlantRules.harvestPlot(state, index, plantLookup, Date.now());
    if (!result.ok) {
      alert(result.message);
      return;
    }
    render();
  }

  function harvestReadyPlots() {
    state.garden.forEach(function (plot, index) {
      if (!plot) return;
      window.PlantRules.harvestPlot(state, index, plantLookup, Date.now(), true);
    });
    render();
  }

  function sellAllCrops() {
    var result = window.ShopRules.sellAllCrops(state, plantLookup);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    render();
  }

  function ensureSelectedSeed() {
    if (selectedSeedId && state.seedInventory[selectedSeedId] > 0) return;
    selectedSeedId = Object.keys(state.seedInventory).find(function (id) {
      return state.seedInventory[id] > 0;
    }) || null;
  }

  function markSaveStatus(text) {
    els.saveStatus.textContent = text;
  }

  function plural(count) {
    return count === 1 ? "" : "s";
  }
})();
