window.LeknesScene = class extends Phaser.Scene {
  constructor() { super({ key: 'LeknesScene' }); }

  init(data) {
    this.state = SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.state.location = 'leknes';
    this.MAP = LEKNES_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    const savedHere = !data && this.state.location === 'leknes';
    this.playerTileX = (data && data.spawnX !== undefined) ? data.spawnX : 12;
    this.playerTileY = (data && data.spawnY !== undefined) ? data.spawnY : 18;
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
    this.shopOpen = false;
    this.shopTab = 0;
    this.compIndex = 0;
    this.companionSprite = null;
    this.lastPlayerTile = {tx:0, ty:0};
    this.dialogOpen = false;
    this._welcomeActive = false;
    this._dialogQueue = [];  // queued {name, text} to show after current dialog closes
    this.tournamentConfirmOpen = false;
    this.travelAgentConfirmOpen = false;
    this.travelMenuOpen = false;
    this.shopLayer = null;
    this.museumOpen = false;
    this._museumObjects = [];
    this._museumIndex = 0;
  }

  create() {
    this.drawMap();
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    // Rescue: if spawn tile is blocked, reset to safe default
    const _spawnTile = this.MAP.ground?.[this.playerTileY]?.[this.playerTileX];
    const _spawnWater = _spawnTile === 'O' || _spawnTile === 'D';
    if (_spawnWater ? !this.state.hasBoat : !this.walkGrid[this.playerTileY]?.[this.playerTileX]) { this.playerTileX = 14; this.playerTileY = 14; }
    const fz = this.MAP.objects.find(o=>o.type==='ferry-zone');
    this.ferryTile = fz ? {tx:fz.tx+1, ty:fz.ty+2} : null;
    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.applyInitialWaterState();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.spawnCompanion();
    this.createNPCs();

    this.fishHint    = this.add.text(400, 612, 'Press F to fish', {fontSize:'14px',color:'#fbbf24',stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.interactHint   = this.add.text(400, 592, 'Press SPACE to interact', {fontSize:'13px',color:'#94a3b8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.shopFrontHint  = this.add.text(400, 574, 'Press SPACE to enter Fish Market', {fontSize:'13px',color:'#38bdf8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText     = this.add.text(400, 572, '', {fontSize:'14px',color:'#ffffff',stroke:'#000000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locationLabel= this.add.text(400, -50, 'Leknes', {fontSize:'18px',color:'#ffffff',stroke:'#000000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

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

    // USA Passport: fixed location — no random selection needed

    this.game.events.emit('updateUI', this.state);

    this.game.events.off('fishingComplete');
    this.game.events.on('fishingComplete', this.onFishCaught, this);

    this.buildShopUI();
    this._buildMuseumUI();

    // Museum label on lower cabin roof (cabin2 at tx:22, ty:18) — matches Ikke Musikk style
    const _TS = GAME_DATA.TILE_SIZE;
    this.add.text((22 + 2.5) * _TS, (18 + 2.5) * _TS, 'Lofotr Viking\nMuseum', {
      fontSize: '10px', color: '#fbbf24', fontFamily: 'monospace', align: 'center',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(5);

    if (!this.state.hasSeenWelcome) {
      this.state.hasSeenWelcome = true;
      SaveSystem.save(this.state);
      this.time.delayedCall(600, () => {
        this._welcomeActive = true;
        this._dialogQueue = [
          { name: '🌊 Welcome!', text: 'Welcome ' + (this.state.playerName || 'Ikke Musikk') + ' to the Lofoten Islands! Your goal is to become a legendary fisherman. There are 5 legendary Trophy Fish you need to catch in order to qualify for the Grand Fishing Tournament.' },
          { name: '🌊 Welcome!', text: 'Catch fish to sell at the market for kroner. Use the kroner to upgrade your fishing gear and lifestyle. Fight haters, rizz baddies, and catch fish to increase your aura. Different maps have different surprises!' },
          { name: '🌊 Welcome!', text: 'Fisherman Tom has been waiting for you here in Leknes. Collect your fishing rod and ferry pass from him and begin exploring the beautiful islands of Lofoten!' },
        ];
        const n = this._dialogQueue.shift();
        this.openDialog(n.name, n.text);
      });
    }
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
      {tx:11, ty:18, key:'ow5', type:'travel', name:'Ferry Captain', dialogue:''},
      {tx:8,  ty:5,  key:'ow6', type:'dialog', name:'Northern Lights Chaser', dialogue:'Have you been to Tromsø? You can see the northern lights there. They are magical!'},
      {tx:14, ty:12, key:'ow7', type:'dialog', name:'Rod Merchant',  dialogue:'A better rod helps you catch bigger fish!'},
      {tx:20, ty:10, key:'ow8', type:'dialog', name:'Sea Captain',   dialogue:'Dark blue water is deep ocean — rarest fish live there, but you need a boat to reach it.'},
      {tx:5,  ty:22, key:'ow9', type:'dialog', name:'Local Guide',   dialogue:'Reine has giant Skrei. Kvalvika hides legendary Bluefin Tuna. Henningsvær is great for Mackerel!'},
      {tx:18, ty:18, key:'ow3', type:'dialog', name:'Dockhand',      dialogue:'Buy a boat at the Fish Market and step onto any ocean tile — you will transform automatically!'},
      {tx:22, ty:14, key:'ow4', type:'dialog', name:'Farmer',        dialogue:'Animals you buy from the Fish Market will live on Kåkern — your home island!'},
      {tx:14, ty:19, key:'ow1', type:'tournament', name:'Tournament Official', dialogue:''},
      {tx:17, ty:9, key:'ow2', type:'travel-agent', name:'Travel Agent',      dialogue:''},
      {tx:3, ty:11, key:'ow10', type:'fisherman-tom', name:'Fisherman Tom', dialogue:''},
    ];
    const TS = GAME_DATA.TILE_SIZE;
    this.npcs = defs.map((d,i) => {
      const sprite = this.add.sprite(d.tx*TS+TS/2, d.ty*TS+TS/2, d.key, 1).setDepth(9);
      this.tweens.add({targets:sprite, y:sprite.y-4, duration:900+i*120, yoyo:true, repeat:-1, delay:i*200});
      return {...d, sprite};
    });
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

  isShopFront() {
    const shop = this.MAP.objects.find(o => o.type === 'shop');
    if (!shop) return false;
    const def = OBJECT_DEFS['shop'];
    const dirMap = {right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [dx,dy] = dirMap[this.facing] || [0,0];
    const nr = this.playerTileY + dy, nc = this.playerTileX + dx;
    return nr >= shop.ty && nr < shop.ty + def.th && nc >= shop.tx && nc < shop.tx + def.tw;
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
    this.scene.launch('FishingScene', {location:'leknes', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'LeknesScene'});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (!result.caught) {
      if (result.fish) { window.addFishAuraMiss(this.state, result.fish, false); this.game.events.emit('updateUI', this.state); }
      return;
    }
    const _xpMult = getXPBonus(this.state.companion, 'leknes');
    const _xpFinal = Math.round(result.xp * _xpMult);
    const leveled = addXP(this.state, _xpFinal);
    window.updateTop10(this.state, result.fish, 'Leknes');
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    const newTrophy = addTrophy(this.state, result.fish.name);
    if (newTrophy) {
      this.game.events.emit('trophy', result.fish.name);
      const count = (this.state.trophies || []).length;
      const total = GAME_DATA.TROPHY_FISH.length;
      this.showMsg('🏆 NEW TROPHY: ' + result.fish.name + '! (' + count + '/' + total + ')');
    }
    const _invResult = window.addFishToInventory(this.state, result.fish, {value: result.value});
    if (_invResult.added) {
      const _cabinBonus = window.cabinFishBonus(this.state);
      if (_cabinBonus > 0) { this.state.cabinEarnings = (this.state.cabinEarnings||0) + _cabinBonus; }
      if (!newTrophy) {
        const _swapMsg = _invResult.replaced ? ' (dropped ' + _invResult.replaced.name + ')' : '';
        this.showMsg('Caught ' + result.fish.name + ' ' + result.fish.weight + 'kg! +' + _xpFinal + 'XP' + _swapMsg + ((_cabinBonus>0)?' +'+_cabinBonus.toLocaleString()+' kr (cabin)':''));
      }
    } else {
      if (!newTrophy) this.showMsg('Too small — released. +' + _xpFinal + 'XP');
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

  checkUsaPassport() {
    if (this.state.hasUsaPassport) return;
    // Fixed location: tree at tx:17, ty:27 (lower center of Leknes).
    // Player must stand at tx:17, ty:28 facing up and press SPACE.
    if (this.playerTileX === 17 && this.playerTileY === 28 && this.facing === 'up'
        && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.state.hasUsaPassport = true;
      this.state.aura = Math.max(-100, Math.min(100, (this.state.aura || 20) + 10));
      if (!this.state.playerItems) this.state.playerItems = [];
      this.state.playerItems.push('USA Passport');
      SaveSystem.save(this.state);
      this.game.events.emit('updateUI', this.state);
      this.openDialog('🛂 USA Passport Found!', `You discovered a USA Passport hidden in the lower center tree of Leknes! Added to your Ikke Musikk Duffel Bag. +10 AURA (Now: ${this.state.aura})`);
    }
  }

  getNearbyNPC() {
    // NPC must be exactly 1 tile ahead in facing direction
    const dirMap={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [dx,dy] = dirMap[this.facing] || [0,0];
    const tx=this.playerTileX+dx, ty=this.playerTileY+dy;
    return this.npcs.find(n=>n.tx===tx && n.ty===ty) || null;
  }

  interact(npc) {
    if (npc.type === 'fisherman-tom') {
      if (!this.state.hasReceivedStarterKit) {
        this.state.rod = 'basic';
        this.state.hasFerryPass = true;
        this.state.hasReceivedStarterKit = true;
        SaveSystem.save(this.state);
        this.game.events.emit('updateUI', this.state);
        this.openDialog('👨 Fisherman Tom', "Hey " + (this.state.playerName || 'Ikke Musikk') + "! Big fan. Here is your basic rod and ferry pass. To fish, go to the water and press F. You can sell the fish you catch at the shop in town for money. Your ferry pass allows you to travel the islands of Lofoten. Just find the Ferry Captain and tell him where to take you. Each town has one. Koser deg!");
      } else {
        const lyrics = GAME_DATA.IKKE_MUSIKK_LYRICS;
        const line = lyrics[Math.floor(Math.random() * lyrics.length)];
        this.openDialog('🎤 Fisherman Tom', '♪ ' + line + ' ♪');
      }
      return;
    }
    if (npc.type === 'musikk') {
      const lyrics = GAME_DATA.IKKE_MUSIKK_LYRICS;
      const line = lyrics[Math.floor(Math.random() * lyrics.length)];
      this.openDialog('🎤 Ikke Musikk Fan', '♪ ' + line + ' ♪');
      return;
    }
    switch(npc.type) {
      case 'travel':
        if (!this.state.hasFerryPass) { this.openDialog('Ferry Captain', "You'll need a ferry pass to travel the islands."); }
        else { this.openTravelMenu(); }
        break;
      case 'travel-agent': this.openTravelAgentDialog(); break;
      case 'tournament': this.openTournamentDialog(); break;
      default: { const _g = GAME_DATA.OW_GENDER?.[npc.key]; this.openDialog((_g==='male'?'👨 ':_g==='female'?'👩 ':'')+npc.name, npc.dialogue); }
    }
  }


  openTournamentDialog() {
    if (this.state.tournamentActive) {
      this.openDialog('Tournament Official', '🎣 Tournament in progress! Go, go, go!');
      return;
    }
    const trophies = this.state.trophies || [];
    const total = GAME_DATA.TROPHY_FISH.length;
    if (trophies.length < total) {
      const missing = GAME_DATA.TROPHY_FISH.filter(f => !trophies.includes(f));
      const missingList = missing.join(', ');
      this.openDialog('Tournament Official', `You need all ${total} trophy fish to enter the Grand Tournament. You have ${trophies.length}/${total}. Still needed: ${missingList}.`);
      return;
    }
    this.tournamentConfirmOpen = true;
    this.openDialog('Tournament Official', '🎣 Grand Tournament — your fish inventory will be cleared! You have 5 minutes to catch the biggest fish across any map. ENTER to start, ESC to cancel.');
  }

  openTravelAgentDialog() {
    if (this.state.hasTromsoTicket) {
      this.openDialog('Travel Agent', 'You already have a Tromsø roundtrip ticket! Head to the ferry when ready. Return fare is included!');
    } else if (this.state.money < GAME_DATA.TROMSO_TICKET_PRICE) {
      this.openDialog('Travel Agent', `A ticket to Tromsø costs ${GAME_DATA.TROMSO_TICKET_PRICE.toLocaleString()} NOK. You have ${this.state.money.toLocaleString()} NOK. Keep fishing!`);
    } else {
      this.travelAgentConfirmOpen = true;
      this.openDialog('Travel Agent', `Tromsø roundtrip ticket — ${GAME_DATA.TROMSO_TICKET_PRICE.toLocaleString()} NOK. Covers the return journey too! Press ENTER to purchase, SPACE to cancel.`);
    }
  }

  checkFerryTile() {
    if (this.ferryTile && this.playerTileX===this.ferryTile.tx && this.playerTileY===this.ferryTile.ty) {
      if (!this.shopOpen && !this.dialogOpen && !this.travelMenuOpen) {
        if (!this.state.hasFerryPass) { this.openDialog('Ferry Captain', "You'll need a ferry pass to travel the islands."); }
        else { this.openTravelMenu(); }
      }
    }
  }

  buildShopUI() {
    const W=680, H=460;
    const bg = this.add.rectangle(0,0,W,H,0x0f172a,0.97).setStrokeStyle(2,0x38bdf8);
    const tabs = ['SELL FISH','RODS','BOAT','GUIDES','ANIMALS'];
    this.shopTabTexts = tabs.map((t,i)=>{
      const txt = this.add.text(-W/2+16+i*134, -H/2+14, t, {fontSize:'12px',color:'#94a3b8',fontFamily:'monospace'});
      txt.setInteractive({useHandCursor:true}).on('pointerdown',()=>{ if(!this.shopOpen) return; this.shopTab=i; this.renderShopTab(); });
      return txt;
    });
    this.shopTitle = this.add.text(0,-H/2+40,'',{fontSize:'20px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5);
    const divider = this.add.rectangle(0,-H/2+54,W-20,1,0x38bdf8,0.5);
    this.shopBody  = this.add.text(0,0,'',{fontSize:'13px',color:'#e2e8f0',fontFamily:'monospace',align:'center',wordWrap:{width:620}}).setOrigin(0.5);
    this.shopHint  = this.add.text(0,H/2-18,'',{fontSize:'12px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    const container = this.add.container(400,320).setDepth(50).setVisible(false);
    container.add([bg,divider,...this.shopTabTexts,this.shopTitle,this.shopBody,this.shopHint]);
    this.shopLayer = container.setScrollFactor(0);

    // Travel menu
    const travelBg = this.add.rectangle(0,0,400,380,0x0f172a,0.97).setStrokeStyle(2,0x4ade80);
    this.travelTitle = this.add.text(0,-160,'Travel To...',{fontSize:'22px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelDests = ['Reine','Kåkern','Kvalvika','Henningsvær','Tromsø'];
    this.travelTexts = this.travelDests.map((d,i)=>{
      const t = this.add.text(0,-100+i*50,d,{fontSize:'18px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5);
      t.setInteractive({useHandCursor:true}).on('pointerdown',()=>{ if(!this.travelMenuOpen) return; this.travelIndex=i; this.updateTravelCursor(); this.executeTravel(d); });
      return t;
    });
    this.travelCursor = this.add.text(0,0,'>',{fontSize:'16px',color:'#4ade80'});
    this.travelHint   = this.add.text(0,160,'Tap or ENTER to travel  ·  ESC cancel',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelLayer  = this.add.container(400,320).setDepth(51).setVisible(false).setScrollFactor(0);
    this.travelLayer.add([travelBg,this.travelTitle,...this.travelTexts,this.travelCursor,this.travelHint]);
    this.travelIndex = 0;

    // Dialog box
    const diagBg  = this.add.rectangle(400,490,760,120,0x0f172a,0.95).setStrokeStyle(2,0x94a3b8).setDepth(52).setScrollFactor(0);
    diagBg.setInteractive({ useHandCursor: true });
    diagBg.on('pointerdown', () => {
      if (!this.dialogOpen) return;
      if (this.tournamentConfirmOpen) {
        this.tournamentConfirmOpen = false;
        this.closeAll();
        this.state.inventory = [];
        this.state.tournamentActive = true;
        this.state.tournamentBestFish = null;
        this.state.tournamentEndTime = Date.now() + 300000;
        SaveSystem.saveNow(this.state);
        this.game.events.emit('updateUI', this.state);
        return;
      }
      this.advanceDialog();
    });

    this.diagName = this.add.text(30,438,'',{fontSize:'15px',color:'#fbbf24',fontFamily:'monospace'}).setDepth(53).setScrollFactor(0);
    this.diagText = this.add.text(30,462,'',{fontSize:'14px',color:'#e2e8f0',fontFamily:'monospace',wordWrap:{width:740}}).setDepth(53).setScrollFactor(0);
    this.diagHint = this.add.text(770,538,'Tap or ENTER to continue',{fontSize:'12px',color:'#475569',fontFamily:'monospace'}).setOrigin(1,1).setDepth(53).setScrollFactor(0);
    this.diagLayer = this.add.container(0,0).setDepth(52).setVisible(false).setScrollFactor(0);
    this.diagLayer.add([diagBg,this.diagName,this.diagText,this.diagHint]);

    this.rodItems = Object.entries(GAME_DATA.RODS).map(([k,v])=>({key:k,...v})).filter(r=>r.key!=='basic');
    this.rodIndex = 0;
    this.compItems = window.GUIDES || [];
    this.compIndex = 0;
    // Reveal overlay for animal purchases (shown outside the shop container)
    this.animalRevealBg  = this.add.rectangle(400,320,500,360,0x0f172a,0.98).setStrokeStyle(2,0xf59e0b).setDepth(60).setVisible(false).setScrollFactor(0);
    this.animalRevealImg = this.add.image(400,260,'animal-icon1').setScale(5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealName= this.add.text(400,380,'',{fontSize:'20px',color:'#f59e0b',fontFamily:'monospace'}).setOrigin(0.5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealHint= this.add.text(400,430,'Press SPACE to close',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealOpen = false;
  }

  openUnifiedShop() {
    this.shopOpen = true;
    this.shopLayer.setVisible(true);
    this.renderShopTab();
  }

  renderShopTab() {
    const tab = this.shopTab;
    this.shopTabTexts.forEach((t,i)=>t.setColor(i===tab?'#38bdf8':'#94a3b8'));
    if (tab===0) {
      this.shopTitle.setText('🐟 Sell Fish');
      this.updateFishMarket();
      this.shopHint.setText('ENTER sell all  ←→ switch tab  ESC close');
    } else if (tab===1) {
      this.shopTitle.setText('🎣 Fishing Rods');
      this.updateRodShop();
      this.shopHint.setText('↑↓ select  ENTER buy  ←→ switch tab  ESC close');
    } else if (tab===2) {
      this.shopTitle.setText('⛵ Boat');
      const owned = this.state.hasBoat;
      this.shopBody.setText(owned
        ? '✓ You own a boat!\n\nUnlocks open-sea fishing,\nrare & legendary fish catches.'
        : 'Buy a fishing boat — '+GAME_DATA.BOAT_PRICE+' NOK\nYour balance: '+this.state.money+' NOK\n\nUnlocks open-sea fishing,\nfish above 20kg, rare & legendary catches.');
      this.shopHint.setText((owned?'':'ENTER buy  ')+'←→ switch tab  ESC close');
    } else if (tab===3) {
      this.shopTitle.setText('🧭 Guides');
      this.updateCompanionShop();
      this.shopHint.setText('↑↓ select  ENTER buy  ←→ switch tab  ESC close');
    } else if (tab===4) {
      this.shopTitle.setText('🐾 Animals');
      this.updateAnimalShop();
      this.shopHint.setText('ENTER to get mystery animal  ←→ switch tab  ESC close');
    }
  }

  updateCompanionShop() {
    const lines = this.compItems.map((c,i)=>{
      const owned = this.state.companion===c.key;
      const prefix = i===this.compIndex ? '> ' : '  ';
      return prefix+c.name.padEnd(10)+' '+c.price+' NOK'+(owned?' [ACTIVE]':'')+'  '+c.desc;
    });
    const cur = this.state.companion;
    if (cur) lines.push('\n[Current companion: '+cur+']  ENTER to dismiss (-0 NOK)');
    this.shopBody.setText(lines.join('\n'));
  }

  buyCompanion() {
    const comp = this.compItems[this.compIndex];
    if (!comp) return;
    if (this.state.companion===comp.key) {
      this.state.companion = null;
      if (this.companionSprite) { this.companionSprite.destroy(); this.companionSprite = null; }
      this.showMsg('Companion dismissed.');
    } else {
      if (this.state.money < comp.price) { this.showMsg('Not enough NOK!'); return; }
      this.state.money -= comp.price;
      this.state.companion = comp.key;
      this.spawnCompanion();
      this.showMsg(comp.name+' is now your companion!');
    }
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.updateCompanionShop();
  }

  updateAnimalShop() {
    if (!this.state.animals) this.state.animals = [];
    const owned = this.state.animals.length;
    const total = window.ANIMALS.length;
    const available = window.ANIMALS.filter(a=>!this.state.animals.includes(a.id));
    const lines = [
      '  > [ Buy Mystery Animal ]   5000 NOK',
      '',
      `  Animals collected: ${owned} / ${total}`,
      '',
      '  Each purchase sends a mystery animal',
      '  to your home on Kåkern!',
      '',
      available.length===0 ? '  All animals collected!' : `  ${available.length} animal(s) still undiscovered...`,
    ];
    this.shopBody.setText(lines.join('\n')+'\n\nBalance: '+this.state.money+' NOK');
  }

  buyAnimal() {
    if (!this.state.animals) this.state.animals=[];
    const available = window.ANIMALS.filter(a=>!this.state.animals.includes(a.id));
    if (available.length===0) { this.showMsg('You already have all animals!'); return; }
    const price = 5000;
    if (this.state.money < price) { this.showMsg('Not enough NOK! Need 5000.'); return; }
    this.state.money -= price;
    const picked = available[Math.floor(Math.random()*available.length)];
    this.state.animals.push(picked.id);
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.updateAnimalShop();
    this.closeAll();
    this.showAnimalReveal(picked.id, true);
  }

  showAnimalReveal(id, fromPurchase) {
    const key = 'animal-icon'+id;
    this.animalRevealImg.setTexture(key);
    this.animalRevealName.setText((fromPurchase?'New animal arrived! ':'Animal ')+id);
    this.animalRevealBg.setVisible(true);
    this.animalRevealImg.setVisible(true);
    this.animalRevealName.setVisible(true);
    this.animalRevealHint.setVisible(true);
    this.animalRevealOpen = true;
  }

  closeAnimalReveal() {
    this.animalRevealBg.setVisible(false);
    this.animalRevealImg.setVisible(false);
    this.animalRevealName.setVisible(false);
    this.animalRevealHint.setVisible(false);
    this.animalRevealOpen = false;
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

  updateFishMarket() {
    const inv = this.state.inventory;
    if (inv.length === 0) { this.shopBody.setText('No fish in inventory.\nCatch some fish first!'); return; }
    let total = 0;
    const lines = inv.map(f=>{ const val=(f.magical ? 2 : 1)*f.weight*GAME_DATA.FISH_PRICE_PER_KG; total+=val; return (f.magical?'✨ ':'')+f.name+' '+f.weight+'kg = '+val+' NOK'; });
    lines.push('', 'Total: '+total+' NOK');
    this.shopBody.setText(lines.join('\n'));
  }

  updateRodShop() {
    const lines = this.rodItems.map((r,i)=>{
      const owned  = this.state.rod===r.key;
      const prefix = i===this.rodIndex ? '> ' : '  ';
      const price  = r.price===0 ? 'FREE' : r.price.toLocaleString()+' NOK';
      const bonus  = `+${r.weightBonus}kg weight bonus`;
      const tag    = owned ? ' [OWNED]' : '';
      return `${prefix}${r.name.padEnd(13)} ${price.padEnd(12)}${tag.padEnd(9)} ${bonus}`;
    });
    this.shopBody.setText(lines.join('\n'));
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
    if (dest === 'Tromsø') {
      if (!this.state.hasTromsoTicket) {
        this.closeAll();
        this.openDialog('Ferry Captain', 'You need a Tromsø ticket! Visit the Travel Agent (near the market) to buy one for 8,000 NOK.');
        return;
      }
      this.state.location = 'tromso';
      this.state.x = 17; this.state.y = 26;
      SaveSystem.saveNow(this.state);
      this.closeAll();
      window.showTravelAnim(this, 'plane', () => { this.scene.start('TromsoScene', {spawnX: 17, spawnY: 26}); });
      return;
    }
    const sceneMap = {'Reine':'ReineScene','Kåkern':'KakernScene','Kvalvika':'KvalvikaScene','Henningsvær':'HenningsvaarScene'};
    const locMap   = {'Reine':'reine','Kåkern':'kåkern','Kvalvika':'kvalvika','Henningsvær':'henningsvær'};
    this.state.location = locMap[dest] || dest.toLowerCase();
    const spawnMap = {
      'Reine': {x:8, y:14},
      'Kåkern': {x:11, y:7},
      'Kvalvika': {x:16, y:17},
      'Henningsvær': {x:15, y:23},
      'Tromso': {x:21, y:28}
    };
    const spawn = spawnMap[dest] || {x:12, y:13};
    this.state.x = spawn.x;
    this.state.y = spawn.y;
    SaveSystem.saveNow(this.state);
    this.closeAll();
    window.showTravelAnim(this, 'ferry', () => { this.scene.start(sceneMap[dest] || 'LeknesScene', {spawnX: spawn.x, spawnY: spawn.y}); });
  }

  openDialog(name, text) {
    this.dialogOpen = true;
    this.diagName.setText(name);
    this.diagText.setText(text);
    this.diagLayer.setVisible(true);
    
    // Update hint based on queue
    if (this._dialogQueue && this._dialogQueue.length > 0) {
      this.diagHint.setText('ENTER to continue');
    } else {
      this.diagHint.setText('ENTER to close');
    }
  }

  advanceDialog() {
    this.travelAgentConfirmOpen = false;
    this.closeAll();
    if (this._dialogQueue && this._dialogQueue.length > 0) {
      const n = this._dialogQueue.shift();
      this.openDialog(n.name, n.text);
    } else {
      this._welcomeActive = false;
    }
  }

  closeAll() {
    this.tournamentConfirmOpen = false;
    this.travelAgentConfirmOpen = false;
    this.shopOpen=false; this.travelMenuOpen=false; this.dialogOpen=false;
    this._hTx = -1;
    if(this.shopLayer)  this.shopLayer.setVisible(false);
    if(this.travelLayer)this.travelLayer.setVisible(false);
    if(this.diagLayer)  this.diagLayer.setVisible(false);
    this.rodIndex=0;
    this.closeMuseum();
  }

  // ── Lofotr Viking Museum ──────────────────────────────────────────────

  _buildMuseumUI() {
    // Pre-load rpgItems spritesheet if not already loaded
    if (!this.textures.exists('rpgItems')) {
      this.load.spritesheet('rpgItems', 'assets/rpgItems.png', { frameWidth: 16, frameHeight: 16 });
      this.load.once('complete', () => { /* loaded on demand */ });
      this.load.start();
    }
  }

  openMuseum() {
    this.museumOpen = true;
    this._museumIndex = 0;
    this._renderMuseum();
  }

  closeMuseum() {
    this.museumOpen = false;
    (this._museumObjects || []).forEach(o => o.destroy());
    this._museumObjects = [];
  }

  _renderMuseum() {
    (this._museumObjects || []).forEach(o => o.destroy());
    this._museumObjects = [];

    const W = 580, H = 460;
    const cx = 400, cy = 308;
    const add = (o) => { this._museumObjects.push(o); return o; };

    add(this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97).setStrokeStyle(2, 0xf59e0b).setDepth(60).setScrollFactor(0));
    add(this.add.text(cx, cy - H/2 + 16, '🏛️  Lofotr Viking Museum', {
      fontSize: '15px', color: '#f59e0b', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));

    const playerATK = window.getPlayerATK(this.state);
    const playerDEF = window.getPlayerDEF(this.state);
    const equipped = this.state.equippedWeapon || 'None';
    add(this.add.text(cx, cy - H/2 + 33, `ATK: ${playerATK}  DEF: ${playerDEF}  Weapon: ${equipped}`, {
      fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));

    const PAGE = 10;
    const items = MUSEUM_ITEMS;
    const startI = Math.max(0, Math.min(this._museumIndex - 4, items.length - PAGE));
    const listTop = cy - H/2 + 52;

    for (let i = 0; i < PAGE; i++) {
      const idx = startI + i;
      if (idx >= items.length) break;
      const item = items[idx];
      const yy = listTop + i * 37;
      const selected = idx === this._museumIndex;
      const owned = (this.state.items || []).some(it => it.name === item.name);
      const slots = this.state.equippedArmour || {};
      const isEquipped = item.type === 'weapon'
        ? this.state.equippedWeapon === item.name
        : slots[item.slot] === item.name;

      if (selected) {
        add(this.add.rectangle(cx, yy + 8, W - 20, 33, 0x1e3a5f).setStrokeStyle(1, 0x38bdf8).setDepth(60).setScrollFactor(0));
      }

      if (this.textures.exists('rpgItems')) {
        add(this.add.image(cx - 260, yy + 8, 'rpgItems', item.frame).setScale(2).setDepth(62).setScrollFactor(0));
      }

      // Section divider labels
      if (idx === 0 || (idx > 0 && items[idx].type !== items[idx-1].type)) {
        const divLabel = item.type === 'armour' ? '── ARMOUR ──' : '── WEAPONS ──';
        const prevType = idx > 0 ? items[idx-1].type : null;
        if (prevType !== item.type) {
          add(this.add.text(cx - 240, yy - 6, divLabel, {
            fontSize: '9px', color: '#475569', fontFamily: 'monospace'
          }).setOrigin(0, 0.5).setDepth(62).setScrollFactor(0));
        }
      }

      const statStr = item.type === 'armour' ? `+${item.def} DEF` : `+${item.atk} ATK`;
      const nameColor = isEquipped ? '#fbbf24' : (owned ? '#6b7280' : (selected ? '#ffffff' : '#e2e8f0'));
      add(this.add.text(cx - 242, yy + 8, item.name + (isEquipped ? ' ⚔' : owned ? ' ✓' : ''), {
        fontSize: '12px', color: nameColor, fontFamily: 'monospace', stroke: '#000', strokeThickness: 2
      }).setOrigin(0, 0.5).setDepth(62).setScrollFactor(0));

      add(this.add.text(cx + 80, yy + 8, statStr, {
        fontSize: '12px', color: item.type === 'armour' ? '#60a5fa' : '#f87171',
        fontFamily: 'monospace'
      }).setOrigin(0.5, 0.5).setDepth(62).setScrollFactor(0));

      const canAfford = (this.state.money || 0) >= item.price;
      add(this.add.text(cx + 180, yy + 8, item.price.toLocaleString() + ' NOK', {
        fontSize: '11px', color: owned ? '#6b7280' : (canAfford ? '#4ade80' : '#ef4444'),
        fontFamily: 'monospace'
      }).setOrigin(0.5, 0.5).setDepth(62).setScrollFactor(0));

      add(this.add.text(cx + 260, yy + 8, '+' + item.aura + ' ✨', {
        fontSize: '11px', color: '#a78bfa', fontFamily: 'monospace'
      }).setOrigin(0.5, 0.5).setDepth(62).setScrollFactor(0));
    }

    add(this.add.text(cx, cy + H/2 - 24, `${this._museumIndex+1}/${items.length}  ↑↓ scroll  ENTER buy/equip  ESC close`, {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(61).setScrollFactor(0));
  }

  _buyMuseumItem() {
    const item = MUSEUM_ITEMS[this._museumIndex];
    if (!item) return;
    const owned = (this.state.items || []).some(it => it.name === item.name);
    if (!this.state.equippedArmour) this.state.equippedArmour = {};

    if (item.type === 'weapon' && owned) {
      // Toggle equip/unequip weapon
      if (this.state.equippedWeapon === item.name) {
        this.state.equippedWeapon = null;
        this.showMsg('Unequipped ' + item.name);
      } else {
        this.state.equippedWeapon = item.name;
        this.showMsg('Equipped ' + item.name + '! ATK now ' + window.getPlayerATK(this.state));
      }
      SaveSystem.save(this.state);
      this.game.events.emit('updateUI', this.state);
      this._renderMuseum();
      return;
    }

    if (item.type === 'armour' && owned) {
      // Toggle equip/unequip armour in its slot
      if (this.state.equippedArmour[item.slot] === item.name) {
        this.state.equippedArmour[item.slot] = null;
        this.showMsg('Unequipped ' + item.name);
      } else {
        this.state.equippedArmour[item.slot] = item.name;
        this.showMsg('Equipped ' + item.name + '! DEF now ' + window.getPlayerDEF(this.state));
      }
      SaveSystem.save(this.state);
      this.game.events.emit('updateUI', this.state);
      this._renderMuseum();
      return;
    }

    if ((this.state.money || 0) < item.price) { this.showMsg('Not enough NOK!'); return; }

    this.state.money -= item.price;
    if (!this.state.items) this.state.items = [];
    this.state.items.push({ name: item.name, frame: item.frame });
    this.state.aura = Math.min(100, (this.state.aura || 20) + item.aura);

    if (item.type === 'weapon') {
      this.state.equippedWeapon = item.name;
      this.showMsg(`Bought & equipped ${item.name}! +${item.aura} AURA  ATK → ${window.getPlayerATK(this.state)}`);
    } else {
      // Auto-equip armour into its slot (replaces previous in that slot)
      this.state.equippedArmour[item.slot] = item.name;
      this.showMsg(`Bought & equipped ${item.name}! +${item.aura} AURA  DEF → ${window.getPlayerDEF(this.state)}`);
    }

    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this._renderMuseum();
  }

  sellAllFish() {
    const inv = this.state.inventory;
    if (!inv.length) return;
    const total = inv.reduce((s,f)=>s+(f.magical ? 2 : 1)*f.weight*GAME_DATA.FISH_PRICE_PER_KG,0);
    this.state.money += total;
    this.state.inventory = [];
    this.showMsg('Sold all fish for '+total+' NOK!');
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI',this.state);
    this.updateFishMarket();
  }

  buyRod() {
    const rod = this.rodItems[this.rodIndex];
    if (this.state.rod===rod.key) { this.showMsg('You already own this rod!'); return; }
    if (this.state.money<rod.price) { this.showMsg('Not enough money!'); return; }
    this.state.money -= rod.price;
    this.state.rod = rod.key;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI',this.state);
    this.showMsg('Bought '+rod.name+'!');
    this.updateRodShop();
  }

  buyBoat() {
    if (this.state.hasBoat) { this.showMsg('You already own a boat!'); return; }
    if (this.state.money<GAME_DATA.BOAT_PRICE) { this.showMsg('Not enough money!'); return; }
    this.state.money -= GAME_DATA.BOAT_PRICE;
    this.state.hasBoat = true;
    this.state.aura = Math.max(-100, Math.min(100, (this.state.aura || 20) + 10));
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI',this.state);
    this.showMsg('Bought a fishing boat! Open sea unlocked!');
    this.renderShopTab();
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
    // Lower cabin = Lofotr Viking Museum (cabin2 at tx:22, ty:18)
    if (door && door.tx === 22 && door.ty === 18) {
      this.openMuseum();
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

    // Animal reveal popup — highest priority
    if (this.animalRevealOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)||Phaser.Input.Keyboard.JustDown(this.escKey)||Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        this.closeAnimalReveal();
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      if (this.shopOpen||this.travelMenuOpen||this.dialogOpen||this.museumOpen) { this.closeAll(); return; }
    }

    if (this.travelMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.travelIndex=(this.travelIndex-1+this.travelDests.length)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.travelIndex=(this.travelIndex+1)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.executeTravel(this.travelDests[this.travelIndex]);
      return;
    }

    if (this.shopOpen) {
      const numTabs = 5;
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left))  { this.shopTab=(this.shopTab-1+numTabs)%numTabs; this.renderShopTab(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) { this.shopTab=(this.shopTab+1)%numTabs; this.renderShopTab(); }
      if (this.shopTab===0 && Phaser.Input.Keyboard.JustDown(this.enterKey)) this.sellAllFish();
      if (this.shopTab===1) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.rodIndex=(this.rodIndex-1+this.rodItems.length)%this.rodItems.length; this.updateRodShop(); }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.rodIndex=(this.rodIndex+1)%this.rodItems.length; this.updateRodShop(); }
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.buyRod();
      }
      if (this.shopTab===2 && Phaser.Input.Keyboard.JustDown(this.enterKey)) this.buyBoat();
      if (this.shopTab===3) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.compIndex=(this.compIndex-1+this.compItems.length)%this.compItems.length; this.updateCompanionShop(); }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.compIndex=(this.compIndex+1)%this.compItems.length; this.updateCompanionShop(); }
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.buyCompanion();
      }
      if (this.shopTab===4) {
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.buyAnimal();
      }
      return;
    }

    if (this.museumOpen) {
      const items = MUSEUM_ITEMS;
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this._museumIndex = (this._museumIndex - 1 + items.length) % items.length; this._renderMuseum(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this._museumIndex = (this._museumIndex + 1) % items.length; this._renderMuseum(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) { this._buyMuseumItem(); }
      return;
    }

    if (this.dialogOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) { if (this._welcomeActive) return; this._dialogQueue=[]; this.tournamentConfirmOpen=false; this.travelAgentConfirmOpen=false; this.closeAll(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.advanceDialog();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        if (this.tournamentConfirmOpen) {
          this.tournamentConfirmOpen = false;
          this.closeAll();
          this.state.inventory = [];
          this.state.tournamentActive = true;
          this.state.tournamentBestFish = null;
          this.state.tournamentEndTime = Date.now() + 300000;
          SaveSystem.saveNow(this.state);
          this.game.events.emit('updateUI', this.state);
          return;
        }
        if (this.travelAgentConfirmOpen) {
          this.travelAgentConfirmOpen = false;
          this.state.money -= GAME_DATA.TROMSO_TICKET_PRICE;
          this.state.hasTromsoTicket = true;
          SaveSystem.save(this.state);
          this.game.events.emit('updateUI', this.state);
          this.closeAll();
          this.openDialog('Travel Agent', 'Enjoy Tromsø — the Arctic capital! Use the Ferry Captain to travel there.');
          return;
          }
          this.advanceDialog();
          }
          return;
          }
    if (this.playerTileX!==this._hTx||this.playerTileY!==this._hTy||this.facing!==this._hFacing) {
      this._hTx=this.playerTileX; this._hTy=this.playerTileY; this._hFacing=this.facing;
      this._canFish=this.isFishingSpot(); this._nearNPC=this.getNearbyNPC();
      this._nearDoor=!this._nearNPC&&this.getCabinDoor();
      this._atShop=!this.shopOpen&&this.isShopFront();
      this.fishHint.setVisible(this._canFish);
      this.interactHint.setVisible(!!(this._nearNPC||this._nearDoor)&&!this._atShop);
      this.shopFrontHint.setVisible(this._atShop);
    }
    const canFish=this._canFish, nearNPC=this._nearNPC, nearDoor=this._nearDoor, atShop=this._atShop;

    this.checkBaddieFollowInput();
    if (canFish && !this.isFishing && Phaser.Input.Keyboard.JustDown(this.fKey)) { this.startFishing(); return; }
    if (atShop   && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.shopTab=0; this.openUnifiedShop(); return; }
    if (nearNPC  && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.interact(nearNPC); return; }
    if (nearDoor && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.showCabinIdiom(); return; }
    this.checkUsaPassport();

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
            onComplete:()=>{ this.isMoving=false; this.checkWaterTransform(); this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true); if(this.onWater) this.player.setFlipY(this.facing==='up'); this.updateCompanion(); if(this.followingBaddie) this.updateBaddieFollow(this.lastPlayerTile); this.checkBushEncounter(); this.checkDragCatch('leknes'); }});
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
    // Left edge water (col 0, rows 12-20) → Kåkern right river
    if (dx === -1 && tx === 0 && (g === 'O' || g === 'D') && ty >= 12 && ty <= 20) {
      this.state.location = 'kåkern';
      SaveSystem.saveNow(this.state);
      this.scene.start('KakernScene', {spawnX: 31, spawnY: Math.max(9, Math.min(16, ty - 3)), spawnFacing: 'left'});
    }
  }
};
