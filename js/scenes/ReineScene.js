window.ReineScene = class extends Phaser.Scene {
  constructor() { super({ key: 'ReineScene' }); }

  init(data) {
    this.state = SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.state.location = 'reine';
    this.MAP = REINE_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    const savedHere = !data && this.state.location === 'reine';
    this.playerTileX = (data && data.spawnX !== undefined) ? data.spawnX : 8;
    this.playerTileY = (data && data.spawnY !== undefined) ? data.spawnY : 14;
    this.player = null;
    this.npcs = [];
    this.cursors = null;
    this.fKey = null;
    this.spaceKey = null;
    this.isFishing = false;
    this.isMoving = false;
    this.moveCooldown = 0;
    this.facing = (data && data.spawnFacing) || 'down';
    this.onWater = false;
    this.dialogOpen = false;
    this.travelMenuOpen = false;
    this.burgerShopOpen = false;
    this.top10Open = false;
    this.marketOpen = false;
    this.restaurantOpen = false;
    this.birdTourOpen   = false;
    this.companionSprite = null;
    this.lastPlayerTile = {tx:0, ty:0};
  }

  create() {
    this.drawMap();
    const _TS = GAME_DATA.TILE_SIZE;
    this.add.text((5 + 2.5) * _TS, (16 + 1.5) * _TS, 'Reine\nMarket',
      { fontSize:'10px', color:'#fbbf24', fontFamily:'monospace', align:'center',
        stroke:'#000000', strokeThickness:3 }).setOrigin(0.5).setDepth(5);
    this.add.text((17 + 2.5) * _TS, (22 + 1.5) * _TS, 'Restaurant\nReine',
      { fontSize:'10px', color:'#fbbf24', fontFamily:'monospace', align:'center',
        stroke:'#000000', strokeThickness:3 }).setOrigin(0.5).setDepth(5);
    this.add.text((6 + 2.5) * _TS, (6 + 1.5) * _TS, 'Bird\nWatching\nTour',
      { fontSize:'10px', color:'#fbbf24', fontFamily:'monospace', align:'center',
        stroke:'#000000', strokeThickness:3 }).setOrigin(0.5).setDepth(5);
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    const _spawnTile = this.MAP.ground?.[this.playerTileY]?.[this.playerTileX];
    const _spawnWater = _spawnTile === 'O' || _spawnTile === 'D';
    if (_spawnWater ? !this.state.hasBoat : !this.walkGrid[this.playerTileY]?.[this.playerTileX]) { this.playerTileX = 8; this.playerTileY = 5; }
    const fz = this.MAP.objects.find(o=>o.type==='ferry-zone');    this.ferryTile = fz ? {tx:fz.tx+1, ty:fz.ty+2} : null;
    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.applyInitialWaterState();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.spawnCompanion();
    this.createNPCs();

    this.fishHint    = this.add.text(400, 612, 'Press F to fish', {fontSize:'14px',color:'#fbbf24',stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.interactHint= this.add.text(400, 592, 'Press SPACE to interact', {fontSize:'13px',color:'#94a3b8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText     = this.add.text(400, 572, '', {fontSize:'14px',color:'#ffffff',stroke:'#000000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locationLabel= this.add.text(400, -50, 'Reine', {fontSize:'18px',color:'#ffffff',stroke:'#000000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

    this.cursors  = this.input.keyboard.createCursorKeys();
    this.fKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.isFishing = false;

    Object.assign(this, window.BushEncounterMixin);
    Object.assign(this, window.BaddieFollowMixin);
    Object.assign(this, window.DragCatchMixin);
    this.initEncounter();
    this.initBaddieFollow();
    window.checkBaddieTimers(this.state);
    if (!this.scene.isActive('UIScene')) this.scene.launch('UIScene');

    // Norwegian Passport: fixed location, no random selection needed

    this.game.events.emit('updateUI', this.state);

    this.game.events.off('fishingComplete');
    this.game.events.on('fishingComplete', this.onFishCaught, this);

    this.buildDialogUI();
    this.buildTravelMenu();
    this.buildBurgerUI();
    this.buildTop10UI();
  }

  drawMap() {
    const TS = GAME_DATA.TILE_SIZE;
    const map = this.MAP;
    this.add.rectangle(0, 0, GAME_DATA.MAP_COLS*TS+2, GAME_DATA.MAP_ROWS*TS+2, 0x071524).setOrigin(0,0).setDepth(-1);
    for (let r=0; r<GAME_DATA.MAP_ROWS; r++) {
      for (let c=0; c<GAME_DATA.MAP_COLS; c++) {
        const key = GAME_DATA.GROUND_KEYS[map.ground[r][c]] || 'tile-grass';
        this.add.image(c*TS, r*TS, key).setOrigin(0,0).setScale(2).setDepth(0);
      }
    }
    for (const obj of map.objects) {
      const def = OBJECT_DEFS[obj.type];
      if (!def) continue;
      this.add.image(obj.tx*TS, obj.ty*TS, def.key)
        .setOrigin(0,0).setScale(2)
        .setDepth(1 + obj.ty*0.01);
    }
  }

  createNPCs() {
    const defs = [
      {tx:5,  ty:12, key:'ow2', type:'burger', name:'Island Local',   dialogue:''},
      {tx:11, ty:7, key:'ow3', type:'fisherman', name:'Fisherman',      dialogue:''},
      {tx:13, ty:8,  key:'ow5', type:'musikk', name:'Ikke Musikk Fan', dialogue:''},
      {tx:7,  ty:14, key:'ow9', type:'ferry',  name:'Ferry Captain',  dialogue:''},
      {tx:1,  ty:25, key:'ow1', type:'dialog', name:'Villager',       dialogue:'', dialogues: window.LOFOTEN_FACTS},
      {tx:8,  ty:27, key:'ow6', type:'dialog', name:'Bird Watcher',   dialogue:'', dialogues: window.BIRD_WATCHER_FACTS},
    ];
    const TS = GAME_DATA.TILE_SIZE;
    this.npcs = defs.map((d,i) => {
      const sprite = this.add.sprite(d.tx*TS+TS/2, d.ty*TS+TS/2, d.key, 1).setDepth(9);
      this.tweens.add({targets:sprite, y:sprite.y-4, duration:900+i*120, yoyo:true, repeat:-1, delay:i*200});
      return {...d, sprite};
    });
  }

  spawnCompanion() {
    if (this.companionSprite) { this.companionSprite.destroy(); this.companionSprite = null; }
    if (!this.state.companion) return;
    const TS = GAME_DATA.TILE_SIZE;
    const bx = this.playerTileX*TS+TS/2;
    const by = Math.min((this.playerTileY+1)*TS+TS/2, (GAME_DATA.MAP_ROWS-1)*TS+TS/2);
    this.companionSprite = this.add.sprite(bx, by, this.state.companion, 1).setDepth(9);
    this.companionSprite.play(this.state.companion+'-idle-down', true);
  }

  updateCompanion() {
    if (!this.companionSprite || !this.state.companion) return;
    this.companionSprite.setVisible(!this.onWater);
    const TS = GAME_DATA.TILE_SIZE;
    const tx = this.lastPlayerTile.tx, ty = this.lastPlayerTile.ty;
    const dx = this.playerTileX - tx, dy = this.playerTileY - ty;
    let dir='down';
    if (dx>0) dir='right'; else if (dx<0) dir='left'; else if (dy<0) dir='up';
    const k = this.state.companion;
    this.companionSprite.play(k+'-walk-'+dir, true);
    this.tweens.add({targets:this.companionSprite, x:tx*TS+TS/2, y:ty*TS+TS/2, duration:160,
      onComplete:()=>{ if(this.companionSprite) this.companionSprite.play(k+'-idle-'+dir,true); }});
  }

  updatePlayerPos() {
    const TS = GAME_DATA.TILE_SIZE;
    this.player.setPosition(this.playerTileX*TS+TS/2, this.playerTileY*TS+TS/2);
  }

  isPassable(col, row) {
    if (col<0||row<0||col>=GAME_DATA.MAP_COLS||row>=GAME_DATA.MAP_ROWS) return false;
    const g = this.MAP.ground[row][col];
    if (g==='O'||g==='D') return this.state.hasBoat;
    if (this.npcs && this.npcs.some(n => n.tx === col && n.ty === row)) return false;
    return this.walkGrid[row][col];
  }

  applyInitialWaterState() {
    const g = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    this.onWater = (g === 'O' || g === 'D');
    if (this.onWater) {
      this.player.setTexture('boat').setScale(0.5);
      if (this.companionSprite) this.companionSprite.setVisible(false);
    } else {
      this.player.setTexture(this.charKey).setScale(1);
    }
  }

  checkWaterTransform() {
    this.player.setFlipY(false);
    const g = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    const nowWater = (g === 'O' || g === 'D');
    if (nowWater === this.onWater) return;
    this.onWater = nowWater;
    if (nowWater) {
      this.player.setTexture('boat').setScale(0.5);
      if (this.companionSprite) this.companionSprite.setVisible(false);
    } else {
      this.player.setTexture(this.charKey).setScale(1);
      if (this.companionSprite) this.companionSprite.setVisible(true);
    }
  }

  isFishingSpot() {
    const og = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    if ((og==='O'||og==='D') && this.state.hasBoat) return true;
    const r=this.playerTileY, c=this.playerTileX;
    const g = this.MAP.ground[r]?.[c];
    if (g==='O'||g==='D') return this.state.hasBoat;
    const dirMap={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [dx,dy] = dirMap[this.facing] || [0,1];
    const nr=r+dy, nc=c+dx;
    if (nr<0||nc<0||nr>=GAME_DATA.MAP_ROWS||nc>=GAME_DATA.MAP_COLS) return false;
    return !!(this.waterGrid[nr][nc]);
  }

  startFishing() {
    if (!this.state.rod) {
      this.showMsg('Need a rod to fish!');
      return;
    }
    this.isFishing = true;
    SaveSystem.save(this.state);
    const dirMap={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [ddx,ddy] = dirMap[this.facing]||[0,1];
    const ft = this.MAP.ground[this.playerTileY+ddy]?.[this.playerTileX+ddx];
    const ct = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    const isDeepOcean = ct==='D' || ft==='D';
    this.scene.sleep();
    this.scene.launch('FishingScene', {location:'reine', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'ReineScene'});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (!result.caught) {
      if (result.fish) { window.addFishAuraMiss(this.state, result.fish, false); this.game.events.emit('updateUI', this.state); }
      return;
    }
    const _xpMult = getXPBonus(this.state.companion, 'reine');
    const _xpFinal = Math.round(result.xp * _xpMult);
    const leveled = addXP(this.state, _xpFinal);
    this.state.totalFishCaught = (this.state.totalFishCaught || 0) + 1;
    if (this.state.totalFishCaught === 100 && window.checkAndAwardBadge(this.state, 'fish-100', '100 Fish')) this.showMsg('🏆 BADGE UNLOCKED: 100 Fish Caught!');
    if (this.state.totalFishCaught === 1000 && window.checkAndAwardBadge(this.state, 'fish-1000', '1000 Fish')) this.showMsg('🏆 BADGE UNLOCKED: 1000 Fish Caught!');
    window.updateTop10(this.state, result.fish, 'Reine');
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    const newTrophy = addTrophy(this.state, result.fish.name);
    if (newTrophy) {
      this.game.events.emit('trophy', result.fish.name);
      if (newTrophy.badgeUnlocked) this.showMsg('🏆 BADGE UNLOCKED: All Trophy Fish! 🏆');
    }
    const _invResult = window.addFishToInventory(this.state, result.fish, {value: result.value});
    if (_invResult.added) {
      const _cabinBonus = window.cabinFishBonus(this.state);
      if (_cabinBonus > 0) { this.state.cabinEarnings = (this.state.cabinEarnings||0) + _cabinBonus; }
      this.showMsg('Caught '+result.fish.name+' '+result.fish.weight+'kg! +'+_xpFinal+'XP'+(_invResult.replaced?' (dropped '+_invResult.replaced.name+')':'')+(_cabinBonus>0?' +'+_cabinBonus.toLocaleString()+' kr (cabin)':''));
    } else {
      this.showMsg('Too small — released. +'+_xpFinal+'XP');
    }
    window.addFishAura(this.state, result.fish);
    if (this.state.tournamentActive && result.fish.weight > ((this.state.tournamentBestFish && this.state.tournamentBestFish.weight) || 0)) {
      this.state.tournamentBestFish = { name: result.fish.name, weight: result.fish.weight };
    }
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
  }

  showMsg(txt) {
    this.msgText.setVisible(true);
    this.msgText.setText(txt);
    this.time.delayedCall(3000, ()=>{ if(this.msgText){ this.msgText.setText(''); this.msgText.setVisible(false); } });
  }

  checkNorPassport() {
    if (this.state.hasNorPassport) return;
    if (this.playerTileX === 4 && this.playerTileY === 3 && this.facing === 'right') {
      this.state.hasNorPassport = true;
      this.state.aura = Math.max(-100, Math.min(100, (this.state.aura || 20) + 10));
      if (!this.state.playerItems) this.state.playerItems = [];
      this.state.playerItems.push('Norwegian Passport');
      SaveSystem.save(this.state);
      this.game.events.emit('updateUI', this.state);
      this.openDialog('🇳🇴 Norwegian Passport Found!', `You discovered a Norwegian Passport hidden in the upper-left tree of Reine! Added to your Ikke Musikk Duffel Bag. +10 AURA (Now: ${this.state.aura})`);
    }
  }

  getNearbyNPC() {
    const dirMap={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [dx,dy] = dirMap[this.facing] || [0,0];
    const tx=this.playerTileX+dx, ty=this.playerTileY+dy;
    return this.npcs.find(n=>n.tx===tx && n.ty===ty) || null;
  }

  interact(npc) {
    if (npc.type === 'musikk') {
      const lyrics = GAME_DATA.IKKE_MUSIKK_LYRICS;
      const line = lyrics[Math.floor(Math.random() * lyrics.length)];
      this.openDialog('🎤 Ikke Musikk Fan', '♪ ' + line + ' ♪');
    } else if (npc.type === 'ferry') {
      if (!this.state.hasFerryPass) { this.openDialog('Ferry Captain', "You'll need a ferry pass to travel the islands."); }
      else { this.openTravelMenu(); }
    } else if (npc.type === 'burger') {
      this.openBurgerShop();
    } else if (npc.type === 'fisherman') {
      this.openTop10UI();
    } else {
      const _g = GAME_DATA.OW_GENDER?.[npc.key];
      const _lines = npc.dialogues;
      const _txt = _lines ? _lines[Math.floor(Math.random()*_lines.length)] : npc.dialogue;
      this.openDialog((_g==='male'?'👨 ':_g==='female'?'👩 ':'')+npc.name, _txt);
    }
  }

  checkFerryTile() {
    if (this.ferryTile && this.playerTileX===this.ferryTile.tx && this.playerTileY===this.ferryTile.ty) {
      if (!this.dialogOpen && !this.travelMenuOpen) {
        if (!this.state.hasFerryPass) { this.openDialog('Ferry Captain', "You'll need a ferry pass to travel the islands."); }
        else { this.openTravelMenu(); }
      }
    }
  }

  // ── Travel Menu ──────────────────────────────────────────────────
  buildTravelMenu() {
    const travelBg   = this.add.rectangle(0,0,400,340,0x0f172a,0.97).setStrokeStyle(2,0x4ade80);
    this.travelTitle  = this.add.text(0,-140,'Travel To...',{fontSize:'22px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelDests  = ['Leknes','Kåkern','Kvalvika','Henningsvær'];
    this.travelTexts  = this.travelDests.map((d,i)=>{ const t=this.add.text(0,-80+i*50,d,{fontSize:'18px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5); t.setInteractive({useHandCursor:true}).on('pointerdown',()=>{ if(!this.travelMenuOpen) return; this.travelIndex=i; this.updateTravelCursor(); this.executeTravel(d); }); return t; });
    this.travelCursor = this.add.text(0,0,'>',{fontSize:'16px',color:'#4ade80'});
    this.travelHint   = this.add.text(0,140,'Tap or ENTER to travel  ·  ESC cancel',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelLayer  = this.add.container(400,320).setDepth(51).setVisible(false).setScrollFactor(0);
    this.travelLayer.add([travelBg,this.travelTitle,...this.travelTexts,this.travelCursor,this.travelHint]);
    this.travelIndex  = 0;
  }

  openTravelMenu() {
    this.travelMenuOpen = true;
    this.travelLayer.setVisible(true);
    this.travelIndex = 0;
    this.updateTravelCursor();
  }

  updateTravelCursor() {
    this.travelTexts.forEach((t,i)=>t.setColor(i===this.travelIndex?'#4ade80':'#ffffff'));
    const sel = this.travelTexts[this.travelIndex];
    this.travelCursor.setPosition(sel.x-sel.width/2-24, sel.y-10);
  }

  executeTravel(dest) {
    const sceneMap = {'Leknes':'LeknesScene','Kåkern':'KakernScene','Kvalvika':'KvalvikaScene','Henningsvær':'HenningsvaarScene'};
    const locMap   = {'Leknes':'leknes','Kåkern':'kåkern','Kvalvika':'kvalvika','Henningsvær':'henningsvær'};
    const spawnMap = {
    'Leknes': {x:12, y:18},
    'Kåkern': {x:11, y:7},
    'Kvalvika': {x:16, y:17},
    'Henningsvær': {x:15, y:23}
  };
    const spawn = spawnMap[dest] || {x:12, y:13};
    this.state.location = locMap[dest] || dest.toLowerCase();
    this.state.x = spawn.x;
    this.state.y = spawn.y;
    SaveSystem.saveNow(this.state);
    this.closeAll();
    window.showTravelAnim(this, 'ferry', () => { this.scene.start(sceneMap[dest] || 'LeknesScene', {spawnX: spawn.x, spawnY: spawn.y}); });
  }


  buildBurgerUI() {
    const bg = this.add.rectangle(0,0,420,220,0x1a0a00,0.97).setStrokeStyle(2,0xf59e0b);
    const title  = this.add.text(0,-85,'🐟 FRESH FISH BURGER 🐟',{fontSize:'18px',color:'#f59e0b',fontFamily:'monospace'}).setOrigin(0.5);
    const line1  = this.add.text(0,-45,'Caught this morning in Reine!',{fontSize:'14px',color:'#e2e8f0',fontFamily:'monospace'}).setOrigin(0.5);
    const line2  = this.add.text(0,-15,'Cost: 200 NOK',{fontSize:'15px',color:'#fbbf24',fontFamily:'monospace'}).setOrigin(0.5);
    const line3  = this.add.text(0, 15,'Gives: 500 XP',{fontSize:'15px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(0.5);
    this.burgerHint = this.add.text(0,65,'ENTER to buy  ESC to pass',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.burgerLayer = this.add.container(400,320).setDepth(55).setVisible(false).setScrollFactor(0);
    this.burgerLayer.add([bg,title,line1,line2,line3,this.burgerHint]);
  }

  openBurgerShop() {
    this.burgerShopOpen = true;
    this.burgerHint.setText('ENTER to buy  ESC to pass');
    this.burgerLayer.setVisible(true);
  }

  buyBurger() {
    if (this.state.money < 200) {
      this.burgerHint.setText('Not enough NOK! (need 200)');
      return;
    }
    this.state.money -= 200;
    const leveled = addXP(this.state, 500);
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.closeAll();
    this.showMsg('Delicious! +500 XP');
  }

  // ── Dialog UI ────────────────────────────────────────────────────
  buildDialogUI() {
    const diagBg  = this.add.rectangle(400, 490, 760, 120, 0x0f172a, 0.95).setStrokeStyle(2, 0x94a3b8).setDepth(52).setScrollFactor(0);
    this.diagName = this.add.text(30, 438, '', {fontSize:'15px',color:'#fbbf24',fontFamily:'monospace'}).setDepth(53).setScrollFactor(0);
    this.diagText = this.add.text(30, 462, '', {fontSize:'14px',color:'#e2e8f0',fontFamily:'monospace',wordWrap:{width:740}}).setDepth(53).setScrollFactor(0);
    this.diagHint = this.add.text(770, 538, 'SPACE to close', {fontSize:'12px',color:'#475569',fontFamily:'monospace'}).setOrigin(1,1).setDepth(53).setScrollFactor(0);
    this.diagLayer = this.add.container(0,0).setDepth(52).setVisible(false).setScrollFactor(0);
    this.diagLayer.add([diagBg, this.diagName, this.diagText, this.diagHint]);
  }

  openDialog(name, text) {
    this.dialogOpen = true;
    this.diagName.setText(name);
    this.diagText.setText(text);
    this.diagLayer.setVisible(true);
  }

  closeAll() {
    this.dialogOpen = false;
    this.travelMenuOpen = false;
    this.burgerShopOpen = false;
    this.top10Open = false;
    if (this.diagLayer)   this.diagLayer.setVisible(false);
    if (this.travelLayer) this.travelLayer.setVisible(false);
    if (this.burgerLayer) this.burgerLayer.setVisible(false);
    if (this.top10Layer)  this.top10Layer.setVisible(false);
    this.closeMarket();
  }

  getCabinDoor() {
    for (const obj of this.MAP.objects) {
      if (obj.type==='cabin1'||obj.type==='cabin2'||obj.type==='shop') {
        if (this.playerTileX===obj.tx+1 && this.playerTileY===obj.ty+5) return obj;
      }
    }
    return null;
  }

  showCabinIdiom() {
    const door = this.getCabinDoor();
    // Middle cabin (cabin2 at tx:5, ty:16) → Reine Market
    if (door && door.tx === 5 && door.ty === 16) {
      this.openMarket();
      return;
    }
    // Upper-left cabin (cabin1 at tx:6, ty:6) → Bird Watching Tour
    if (door && door.tx === 6 && door.ty === 6) {
      this.openBirdTourMenu();
      return;
    }
    // Lower-right cabin (cabin1 at tx:17, ty:22) → Restaurant Reine
    if (door && door.tx === 17 && door.ty === 22) {
      this.openRestaurant();
      return;
    }
    const idioms = GAME_DATA.CABIN_IDIOMS;
    if (!this.state.usedIdioms) this.state.usedIdioms = [];
    if (this.state.usedIdioms.length >= idioms.length) this.state.usedIdioms = [];
    const unused = idioms.map((_,i)=>i).filter(i=>!this.state.usedIdioms.includes(i));
    const idx = unused[Math.floor(Math.random()*unused.length)];
    this.state.usedIdioms.push(idx);
    this.openDialog('\u{1F3E0} Norwegian Wisdom', idioms[idx]);
  }

  update(time, delta) {
    this.moveCooldown -= delta;

    // Bush encounter — blocks all other input/movement
    if (this.encounterOpen) {
      this._handleEncounterInput();
      return;
    }

    if (this.marketOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) { this.closeMarket(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
        this._marketTab = 1 - (this._marketTab || 0);
        this._renderMarket();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        if ((this._marketTab || 0) === 0) { this._sellAllDragCatches(); return; }
        else { this._buyHarpoon(); return; }
      }
      return;
    }

    if (this.restaurantOpen) {
      // After date result, any confirm/esc key closes
      if (this._restaurantAwaitingClose) {
        const anyKey = Phaser.Input.Keyboard.JustDown(this.enterKey) ||
                       Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                       Phaser.Input.Keyboard.JustDown(this.escKey);
        if (anyKey) this.closeRestaurant();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) { this.closeRestaurant(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this._restaurantChoice = 1 - this._restaurantChoice;
        this._updateRestaurantCursor();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        if (this._restaurantChoice === 0) this._confirmDateDinner();
        else this.closeRestaurant();
        return;
      }
      return;
    }

    if (this.birdTourOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) { this.closeBirdTourMenu(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this._birdTourChoice = 1 - this._birdTourChoice;
        this._updateBirdTourCursor();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        if (this._birdTourChoice === 0) this._startBirdTour();
        else this.closeBirdTourMenu();
        return;
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.dialogOpen || this.travelMenuOpen || this.burgerShopOpen || this.top10Open) { this.closeAll(); return; }
    }

    if (this.travelMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.travelIndex=(this.travelIndex-1+this.travelDests.length)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.travelIndex=(this.travelIndex+1)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.executeTravel(this.travelDests[this.travelIndex]);
      return;
    }

    if (this.burgerShopOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.buyBurger(); return; }
      return;
    }

    if (this.top10Open) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.enterKey)) { this.closeAll(); return; }
      return;
    }

    if (this.dialogOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)||Phaser.Input.Keyboard.JustDown(this.enterKey)) this.closeAll();
      return;
    }

    if (this.playerTileX!==this._hTx||this.playerTileY!==this._hTy||this.facing!==this._hFacing) {
      this._hTx=this.playerTileX; this._hTy=this.playerTileY; this._hFacing=this.facing;
      this._canFish=this.isFishingSpot(); this._nearNPC=this.getNearbyNPC();
      this._nearDoor=!this._nearNPC&&this.getCabinDoor();
      this.fishHint.setVisible(this._canFish);
      this.interactHint.setVisible(!!(this._nearNPC||this._nearDoor));
    }
    const canFish=this._canFish, nearNPC=this._nearNPC, nearDoor=this._nearDoor;

    this.checkBaddieFollowInput();
    if (canFish && !this.isFishing && Phaser.Input.Keyboard.JustDown(this.fKey)) { this.startFishing(); return; }
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (nearNPC)  { this.interact(nearNPC); return; }
      if (nearDoor) { this.showCabinIdiom(); return; }
      this.checkNorPassport();
    }

    if (this.moveCooldown <= 0 && !this.isMoving) {
      let dx=0, dy=0, newFacing=this.facing;
      if      (this.cursors.left.isDown)  { dx=-1; newFacing='left'; }
      else if (this.cursors.right.isDown) { dx= 1; newFacing='right'; }
      else if (this.cursors.up.isDown)    { dy=-1; newFacing='up'; }
      else if (this.cursors.down.isDown)  { dy= 1; newFacing='down'; }

      if (dx||dy) {
        const nx=this.playerTileX+dx, ny=this.playerTileY+dy;
        this.facing = newFacing;
        this.player.play((this.onWater?'boat':this.charKey)+'-walk-'+newFacing, true);
        if (this.onWater) this.player.setFlipY(newFacing === 'up');
        if (this.isPassable(nx,ny)) {
          this.lastPlayerTile={tx:this.playerTileX,ty:this.playerTileY};
          this.playerTileX=nx; this.playerTileY=ny;
          this.state.x=nx; this.state.y=ny;
          SaveSystem.save(this.state);
          const TS=GAME_DATA.TILE_SIZE;
          this.isMoving=true;
          this.tweens.add({targets:this.player, x:nx*TS+TS/2, y:ny*TS+TS/2, duration:160,
            onComplete:()=>{ this.isMoving=false; this.checkWaterTransform(); this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true); if(this.onWater) this.player.setFlipY(this.facing==='up'); this.updateCompanion(); if(this.followingBaddie) this.updateBaddieFollow(this.lastPlayerTile); this.checkBushEncounter(); this.checkDragCatch('reine'); }});
          this.moveCooldown=160;
        } else if (nx < 0 || nx >= GAME_DATA.MAP_COLS || ny < 0 || ny >= GAME_DATA.MAP_ROWS) {
          this.tryEdgeWarp(this.playerTileX, this.playerTileY, dx, dy);
        }
      } else {
        this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing, true);
      if (this.onWater) this.player.setFlipY(this.facing === 'up');
      }
    }
  }

  tryEdgeWarp(tx, ty, dx, dy) {
    const g = this.MAP.ground[ty]?.[tx];
    // Right edge deep water (col 31, rows 19-22) → Kåkern left river
    if (dx === 1 && tx === 31 && g === 'D' && ty >= 19 && ty <= 22) {
      this.state.location = 'kåkern';
      SaveSystem.saveNow(this.state);
      this.scene.start('KakernScene', {spawnX: 0, spawnY: 12, spawnFacing: 'right'});
      return;
    }
    // Right edge deep water (col 31, rows 6-9) → Kvalvika left edge (near hidden key)
    if (dx === 1 && tx === 31 && g === 'D' && ty >= 6 && ty <= 9) {
      const destY = ty === 6 ? 25 : ty === 7 ? 26 : 27;
      this.state.location = 'kvalvika';
      SaveSystem.saveNow(this.state);
      this.scene.start('KvalvikaScene', {spawnX: 0, spawnY: destY, spawnFacing: 'right'});
    }
  }

  buildTop10UI() {
    const bg = this.add.rectangle(0, 0, 500, 480, 0x0f172a, 0.98).setStrokeStyle(2, 0x60a5fa);
    const title = this.add.text(0, -210, '🏆 TOP 10 BIGGEST CATCHES 🏆', {fontSize:'20px', color:'#60a5fa', fontFamily:'monospace', fontStyle:'bold'}).setOrigin(0.5);
    
    this.top10Entries = [];
    for (let i = 0; i < 10; i++) {
      const y = -160 + i * 35;
      const rank = this.add.text(-230, y, (i + 1) + ".", {fontSize:'14px', color:'#94a3b8', fontFamily:'monospace'});
      const info = this.add.text(-190, y, "", {fontSize:'14px', color:'#ffffff', fontFamily:'monospace'});
      const map  = this.add.text(230, y, "", {fontSize:'12px', color:'#64748b', fontFamily:'monospace'}).setOrigin(1, 0);
      this.top10Entries.push({ rank, info, map });
    }

    this.top10Hint = this.add.text(0, 210, 'Press SPACE or ESC to close', {fontSize:'13px', color:'#475569', fontFamily:'monospace'}).setOrigin(0.5);
    this.top10Layer = this.add.container(400, 320).setDepth(60).setVisible(false).setScrollFactor(0);
    this.top10Layer.add([bg, title, ...this.top10Entries.map(e => e.rank), ...this.top10Entries.map(e => e.info), ...this.top10Entries.map(e => e.map), this.top10Hint]);
  }

  openTop10UI() {
    this.top10Open = true;
    this.updateTop10List();
    this.top10Layer.setVisible(true);
  }

  updateTop10List() {
    const data = this.state.top10 || [];
    const rarityColors = { common:'#94a3b8', uncommon:'#4ade80', rare:'#60a5fa', legendary:'#f59e0b', secret:'#e879f9' };
    
    if (data.length === 0) {
      this.top10Entries.forEach(e => { e.rank.setVisible(false); e.info.setVisible(false); e.map.setVisible(false); });
      this.top10Entries[0].rank.setVisible(true);
      this.top10Entries[0].rank.setText("No catches yet!");
      this.top10Entries[0].rank.setX(0).setOrigin(0.5);
      return;
    }

    this.top10Entries.forEach((entry, i) => {
      const fish = data[i];
      if (fish) {
        const prefix = fish.magical ? '✨ ' : '';
        entry.rank.setText((i + 1) + ".");
        entry.rank.setX(-230).setOrigin(0, 0);
        entry.info.setText(prefix + fish.name + " (" + fish.weight + "kg)");
        entry.info.setColor(rarityColors[fish.rarity] || '#ffffff');
        entry.map.setText(fish.map);
        entry.rank.setVisible(true);
        entry.info.setVisible(true);
        entry.map.setVisible(true);
      } else {
        entry.rank.setVisible(false);
        entry.info.setVisible(false);
        entry.map.setVisible(false);
      }
    });
  }

  openMarket() {
    this.marketOpen = true;
    this._marketTab = this._marketTab || 0;
    this._renderMarket();
  }

  _renderMarket() {
    (this._marketObjects || []).forEach(o => o.destroy());
    this._marketObjects = [];

    const W = 480, H = 380;
    const cx = 400, cy = 320;
    const tab = this._marketTab || 0;

    const bg = this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97)
      .setDepth(60).setScrollFactor(0);
    const border = this.add.rectangle(cx, cy, W, H)
      .setStrokeStyle(2, 0x22c55e).setDepth(60).setScrollFactor(0);
    const title = this.add.text(cx, cy - H/2 + 18, '🦞 Reine Market', {
      fontSize:'15px', color:'#4ade80', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
    this._marketObjects.push(bg, border, title);

    // ── Tab headers ──
    const tabY = cy - H/2 + 40;
    const tabNames = ['💰 Sell Catches', '🔱 Harpoon'];
    tabNames.forEach((name, i) => {
      const tabX = cx - 100 + i * 200;
      const active = i === tab;
      const tabBg = this.add.rectangle(tabX, tabY, 180, 22,
        active ? 0x166534 : 0x1e293b, active ? 0.9 : 0.7)
        .setDepth(61).setScrollFactor(0);
      const tabTxt = this.add.text(tabX, tabY, name, {
        fontSize:'11px', color: active ? '#4ade80' : '#64748b', fontFamily:'monospace'
      }).setOrigin(0.5).setDepth(62).setScrollFactor(0);
      // Touch support: click tab to switch
      tabBg.setInteractive().on('pointerdown', () => {
        this._marketTab = i; this._renderMarket();
      });
      this._marketObjects.push(tabBg, tabTxt);
    });

    const divider = this.add.rectangle(cx, cy - H/2 + 52, W - 20, 1, 0x334155)
      .setDepth(61).setScrollFactor(0);
    this._marketObjects.push(divider);

    const contentY = cy - H/2 + 68;

    // ── Tab 0: Sell Catches ──
    if (tab === 0) {
      const catches = this.state.dragCatches || [];
      const lineH = 26;
      if (catches.length === 0) {
        const empty = this.add.text(cx, cy + 10, 'No drag catches yet.\nGo fishing on water with a boat!', {
          fontSize:'13px', color:'#64748b', fontFamily:'monospace', align:'center'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._marketObjects.push(empty);
      } else {
        let totalValue = 0;
        catches.forEach((c, i) => {
          const rarityColor = { common:'#94a3b8', uncommon:'#4ade80', rare:'#60a5fa', legendary:'#f59e0b', secret:'#e879f9' };
          const fish = (window.DRAG_FISH || []).find(f => f.name === c.name);
          const col = rarityColor[fish?.rarity || 'common'];
          const line = this.add.text(cx - W/2 + 20, contentY + i * lineH,
            `${c.name}  x${c.count}  ${c.totalWeight}kg  →  ${c.totalValue.toLocaleString()} NOK`,
            { fontSize:'12px', color: col, fontFamily:'monospace' }
          ).setDepth(61).setScrollFactor(0);
          this._marketObjects.push(line);
          totalValue += c.totalValue;
        });
        const divTotal = this.add.rectangle(cx, contentY + catches.length * lineH + 8, W - 20, 1, 0x334155)
          .setDepth(61).setScrollFactor(0);
        const totalText = this.add.text(cx - W/2 + 20, contentY + catches.length * lineH + 16,
          `TOTAL:  ${totalValue.toLocaleString()} NOK`,
          { fontSize:'13px', color:'#fef08a', fontFamily:'monospace' }
        ).setDepth(61).setScrollFactor(0);
        this._marketObjects.push(divTotal, totalText);
      }
      const hint = this.add.text(cx, cy + H/2 - 22,
        catches.length > 0 ? 'ENTER sell all  |  ◄► switch tab  |  ESC close'
                           : '◄► switch tab  |  ESC close',
        { fontSize:'10px', color:'#64748b', fontFamily:'monospace' }
      ).setOrigin(0.5).setDepth(61).setScrollFactor(0);
      this._marketObjects.push(hint);
    }

    // ── Tab 1: Harpoon Shop ──
    if (tab === 1) {
      const owned = !!this.state.hasHarpoon;
      this.add.nothing; // no-op placeholder

      const icon = this.add.text(cx, contentY + 30, '🔱', { fontSize:'48px' })
        .setOrigin(0.5).setDepth(61).setScrollFactor(0);
      const name = this.add.text(cx, contentY + 90, 'Harpoon', {
        fontSize:'20px', color:'#38bdf8', fontFamily:'monospace'
      }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
      const desc = this.add.text(cx, contentY + 118,
        'Auto-catch any fish over 50kg.\nSingle use — carry one at a time.',
        { fontSize:'12px', color:'#94a3b8', fontFamily:'monospace', align:'center' }
      ).setOrigin(0.5).setDepth(61).setScrollFactor(0);
      this._marketObjects.push(icon, name, desc);

      if (owned) {
        const ownedTxt = this.add.text(cx, contentY + 165, '✅ You own a harpoon', {
          fontSize:'14px', color:'#4ade80', fontFamily:'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._marketObjects.push(ownedTxt);
      } else {
        const price = this.add.text(cx, contentY + 160, '4,000 NOK', {
          fontSize:'18px', color:'#fbbf24', fontFamily:'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        const canAfford = (this.state.money || 0) >= 4000;
        // Buy button
        const btnBg = this.add.rectangle(cx, contentY + 200, 180, 32,
          canAfford ? 0x166534 : 0x374151, 0.9)
          .setStrokeStyle(1, canAfford ? 0x4ade80 : 0x475569)
          .setDepth(61).setScrollFactor(0).setInteractive();
        const btnTxt = this.add.text(cx, contentY + 200, canAfford ? 'ENTER to Buy' : 'Not enough NOK', {
          fontSize:'13px', color: canAfford ? '#ffffff' : '#64748b', fontFamily:'monospace'
        }).setOrigin(0.5).setDepth(62).setScrollFactor(0);
        if (canAfford) btnBg.on('pointerdown', () => this._buyHarpoon());
        this._marketObjects.push(price, btnBg, btnTxt);
      }

      const hint = this.add.text(cx, cy + H/2 - 22,
        '◄► switch tab  |  ESC close',
        { fontSize:'10px', color:'#64748b', fontFamily:'monospace' }
      ).setOrigin(0.5).setDepth(61).setScrollFactor(0);
      this._marketObjects.push(hint);
    }
  }

  _buyHarpoon() {
    if (this.state.hasHarpoon) { this.showMsg('You already have a harpoon!'); return; }
    if ((this.state.money || 0) < 4000) { this.showMsg('Not enough NOK! Need 4,000.'); return; }
    this.state.money -= 4000;
    this.state.hasHarpoon = true;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.showMsg('🔱 Harpoon purchased! Use it on any fish over 50kg.');
    this._renderMarket();
  }

  _sellAllDragCatches() {
    const catches = this.state.dragCatches || [];
    if (catches.length === 0) return;
    const totalValue = catches.reduce((sum, c) => sum + c.totalValue, 0);
    this.state.money += totalValue;
    this.state.dragCatches = [];
    SaveSystem.saveNow(this.state);
    this.game.events.emit('updateUI', this.state);
    this.showMsg(`💰 Sold all catches for ${totalValue.toLocaleString()} NOK!`);
    this.marketOpen = false;
    (this._marketObjects || []).forEach(o => o.destroy());
    this._marketObjects = [];
  }

  closeMarket() {
    this.marketOpen = false;
    (this._marketObjects || []).forEach(o => o.destroy());
    this._marketObjects = [];
  }

  openRestaurant() {
    this.restaurantOpen = true;
    this._restaurantChoice = 0;
    this._restaurantObjects = [];
    this._renderRestaurant();
  }

  _renderRestaurant() {
    (this._restaurantObjects || []).forEach(o => o.destroy());
    this._restaurantObjects = [];

    const cx = 400, cy = 310;
    const W = 540, H = 280;
    const baddies = this.state.baddiesCaught || [];
    const bestBaddie = baddies.reduce((best, b) => (!best || b.level > best.level ? b : best), null);

    const add = (o) => { this._restaurantObjects.push(o); return o; };

    add(this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0xf59e0b).setDepth(50).setScrollFactor(0));
    add(this.add.text(cx, cy - H/2 + 20, '🍽  Restaurant Reine', {
      fontSize: '17px', color: '#fbbf24', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    let subtitleStr, canDine;
    if (!bestBaddie) {
      subtitleStr = 'Fish Tacos for Two — 1000 NOK\n\nYou have no baddies to bring on a date yet!\nRizz one first 💅';
      canDine = false;
    } else {
      subtitleStr = `Fish Tacos for Two — 1000 NOK\n\nDate: ${bestBaddie.name}  (Level ${bestBaddie.level})\nReward: +${bestBaddie.level} AURA`;
      canDine = (this.state.money || 0) >= 1000;
    }

    add(this.add.text(cx, cy - 30, subtitleStr, {
      fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace',
      align: 'center', wordWrap: { width: W - 40 }
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    const opt1Color = !bestBaddie ? '#475569' : canDine ? '#4ade80' : '#ef4444';
    this._restOpt1 = add(this.add.text(cx, cy + 80, '▶ Take her on a date  (-1000 NOK)', {
      fontSize: '13px', color: opt1Color, fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    this._restOpt2 = add(this.add.text(cx, cy + 112, '  Leave', {
      fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.text(cx, cy + H/2 - 14, '↑↓ choose   ENTER confirm   ESC leave', {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    this._restaurantCanDine = canDine;
    this._restaurantChoice = 0;
  }

  _updateRestaurantCursor() {
    const idx = this._restaurantChoice;
    const baddies = this.state.baddiesCaught || [];
    const bestBaddie = baddies.reduce((best, b) => (!best || b.level > best.level ? b : best), null);
    const opt1Color = !bestBaddie ? '#475569' : (this.state.money || 0) >= 1000 ? '#4ade80' : '#ef4444';
    if (this._restOpt1) {
      this._restOpt1.setText((idx === 0 ? '▶ ' : '  ') + 'Take her on a date  (-1000 NOK)');
      this._restOpt1.setColor(idx === 0 ? opt1Color : '#cbd5e1');
    }
    if (this._restOpt2) {
      this._restOpt2.setText((idx === 1 ? '▶ ' : '  ') + 'Leave');
      this._restOpt2.setColor(idx === 1 ? '#4ade80' : '#cbd5e1');
    }
  }

  _confirmDateDinner() {
    if (!this._restaurantCanDine) return;
    const baddies = this.state.baddiesCaught || [];
    const bestBaddie = baddies.reduce((best, b) => (!best || b.level > best.level ? b : best), null);
    if (!bestBaddie) return;

    this.state.money = (this.state.money || 0) - 1000;
    const auraGain = bestBaddie.level;
    this.state.aura = Math.max(-100, Math.min(100, (this.state.aura || 20) + auraGain));
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);

    // Show result
    (this._restaurantObjects || []).forEach(o => o.destroy());
    this._restaurantObjects = [];
    const cx = 400, cy = 310;
    const bg = this.add.rectangle(cx, cy, 540, 200, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0xf59e0b).setDepth(50).setScrollFactor(0);
    const msg = this.add.text(cx, cy, `🌹 Amazing date with ${bestBaddie.name}!\nFish tacos were fire 🌮\n+${auraGain} AURA`, {
      fontSize: '15px', color: '#fbbf24', fontFamily: 'monospace',
      align: 'center', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);
    const sub = this.add.text(cx, cy + 70, 'Press any key to leave', {
      fontSize: '11px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);
    this._restaurantObjects = [bg, msg, sub];
    // Next keypress closes
    this._restaurantAwaitingClose = true;
  }

  closeRestaurant() {
    this.restaurantOpen = false;
    this._restaurantAwaitingClose = false;
    (this._restaurantObjects || []).forEach(o => o.destroy());
    this._restaurantObjects = [];
  }

  openBirdTourMenu() {
    this.birdTourOpen   = true;
    this._birdTourChoice = 0;
    this._birdTourObjects = [];
    const cx = 400, cy = 310, W = 500, H = 220;
    const add = (o) => { this._birdTourObjects.push(o); return o; };
    const canAfford = (this.state.money || 0) >= 200;

    add(this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0x60a5fa).setDepth(50).setScrollFactor(0));
    add(this.add.text(cx, cy - H/2 + 20, '🐦  Bird Watching Tour', {
      fontSize: '17px', color: '#7dd3fc', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.text(cx, cy - 20, 'Fly through the Lofoten skies!\nCost: 200 NOK' + (canAfford ? '' : '  (not enough NOK)'), {
      fontSize: '13px', color: canAfford ? '#cbd5e1' : '#ef4444', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    this._birdOpt1 = add(this.add.text(cx, cy + 55, '▶ Start Tour  (-200 NOK)', {
      fontSize: '13px', color: canAfford ? '#4ade80' : '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    this._birdOpt2 = add(this.add.text(cx, cy + 85, '  Leave', {
      fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.text(cx, cy + H/2 - 14, '↑↓ choose   ENTER confirm   ESC leave', {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    this._birdTourCanAfford = canAfford;
  }

  _updateBirdTourCursor() {
    const idx = this._birdTourChoice;
    const canAfford = this._birdTourCanAfford;
    if (this._birdOpt1) {
      this._birdOpt1.setText((idx === 0 ? '▶ ' : '  ') + 'Start Tour  (-200 NOK)');
      this._birdOpt1.setColor(idx === 0 ? (canAfford ? '#4ade80' : '#475569') : '#cbd5e1');
    }
    if (this._birdOpt2) {
      this._birdOpt2.setText((idx === 1 ? '▶ ' : '  ') + 'Leave');
      this._birdOpt2.setColor(idx === 1 ? '#4ade80' : '#cbd5e1');
    }
  }

  _startBirdTour() {
    if (!this._birdTourCanAfford) return;
    this.state.money = (this.state.money || 0) - 200;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.closeBirdTourMenu();
    this.scene.sleep('ReineScene');
    this.scene.launch('BirdWatchingScene', { callerScene: 'ReineScene', charKey: this.charKey, state: this.state });
  }

  closeBirdTourMenu() {
    this.birdTourOpen = false;
    (this._birdTourObjects || []).forEach(o => o.destroy());
    this._birdTourObjects = [];
  }
};

