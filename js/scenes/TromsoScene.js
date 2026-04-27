window.TromsoScene = class extends Phaser.Scene {
  constructor() { super({ key: 'TromsoScene' }); }

  init() {
    this.state = SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.state.location = 'tromso';
    this.MAP = TROMSO_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    const savedHere = this.state.location === 'tromso';
    this.playerTileX = 17;
    this.playerTileY = 26;
    this.player = null;
    this.npcs = [];
    this.cursors = null;
    this.fKey = null;
    this.spaceKey = null;
    this.isFishing = false;
    this.isMoving = false;
    this.moveCooldown = 0;
    this.facing = 'down';
    this.onWater = false;
    this.dialogOpen = false;
    this.returnConfirmOpen = false;
    this.travelMenuOpen = false;
    this.companionSprite = null;
    this.lastPlayerTile = {tx:0, ty:0};
    this.northernLightsActive = false;
    this.fishBuyerConfirmOpen = false;
    this.snowballFightOpen = false;
    this.nlTimer = 0;
    this.nlPhase = 'off'; // 'on' or 'off'
    this.NL_ON_DURATION  = 60000;  // 1 minute
    this.NL_OFF_DURATION = 120000; // 2 minutes
    this.nlOverlay = null;
    this.nlDarkOverlay = null;
    this.recordShopOpen = false;
    this.recordShopTab = 0;       // 0=Shop, 1=Buy, 2=My Records, 3=Make Album, 4=My Albums
    this._recordShopObjects = [];
    this._albumMakingMode = false; // sub-state within Make Album tab
    this._albumTitle = '';
    this._albumSelectedTracks = []; // array of record names in order
    this._albumCursor = 0;         // cursor in the buy/my records list
    this._albumTrackCursor = 0;    // cursor within the selected tracks list (for reorder)
    this._albumTrackFocus = false;  // false=selecting from library, true=reordering tracks
  }

  create() {
    this.drawMap();
    // "Record Store" label on lower-left cabin roof at tx:2, ty:17
    const _TS = GAME_DATA.TILE_SIZE;
    this.add.text((2 + 1.5) * _TS, (17 + 1.5) * _TS, 'Record\nStore',
      { fontSize: '10px', color: '#fbbf24', fontFamily: 'monospace', align: 'center',
        stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5).setDepth(5);
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    if (!this.walkGrid[this.playerTileY]?.[this.playerTileX]) { this.playerTileX = 17; this.playerTileY = 26; }
    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);

    this.spawnCompanion();
    this.createNPCs();

    // Northern lights overlays (behind HUD, above map)
    this.nlDarkOverlay = this.add.rectangle(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE, 0x000011, 0.4)
      .setOrigin(0, 0).setDepth(15).setVisible(false);
    this.nlOverlay = this.add.rectangle(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE, 0x003300, 0.35)
      .setOrigin(0, 0).setDepth(16).setVisible(false);

    this.fishHint     = this.add.text(400, 612, 'Press F to fish', {fontSize:'14px',color:'#fbbf24',stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.interactHint = this.add.text(400, 592, 'Press SPACE to interact', {fontSize:'13px',color:'#94a3b8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText      = this.add.text(400, 572, '', {fontSize:'14px',color:'#ffffff',stroke:'#000000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locationLabel= this.add.text(400, -50, 'Tromsø — Arctic Capital', {fontSize:'18px',color:'#7dd3fc',stroke:'#000000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

    // Northern lights announcement
    this.nlMsg = this.add.text(400, 100, '', {fontSize:'20px',color:'#4ade80',stroke:'#000000',strokeThickness:4,backgroundColor:'#00000099',padding:{x:12,y:6}}).setOrigin(0.5).setDepth(25).setScrollFactor(0).setVisible(false);

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
    this.game.events.emit('updateUI', this.state);

    this.game.events.off('fishingComplete');
    this.game.events.on('fishingComplete', this.onFishCaught, this);

    this.buildDialogUI();
    this.buildRecordShopUI();

    // Northern lights — use Phaser timer events instead of per-frame delta accumulation
    this._scheduleNorthernLightsOff();
  }

  drawMap() {
    const TS = GAME_DATA.TILE_SIZE;
    const map = this.MAP;
    this.add.rectangle(0, 0, GAME_DATA.MAP_COLS*TS+2, GAME_DATA.MAP_ROWS*TS+2, 0x0a1520).setOrigin(0,0).setDepth(-1);
    for (let r=0; r<GAME_DATA.MAP_ROWS; r++) {
      for (let c=0; c<GAME_DATA.MAP_COLS; c++) {
        const key = GAME_DATA.GROUND_KEYS[map.ground[r][c]] || 'tile-snow';
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
    // Snowball arena — in the 6×7 snow patch (rows 8-14, cols 26-31)
    // 32×48 image at scale 2 = 64×96 = 2×3 tiles, placed at tx:27, ty:13
    this.add.image(27*TS, 13*TS, 'snowball-arena')
      .setOrigin(0, 0).setScale(2).setDepth(2);
  }

  createNPCs() {
    const defs = [
      // All on confirmed S tiles in the harbor area (rows 26-28, cols 16-24)
      // Harbor cluster
      {tx:16, ty:26, key:'ow9', type:'return',     name:'Return Ferry',      dialogue:'Your roundtrip ticket includes the return! Speak to me to sail back to Leknes.'},
      {tx:18, ty:27, key:'ow7', type:'food',       name:'Reindeer Cook',     dialogue:'Reindeer meat — 200 NOK. Warms you right up in this Arctic cold! (+500 XP)'},
      {tx:21, ty:26, key:'ow3', type:'fish-buyer', name:'Fish Buyer',        dialogue:'I buy all fish! Great prices for arctic catches — magical fish at double rate!'},
      {tx:22, ty:25, key:'ow2', type:'dialog',           name:'Tromsø Local',       dialogue:'Welcome to Tromsø! The ice fjord is just south — incredible fishing!'},
      {tx:28, ty:12, key:'ow5', type:'snowball-fight',   name:'Snowball Fighter',   dialogue:''},
      {tx:27, ty:23, key:'ow4', type:'dialog',     name:'Norwegian Captain', dialogue:"The Northern Lights are magical. Catch fish under them and they're worth double!"},
      // Upper snow areas
      {tx:5,  ty:2,  key:'ow6', type:'dialog',     name:'Dog Musher',        dialogue:'My huskies love this Arctic air. Follow the fjord ice south for the biggest catches!'},
      {tx:12, ty:4,  key:'ow8', type:'dialog',     name:'Sami Guide',        dialogue:'My people have fished these waters for centuries. The Magical Greenland Shark is a trophy!'},
      {tx:10, ty:8,  key:'ow1', type:'dialog',     name:'Polar Explorer',    dialogue:"I've crossed the Arctic 12 times. The deep fjord holds secrets unimagined. Actually... I've been searching for a key to that old cabin over there for years. You haven't seen it anywhere, have you?"},
      // Ikke Musikk
      {tx:24, ty:3,  key:'ow10', type:'musikk',     name:'Ikke Musikk Fan',       dialogue:''},
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
      onComplete:()=>{ if(this.companionSprite) this.companionSprite.play(k+'-idle-'+dir, true); }});
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
    if (!this.walkGrid[row][col]) return this.state.hasBoat && !!this.waterGrid[row][col];
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
    this.scene.launch('FishingScene', {location:'tromso', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'TromsoScene', northernLightsActive:!!this.northernLightsActive});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (!result.caught) {
      if (result.fish) { window.addFishAuraMiss(this.state, result.fish, !!this.northernLightsActive); this.game.events.emit('updateUI', this.state); }
      return;
    }
    let xp = result.xp;
    // Northern lights: fish becomes magical (2× sell value, prefixed name)
    let fishName = result.fish.name;
    let fishValue = result.value;
    let magical = false;
    if (this.northernLightsActive) {
      fishName = '✨ ' + fishName;
      fishValue = fishValue * 2;
      magical = true;
    }
    result.fish.magical = magical;
    xp = Math.round(xp * getXPBonus(this.state.companion, 'tromso'));
    const leveled = addXP(this.state, xp);
    this.state.totalFishCaught = (this.state.totalFishCaught || 0) + 1;
    if (this.state.totalFishCaught === 100 && window.checkAndAwardBadge(this.state, 'fish-100', '100 Fish')) this.showMsg('🏆 BADGE UNLOCKED: 100 Fish Caught!');
    if (this.state.totalFishCaught === 1000 && window.checkAndAwardBadge(this.state, 'fish-1000', '1000 Fish')) this.showMsg('🏆 BADGE UNLOCKED: 1000 Fish Caught!');
    window.updateTop10(this.state, result.fish, 'Tromsø');
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    const newTrophy = addTrophy(this.state, result.fish.name);
    if (newTrophy) {
      this.game.events.emit('trophy', result.fish.name);
      const count = (this.state.trophies || []).length;
      this.showMsg('🏆 NEW TROPHY: ' + result.fish.name + '! (' + count + '/' + GAME_DATA.TROPHY_FISH.length + ')');
      if (newTrophy.badgeUnlocked) this.showMsg('🏆 BADGE UNLOCKED: All Trophy Fish! 🏆');
    }
    const _invResult = window.addFishToInventory(this.state, result.fish, {value: fishValue, magical});
    if (_invResult.added) {
      const _cabinBonus = window.cabinFishBonus(this.state);
      if (_cabinBonus > 0) { this.state.cabinEarnings = (this.state.cabinEarnings||0) + _cabinBonus; }
      const bonus = (magical ? ' ✨Magical!' : '') + (_cabinBonus>0 ? ' +'+_cabinBonus.toLocaleString()+' kr (cabin)' : '') + (_invResult.replaced ? ' (dropped '+_invResult.replaced.name+')' : '');
      if (!newTrophy) this.showMsg('Caught '+(magical?'✨ ':'')+result.fish.name+' '+result.fish.weight+'kg! +'+xp+'XP'+bonus);
    } else {
      if (!newTrophy) this.showMsg('Too small — released. +'+xp+'XP');
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
    } else if (npc.type === 'snowball-fight') {
      this.openSnowballFightMenu();
    } else if (npc.type === 'return') {
      this.openReturnDialog();
    } else if (npc.type === 'food') {
      this.openFoodDialog(npc);
    } else if (npc.type === 'fish-buyer') {
      this.openFishBuyerDialog();
    } else {
      const _g = GAME_DATA.OW_GENDER?.[npc.key];
      const _lines = npc.dialogues;
      const _txt = _lines ? _lines[Math.floor(Math.random()*_lines.length)] : npc.dialogue;
      this.openDialog((_g==='male'?'👨 ':_g==='female'?'👩 ':'')+npc.name, _txt);
    }
  }

  openReturnDialog() {
    if (this.state.hasTromsoTicket) {
      this.returnConfirmOpen = true;
      this.openDialog('Return Ferry', 'Your roundtrip ticket covers the return! Sail back to Leknes? Press ENTER to confirm, SPACE to cancel.');
    } else {
      this.openDialog('Return Ferry', 'Your roundtrip ticket has already been used. You need a new ticket from Leknes to return here.');
    }
  }

  openFoodDialog(npc) {
    if (this.state.money >= 200) {
      this.foodNpcPending = npc;
      this.foodConfirmOpen = true;
      this.openDialog(npc.name, 'Reindeer meat — 200 NOK. Press ENTER to buy (+500 XP), SPACE to cancel.');
    } else {
      this.openDialog(npc.name, `Reindeer meat — 200 NOK. You only have ${this.state.money.toLocaleString()} NOK.`);
    }
  }


  _calcFishSale(inv) {
    const gross = inv.reduce((s,f) => s + (f.value || (f.magical ? 2 : 1) * f.weight * GAME_DATA.FISH_PRICE_PER_KG), 0);
    const taxable = gross > 50000;
    const tax = taxable ? Math.round(gross * 0.25) : 0;
    return { gross, tax, payout: gross - tax };
  }

  openFishBuyerDialog() {
    const inv = this.state.inventory;
    if (!inv.length) {
      this.openDialog('Fish Buyer', 'No fish to sell! Walk to the fjord edge and press F to fish.');
      return;
    }
    const { gross, tax, payout } = this._calcFishSale(inv);
    const taxNote = tax > 0 ? ` ⚠ NAV tax 25%: -${tax.toLocaleString()} NOK → You receive ${payout.toLocaleString()} NOK.` : '';
    this.fishBuyerConfirmOpen = true;
    this.openDialog('Fish Buyer', `I'll buy your ${inv.length} fish for ${gross.toLocaleString()} NOK!${taxNote} Press ENTER to sell all, ESC to cancel.`);
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
    this.returnConfirmOpen = false;
    this.foodConfirmOpen = false;
    this.fishBuyerConfirmOpen = false;
    this.foodNpcPending = null;
    if (this.diagLayer) this.diagLayer.setVisible(false);
    this.recordShopOpen = false;
    this._albumMakingMode = false;
    this._recordShopObjects.forEach(o => o.destroy());
    this._recordShopObjects = [];
    if (this.recordShopLayer) this.recordShopLayer.setVisible(false);
    // Snowball fight menu
    this.snowballFightOpen = false;
    if (this._snowballFightObjects) { this._snowballFightObjects.forEach(o => o.destroy()); this._snowballFightObjects = []; }
  }

  getCabinDoor() {
    for (const obj of this.MAP.objects) {
      if (obj.type==='cabin1'||obj.type==='cabin2'||obj.type==='shop') {
        if (this.playerTileX===obj.tx+1 && this.playerTileY===obj.ty+5) return obj;
      }
    }
    return null;
  }

  showCabinIdiom(door) {
    if (door && door.tx === 2 && door.ty === 17) {
      this.openRecordShop();
      return;
    }
    // Secret cabin (cabin2 at tx:17, ty:3) — unlocked by Kvalvika Key → 2 unreleased songs
    if (door && door.tx === 17 && door.ty === 3) {
      if (this.state.hasKvalvikaKey && !this.state.hasTromsoSongs) {
        this.state.hasTromsoSongs = true;
        if (!this.state.ownedRecords) this.state.ownedRecords = [];
        const newSongs = ['Gudinne', 'Santorini Sunset'];
        newSongs.forEach(s => { if (!this.state.ownedRecords.includes(s)) this.state.ownedRecords.push(s); });
        // Check badge: all 15 buyable + 2 unreleased = 17 total
        if (this.state.ownedRecords.length >= (window.RECORDS_FOR_SALE || []).length + 2) {
          if (window.checkAndAwardBadge(this.state, 'all-records', 'All Records')) {
            this.showMsg('🏆 BADGE UNLOCKED: All Records! 🎵');
          }
        }
        SaveSystem.save(this.state);
        this.game.events.emit('updateUI', this.state);
        this.openDialog('🎵 Secret Cabin', 'The hidden key unlocks this cabin! Inside you find 2 unreleased Ikke Musikk tracks: "Gudinne" and "Santorini Sunset" — added to your Records!');
        return;
      }
      if (this.state.hasTromsoSongs) {
        this.openDialog('🎵 Secret Cabin', '"Gudinne" and "Santorini Sunset" are already in your records. Enjoy the music!');
        return;
      }
    }
    const idioms = GAME_DATA.CABIN_IDIOMS;
    if (!this.state.usedIdioms) this.state.usedIdioms = [];
    if (this.state.usedIdioms.length >= idioms.length) this.state.usedIdioms = [];
    const unused = idioms.map((_,i)=>i).filter(i=>!this.state.usedIdioms.includes(i));
    const idx = unused[Math.floor(Math.random()*unused.length)];
    this.state.usedIdioms.push(idx);
    this.openDialog('\u{1F3E0} Norwegian Wisdom', idioms[idx]);
  }

  _scheduleNorthernLightsOff() {
    this.northernLightsActive = false;
    this.nlDarkOverlay.setVisible(false);
    this.nlOverlay.setVisible(false);
    this.time.delayedCall(this.NL_OFF_DURATION, () => this._activateNorthernLights());
  }

  _activateNorthernLights() {
    this.northernLightsActive = true;
    this.nlDarkOverlay.setVisible(true);
    this.nlOverlay.setVisible(true);
    this.nlMsg.setVisible(true);
    this.nlMsg.setText('✨ Northern Lights! Magical fish appear! 2× value!');
    this.time.delayedCall(4000, () => { if (this.nlMsg) { this.nlMsg.setText(''); this.nlMsg.setVisible(false); } });
    this.time.delayedCall(this.NL_ON_DURATION, () => this._scheduleNorthernLightsOff());
  }

  update(time, delta) {
    this.moveCooldown -= delta;

    // Bush encounter — blocks all other input/movement
    if (this.encounterOpen) {
      this._handleEncounterInput();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.recordShopOpen || this.dialogOpen || this.snowballFightOpen) { this.closeAll(); return; }
    }

    if (this.snowballFightOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this._snowballFightChoice = 1 - this._snowballFightChoice;
        this._updateSnowballFightCursor();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        if (this._snowballFightChoice === 0) { this._startSnowballFight(); }
        else { this.closeAll(); }
        return;
      }
      return;
    }

    if (this.recordShopOpen) {
      this._handleRecordShopInput();
      return;
    }

    if (this.dialogOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        if (this.fishBuyerConfirmOpen) {
          // SPACE cancels fish sale
          this.fishBuyerConfirmOpen = false;
          this.closeAll();
          return;
        }
        if (this.returnConfirmOpen) {
          this.returnConfirmOpen = false;
          this.state.hasTromsoTicket = false;
          this.state.location = 'leknes';
          this.state.x = 12; this.state.y = 18;
          SaveSystem.saveNow(this.state);
          this.closeAll();
          window.showTravelAnim(this, 'plane', () => { this.scene.start('LeknesScene', {spawnX: 12, spawnY: 18}); });
          return;
        }
        if (this.foodConfirmOpen) {
          this.foodConfirmOpen = false;
          this.state.money -= 200;
          const leveled = addXP(this.state, 500);
          if (leveled) this.game.events.emit('levelUp', this.state.level);
          SaveSystem.save(this.state);
          this.game.events.emit('updateUI', this.state);
          this.closeAll();
          this.showMsg('Delicious reindeer meat! +500 XP');
          return;
        }
        this.closeAll(); return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        if (this.fishBuyerConfirmOpen) {
          this.fishBuyerConfirmOpen = false;
          const inv = this.state.inventory;
          const { payout, tax } = this._calcFishSale(inv);
          this.state.money += payout;
          this.state.inventory = [];
          SaveSystem.save(this.state);
          this.game.events.emit('updateUI', this.state);
          this.closeAll();
          const taxNote = tax > 0 ? ` (⚠ NAV tax: -${tax.toLocaleString()} NOK)` : '';
          this.showMsg('Sold all fish for ' + payout.toLocaleString() + ' NOK!' + taxNote);
          return;
        }
        if (this.returnConfirmOpen) {
          this.returnConfirmOpen = false;
          this.state.hasTromsoTicket = false;
          this.state.location = 'leknes';
          this.state.x = 12; this.state.y = 18; // next to Leknes ferry
          SaveSystem.saveNow(this.state);
          this.closeAll();
          window.showTravelAnim(this, 'plane', () => { this.scene.start('LeknesScene', {spawnX: 12, spawnY: 18}); });
          return;
        }
        if (this.foodConfirmOpen) {
          this.foodConfirmOpen = false;
          this.state.money -= 200;
          const leveled = addXP(this.state, 500);
          if (leveled) this.game.events.emit('levelUp', this.state.level);
          SaveSystem.save(this.state);
          this.game.events.emit('updateUI', this.state);
          this.closeAll();
          this.showMsg('Delicious reindeer meat! +500 XP');
          return;
        }
        this.closeAll();
      }
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
    if (nearNPC  && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.interact(nearNPC); return; }
    if (nearDoor && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.showCabinIdiom(nearDoor); return; }

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
          this.lastPlayerTile = {tx:this.playerTileX, ty:this.playerTileY};
          this.playerTileX=nx; this.playerTileY=ny;
          this.state.x=nx; this.state.y=ny;
          SaveSystem.save(this.state);
          const TS=GAME_DATA.TILE_SIZE;
          this.isMoving=true;
          this.tweens.add({targets:this.player, x:nx*TS+TS/2, y:ny*TS+TS/2, duration:160,
            onComplete:()=>{ this.isMoving=false; this.checkWaterTransform(); if(!this.slideIfIce()){this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true); if(this.onWater) this.player.setFlipY(this.facing==='up');} this.updateCompanion(); if(this.followingBaddie) this.updateBaddieFollow(this.lastPlayerTile); this.checkBushEncounter(); this.checkDragCatch('tromso'); }});
          this.moveCooldown=160;
        }
      } else {
        this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing, true);
      if (this.onWater) this.player.setFlipY(this.facing === 'up');
      }
    }
  }

  slideIfIce() {
    // Check if current tile is ice
    const getTile = (r, c) => {
      const row = this.MAP.ground[r];
      if (!row) return null;
      return typeof row === 'string' ? row[c] : row[c];
    };
    if (getTile(this.playerTileY, this.playerTileX) !== 'I') return false;
    const dirMap = { left:[-1,0], right:[1,0], up:[0,-1], down:[0,1] };
    const [dx, dy] = dirMap[this.facing] || [0,0];
    if (!dx && !dy) return false;

    // Compute full slide destination — slide across ice, stop on first non-ice passable tile
    let cx = this.playerTileX, cy = this.playerTileY;
    let steps = 0;
    while (true) {
      const nx = cx + dx, ny = cy + dy;
      if (!this.isPassable(nx, ny)) break;           // wall / out of bounds — stay put
      cx = nx; cy = ny;
      steps++;
      if (getTile(cy, cx) !== 'I') break;            // landed on non-ice — stop here
      if (steps > 32) break; // safety cap
    }
    if (steps === 0) return false;

    this.lastPlayerTile = {tx:this.playerTileX, ty:this.playerTileY};
    this.playerTileX = cx; this.playerTileY = cy;
    this.state.x = cx; this.state.y = cy;
    SaveSystem.save(this.state);
    const TS = GAME_DATA.TILE_SIZE;
    this.isMoving = true;
    this.moveCooldown = steps * 80;
    this.player.play((this.onWater?'boat':this.charKey)+'-walk-'+this.facing, true);
    this.tweens.add({targets:this.player, x:cx*TS+TS/2, y:cy*TS+TS/2, duration:steps*80, ease:'Linear',
      onComplete:()=>{
        this.isMoving = false;
        this.checkWaterTransform();
        this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing, true);
        if (this.onWater) this.player.setFlipY(this.facing==='up');
        this.updateCompanion();
        this.checkBushEncounter();
        this.checkDragCatch('tromso');
      }
    });
    return true;
  }

  buildRecordShopUI() {
    this.recordShopLayer = this.add.container(0, 0).setDepth(60).setScrollFactor(0).setVisible(false);
  }

  openRecordShop() {
    this.recordShopOpen = true;
    this.recordShopTab = 0;
    this._albumCursor = 0;
    this._albumMakingMode = false;
    this._albumTitle = '';
    this._albumSelectedTracks = [];
    this._albumTrackCursor = 0;
    this._albumTrackFocus = false;
    this._renderRecordShop();
  }

  _renderRecordShop() {
    this._recordShopObjects.forEach(o => o.destroy());
    this._recordShopObjects = [];
    this.recordShopLayer.setVisible(true);

    const cx = 400, cy = 320, W = 640, H = 460;
    const tabs = ['🛒 Shop', '🎵 Buy Records', '💿 My Records', '🎤 Make Album', '📀 My Albums'];

    const bg = this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.98)
      .setStrokeStyle(2, 0xa78bfa).setDepth(60).setScrollFactor(0);
    this._recordShopObjects.push(bg);

    const title = this.add.text(cx, cy - H/2 + 18, '🎵 Record Store', {
      fontSize: '16px', color: '#a78bfa', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
    this._recordShopObjects.push(title);

    tabs.forEach((tab, i) => {
      const tx = cx - W/2 + 20 + i * 155;
      const isActive = i === this.recordShopTab;
      const t = this.add.text(tx, cy - H/2 + 42, tab, {
        fontSize: '11px', color: isActive ? '#a78bfa' : '#64748b', fontFamily: 'monospace',
        stroke: isActive ? '#000' : undefined, strokeThickness: isActive ? 2 : 0
      }).setDepth(61).setScrollFactor(0);
      this._recordShopObjects.push(t);
      if (isActive) {
        const ul = this.add.rectangle(tx + t.width/2, cy - H/2 + 56, t.width, 2, 0xa78bfa)
          .setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(ul);
      }
    });

    const div = this.add.rectangle(cx, cy - H/2 + 62, W - 20, 1, 0x334155).setDepth(61).setScrollFactor(0);
    this._recordShopObjects.push(div);

    const contentY = cy - H/2 + 74;
    const lineH = 24;

    if (this.recordShopTab === 0) {
      // Radio is always included — show status only
      const t = this.add.text(cx, contentY + 40, '📻 Radio — Included with your player kit!', {
        fontSize: '13px', color: '#4ade80', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
      const hint = this.add.text(cx, contentY + 70, 'Tune stations with R key while exploring', {
        fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
      this._recordShopObjects.push(t, hint);

    } else if (this.recordShopTab === 1) {
      const forSale = (window.RECORDS_FOR_SALE || []).filter(r => !(this.state.ownedRecords || []).includes(r));
      if (forSale.length === 0) {
        const t = this.add.text(cx, contentY + 60, 'You own all available records!', {
          fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(t);
      } else {
        const maxVisible = 12;
        // Scroll window only moves when cursor reaches the last visible row
        const scrollStart = Math.max(0, Math.min(this._albumCursor - (maxVisible - 1), forSale.length - maxVisible));
        const visible = forSale.slice(scrollStart, scrollStart + maxVisible);
        visible.forEach((rec, i) => {
          const actualIdx = scrollStart + i;
          const isSelected = actualIdx === this._albumCursor;
          const color = isSelected ? '#fef08a' : '#e2e8f0';
          const prefix = isSelected ? '▶ ' : '  ';
          const t = this.add.text(cx - W/2 + 20, contentY + i * lineH, prefix + rec, {
            fontSize: '12px', color, fontFamily: 'monospace'
          }).setDepth(61).setScrollFactor(0);
          this._recordShopObjects.push(t);
        });
        const scrollHint = forSale.length > maxVisible ? `  ↑↓ scroll` : '';
        const info = this.add.text(cx, cy + H/2 - 40,
          `${this._albumCursor + 1} / ${forSale.length}  |  5,000 NOK + 25 AURA each`,
          { fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace' }
        ).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        const hint = this.add.text(cx, cy + H/2 - 22, '↑↓ browse  ENTER buy  ◄► tabs  ESC close', {
          fontSize: '10px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(info, hint);
      }

    } else if (this.recordShopTab === 2) {
      const owned = this.state.ownedRecords || [];
      if (owned.length === 0) {
        const t = this.add.text(cx, contentY + 60, 'No records yet!', {
          fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(t);
      } else {
        const maxVisible = 14;
        const scrollStart = Math.max(0, Math.min(this._albumCursor - (maxVisible - 1), owned.length - maxVisible));
        const visible = owned.slice(scrollStart, scrollStart + maxVisible);
        visible.forEach((rec, i) => {
          const actualIdx = scrollStart + i;
          const isSelected = actualIdx === this._albumCursor;
          const color = isSelected ? '#fef08a' : '#e2e8f0';
          const prefix = isSelected ? '▶ ' : '  ';
          const t = this.add.text(cx - W/2 + 20, contentY + i * lineH, prefix + rec, {
            fontSize: '12px', color, fontFamily: 'monospace'
          }).setDepth(61).setScrollFactor(0);
          this._recordShopObjects.push(t);
        });
        const scrollNote = owned.length > maxVisible ? `  ↑↓ scroll` : '';
        const hint = this.add.text(cx, cy + H/2 - 22, `${owned.length} records${scrollNote}  |  ◄► tabs  ESC close`, {
          fontSize: '10px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(hint);
      }

    } else if (this.recordShopTab === 3) {
      this._renderMakeAlbumTab(cx, cy, W, H, contentY, lineH);

    } else if (this.recordShopTab === 4) {
      const albums = this.state.myAlbums || [];
      if (albums.length === 0) {
        const t = this.add.text(cx, contentY + 60, 'No albums yet. Make one!', {
          fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(t);
      } else {
        const maxAlbumDisplay = 5;
        const albumsToShow = albums.slice(0, maxAlbumDisplay);
        albumsToShow.forEach((album, i) => {
          const ay = contentY + i * 80;
          const titleT = this.add.text(cx - W/2 + 20, ay, `💿 ${album.title}`, {
            fontSize: '13px', color: '#a78bfa', fontFamily: 'monospace'
          }).setDepth(61).setScrollFactor(0);
          this._recordShopObjects.push(titleT);
          album.tracks.slice(0, 7).forEach((track, j) => {
            const tt = this.add.text(cx - W/2 + 36, ay + 14 + j * 10, `${j+1}. ${track}`, {
              fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace'
            }).setDepth(61).setScrollFactor(0);
            this._recordShopObjects.push(tt);
          });
        });
        const hint = this.add.text(cx, cy + H/2 - 22, `${albums.length} album(s)  |  ◄► tabs  ESC close`, {
          fontSize: '10px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
        this._recordShopObjects.push(hint);
      }
    }
  }

  _renderMakeAlbumTab(cx, cy, W, H, contentY, lineH) {
    const owned = this.state.ownedRecords || [];
    const tracks = this._albumSelectedTracks;

    const leftLabel = this.add.text(cx - W/2 + 20, contentY, `Your Records (${owned.length})  — SPACE to add/remove:`, {
      fontSize: '11px', color: '#64748b', fontFamily: 'monospace'
    }).setDepth(61).setScrollFactor(0);
    this._recordShopObjects.push(leftLabel);

    const maxVisibleOwned = 11;
    const ownedScrollStart = Math.max(0, Math.min(this._albumCursor - (maxVisibleOwned - 1), owned.length - maxVisibleOwned));
    const visibleOwned = owned.slice(ownedScrollStart, ownedScrollStart + maxVisibleOwned);
    visibleOwned.forEach((rec, i) => {
      const actualIdx = ownedScrollStart + i;
      const isSelected = actualIdx === this._albumCursor;
      const alreadyPicked = tracks.includes(rec);
      const color = alreadyPicked ? '#22c55e' : isSelected ? '#fef08a' : '#e2e8f0';
      const prefix = isSelected ? '▶ ' : '  ';
      const t = this.add.text(cx - W/2 + 20, contentY + 16 + i * 17, prefix + rec + (alreadyPicked ? ' ✓' : ''), {
        fontSize: '11px', color, fontFamily: 'monospace'
      }).setDepth(61).setScrollFactor(0);
      this._recordShopObjects.push(t);
    });

    const rightLabel = this.add.text(cx + 20, contentY, `Tracklist (${tracks.length}/7):`, {
      fontSize: '11px', color: tracks.length === 7 ? '#4ade80' : '#64748b', fontFamily: 'monospace'
    }).setDepth(61).setScrollFactor(0);
    this._recordShopObjects.push(rightLabel);

    tracks.forEach((track, i) => {
      const t = this.add.text(cx + 20, contentY + 16 + i * 17, `${i+1}. ${track}`, {
        fontSize: '11px', color: '#e2e8f0', fontFamily: 'monospace'
      }).setDepth(61).setScrollFactor(0);
      this._recordShopObjects.push(t);
    });

    const albumNum = (this.state.myAlbums || []).length + 1;
    const previewLabel = this.add.text(cx + 20, contentY + 140, `Will save as: "Album ${albumNum}"`, {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setDepth(61).setScrollFactor(0);
    this._recordShopObjects.push(previewLabel);

    let hint = '';
    if (tracks.length < 7) {
      hint = `SPACE add/remove  (${7 - tracks.length} more needed)  |  ◄► tabs  ESC close`;
    } else {
      hint = 'A / ENTER = submit album  |  SPACE remove last added  |  ESC close';
    }
    const hintT = this.add.text(cx, cy + H/2 - 22, hint, {
      fontSize: '10px', color: tracks.length === 7 ? '#4ade80' : '#64748b', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0);
    this._recordShopObjects.push(hintT);
  }

  _submitAlbum() {
    const tracks = this._albumSelectedTracks;
    if (tracks.length < 7) { this.showMsg(`Need ${7 - tracks.length} more tracks!`); return; }
    if (!this.state.myAlbums) this.state.myAlbums = [];
    const albumNum = this.state.myAlbums.length + 1;
    this.state.myAlbums.push({ title: 'Album ' + albumNum, tracks: [...tracks] });
    // Tune to the newly created album's station
    this.state.radioStation = this.state.myAlbums.length; // 1-indexed: album 1 → station 1
    this._albumSelectedTracks = [];
    this._albumCursor = 0;
    this._albumTrackFocus = false;
    this._albumTrackCursor = 0;
    SaveSystem.saveNow(this.state);
    this.game.events.emit('updateUI', this.state);
    this.recordShopTab = 4;
    this._renderRecordShop();
    this.showMsg('💿 Album ' + albumNum + ' saved — tuned to Station ' + this.state.radioStation + '!');
  }

  _handleRecordShopInput() {
    const just = k => Phaser.Input.Keyboard.JustDown(k);

    if (just(this.escKey)) { this.closeAll(); return; }

    if (this.recordShopTab === 3 && this._albumMakingMode === 'typing') {
      return;
    }

    if (just(this.cursors.left)) {
      this.recordShopTab = (this.recordShopTab - 1 + 5) % 5;
      this._albumCursor = 0;
      this._albumMakingMode = false;
      this._renderRecordShop();
      return;
    }
    if (just(this.cursors.right)) {
      this.recordShopTab = (this.recordShopTab + 1) % 5;
      this._albumCursor = 0;
      this._albumMakingMode = false;
      this._renderRecordShop();
      return;
    }

    if (this.recordShopTab === 0) {
      // Radio is always included — no purchase needed
      return;
    }

    if (this.recordShopTab === 1) {
      const forSale = (window.RECORDS_FOR_SALE || []).filter(r => !(this.state.ownedRecords || []).includes(r));
      if (just(this.cursors.up))   { this._albumCursor = Math.max(0, this._albumCursor - 1); this._renderRecordShop(); return; }
      if (just(this.cursors.down)) { this._albumCursor = Math.min(forSale.length - 1, this._albumCursor + 1); this._renderRecordShop(); return; }
      if (just(this.enterKey) || just(this.spaceKey)) {
        const rec = forSale[this._albumCursor];
        if (!rec) return;
        if (this.state.money < window.RECORD_PRICE_NOK) {
          this.openDialog('Record Shop', `Not enough NOK! You need ${window.RECORD_PRICE_NOK.toLocaleString()} NOK.`);
          this.recordShopOpen = false;
          return;
        }
        const aura = this.state.aura || 0;
        if (aura < window.RECORD_PRICE_AURA) {
          this.openDialog('Record Shop', `Not enough AURA! You need ${window.RECORD_PRICE_AURA} aura.`);
          this.recordShopOpen = false;
          return;
        }
        this.state.money -= window.RECORD_PRICE_NOK;
        this.state.aura = Math.max(-100, aura - window.RECORD_PRICE_AURA);
        if (!this.state.ownedRecords) this.state.ownedRecords = [];
        this.state.ownedRecords.push(rec);
        if ((this.state.ownedRecords || []).length >= (window.RECORDS_FOR_SALE || []).length + 2) {
          if (window.checkAndAwardBadge(this.state, 'all-records', 'All Records')) {
            this.showMsg('🏆 BADGE UNLOCKED: All Records! 🎵');
          }
        }
        const leveled = addXP(this.state, 1000);
        if (leveled) this.game.events.emit('levelUp', this.state.level);
        SaveSystem.saveNow(this.state);
        this.game.events.emit('updateUI', this.state);
        this._albumCursor = 0;
        this._renderRecordShop();
        this.showMsg(`🎵 Got: ${rec}!`);
        return;
      }

    } else if (this.recordShopTab === 2) {
      const owned = this.state.ownedRecords || [];
      if (just(this.cursors.up))   { this._albumCursor = Math.max(0, this._albumCursor - 1); this._renderRecordShop(); return; }
      if (just(this.cursors.down)) { this._albumCursor = Math.min(owned.length - 1, this._albumCursor + 1); this._renderRecordShop(); return; }

    } else if (this.recordShopTab === 3) {
      const owned = this.state.ownedRecords || [];
      const tracks = this._albumSelectedTracks;

      if (just(this.cursors.up))   { this._albumCursor = Math.max(0, this._albumCursor - 1); this._renderRecordShop(); return; }
      if (just(this.cursors.down)) { this._albumCursor = Math.min(owned.length - 1, this._albumCursor + 1); this._renderRecordShop(); return; }

      // SPACE / A-button: toggle track or submit when full
      if (just(this.spaceKey)) {
        if (tracks.length === 7) {
          this._submitAlbum(); return;
        }
        const rec = owned[this._albumCursor];
        if (rec) {
          const idx = tracks.indexOf(rec);
          if (idx >= 0) { tracks.splice(idx, 1); }
          else { tracks.push(rec); }
          this._renderRecordShop();
        }
        return;
      }

      if (just(this.enterKey)) {
        this._submitAlbum(); return;
      }

      const bsKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);
      if (Phaser.Input.Keyboard.JustDown(bsKey)) {
        const rec = owned[this._albumCursor];
        const idx = tracks.indexOf(rec);
        if (idx >= 0) { tracks.splice(idx, 1); this._renderRecordShop(); }
        return;
      }
    }
    // Tab 4 (My Albums) is read-only
  }


  openSnowballFightMenu() {
    this.snowballFightOpen = true;
    this._snowballFightChoice = 0;
    this._snowballFightObjects = [];
    const cx = 400, cy = 300, W = 480, H = 210;
    const canAfford = (this.state.money || 0) >= 200;
    const add = o => { this._snowballFightObjects.push(o); return o; };

    add(this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0x7dd3fc).setDepth(50).setScrollFactor(0));
    add(this.add.text(cx, cy - H/2 + 22, '❄  Snowball Fight!', {
      fontSize: '18px', color: '#7dd3fc', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.text(cx, cy - 20, '⏱ 1-minute snowball fight in the arena!\nCost: 200 NOK  •  Win: +3 Aura' + (canAfford ? '' : '\n(not enough NOK)'), {
      fontSize: '12px', color: canAfford ? '#cbd5e1' : '#ef4444', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    this._sbOpt1 = add(this.add.text(cx, cy + 55, '▶ Fight!  (-200 NOK)', {
      fontSize: '13px', color: canAfford ? '#4ade80' : '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    this._sbOpt2 = add(this.add.text(cx, cy + 82, '  Leave', {
      fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.text(cx, cy + H/2 - 14, '↑↓ choose   ENTER confirm   ESC leave', {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    this._snowballFightCanAfford = canAfford;
  }

  _updateSnowballFightCursor() {
    const idx = this._snowballFightChoice;
    const can = this._snowballFightCanAfford;
    if (this._sbOpt1) {
      this._sbOpt1.setText((idx === 0 ? '▶ ' : '  ') + 'Fight!  (-200 NOK)');
      this._sbOpt1.setColor(idx === 0 ? (can ? '#4ade80' : '#475569') : '#cbd5e1');
    }
    if (this._sbOpt2) {
      this._sbOpt2.setText((idx === 1 ? '▶ ' : '  ') + 'Leave');
      this._sbOpt2.setColor(idx === 1 ? '#4ade80' : '#cbd5e1');
    }
  }

  _startSnowballFight() {
    if (!this._snowballFightCanAfford) return;
    this.state.money = (this.state.money || 0) - 200;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.closeAll();
    this.scene.sleep('TromsoScene');
    this.scene.launch('SnowballFightScene', { callerScene: 'TromsoScene', charKey: this.charKey, state: this.state });
  }
};
