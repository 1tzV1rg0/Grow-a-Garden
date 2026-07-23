(function () {
  function canBuySeed(state, plant) {
    return state.coins >= plant.seedPrice;
  }

  function buySeed(state, plant) {
    if (!canBuySeed(state, plant)) {
      return { ok: false, message: "Not enough coins." };
    }

    // Buying a seed spends coins and increases the seed inventory count.
    state.coins -= plant.seedPrice;
    state.seedInventory[plant.id] = (state.seedInventory[plant.id] || 0) + 1;
    return { ok: true };
  }

  function sellAllCrops(state, plantLookup) {
    var total = 0;

    Object.keys(state.cropInventory).forEach(function (plantId) {
      var count = state.cropInventory[plantId] || 0;
      var plant = plantLookup[plantId];
      if (!plant || count <= 0) return;
      total += count * plant.sellValue;
      state.cropInventory[plantId] = 0;
    });

    if (total <= 0) {
      return { ok: false, message: "No crops to sell yet." };
    }

    state.coins += total;
    return { ok: true, coinsEarned: total };
  }

  window.ShopRules = {
    canBuySeed: canBuySeed,
    buySeed: buySeed,
    sellAllCrops: sellAllCrops
  };
})();
