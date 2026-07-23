(function () {
  function plantSeed(state, plotIndex, plantId) {
    if (!state.seedInventory[plantId]) {
      return { ok: false, message: "You do not have that seed." };
    }

    if (state.garden[plotIndex]) {
      return { ok: false, message: "That plot already has a plant." };
    }

    // Planting spends one seed and stores a timestamp for the growth timer.
    state.seedInventory[plantId] -= 1;
    state.garden[plotIndex] = {
      plantId: plantId,
      plantedAt: Date.now()
    };

    return { ok: true };
  }

  function getGrowthStatus(plot, plant, now) {
    var totalMs = plant.growTimeSeconds * 1000;
    var elapsedMs = Math.max(0, now - plot.plantedAt);
    var percent = Math.min(100, Math.floor((elapsedMs / totalMs) * 100));
    var remainingSeconds = Math.max(0, Math.ceil((totalMs - elapsedMs) / 1000));

    return {
      ready: percent >= 100,
      percent: percent,
      label: percent >= 100 ? "Ready" : remainingSeconds + "s left"
    };
  }

  function harvestPlot(state, plotIndex, plantLookup, now, silent) {
    var plot = state.garden[plotIndex];
    if (!plot) {
      return { ok: false, message: "There is nothing to harvest." };
    }

    var plant = plantLookup[plot.plantId];
    var growth = getGrowthStatus(plot, plant, now);

    if (!growth.ready) {
      return {
        ok: false,
        message: silent ? "" : plant.name + " is still growing."
      };
    }

    // Harvesting moves one ready crop into crop inventory and frees the plot.
    state.cropInventory[plant.id] = (state.cropInventory[plant.id] || 0) + 1;
    state.garden[plotIndex] = null;
    return { ok: true, plant: plant };
  }

  window.PlantRules = {
    plantSeed: plantSeed,
    getGrowthStatus: getGrowthStatus,
    harvestPlot: harvestPlot
  };
})();
