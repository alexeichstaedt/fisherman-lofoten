/**
 * DragCatchMixin
 * Call checkDragCatch(location) from the movement tween's onComplete
 * in any scene where the player can be on water with a boat.
 */
window.DragCatchMixin = {
  checkDragCatch(location) {
    if (!this.onWater || !this.state.hasBoat) return;
    if (Math.random() >= 0.02) return; // 5% chance per water tile

    const fish = window.getDragFish(location);
    if (!fish) return;

    const weight = fish.minW + Math.floor(Math.random() * (fish.maxW - fish.minW + 1));
    const value  = weight * fish.pricePerKg;
    const xp     = Math.round(weight * fish.xpMult * 50);
    const auraGain = (fish.rarity === 'secret' || fish.rarity === 'legendary') ? 3
                   : fish.rarity === 'rare' ? 2 : 1;

    // Give XP immediately
    if (window.addXP) {
      const leveled = window.addXP(this.state, xp);
      if (leveled) {
        this.game.events.emit('levelUp', this.state.level);
      }
    } else {
      this.state.xp = (this.state.xp || 0) + xp;
    }

    // Give aura immediately
    this.state.aura = Math.min(100, (this.state.aura || 0) + auraGain);

    // Store catch for later sale at Reine Market
    if (!this.state.dragCatches) this.state.dragCatches = [];
    const existing = this.state.dragCatches.find(c => c.name === fish.name);
    if (existing) {
      existing.totalWeight += weight;
      existing.totalValue  += value;
      existing.count++;
    } else {
      this.state.dragCatches.push({
        name: fish.name, count: 1,
        totalWeight: weight, totalValue: value,
        pricePerKg: fish.pricePerKg
      });
    }

    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.showMsg(`🎣 Drag: ${fish.name} ${weight}kg  +${xp}XP  +${auraGain} AURA`);
  }
};
