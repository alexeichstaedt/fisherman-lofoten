window.KvalvikaScene = class extends Phaser.Scene {
  constructor() { super({ key: 'KvalvikaScene' }); }

  init(data) {
    this.state = SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.state.location = 'kvalvika';
    this.MAP = KVALVIKA_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    const savedHere = !data && this.state.location === 'kvalvika';
    this.playerTileX = (data && data.spawnX !== undefined) ? data.spawnX : 18;
    this.playerTileY = (data && data.spawnY !== undefined) ? data.spawnY : 17;
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
    this.companionSprite = null;
    this.lastPlayerTile = {tx:0, ty:0};
    this._nearKey = false;
    this.keySprite = null;
  }

  create() {
    this.drawMap();
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    if (!this.walkGrid[this.playerTileY]?.[this.playerTileX]) { this.playerTileX = 10; this.playerTileY = 14; }
    const fz = this.MAP.objects.find(o=>o.type==='ferry-zone');    this.ferryTile = fz ? {tx:fz.tx+1, ty:fz.ty+2} : null;
    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.spawnCompanion();
    this.createNPCs();

    // Hidden key on Kvalvika beach — tx:8, ty:25 (grass tile)
    const _TS = GAME_DATA.TILE_SIZE;
    if (!this.state.hasKvalvikaKey) {
      this.keySprite = this.add.image(8 * _TS + _TS/2, 25 * _TS + _TS/2, 'kvalvika-key')
        .setScale(1.2).setDepth(3).setOrigin(0.5);
      this.tweens.add({ targets: this.keySprite, y: this.keySprite.y - 4, duration: 700, yoyo: true, repeat: -1 });
    }

    this.fishHint    = this.add.text(400, 612, 'Press F to fish', {fontSize:'14px',color:'#fbbf24',stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.interactHint= this.add.text(400, 592, 'Press SPACE to interact', {fontSize:'13px',color:'#94a3b8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText     = this.add.text(400, 572, '', {fontSize:'14px',color:'#ffffff',stroke:'#000000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locationLabel= this.add.text(400, -50, 'Kvalvika', {fontSize:'18px',color:'#ffffff',stroke:'#000000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

    this.cursors  = this.input.keyboard.createCursorKeys();
    this.fKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.isFishing = false;

    // Travel menu
    const travelBg   = this.add.rectangle(0,0,400,340,0x0f172a,0.97).setStrokeStyle(2,0x4ade80);
    this.travelTitle = this.add.text(0,-140,'Travel To...',{fontSize:'22px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelDests = ['Leknes','Reine','Kåkern','Henningsvær'];
    this.travelTexts = this.travelDests.map((d,i)=>this.add.text(0,-80+i*50,d,{fontSize:'18px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5));
    this.travelCursor= this.add.text(0,0,'>',{fontSize:'16px',color:'#4ade80'});
    this.travelHint  = this.add.text(0,140,'ENTER to travel  ESC cancel',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelLayer = this.add.container(400,320).setDepth(51).setVisible(false).setScrollFactor(0);
    this.travelLayer.add([travelBg,this.travelTitle,...this.travelTexts,this.travelCursor,this.travelHint]);
    this.travelIndex = 0;
    this.travelMenuOpen = false;

    Object.assign(this, window.BushEncounterMixin);
    Object.assign(this, window.BaddieFollowMixin);
    Object.assign(this, window.DragCatchMixin);
    this.initEncounter();
    this.initBaddieFollow();
    window.checkBaddieTimers(this.state);
    if (!this.scene.isActive('UIScene')) this.scene.launch('UIScene');
    this.game.events.emit('updateUI', this.state);

    this.game.events.off('fishingComplete');
    this.game.events.on('fishingComplete', this.onFishCaught, this);

    this.buildDialogUI();
  }

  drawMap() {
    const TS = GAME_DATA.TILE_SIZE;
    const map = this.MAP;
    // Solid background prevents any sub-pixel dead-pixel gaps
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
      {tx:14,ty:17, key:'ow2', type:'dialog', name:'Beach Fisher',  dialogue:'The bay here is stunning. Cod and halibut love these waters!'},
      {tx:8, ty:12, key:'ow5', type:'musikk', name:'Ikke Musikk Fan', dialogue:''},
      {tx:17, ty:17, key:'ow9', type:'ferry', name:'Ferry Captain', dialogue:''},
      {tx:12, ty:14, key:'ow6', type:'dialog', name:'Mountain Hiker', dialogue:'The beach is amazing today! Just be careful in the deep ocean. There are stories of a monster.'},      {tx:23, ty:30, key:'ow1', type:'dialog', name:'Trail Guide',    dialogue:'The hike to Kvalvika beach is right through those mountains. Be careful because it is very heavy.'},
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
    if (this.npcs && this.npcs.some(n => n.tx === col && n.ty === row)) return false;
    if (!this.walkGrid[row][col]) {
      // Not walkable on foot — allow if we have a boat and it's a water tile
      return this.state.hasBoat && this.waterGrid[row][col];
    }
    return true;
  }

  checkWaterTransform() {
    this.player.setFlipY(false);
    const nowWater = !!(this.waterGrid[this.playerTileY]?.[this.playerTileX]);
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
    const r=this.playerTileY, c=this.playerTileX;
    // On water tile with boat → always fishable
    if (this.waterGrid[r]?.[c] && this.state.hasBoat) return true;
    // Must be facing water exactly 1 tile away
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
    this.scene.launch('FishingScene', {location:'kvalvika', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'KvalvikaScene'});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (result.killerWhaleDeath) {
      // Death penalty: lose boat, money, rod — keep level, animals, trophies
      this.state.money = 0;
      this.state.rod = 'basic';
      this.state.hasBoat = false;
      this.state.inventory = [];
      this.state.location = 'leknes';
      this.state.x = 12; this.state.y = 18;
      SaveSystem.saveNow(this.state);
      this.scene.start('LeknesScene', {spawnX: 12, spawnY: 18});
      return;
    }
    if (!result.caught) {
      if (result.fish) { window.addFishAuraMiss(this.state, result.fish, false); this.game.events.emit('updateUI', this.state); }
      return;
    }
    const _xpMult = getXPBonus(this.state.companion, 'kvalvika');
    const _xpFinal = Math.round(result.xp * _xpMult);
    const leveled = addXP(this.state, _xpFinal);
    window.updateTop10(this.state, result.fish, 'Kvalvika');
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    const newTrophy = addTrophy(this.state, result.fish.name);
    if (newTrophy) this.game.events.emit('trophy', result.fish.name);
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

  getNearbyNPC() {
    // NPC must be exactly 1 tile ahead in facing direction
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
    } else {
      const _g = GAME_DATA.OW_GENDER?.[npc.key];
      this.openDialog((_g==='male'?'👨 ':_g==='female'?'👩 ':'')+npc.name, npc.dialogue);
    }
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
    const sceneMap = {'Leknes':'LeknesScene','Reine':'ReineScene','Kåkern':'KakernScene','Henningsvær':'HenningsvaarScene'};
    const locMap   = {'Leknes':'leknes','Reine':'reine','Kåkern':'kåkern','Henningsvær':'henningsvær'};
    const spawnMap = {
    'Leknes': {x:12, y:18},
    'Reine': {x:8, y:14},
    'Kåkern': {x:11, y:7},
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


  checkFerryTile() {
    if (this.ferryTile && this.playerTileX===this.ferryTile.tx && this.playerTileY===this.ferryTile.ty) {
      if (!this.dialogOpen) {
        this.state.location = 'leknes';
        this.state.x = 12; this.state.y = 18;
        SaveSystem.saveNow(this.state);
        this.scene.start('LeknesScene', {spawnX: 12, spawnY: 18});
      }
    }
  }

  _collectKey() {
    this.state.hasKvalvikaKey = true;
    if (!this.state.playerItems) this.state.playerItems = [];
    this.state.playerItems.push('Kvalvika Key');
    if (this.keySprite) { this.keySprite.destroy(); this.keySprite = null; }
    this._nearKey = false;
    this.interactHint.setVisible(false);
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.openDialog('🗝️ Kvalvika Key', 'You found a hidden cabin key. Find the cabin and discover the treasures within.');
  }

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
    if (this.diagLayer)  this.diagLayer.setVisible(false);
    if (this.travelLayer) this.travelLayer.setVisible(false);
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

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.dialogOpen || this.travelMenuOpen) { this.closeAll(); return; }
    }

    if (this.travelMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.travelIndex=(this.travelIndex-1+this.travelDests.length)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.travelIndex=(this.travelIndex+1)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.executeTravel(this.travelDests[this.travelIndex]);
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
      this._nearKey = !this.state.hasKvalvikaKey && this.playerTileX===7 && this.playerTileY===25;
      this.fishHint.setVisible(this._canFish);
      this.interactHint.setVisible(!!(this._nearNPC||this._nearDoor||this._nearKey));
    }
    const canFish=this._canFish, nearNPC=this._nearNPC, nearDoor=this._nearDoor;

    this.checkBaddieFollowInput();
    if (canFish && !this.isFishing && Phaser.Input.Keyboard.JustDown(this.fKey)) { this.startFishing(); return; }
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (nearNPC)  { this.interact(nearNPC); return; }
      if (nearDoor) { this.showCabinIdiom(); return; }
      if (this._nearKey) { this._collectKey(); return; }
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
            onComplete:()=>{ this.isMoving=false; this.checkWaterTransform(); this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true); if(this.onWater) this.player.setFlipY(this.facing==='up'); this.updateCompanion(); if(this.followingBaddie) this.updateBaddieFollow(this.lastPlayerTile); this.checkBushEncounter(); this.checkDragCatch('kvalvika'); }});
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
    // Bottom edge (row 31, cols 13-17) → Kåkern top-left (secret mountain pass)
    if (dy === 1 && ty === 31 && tx >= 13 && tx <= 17) {
      this.state.location = 'kåkern';
      this.state.x = 4; this.state.y = 1;
      SaveSystem.saveNow(this.state);
      this.scene.start('KakernScene', {spawnX: 4, spawnY: 1, spawnFacing: 'down'});
      return;
    }
    // Left edge (tx:0, ty:25-27) → back to Reine right edge deep ocean
    if (dx === -1 && tx === 0 && ty >= 25 && ty <= 27) {
      const destY = ty === 25 ? 6 : ty === 26 ? 7 : 8;
      this.state.location = 'reine';
      SaveSystem.saveNow(this.state);
      this.scene.start('ReineScene', {spawnX: 31, spawnY: destY, spawnFacing: 'left'});
    }
  }
};
