window.HenningsvaarScene = class extends Phaser.Scene {
  constructor() { super({ key: 'HenningsvaarScene' }); }

  init(data) {
    this.state = SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.state.location = 'henningsvær';
    this.MAP = HENNINGSVAER_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    this.playerTileX = (data && data.spawnX !== undefined) ? data.spawnX : 15;
    this.playerTileY = (data && data.spawnY !== undefined) ? data.spawnY : 23;
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
    this.jacketShopOpen = false;
    this.jacketShopIndex = 0;
    this.swapShopOpen = false;
    this.swapShopCursor = 0;
    this.swapShopSelected = [];
    this.swapShopObjects = [];
    this.sushiOpen = false;
    this.sushiCursor = 0;
    this.sushiObjects = [];
    this.skilpaddeOpen = false;
    this._skilpaddeObjects = [];
    this.matematikkOpen = false;
    this._matematikkObjects = [];
    this._matematikkTab = 0;
    this.companionSprite = null;
    this.lastPlayerTile = {tx:0, ty:0};
  }

  create() {
    this.drawMap();
    // Soccer pitch: rows 16-24, cols 12-19 (8×9 tiles = 256×288 px)
    const _TS = GAME_DATA.TILE_SIZE;
    this.add.image(12*_TS + 4*_TS, 16*_TS + 4.5*_TS, 'soccer-pitch')
      .setDepth(2).setDisplaySize(8*_TS, 9*_TS);
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    if (!this.walkGrid[this.playerTileY]?.[this.playerTileX]) { this.playerTileX = 15; this.playerTileY = 20; }
    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.spawnCompanion();
    this.createNPCs();

    this.fishHint    = this.add.text(400, 612, 'Press F to fish', {fontSize:'14px',color:'#fbbf24',stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);

    // Thrift Shop label above cabin2 at tx:3, ty:0
    this.add.text((3 + 2.5) * _TS, (0 + 2.5) * _TS, 'Thrift Shop',
      { fontSize:'10px', color:'#fbbf24', fontFamily:'monospace', align:'center',
        stroke:'#000000', strokeThickness:3 }).setOrigin(0.5).setDepth(5);
    // Norsk læringssenter label on 3rd cabin (cabin1 at tx:18, ty:0)
    this.add.text((18 + 2.5) * _TS, (0 + 2.5) * _TS, 'Norsk læringssenter', {
      fontSize:'9px', color:'#fbbf24', fontFamily:'monospace', align:'center',
      stroke:'#000000', strokeThickness:3
    }).setOrigin(0.5).setDepth(5);
    // Matematikk Bibliotek label on 4th cabin (cabin1 at tx:25, ty:0)
    this.add.text((25 + 2.5) * _TS, (0 + 2.5) * _TS, 'Matematikk Bibliotek', {
      fontSize:'9px', color:'#fbbf24', fontFamily:'monospace', align:'center',
      stroke:'#000000', strokeThickness:3
    }).setOrigin(0.5).setDepth(5);
    this.interactHint= this.add.text(400, 592, 'Press SPACE to interact', {fontSize:'13px',color:'#94a3b8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText     = this.add.text(400, 572, '', {fontSize:'14px',color:'#ffffff',stroke:'#000000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locationLabel= this.add.text(400, -50, 'Henningsvær', {fontSize:'18px',color:'#ffffff',stroke:'#000000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

    this.cursors  = this.input.keyboard.createCursorKeys();
    this.fKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.isFishing = false;

    // Travel menu
    const travelBg   = this.add.rectangle(0,0,400,340,0x0f172a,0.97).setStrokeStyle(2,0x4ade80);
    this.travelTitle = this.add.text(0,-140,'Travel To...',{fontSize:'22px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelDests = ['Leknes','Reine','Kvalvika','Kåkern'];
    this.travelTexts = this.travelDests.map((d,i)=>{
      const t = this.add.text(0,-80+i*50,d,{fontSize:'18px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5);
      t.setInteractive({useHandCursor:true}).on('pointerdown',()=>{ if(!this.travelMenuOpen) return; this.travelIndex=i; this.updateTravelCursor(); this.executeTravel(d); });
      return t;
    });
    this.travelCursor= this.add.text(0,0,'>',{fontSize:'16px',color:'#4ade80'});
    this.travelHint  = this.add.text(0,140,'Tap or ENTER to travel  ·  ESC cancel',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelLayer = this.add.container(400,320).setDepth(51).setVisible(false).setScrollFactor(0);
    this.travelLayer.add([travelBg,this.travelTitle,...this.travelTexts,this.travelCursor,this.travelHint]);
    this.travelIndex = 0;
    this.travelMenuOpen = false;

    // Jacket Shop menu
    const JACKETS = [
      { key:'ikke-musikk',      name:'Blue Jacket',    price:0    },
      { key:'im-yellow-jacket', name:'Yellow Bape',    price:10000 },
      { key:'im-pink-bape',     name:'Pink Bape',      price:10000 },
      { key:'im-norway-jacket', name:'Norway Jacket',  price:10000 },
    ];
    this.JACKETS = JACKETS;
    const jsBg    = this.add.rectangle(0,0,420,360,0x0f172a,0.97).setStrokeStyle(2,0xfbbf24);
    const jsTitle = this.add.text(0,-155,'🧥  Jacket Shop',{fontSize:'22px',color:'#fbbf24',fontFamily:'monospace'}).setOrigin(0.5);
    const jsSub   = this.add.text(0,-126,'Ikke Musikk fits — switch your jacket',{fontSize:'12px',color:'#94a3b8',fontFamily:'monospace'}).setOrigin(0.5);
    this.jsItemTexts = JACKETS.map((j,i) => {
      const preview    = this.add.sprite(-80, -90+i*58, j.key, 1).setScale(2);
      const label      = this.add.text(-48, -100+i*58, j.name, {fontSize:'16px',color:'#ffffff',fontFamily:'monospace'});
      const priceLabel = this.add.text(-48,  -82+i*58, j.price === 0 ? 'Default — always free' : j.price.toLocaleString() + ' kr', {fontSize:'13px',color:'#4ade80',fontFamily:'monospace'});
      label.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{ if(!this.jacketShopOpen) return; this.jacketShopIndex=i; this.updateJacketShopCursor(); this.executeJacketShop(); });
      label.disableInteractive(); // re-enabled in openJacketShop()
      return { preview, label, priceLabel };
    });
    this.jsCursor   = this.add.text(0,0,'>',{fontSize:'16px',color:'#fbbf24'});
    this.jsStatusTxt= this.add.text(0,140,'',{fontSize:'12px',color:'#fbbf24',fontFamily:'monospace'}).setOrigin(0.5);
    const jsHint    = this.add.text(0,163,'ENTER buy/equip   ESC close',{fontSize:'12px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.jsLayer    = this.add.container(400,320).setDepth(53).setVisible(false).setScrollFactor(0);
    const allItems = [jsBg, jsTitle, jsSub, this.jsCursor, this.jsStatusTxt, jsHint];
    this.jsItemTexts.forEach(it => allItems.push(it.preview, it.label, it.priceLabel));
    this.jsLayer.add(allItems);

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
    this.buildSwapShopUI();
    this.buildSushiUI();
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
      {tx:15,ty:17, key:'ow2', type:'dialog', name:'Island Fisher',  dialogue:'Henningsvær - jewel of Lofoten! Tuna runs here are legendary. Bring a boat!'},
      {tx:16,ty:21, key:'ow3', type:'dialog', name:'Artist',         dialogue:'', dialogues: window.IKKE_MUSIKK_ARTIST_FACTS},
      {tx:8, ty:4, key:'ow5', type:'sushi', name:'Sushi Chef',       dialogue:''},
      {tx:12,ty:16, key:'ow6', type:'dialog', name:'Architect', dialogue:'This football pitch is known as the most beautiful in the world — right here in Henningsvær! And while you\'re in town, check out the Norsk Læringsenter nearby. It has its own game!'},
      {tx:16, ty:15, key:'ow1', type:'musikk', name:'Ikke Musikk Fan', dialogue:''},
      {tx:14,ty:23, key:'ow4', type:'ferry',  name:'Ferry Captain',  dialogue:''},
      {tx:23,ty:4,  key:'ow7', type:'jacket-shop', name:'Jacket Shop', dialogue:''},    ];
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
    // On water tile with boat → always fishable
    const og = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    if ((og==='O'||og==='D') && this.state.hasBoat) return true;
    const r=this.playerTileY, c=this.playerTileX;
    const g = this.MAP.ground[r]?.[c];
    if (g==='O'||g==='D') return this.state.hasBoat;
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
    this.scene.launch('FishingScene', {location:'henningsvær', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'HenningsvaarScene'});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (!result.caught) {
      if (result.fish) { window.addFishAuraMiss(this.state, result.fish, false); this.game.events.emit('updateUI', this.state); }
      return;
    }
    const _xpMult = getXPBonus(this.state.companion, 'henningsvaer');
    const _xpFinal = Math.round(result.xp * _xpMult);
    const leveled = addXP(this.state, _xpFinal);
    window.updateTop10(this.state, result.fish, 'Henningsvær');
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
    } else if (npc.type === 'jacket-shop') {
      this.openJacketShop();
    } else if (npc.type === 'sushi') {
      this.openSushiMenu();
    } else {
      const _g = GAME_DATA.OW_GENDER?.[npc.key];
      const _lines = npc.dialogues;
      const _txt = _lines ? _lines[Math.floor(Math.random()*_lines.length)] : npc.dialogue;
      this.openDialog((_g==='male'?'👨 ':_g==='female'?'👩 ':'')+npc.name, _txt);
    }
  }

  openJacketShop() {
    this.jacketShopOpen = true;
    this.jacketShopIndex = 0;
    this.jsItemTexts.forEach(it => it.label.setInteractive());
    this.updateJacketShopCursor();
    this.jsLayer.setVisible(true);
  }

  updateJacketShopCursor() {
    this.jsItemTexts.forEach((it, i) => {
      const j = this.JACKETS[i];
      const owned = j.price === 0 || this.state.ownedJackets.includes(j.key);
      const equipped = this.state.characterKey === j.key;
      it.label.setColor(i === this.jacketShopIndex ? '#fef08a' : '#ffffff');
      it.priceLabel.setText(
        equipped      ? '✓ Equipped' :
        j.price === 0 ? 'Default — always free' :
        owned         ? 'Owned — equip free' : j.price.toLocaleString() + ' kr'
      );
      it.priceLabel.setColor(equipped ? '#4ade80' : owned ? '#94a3b8' : '#4ade80');
    });
    const sel = this.jsItemTexts[this.jacketShopIndex];
    this.jsCursor.setPosition(sel.label.x - 22, sel.label.y + 2);
    this.jsStatusTxt.setText('');
  }

  executeJacketShop() {
    const j = this.JACKETS[this.jacketShopIndex];
    const owned = this.state.ownedJackets.includes(j.key);
    const equipped = this.state.characterKey === j.key;
    const free = j.price === 0;
    if (equipped) {
      this.jsStatusTxt.setText('Already wearing this one!'); return;
    }
    if (!free && !owned) {
      if (this.state.money < j.price) {
        this.jsStatusTxt.setText('Not enough kr!'); return;
      }
      this.state.money -= j.price;
      this.state.ownedJackets.push(j.key);
      this.state.aura = Math.max(-100, Math.min(100, (this.state.aura || 20) + 10));
    }
    this.state.characterKey = j.key;
    this.charKey = j.key;
    this.player.setTexture(j.key);
    this.player.play(j.key + '-idle-' + this.facing, true);
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.jsStatusTxt.setText('🧥 ' + j.name + ' equipped!');
    this.updateJacketShopCursor();
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
    const sceneMap = {'Leknes':'LeknesScene','Reine':'ReineScene','Kvalvika':'KvalvikaScene','Kåkern':'KakernScene'};
    const locMap   = {'Leknes':'leknes','Reine':'reine','Kvalvika':'kvalvika','Kåkern':'kåkern'};
    const spawnMap = {
    'Leknes': {x:12, y:18},
    'Reine': {x:8, y:14},
    'Kvalvika': {x:16, y:17},
    'Kåkern': {x:11, y:7}
  };
    const spawn = spawnMap[dest] || {x:12, y:13};
    this.state.location = locMap[dest] || dest.toLowerCase();
    this.state.x = spawn.x;
    this.state.y = spawn.y;
    SaveSystem.saveNow(this.state);
    this.closeAll();
    window.showTravelAnim(this, 'ferry', () => { this.scene.start(sceneMap[dest] || 'LeknesScene', {spawnX: spawn.x, spawnY: spawn.y}); });
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
    this.jacketShopOpen = false;
    this.swapShopOpen = false;
    this.sushiOpen = false;
    this.skilpaddeOpen = false;
    this.matematikkOpen = false;
    this.swapShopObjects.forEach(o => o.destroy());
    this.swapShopObjects = [];
    this.sushiObjects.forEach(o => o.destroy());
    this.sushiObjects = [];
    (this._skilpaddeObjects || []).forEach(o => o.destroy());
    this._skilpaddeObjects = [];
    (this._matematikkObjects || []).forEach(o => o.destroy());
    this._matematikkObjects = [];
    if (window.hideMobileNumpad) window.hideMobileNumpad();
    if (this.swapShopLayer) this.swapShopLayer.setVisible(false);
    if (this.sushiLayer) this.sushiLayer.setVisible(false);
    if (this.diagLayer)  this.diagLayer.setVisible(false);
    if (this.travelLayer) this.travelLayer.setVisible(false);
    if (this.jsLayer) this.jsLayer.setVisible(false);
    if (this.jsItemTexts) this.jsItemTexts.forEach(it => it.label.disableInteractive());
  }

  buildSwapShopUI() {
    // Swap shop is rendered dynamically on open; this just initialises the container
    this.swapShopLayer = this.add.container(0, 0).setDepth(57).setScrollFactor(0).setVisible(false);
  }

  buildSushiUI() {
    this.sushiLayer = this.add.container(0, 0).setDepth(58).setScrollFactor(0).setVisible(false);
  }

  openSushiMenu() {
    const inv = this.state.inventory || [];
    if (inv.length === 0) {
      this.openDialog('🍣 Dockhand', "You don't have any fish! Go catch some first.");
      return;
    }
    this.sushiOpen = true;
    this.sushiCursor = 0;
    this._renderSushiMenu();
  }

  _renderSushiMenu() {
    this.sushiObjects.forEach(o => o.destroy());
    this.sushiObjects = [];
    this.sushiLayer.setVisible(true);

    const inv = this.state.inventory || [];
    const panelW = 440, panelH = Math.min(60 + inv.length * 44 + 80, 480);
    const cx = 400, cy = 320;

    const bg = this.add.rectangle(cx, cy, panelW, panelH, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0xf97316).setDepth(58).setScrollFactor(0);
    const title = this.add.text(cx, cy - panelH/2 + 22, '🍣  Sushi Bar', {fontSize:'20px', color:'#f97316', fontFamily:'monospace'})
      .setOrigin(0.5).setDepth(58).setScrollFactor(0);
    const sub = this.add.text(cx, cy - panelH/2 + 44, 'No NOK — but double XP!', {fontSize:'12px', color:'#94a3b8', fontFamily:'monospace'})
      .setOrigin(0.5).setDepth(58).setScrollFactor(0);

    const listTop = cy - panelH/2 + 66;
    inv.forEach((fish, i) => {
      const fy = listTop + i * 44;
      const xp = Math.round(fish.weight * (fish.xpMult || 1) * 200);
      const isSelected = i === this.sushiCursor;
      const color = isSelected ? '#fef08a' : '#ffffff';
      const label = this.add.text(cx - 180, fy, (isSelected ? '▶ ' : '  ') + fish.name + ' ' + fish.weight + 'kg', {fontSize:'15px', color, fontFamily:'monospace'})
        .setDepth(58).setScrollFactor(0);
      const xpLabel = this.add.text(cx + 100, fy, '+' + xp.toLocaleString() + ' XP', {fontSize:'14px', color:'#4ade80', fontFamily:'monospace'})
        .setDepth(58).setScrollFactor(0);
      label.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{ if(!this.sushiOpen) return; this.sushiCursor=i; this._executeSushi(); });
      xpLabel.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{ if(!this.sushiOpen) return; this.sushiCursor=i; this._executeSushi(); });
      this.sushiObjects.push(label, xpLabel);
    });

    const hint = this.add.text(cx, cy + panelH/2 - 20, 'ENTER make sushi   ESC cancel', {fontSize:'12px', color:'#64748b', fontFamily:'monospace'})
      .setOrigin(0.5).setDepth(58).setScrollFactor(0);

    this.sushiObjects.push(bg, title, sub, hint);
  }

  _executeSushi() {
    const inv = this.state.inventory || [];
    if (inv.length === 0) { this.closeAll(); return; }
    const fish = inv[this.sushiCursor];
    const xp = Math.round(fish.weight * (fish.xpMult || 1) * 200);
    this.state.inventory.splice(this.sushiCursor, 1);
    const leveled = addXP(this.state, xp);
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    this.game.events.emit('updateUI', this.state);
    SaveSystem.saveNow(this.state);
    this.closeAll();
    this.openDialog('🍣 Sushi Made!', fish.name + ' ' + fish.weight + 'kg turned into sushi!\n+' + xp.toLocaleString() + ' XP (no NOK)' + (leveled ? '\n⬆️ LEVEL UP!' : ''));
  }

  openSwapShop() {
    const items = this.state.playerItems || [];
    if (items.length < 2) {
      this.openDialog('🔄 Thrift Shop', 'You need at least 2 items in your Ikke Musikk Duffel Bag to use the Thrift Shop!');
      return;
    }
    this.swapShopOpen = true;
    this.swapShopCursor = 0;
    this.swapShopSelected = [];
    this.swapShopLayer.setVisible(true);
    this._renderSwapShop();
  }

  _renderSwapShop() {
    // Destroy previous objects inside layer
    this.swapShopObjects.forEach(o => o.destroy());
    this.swapShopObjects = [];

    const cx = 400, cy = 310, W = 580, H = 440;
    const items = this.state.playerItems || [];

    const bg = this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.98)
      .setStrokeStyle(2, 0xf59e0b).setDepth(57).setScrollFactor(0);
    const title = this.add.text(cx, cy - H/2 + 18, '🔄 Thrift Shop', {
      fontSize: '15px', color: '#f59e0b', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(58).setScrollFactor(0);
    const sub = this.add.text(cx, cy - H/2 + 36, 'Select 2 items to trade for 1 random item', {
      fontSize: '11px', color: '#64748b', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(58).setScrollFactor(0);

    this.swapShopObjects.push(bg, title, sub);

    const contentY = cy - H/2 + 60;
    const lineH = 21;
    const visMax = 14;
    const start = Math.max(0, this.swapShopCursor - Math.floor(visMax / 2));

    for (let i = start; i < Math.min(items.length, start + visMax); i++) {
      const y = contentY + (i - start) * lineH;
      const selected = this.swapShopSelected.includes(i);
      const isCursor = i === this.swapShopCursor;
      const color = selected ? '#4ade80' : isCursor ? '#fbbf24' : '#cbd5e1';
      const cursor = isCursor ? '▶ ' : '  ';
      const check  = selected ? '✓ ' : '  ';
      const t = this.add.text(cx - W/2 + 20, y, cursor + check + items[i], {
        fontSize: '11px', color, fontFamily: 'monospace'
      }).setDepth(58).setScrollFactor(0);
      t.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{
        if(!this.swapShopOpen) return;
        this.swapShopCursor = i;
        if (this.swapShopSelected.includes(i)) {
          this.swapShopSelected = this.swapShopSelected.filter(x => x !== i);
        } else if (this.swapShopSelected.length < 2) {
          this.swapShopSelected.push(i);
        }
        this._renderSwapShop();
      });
      this.swapShopObjects.push(t);
    }

    const selCount = this.swapShopSelected.length;
    const statusColor = selCount === 2 ? '#4ade80' : '#94a3b8';
    const statusMsg = selCount === 2
      ? `✓ ${selCount}/2 selected — press ENTER to swap!`
      : `${selCount}/2 items selected`;
    const statusTxt = this.add.text(cx, cy + H/2 - 42, statusMsg, {
      fontSize: '12px', color: statusColor, fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(58).setScrollFactor(0);
    if (selCount === 2) {
      statusTxt.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{ if(this.swapShopOpen) this._executeSwap(); });
    }
    const hint = this.add.text(cx, cy + H/2 - 20, '↑↓ Navigate   SPACE select/deselect   ENTER swap   ESC cancel', {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(58).setScrollFactor(0);
    this.swapShopObjects.push(statusTxt, hint);
  }

  _executeSwap() {
    if (this.swapShopSelected.length < 2) return;
    const items = this.state.playerItems || [];
    // Sort descending so splicing doesn't shift indices
    const sorted = [...this.swapShopSelected].sort((a, b) => b - a);
    const removed = sorted.map(i => items[i]);
    sorted.forEach(i => items.splice(i, 1));
    this.state.playerItems = items;

    // Pick 1 random item the player doesn't already own
    const pool = window.ENCOUNTER_ITEMS.filter(e => !items.includes(e.name));
    let gained = 'Nothing available';
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      items.push(pick.name);
      gained = pick.name;
    }
    this.state.playerItems = items;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.swapShopOpen = false;
    this.swapShopObjects.forEach(o => o.destroy());
    this.swapShopObjects = [];
    this.swapShopLayer.setVisible(false);
    this.openDialog('🔄 Swap Complete!', `Gave away: ${removed.join(', ')}\nReceived: ${gained}`);
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
    if (door && door.tx === 3) { this.openSwapShop(); return; }
    if (door && door.tx === 18) { this._openSkilpaddeMenu(); return; }
    if (door && door.tx === 25) { this._openMatematikkBibliotek(); return; }
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
      if (this.dialogOpen || this.travelMenuOpen || this.jacketShopOpen || this.swapShopOpen || this.sushiOpen || this.skilpaddeOpen || this.matematikkOpen) { this.closeAll(); return; }
    }

    if (this.travelMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.travelIndex=(this.travelIndex-1+this.travelDests.length)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.travelIndex=(this.travelIndex+1)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.executeTravel(this.travelDests[this.travelIndex]);
      return;
    }

    if (this.jacketShopOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.jacketShopIndex=(this.jacketShopIndex-1+this.JACKETS.length)%this.JACKETS.length; this.updateJacketShopCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.jacketShopIndex=(this.jacketShopIndex+1)%this.JACKETS.length; this.updateJacketShopCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.executeJacketShop();
      return;
    }

    if (this.swapShopOpen) {
      const items = this.state.playerItems || [];
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.swapShopCursor = (this.swapShopCursor - 1 + items.length) % items.length;
        this._renderSwapShop();
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this.swapShopCursor = (this.swapShopCursor + 1) % items.length;
        this._renderSwapShop();
      }
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        const idx = this.swapShopCursor;
        if (this.swapShopSelected.includes(idx)) {
          this.swapShopSelected = this.swapShopSelected.filter(i => i !== idx);
        } else if (this.swapShopSelected.length < 2) {
          this.swapShopSelected.push(idx);
        }
        this._renderSwapShop();
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this._executeSwap();
      }
      return;
    }

    if (this.skilpaddeOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) { this._closeSkilpaddeMenu(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this._skilpaddeChoice = 1 - this._skilpaddeChoice;
        this._skilpaddeOpt1.setColor(this._skilpaddeChoice === 0 ? '#ffffff' : '#94a3b8');
        this._skilpaddeOpt2.setColor(this._skilpaddeChoice === 1 ? '#ffffff' : '#94a3b8');
        this._skilpaddeOpt1.setText((this._skilpaddeChoice === 0 ? '▶' : ' ') + ' Play (200 NOK)');
        this._skilpaddeOpt2.setText((this._skilpaddeChoice === 1 ? '▶' : ' ') + ' Leave');
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        if (this._skilpaddeChoice === 0) this._startSkilpadde();
        else this._closeSkilpaddeMenu();
        return;
      }
      return;
    }

    if (this.matematikkOpen) {
      this._handleMatematikkInput();
      return;
    }

    if (this.sushiOpen) {
      const inv = this.state.inventory || [];
      if (inv.length === 0) { this.closeAll(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.sushiCursor = (this.sushiCursor - 1 + inv.length) % inv.length;
        this._renderSushiMenu();
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this.sushiCursor = (this.sushiCursor + 1) % inv.length;
        this._renderSushiMenu();
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this._executeSushi();
      }
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
      if (nearDoor) { this.showCabinIdiom(nearDoor); return; }
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
            onComplete:()=>{ this.isMoving=false; this.checkWaterTransform(); this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true); if(this.onWater) this.player.setFlipY(this.facing==='up'); this.updateCompanion(); if(this.followingBaddie) this.updateBaddieFollow(this.lastPlayerTile); this.checkBushEncounter(); this.checkDragCatch('henningsvaer'); }});
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

  _openMatematikkBibliotek() {
    this.matematikkOpen = true;
    this._matematikkObjects = [];
    this._matematikkTab = 0;
    this._renderMatematikkTab(0);
  }

  _renderMatematikkTab(tabIndex) {
    this._matematikkObjects.forEach(o => o.destroy());
    this._matematikkObjects = [];
    const cx = 400, cy = 310, W = 650, H = 330;
    const add = o => { this._matematikkObjects.push(o); return o; };

    // Each line: { t: text, c: colour }  —  blank lines (t:'') add vertical space
    const W_ = '#e2e8f0', YL = '#fbbf24', GR = '#4ade80',
          BL = '#93c5fd', GY = '#94a3b8', PK = '#fca5a5', PU = '#c4b5fd';
    const TABS = [
      {
        icon: '➕', label: 'Addition', color: '#86efac',
        formula: 'a + b = total',
        lines: [
          { t: 'Add your catches together to find the total weight.', c: W_ },
          { t: '', c: '' },
          { t: 'You caught a 14 kg cod and a 9 kg haddock.', c: YL },
          { t: 'How much fish did you bring back?', c: YL },
          { t: '', c: '' },
          { t: '  14 kg + 9 kg = 23 kg  ✓', c: GR },
          { t: '', c: '' },
          { t: 'Tip: line up the digits, then add from right to left.', c: GY },
          { t: 'If a column adds up to 10 or more, carry the 1 over.', c: GY },
        ]
      },
      {
        icon: '➖', label: 'Subtraction', color: '#fca5a5',
        formula: 'a − b = difference',
        lines: [
          { t: 'Subtract to find what is left after selling or losing fish.', c: W_ },
          { t: '', c: '' },
          { t: 'Your bucket holds 30 kg. You already have 17 kg inside.', c: YL },
          { t: 'How much room is left?', c: YL },
          { t: '', c: '' },
          { t: '  30 kg − 17 kg = 13 kg  ✓', c: GR },
          { t: '', c: '' },
          { t: 'Tip: subtract right to left. If the top digit is smaller,', c: GY },
          { t: 'borrow 10 from the column to the left.', c: GY },
        ]
      },
      {
        icon: '✖', label: 'Multiplication', color: '#fde68a',
        formula: 'a × b = product',
        lines: [
          { t: 'Multiply to scale up — same amount, many times over.', c: W_ },
          { t: '', c: '' },
          { t: 'Each crate of fish weighs 8 kg. You have 6 crates.', c: YL },
          { t: 'What is the total weight?', c: YL },
          { t: '', c: '' },
          { t: '  8 kg × 6 = 48 kg  ✓', c: GR },
          { t: '', c: '' },
          { t: 'Tip: multiply right to left. If a column gives 10 or more,', c: GY },
          { t: 'write the ones digit and carry the tens digit left.', c: GY },
        ]
      },
      {
        icon: '➗', label: 'Division', color: '#93c5fd',
        formula: 'a ÷ b = quotient',
        lines: [
          { t: 'Divide to split things into equal groups.', c: W_ },
          { t: '', c: '' },
          { t: 'You caught 36 kg of fish to share equally among 4 boats.', c: YL },
          { t: 'How much does each boat get?', c: YL },
          { t: '', c: '' },
          { t: '  36 kg ÷ 4 = 9 kg each  ✓', c: GR },
          { t: '', c: '' },
          { t: 'Tip: ask "how many times does 4 fit into 36?" = 9 times.', c: GY },
          { t: 'Left over amount after dividing = the remainder.', c: GY },
        ]
      },
      {
        icon: '🔢', label: 'Algebra', color: '#c4b5fd',
        formula: 'find the unknown — do the same to both sides',
        lines: [
          { t: 'Use algebra when you know the total but not every part.', c: W_ },
          { t: '', c: '' },
          { t: 'A crate is 12 kg total. The crate itself weighs 4 kg.', c: YL },
          { t: 'There are 2 identical fish inside. How heavy is one fish?', c: YL },
          { t: '', c: '' },
          { t: '  2x + 4 = 12', c: BL },
          { t: '  2x = 12 − 4  →  2x = 8', c: BL },
          { t: '  x  = 8 ÷ 2   →  x  = 4 kg  ✓', c: GR },
          { t: 'Each fish weighs 4 kg.', c: GY },
        ]
      },
    ];

    const tab = TABS[tabIndex];
    const top = cy - H / 2;

    // Panel background + border
    add(this.add.rectangle(cx, cy, W, H, 0x0b1a2e, 0.98)
      .setStrokeStyle(2, 0x60a5fa).setDepth(60).setScrollFactor(0));

    // Title
    add(this.add.text(cx, top + 18, '📚  Matematikk Bibliotek', {
      fontSize: '14px', color: '#60a5fa', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));

    // Tab selector row
    const tabLabels = ['➕', '➖', '✖', '➗', '🔢'];
    const tabSpacing = 90;
    const tabRowX = cx - tabSpacing * 2;
    tabLabels.forEach((lbl, i) => {
      const tabX = tabRowX + i * tabSpacing;
      const isActive = i === tabIndex;
      const tabRect = add(this.add.rectangle(tabX, top + 44, 72, 22, isActive ? 0x1e3a5f : 0x0f172a, 1)
        .setStrokeStyle(1, isActive ? 0x60a5fa : 0x334155).setDepth(61).setScrollFactor(0));
      if (!isActive) {
        tabRect.setInteractive({useHandCursor:true})
          .on('pointerdown', ()=>{ if(!this.matematikkOpen) return; this._matematikkTab=i; this._renderMatematikkTab(i); });
      }
      add(this.add.text(tabX, top + 44, lbl, {
        fontSize: '13px', color: isActive ? '#ffffff' : '#64748b', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(62).setScrollFactor(0));
    });

    // Tab label + formula
    add(this.add.text(cx, top + 70, tab.icon + '  ' + tab.label, {
      fontSize: '16px', color: tab.color, fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    add(this.add.text(cx, top + 90, tab.formula, {
      fontSize: '13px', color: '#fef08a', fontFamily: 'monospace', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));

    // Divider
    add(this.add.rectangle(cx, top + 105, W - 40, 1, 0x334155).setDepth(61).setScrollFactor(0));

    // Content lines — blank lines add space, coloured lines render with their colour
    const lineH = 17, contentX = cx - W / 2 + 26, contentStartY = top + 114;
    let row = 0;
    tab.lines.forEach(line => {
      if (line.t !== '') {
        add(this.add.text(contentX, contentStartY + row * lineH, line.t, {
          fontSize: '13px', color: line.c, fontFamily: 'monospace'
        }).setDepth(61).setScrollFactor(0));
      }
      row++;
    });

    // Bottom navigation hint + close button
    const nav = tabIndex === 0 ? '▶ next tab  ·  ESC close'
              : tabIndex === 4 ? '◀ prev tab  ·  ESC close'
              : '◀ ▶ browse tabs  ·  ESC close';
    add(this.add.text(cx, cy + H / 2 - 28, 'Tap tab · ◀▶ browse · ESC close', {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    const closeBtn = add(this.add.rectangle(cx, cy + H / 2 - 12, 80, 22, 0x1e3a5f)
      .setStrokeStyle(1, 0x60a5fa).setDepth(61).setScrollFactor(0)
      .setInteractive({useHandCursor:true}));
    closeBtn.on('pointerdown', ()=>{ if(this.matematikkOpen) this._closeMatematikkBibliotek(); });
    add(this.add.text(cx, cy + H / 2 - 12, 'Close', {fontSize:'11px', color:'#60a5fa', fontFamily:'monospace'})
      .setOrigin(0.5).setDepth(62).setScrollFactor(0));
  }

  _closeMatematikkBibliotek() {
    this.matematikkOpen = false;
    this._matematikkObjects.forEach(o => o.destroy());
    this._matematikkObjects = [];
  }

  _handleMatematikkInput() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      if (this._matematikkTab > 0) { this._matematikkTab--; this._renderMatematikkTab(this._matematikkTab); }
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      if (this._matematikkTab < 4) { this._matematikkTab++; this._renderMatematikkTab(this._matematikkTab); }
    }
    if (Phaser.Input.Keyboard.JustDown(this.escKey) ||
        Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
        Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this._closeMatematikkBibliotek();
    }
  }

  _openSkilpaddeMenu() {
    this.skilpaddeOpen = true;
    this._skilpaddeObjects = [];
    const cx = 400, cy = 310;
    const W = 420, H = 200;
    const canAfford = (this.state.money || 0) >= 200;
    const add = (o) => { this._skilpaddeObjects.push(o); return o; };

    add(this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0x4ade80).setDepth(60).setScrollFactor(0));
    add(this.add.text(cx, cy - H/2 + 18, '⚽ Norsk læringssenter', {
      fontSize:'15px', color:'#4ade80', fontFamily:'monospace', stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    add(this.add.text(cx, cy - 20, 'Play SKILPADDE — guess the Norwegian word!', {
      fontSize:'12px', color:'#e2e8f0', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    add(this.add.text(cx, cy + 8, 'Cost: 200 NOK  |  Win: +500 NOK', {
      fontSize:'12px', color:'#94a3b8', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    const streak = this.state.skilpaddeStreak || 0;
    if (streak > 0) {
      add(this.add.text(cx, cy + 28, `🔥 Current streak: ${streak}`, {
        fontSize:'11px', color:'#fbbf24', fontFamily:'monospace'
      }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    }

    this._skilpaddeChoice = 0;
    this._skilpaddeOpt1 = add(this.add.text(cx, cy + H/2 - 50, '▶ Play (200 NOK)', {
      fontSize:'14px', color: canAfford ? '#ffffff' : '#ef4444', fontFamily:'monospace',
      stroke:'#000', strokeThickness:3
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    this._skilpaddeOpt1.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{ if(!this.skilpaddeOpen) return; this._startSkilpadde(); });
    this._skilpaddeOpt2 = add(this.add.text(cx, cy + H/2 - 26, '  Leave', {
      fontSize:'14px', color:'#94a3b8', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
    this._skilpaddeOpt2.setInteractive({useHandCursor:true}).on('pointerdown', ()=>{ if(!this.skilpaddeOpen) return; this._closeSkilpaddeMenu(); });
  }

  _closeSkilpaddeMenu() {
    this.skilpaddeOpen = false;
    (this._skilpaddeObjects || []).forEach(o => o.destroy());
    this._skilpaddeObjects = [];
  }

  _startSkilpadde() {
    if ((this.state.money || 0) < 200) return;
    this.state.money -= 200;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this._closeSkilpaddeMenu();
    this.scene.sleep('HenningsvaarScene');
    this.scene.launch('SkilpaddeScene', {
      callerScene: 'HenningsvaarScene',
      charKey: this.charKey,
      state: this.state
    });
  }

  tryEdgeWarp(tx, ty, dx, dy) {    const g = this.MAP.ground[ty]?.[tx];
    // Top edge (row 0) → Kåkern bottom-right
    if (dy === -1 && ty === 0 && tx >= 8 && tx <= 22) {
      this.state.location = 'kåkern';
      this.state.x = 25; this.state.y = 30;
      SaveSystem.saveNow(this.state);
      this.scene.start('KakernScene', {spawnX: 25, spawnY: 30, spawnFacing: 'up'});
    }
  }
};
