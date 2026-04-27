window.KakernScene = class extends Phaser.Scene {
  constructor() { super({ key: 'KakernScene' }); }

  init(data) {
    this.state = (data && data.state) ? data.state : SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.state.location = 'kåkern';
    this.MAP = KAKERN_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    const savedHere = !data && this.state.location === 'kåkern';
    this.playerTileX = (data && data.spawnX !== undefined) ? data.spawnX : 11;
    this.playerTileY = (data && data.spawnY !== undefined) ? data.spawnY : 7;
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
    this.cabinMenuOpen = false;
    this.cabinMenuIndex = 0;
    this.duffelMenuOpen = false;
    this.duffelTabIdx = 0;
    this._duffelScrollOffset = 0;
    this._duffelObjects = [];
    this.companionSprite = null;
    this.lastPlayerTile = {tx:0, ty:0};
  }

  create() {
    this.drawMap();
    // "Ikke Musikk Cabin" label — position adjusts based on upgrade state
    const _TS = GAME_DATA.TILE_SIZE;
    const upgraded = this.state && this.state.hasBadderCabin;
    const _cabinLabelTy = upgraded ? 20 : 22;
    const _cabinLabelCX = upgraded ? 1+3.5 : 1+2.5;
    this.add.text(_cabinLabelCX*_TS, (_cabinLabelTy+2)*_TS, 'Ikke Musikk\nCabin',
      {fontSize:'10px',color:'#fbbf24',fontFamily:'monospace',align:'center',
       stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(5);
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    // If cabin has been upgraded, patch walkGrid to block the full 7×7 footprint
    // (tx:1-7, ty:20-26) — the extra rows/cols not covered by the original cabin2
    if (upgraded) {
      for (let r = 20; r <= 26; r++) {
        for (let c = 1; c <= 7; c++) {
          if (this.walkGrid[r]) this.walkGrid[r][c] = false;
        }
      }
    }
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;
    const _spawnTile = this.MAP.ground?.[this.playerTileY]?.[this.playerTileX];
    const _spawnWater = _spawnTile === 'O' || _spawnTile === 'D';
    if (_spawnWater ? !this.state.hasBoat : !this.walkGrid[this.playerTileY]?.[this.playerTileX]) { this.playerTileX = 10; this.playerTileY = 7; }
    const fz = this.MAP.objects.find(o=>o.type==='ferry-zone');    this.ferryTile = fz ? {tx:fz.tx+1, ty:fz.ty+2} : null;
    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.applyInitialWaterState();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.spawnCompanion();
    this.createNPCs();
    this.spawnAnimals();
    this.restoreFollower();
    this.updateAnimalVisibility();

    this.fishHint    = this.add.text(400, 612, 'Press F to fish', {fontSize:'14px',color:'#fbbf24',stroke:'#000000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.interactHint= this.add.text(400, 592, 'Press SPACE to interact', {fontSize:'13px',color:'#94a3b8',stroke:'#000000',strokeThickness:2}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText     = this.add.text(400, 572, '', {fontSize:'14px',color:'#ffffff',stroke:'#000000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locationLabel= this.add.text(400, -50, 'Kåkern (Home)', {fontSize:'18px',color:'#ffffff',stroke:'#000000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

    // Animal reveal popup
    this.animalRevealBg    = this.add.rectangle(400,320,500,390,0x0f172a,0.98).setStrokeStyle(2,0xf59e0b).setDepth(60).setVisible(false).setScrollFactor(0);
    this.animalRevealImg   = this.add.image(400,250,'animal-icon1').setScale(5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealName  = this.add.text(400,370,'',{fontSize:'20px',color:'#f59e0b',fontFamily:'monospace'}).setOrigin(0.5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealStatus= this.add.text(400,400,'',{fontSize:'13px',color:'#94a3b8',fontFamily:'monospace'}).setOrigin(0.5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealHint  = this.add.text(400,440,'',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5).setDepth(61).setVisible(false).setScrollFactor(0);
    this.animalRevealOpen  = false;
    this.animalRevealAnimal = null;

    // Animal action menu (follow / info)
    this.animalActionOpen  = false;
    this.animalActionAnimal = null;
    this.animalActionIdx   = 0;
    this.followingAnimal   = null;  // sprite entry currently following player
    const aaBg = this.add.rectangle(0, 0, 420, 110, 0x0f172a, 0.97).setStrokeStyle(2, 0x60a5fa);
    this.aaTitle  = this.add.text(0, -38, '', {fontSize:'14px', color:'#60a5fa', fontFamily:'monospace'}).setOrigin(0.5);
    this.aaOpts   = [
      this.add.text(0, -10, '', {fontSize:'14px', color:'#ffffff', fontFamily:'monospace'}).setOrigin(0.5),
      this.add.text(0,  16, '', {fontSize:'14px', color:'#ffffff', fontFamily:'monospace'}).setOrigin(0.5),
    ];
    this.aaCursor = this.add.text(0, 0, '▶', {fontSize:'12px', color:'#60a5fa', fontFamily:'monospace'}).setOrigin(0.5);
    this.aaHint   = this.add.text(0, 40, 'ENTER confirm  ESC cancel', {fontSize:'11px', color:'#475569', fontFamily:'monospace'}).setOrigin(0.5);
    this.aaLayer  = this.add.container(400, 510).setDepth(62).setVisible(false).setScrollFactor(0);
    this.aaLayer.add([aaBg, this.aaTitle, ...this.aaOpts, this.aaCursor, this.aaHint]);

    // Travel menu
    const travelBg    = this.add.rectangle(0,0,400,340,0x0f172a,0.97).setStrokeStyle(2,0x4ade80);
    this.travelTitle  = this.add.text(0,-140,'Travel To...',{fontSize:'22px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelDests  = ['Leknes','Reine','Kvalvika','Henningsvær'];
    this.travelTexts  = this.travelDests.map((d,i)=>{ const t=this.add.text(0,-80+i*50,d,{fontSize:'18px',color:'#ffffff',fontFamily:'monospace'}).setOrigin(0.5); t.setInteractive({useHandCursor:true}).on('pointerdown',()=>{ if(!this.travelMenuOpen) return; this.travelIndex=i; this.updateTravelCursor(); this.executeTravel(d); }); return t; });
    this.travelCursor = this.add.text(0,0,'>',{fontSize:'16px',color:'#4ade80'});
    this.travelHint   = this.add.text(0,140,'Tap or ENTER to travel  ·  ESC cancel',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.travelLayer  = this.add.container(400,320).setDepth(51).setVisible(false).setScrollFactor(0);
    this.travelLayer.add([travelBg,this.travelTitle,...this.travelTexts,this.travelCursor,this.travelHint]);
    this.travelIndex  = 0;
    this.travelMenuOpen = false;

    // Cabin Manager menu
    const cmBg    = this.add.rectangle(0,0,480,360,0x0f172a,0.97).setStrokeStyle(2,0xfbbf24);
    const cmTitle = this.add.text(0,-155,'🏠  Kåkern Cabins',{fontSize:'20px',color:'#fbbf24',fontFamily:'monospace'}).setOrigin(0.5);
    const cmSub   = this.add.text(0,-127,'Each cabin earns 5,000 kr per fish caught',{fontSize:'12px',color:'#94a3b8',fontFamily:'monospace'}).setOrigin(0.5);
    this.cmItemTexts = window.RENTAL_CABINS.map((cab,i) => {
      const label     = this.add.text(-200, -80+i*55, cab.name, {fontSize:'16px',color:'#ffffff',fontFamily:'monospace'});
      const statusTxt = this.add.text(-200, -62+i*55, '', {fontSize:'13px',color:'#4ade80',fontFamily:'monospace'});
      return { label, statusTxt };
    });
    // Cash Out row
    this.cmCashOutLabel  = this.add.text(-200, 100, '💰 Cash Out', {fontSize:'16px',color:'#4ade80',fontFamily:'monospace'});
    this.cmCashOutAmount = this.add.text(-200, 118, '0 kr pending', {fontSize:'13px',color:'#94a3b8',fontFamily:'monospace'});
    this.cmCursor   = this.add.text(0,0,'>',{fontSize:'16px',color:'#fbbf24'});
    this.cmStatusTxt= this.add.text(0,148,'',{fontSize:'12px',color:'#fbbf24',fontFamily:'monospace'}).setOrigin(0.5);
    const cmHint    = this.add.text(0,168,'ENTER buy/cash out   ESC close',{fontSize:'12px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.cmLayer    = this.add.container(400,300).setDepth(53).setVisible(false).setScrollFactor(0);
    const allCmItems = [cmBg, cmTitle, cmSub, this.cmCursor, this.cmStatusTxt, cmHint, this.cmCashOutLabel, this.cmCashOutAmount];
    this.cmItemTexts.forEach(it => allCmItems.push(it.label, it.statusTxt));
    this.cmLayer.add(allCmItems);

    this.cursors  = this.input.keyboard.createCursorKeys();
    this.fKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.gKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.isFishing = false;

    Object.assign(this, window.BushEncounterMixin);
    Object.assign(this, window.BaddieFollowMixin);
    Object.assign(this, window.AnimalFollowMixin);
    this.initEncounter();
    this.initBaddieFollow();
    this.initAnimalFollow();
    window.checkBaddieTimers(this.state);
    Object.assign(this, window.DragCatchMixin);

    // Ensure the HUD is running — needed after scene.restart() for cabin upgrade
    if (!this.scene.isActive('UIScene')) {
      this.scene.launch('UIScene');
    } else if (this.scene.isSleeping('UIScene')) {
      this.scene.wake('UIScene');
    }
    this.game.events.emit('updateUI', this.state);

    this.game.events.off('fishingComplete');
    this.game.events.on('fishingComplete', this.onFishCaught, this);

    this.buildDialogUI();
  }

  drawMap() {
    const TS = GAME_DATA.TILE_SIZE;
    const map = this.MAP;
    const upgraded = this.state && this.state.hasBadderCabin;
    // Solid background prevents any sub-pixel dead-pixel gaps
    this.add.rectangle(0, 0, GAME_DATA.MAP_COLS*TS+2, GAME_DATA.MAP_ROWS*TS+2, 0x071524).setOrigin(0,0).setDepth(-1);
    for (let r=0; r<GAME_DATA.MAP_ROWS; r++) {
      for (let c=0; c<GAME_DATA.MAP_COLS; c++) {
        const key = GAME_DATA.GROUND_KEYS[map.ground[r][c]] || 'tile-grass';
        this.add.image(c*TS, r*TS, key).setOrigin(0,0).setScale(2).setDepth(0);
      }
    }
    for (const obj of map.objects) {
      // When upgraded: skip any tree within or immediately above the 7×7 badder cabin
      // footprint (tx:1-7, ty:18-26) — ty:18 included since a 2-tall tree there
      // has its base touching the cabin top edge at ty:20.
      if (upgraded && obj.type === 'tree2' &&
          obj.tx >= 1 && obj.tx <= 7 && obj.ty >= 18 && obj.ty <= 26) continue;
      // Also skip the original cabin2 at tx:1 ty:22
      if (upgraded && obj.type === 'cabin2' && obj.tx === 1 && obj.ty === 22) continue;
      const def = OBJECT_DEFS[obj.type];
      if (!def) continue;
      this.add.image(obj.tx*TS, obj.ty*TS, def.key)
        .setOrigin(0,0).setScale(2)
        .setDepth(1 + obj.ty*0.01);
    }
    // Render the upgraded badder cabin (7×7) — depth set above all trees in its footprint
    // (deepest tree at ty:22 has depth 1.22, so we use 1.30 to always sit on top)
    if (upgraded) {
      this.add.image(1*TS, 20*TS, 'badder-cabin')
        .setOrigin(0,0).setScale(2).setDepth(1.30);
    }
  }

  createNPCs() {
    const defs = [
      {tx:10,ty:7, key:'ow9', type:'return', name:'Ferry Captain', dialogue:''},
      {tx:17, ty:17,key:'ow2', type:'dialog', name:'Islander',      dialogue:'Welcome home! Animals you buy live here. Cross the ocean with your boat to explore the south side.'},
      {tx:25, ty:18, key:'ow5', type:'musikk', name:'Ikke Musikk Fan', dialogue:''},
      {tx:28, ty:27, key:'ow8', type:'cabin-manager', name:'Cabin Manager', dialogue:''},
    ];
    const TS = GAME_DATA.TILE_SIZE;
    this.npcs = defs.map((d,i) => {
      const sprite = this.add.sprite(d.tx*TS+TS/2, d.ty*TS+TS/2, d.key, 1).setDepth(9);
      this.tweens.add({targets:sprite, y:sprite.y-4, duration:900+i*120, yoyo:true, repeat:-1, delay:i*200});
      return {...d, sprite};
    });
    this.drawRentalCabinLabels();
  }

  drawRentalCabinLabels() {
    const TS = GAME_DATA.TILE_SIZE;
    if (this.rentalLabels) this.rentalLabels.forEach(l => l.destroy());
    this.rentalLabels = [];
    window.RENTAL_CABINS.forEach(cab => {
      const owned = this.state.ownedCabins && this.state.ownedCabins.includes(cab.id);
      const label = this.add.text((cab.tx+1.5)*TS, (cab.ty+1.5)*TS,
        owned ? 'Ikke Musikk\nRental Cabin' : '',
        {fontSize:'9px',color:'#fbbf24',fontFamily:'monospace',align:'center',stroke:'#000000',strokeThickness:3})
        .setOrigin(0.5).setDepth(5);
      this.rentalLabels.push(label);
    });
  }

  spawnAnimals() {
    const TS = GAME_DATA.TILE_SIZE;
    const owned = this.state.animals || [];
    this.animalSprites = [];
    const VALID_LAND = new Set(['G','GR','GB','GBu','GF']);
    const VALID_WATER = new Set(['O','D']);

    // Filter spawn pools to only walkable, non-cabin tiles at runtime
    const validLandPool = window.ANIMAL_LAND_SPAWNS.filter(s => {
      const tile = this.MAP.ground[s.ty]?.[s.tx];
      if (!VALID_LAND.has(tile)) return false;
      return this.walkGrid[s.ty]?.[s.tx] === true;
    });
    const validWaterPool = window.ANIMAL_WATER_SPAWNS.filter(s => {
      const tile = this.MAP.ground[s.ty]?.[s.tx];
      return VALID_WATER.has(tile);
    });

    let landIdx = 0, waterIdx = 0;
    owned.forEach(id => {
      const animalDef = window.ANIMALS.find(a => a.id === id);
      const isWater = animalDef && animalDef.terrain === 'water';
      const pool = isWater ? validWaterPool : validLandPool;
      const idx  = isWater ? waterIdx++ : landIdx++;
      const spawn = pool[idx % pool.length];
      if (!spawn) return;
      const x = spawn.tx * TS + TS/2;
      const y = spawn.ty * TS + TS/2;
      const sprite = this.add.sprite(x, y, `animal${id}`, 0).setDepth(8).setScale(0.34);
      sprite.play(`animal${id}-idle`, true);
      this.animalSprites.push({id, tx: spawn.tx, ty: spawn.ty, homeTx: spawn.tx, homeTy: spawn.ty, sprite});
    });
  }

  restoreFollower() {
    const id = this.state.followAnimalId;
    if (id == null) return;
    const entry = (this.animalSprites || []).find(a => a.id === id);
    if (entry) this.followingAnimal = entry;
  }

  updateAnimalVisibility() {
    (this.animalSprites || []).forEach(entry => {
      const def = window.ANIMALS.find(a => a.id === entry.id);
      if (!def) return;
      const isFollowing = this.followingAnimal && this.followingAnimal.id === entry.id;
      if (isFollowing) {
        // Land follower: hide on water. Water follower: hide on land.
        entry.sprite.setVisible(def.terrain === 'water' ? this.onWater : !this.onWater);
      } else {
        // Non-following animals always visible
        entry.sprite.setVisible(true);
      }
    });
  }

  openAnimalActionMenu(animal) {
    this.animalActionAnimal = animal;
    this.animalActionIdx = 0;
    const animalDef = window.ANIMALS.find(a => a.id === animal.id) || {};
    const isFollowing = this.followingAnimal && this.followingAnimal.id === animal.id;
    const isWater = animalDef.terrain === 'water';
    this.aaTitle.setText(animalDef.name || ('Animal ' + animal.id));
    if (isFollowing) {
      this.aaOpts[0].setText('Stop following');
      this.aaOpts[1].setText('Show info');
      this.aaOpts[1].setColor('#ffffff');
    } else {
      const followLabel = isWater ? 'Follow me (boat)' : 'Follow me';
      this.aaOpts[0].setText(this.followingAnimal ? followLabel + ' (replaces current)' : followLabel);
      this.aaOpts[1].setText('Show info');
      this.aaOpts[1].setColor('#ffffff');
    }
    this.updateAnimalActionCursor();
    this.animalActionOpen = true;
    this.aaLayer.setVisible(true);
  }

  updateAnimalActionCursor() {
    const opt = this.aaOpts[this.animalActionIdx];
    this.aaCursor.setPosition(opt.x - opt.width/2 - 14, opt.y);
  }

  confirmAnimalAction() {
    const animal = this.animalActionAnimal;
    const animalDef = window.ANIMALS.find(a => a.id === animal.id) || {};
    const isFollowing = this.followingAnimal && this.followingAnimal.id === animal.id;
    const TS = GAME_DATA.TILE_SIZE;

    if (isFollowing) {
      if (this.animalActionIdx === 0) {
        // Stop following
        this.followingAnimal = null;
        this.state.followAnimalId = null;
        SaveSystem.save(this.state);
        this.closeAnimalActionMenu();
        this.showMsg(animalDef.name + ' will stay here.', 2000);
      } else {
        this.closeAnimalActionMenu(); this.showAnimalReveal(animal.id);
      }
    } else {
      if (this.animalActionIdx === 0) {
        // Start following
        this.followingAnimal = animal;
        this.state.followAnimalId = animal.id;
        SaveSystem.save(this.state);
        this.closeAnimalActionMenu();
        this.showMsg(animalDef.name + ' is now following you!', 2000);
      } else {
        this.closeAnimalActionMenu(); this.showAnimalReveal(animal.id);
      }
    }
  }

  closeAnimalActionMenu() {
    this.animalActionOpen = false;
    this.animalActionAnimal = null;
    this.aaLayer.setVisible(false);
  }

  getNearbyAnimal() {
    const dirMap = {right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [dx,dy] = dirMap[this.facing] || [0,1];
    const tx = this.playerTileX + dx, ty = this.playerTileY + dy;
    return (this.animalSprites || []).find(a => a.tx === tx && a.ty === ty) || null;
  }

  showAnimalReveal(animalEntry) {
    const id  = animalEntry ? animalEntry.id : animalEntry;
    const def = window.ANIMALS.find(a => a.id === id) || {};
    const isWater    = def.terrain === 'water';
    const isFollowing = this.followingAnimal && this.followingAnimal.id === id;
    this.animalRevealAnimal = animalEntry;
    this.animalRevealImg.setTexture('animal-icon' + id);
    this.animalRevealName.setText(def.name || ('Animal ' + id));
    this.animalRevealStatus.setText(
      isFollowing ? '✓ Currently following you' :
      isWater     ? '🌊 Water animal (follows your boat)' : 'Not following'
    ).setColor(isFollowing ? '#4ade80' : '#94a3b8');
    this.animalRevealHint.setText(
      isFollowing ? 'ENTER to stop following  ·  ESC to close' :
                    'ENTER to follow  ·  ESC to close'
    );
    [this.animalRevealBg, this.animalRevealImg, this.animalRevealName,
     this.animalRevealStatus, this.animalRevealHint].forEach(e => e.setVisible(true));
    this.animalRevealOpen = true;
  }

  closeAnimalReveal() {
    [this.animalRevealBg, this.animalRevealImg, this.animalRevealName,
     this.animalRevealStatus, this.animalRevealHint].forEach(e => e.setVisible(false));
    this.animalRevealOpen  = false;
    this.animalRevealAnimal = null;
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
    if (this.npcs && this.npcs.some(n => n.tx === col && n.ty === row)) return false;
    // Check animals before water — water animals should block the boat too
    if (this.animalSprites && this.animalSprites.some(a => {
      if (this.followingAnimal && a.id === this.followingAnimal.id) return false;
      return a.tx === col && a.ty === row;
    })) return false;
    if (g==='O'||g==='D') return this.state.hasBoat;
    return this.walkGrid[row][col];
  }

  checkWaterTransform() {
    this.player.setFlipY(false);
    this.updateAnimalVisibility();
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

  applyInitialWaterState() {
    const g = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    this.onWater = (g === 'O' || g === 'D');
    if (this.onWater) {
      this.player.setTexture('boat').setScale(0.5);
    } else {
      this.player.setTexture(this.charKey).setScale(1);
    }
    this.updateAnimalVisibility();
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
    this.scene.launch('FishingScene', {location:'kåkern', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'KakernScene'});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (!result.caught) {
      if (result.fish) { window.addFishAuraMiss(this.state, result.fish, false); this.game.events.emit('updateUI', this.state); }
      return;
    }
    const _xpMult = getXPBonus(this.state.companion, 'kåkern');
    const _xpFinal = Math.round(result.xp * _xpMult);
    const leveled = addXP(this.state, _xpFinal);
    this.state.totalFishCaught = (this.state.totalFishCaught || 0) + 1;
    if (this.state.totalFishCaught === 1000 && window.checkAndAwardBadge(this.state, 'fish-1000', '1000 Fish')) this.showMsg('🏆 BADGE UNLOCKED: 1000 Fish Caught!');
    window.updateTop10(this.state, result.fish, 'Kåkern');
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
    } else if (npc.type === 'return') {
      if (!this.state.hasFerryPass) { this.openDialog('Ferry Captain', "You'll need a ferry pass to travel the islands."); }
      else { this.openTravelMenu(); }
    } else if (npc.type === 'cabin-manager') {
      this.openCabinMenu();
    } else {
      const _g = GAME_DATA.OW_GENDER?.[npc.key];
      this.openDialog((_g==='male'?'👨 ':_g==='female'?'👩 ':'')+npc.name, npc.dialogue);
    }
  }

  openCabinMenu() {
    this.cabinMenuOpen = true;
    this.cabinMenuIndex = 0;
    this.cmStatusTxt.setText('');
    this.updateCabinMenuDisplay();
    this.cmLayer.setVisible(true);
  }

  updateCabinMenuDisplay() {
    const owned = this.state.ownedCabins || [];
    const cashOutIndex = window.RENTAL_CABINS.length;
    window.RENTAL_CABINS.forEach((cab, i) => {
      const isOwned = owned.includes(cab.id);
      this.cmItemTexts[i].label.setColor(i === this.cabinMenuIndex ? '#fef08a' : '#ffffff');
      this.cmItemTexts[i].statusTxt.setText(isOwned ? '✓ Owned' : '500,000 kr');
      this.cmItemTexts[i].statusTxt.setColor(isOwned ? '#4ade80' : '#94a3b8');
    });
    // Cash Out row
    const pending = window.computeCabinEarnings(this.state);
    const isCashOutSelected = this.cabinMenuIndex === cashOutIndex;
    this.cmCashOutLabel.setColor(isCashOutSelected ? '#fef08a' : '#4ade80');
    this.cmCashOutAmount.setText(pending > 0 ? pending.toLocaleString() + ' kr pending' : 'Nothing to collect');
    this.cmCashOutAmount.setColor(pending > 0 ? '#fbbf24' : '#64748b');
    // Move cursor
    if (isCashOutSelected) {
      this.cmCursor.setPosition(this.cmCashOutLabel.x - 22, this.cmCashOutLabel.y + 2);
    } else {
      const sel = this.cmItemTexts[this.cabinMenuIndex];
      this.cmCursor.setPosition(sel.label.x - 22, sel.label.y + 2);
    }
  }

  executeCabinPurchase() {
    const cashOutIndex = window.RENTAL_CABINS.length;
    if (this.cabinMenuIndex === cashOutIndex) { this.executeCashOut(); return; }
    const cab = window.RENTAL_CABINS[this.cabinMenuIndex];
    const owned = this.state.ownedCabins || [];
    if (owned.includes(cab.id)) {
      this.cmStatusTxt.setText('You already own this cabin!'); return;
    }
    if (this.state.money < window.CABIN_PRICE) {
      this.cmStatusTxt.setText('Not enough kr! Need 500,000.'); return;
    }
    this.state.money -= window.CABIN_PRICE;
    this.state.ownedCabins = [...owned, cab.id];
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    if ((this.state.ownedCabins || []).length >= 3) {
      if (window.checkAndAwardBadge(this.state, 'three-cabins', '3 Rental Cabins')) {
        this.showMsg('🏆 BADGE UNLOCKED: 3 Rental Cabins! 🏠');
      }
    }
    this.drawRentalCabinLabels();
    this.cmStatusTxt.setText('🏠 ' + cab.name + ' is now your rental cabin!');
    this.updateCabinMenuDisplay();
  }

  executeCashOut() {
    const pending = this.state.cabinEarnings || 0;
    if (pending === 0) {
      this.cmStatusTxt.setText('Nothing to collect — go catch some fish!'); return;
    }
    this.state.money = (this.state.money || 0) + pending;
    this.state.cabinEarnings = 0;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this.cmStatusTxt.setText('💰 Collected ' + pending.toLocaleString() + ' kr!');
    this.updateCabinMenuDisplay();
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
    const sceneMap = {'Leknes':'LeknesScene','Reine':'ReineScene','Kvalvika':'KvalvikaScene','Henningsvær':'HenningsvaarScene'};
    const locMap   = {'Leknes':'leknes','Reine':'reine','Kvalvika':'kvalvika','Henningsvær':'henningsvær'};
    const spawnMap = {
    'Leknes': {x:12, y:18},
    'Reine': {x:8, y:14},
    'Kvalvika': {x:16, y:17},
    'Henningsvær': {x:15, y:23}
  };
    const spawn = spawnMap[dest] || {x:12, y:13};
    this.state.location = locMap[dest] || dest.toLowerCase();
    this.state.x = spawn.x;
    this.state.y = spawn.y;
    this.state.followAnimalId = null; // animals stay in Kåkern
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
    this.cabinMenuOpen = false;
    this.closeDuffelMenu();
    if (this.diagLayer)  this.diagLayer.setVisible(false);
    if (this.travelLayer) this.travelLayer.setVisible(false);
    if (this.cmLayer) this.cmLayer.setVisible(false);
  }

  openDuffelMenu() {
    this.duffelMenuOpen = true;
    this.duffelTabIdx = 0;
    this._duffelScrollOffset = 0;
    this._renderDuffelMenu();
  }

  _renderDuffelMenu() {
    // Destroy previous
    this._duffelObjects.forEach(o => o.destroy());
    this._duffelObjects = [];

    const cx = 400, cy = 320, W = 660, H = 440;
    const tabs = ['🎒 Duffel Bag', '💃 Baddies', '⚔ Haters', '🏠 Upgrade'];
    const tabColors = ['#fbbf24', '#f472b6', '#ef4444', '#4ade80'];

    const bg = this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.98)
      .setStrokeStyle(2, 0xfbbf24).setDepth(55).setScrollFactor(0);
    this._duffelObjects.push(bg);

    const title = this.add.text(cx, cy - H/2 + 18, 'Ikke Musikk Cabin', {
      fontSize: '16px', color: '#fbbf24', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
    this._duffelObjects.push(title);

    // Tab headers — 4 equal slots, text centered in each slot
    const slotW = W / tabs.length;
    tabs.forEach((tab, i) => {
      const tx = cx - W/2 + slotW/2 + i * slotW;
      const isActive = i === this.duffelTabIdx;
      const tabTxt = this.add.text(tx, cy - H/2 + 42, tab, {
        fontSize: '11px', color: isActive ? tabColors[i] : '#64748b', fontFamily: 'monospace',
        stroke: isActive ? '#000' : undefined, strokeThickness: isActive ? 2 : 0
      }).setOrigin(0.5, 0).setDepth(56).setScrollFactor(0);
      this._duffelObjects.push(tabTxt);
      if (isActive) {
        const underline = this.add.rectangle(tx, cy - H/2 + 62, slotW - 10, 2, 0xfbbf24)
          .setDepth(56).setScrollFactor(0);
        this._duffelObjects.push(underline);
      }
    });

    // Divider
    const div = this.add.rectangle(cx, cy - H/2 + 72, W - 20, 1, 0x334155).setDepth(56).setScrollFactor(0);
    this._duffelObjects.push(div);

    const contentY = cy - H/2 + 90;
    const lineH = 22;

    if (this.duffelTabIdx === 0) {
      // Items tab
      const items = this.state.playerItems || [];
      if (items.length === 0) {
        const empty = this.add.text(cx, contentY + 60, 'No items yet. Find them in the bushes!', {
          fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
        this._duffelObjects.push(empty);
      } else {
        const visibleRows = Math.floor((H - 110) / lineH); // how many fit
        const maxScroll = Math.max(0, items.length - visibleRows);
        this._duffelScrollOffset = Math.max(0, Math.min(this._duffelScrollOffset, maxScroll));
        const visibleItems = items.slice(this._duffelScrollOffset, this._duffelScrollOffset + visibleRows);
        visibleItems.forEach((item, i) => {
          const y = contentY + i * lineH;
          const t = this.add.text(cx - W/2 + 20, y, `• ${item}`, {
            fontSize: '12px', color: '#e2e8f0', fontFamily: 'monospace'
          }).setDepth(56).setScrollFactor(0);
          this._duffelObjects.push(t);
        });
        // Scroll indicator
        const scrollHint = (maxScroll > 0)
          ? `${items.length} items  ↑↓ scroll (${this._duffelScrollOffset + 1}-${Math.min(this._duffelScrollOffset + visibleRows, items.length)} of ${items.length})`
          : `${items.length} item${items.length !== 1 ? 's' : ''} in bag`;
        const countTxt = this.add.text(cx, cy + H/2 - 24, scrollHint, {
          fontSize: '11px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
        this._duffelObjects.push(countTxt);
      }
    } else if (this.duffelTabIdx === 1) {
      // Baddies tab
      const baddies = [...(this.state.baddiesCaught || [])].sort((a, b) => b.level - a.level);
      if (baddies.length === 0) {
        const empty = this.add.text(cx, contentY + 60, 'No baddies caught yet!', {
          fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
        this._duffelObjects.push(empty);
      } else {
        const _followName = this.state.followingBaddieName;
        baddies.forEach((b, i) => {
          const y = contentY + i * lineH;
          const rankColor = i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#cbd5e1';
          const isFollowing = _followName === b.name;
          const expires = b.expiresAt ? Math.max(0, Math.round((b.expiresAt - Date.now()) / 3600000)) + 'h' : '?';
          const flag = (window.BADDIE_FLAGS && window.BADDIE_FLAGS[b.name]) || '🌍';
          const label = `#${i+1}  ${flag} ${b.name || 'Baddie'}  (Lv ${b.level})${isFollowing ? ' 💅' : ''}  ⏱${expires}`;
          const t = this.add.text(cx - W/2 + 20, y, label, {
            fontSize: '12px', color: rankColor, fontFamily: 'monospace'
          }).setDepth(56).setScrollFactor(0);
          this._duffelObjects.push(t);
        });
        const hint = this.add.text(cx, cy + H/2 - 28, _followName ? 'ENTER to send #1 home' : 'ENTER to take #1 with you', {
          fontSize: '11px', color: '#f472b6', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
        this._duffelObjects.push(hint);
      }
    } else if (this.duffelTabIdx === 2) {
      // Haters tab
      const haters = [...(this.state.hatersDefeated || [])].sort((a, b) => b.level - a.level);
      if (haters.length === 0) {
        const empty = this.add.text(cx, contentY + 60, 'No haters defeated yet!', {
          fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
        this._duffelObjects.push(empty);
      } else {
        haters.forEach((h, i) => {
          const y = contentY + i * lineH;
          const rankColor = i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#cbd5e1';
          const muscle = h.level > 50 ? '💪💪💪' : h.level > 25 ? '💪💪' : '💪';
          const t = this.add.text(cx - W/2 + 20, y, `#${i+1}  Hater  (Lv ${h.level})`, {
            fontSize: '12px', color: rankColor, fontFamily: 'monospace'
          }).setDepth(56).setScrollFactor(0);
          this._duffelObjects.push(t);
        });
      }
    } else {
      // Upgrade tab
      const alreadyUpgraded = this.state.hasBadderCabin;
      if (alreadyUpgraded) {
        this._duffelObjects.push(
          this.add.text(cx, contentY + 30, '🏠 Cabin upgraded!', {
            fontSize: '16px', color: '#4ade80', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0),
          this.add.text(cx, contentY + 62, 'Your 7×7 Badder Cabin is active.', {
            fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0),
          this.add.text(cx, contentY + 88, '⚡ Haters & Baddies now reach Level 12', {
            fontSize: '11px', color: '#fbbf24', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0)
        );
      } else {
        const canAfford = (this.state.money || 0) >= 1000000;
        this._duffelObjects.push(
          this.add.text(cx, contentY + 20, '🏠 Cabin Upgrade', {
            fontSize: '16px', color: '#4ade80', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0),
          this.add.text(cx, contentY + 50, 'Upgrade your 5×5 cabin to a legendary 7×7\nBadder Cabin. Expands up and to the right.', {
            fontSize: '12px', color: '#cbd5e1', fontFamily: 'monospace', align: 'center'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0),
          this.add.text(cx, contentY + 85, '+50 Aura  •  +100,000 XP  •  Encounters up to Lv 12', {
            fontSize: '11px', color: '#fbbf24', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0),
          this.add.text(cx, contentY + 110, 'Cost: 1,000,000 NOK', {
            fontSize: '14px', color: canAfford ? '#fbbf24' : '#ef4444', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0),
          this.add.text(cx, contentY + 138,
            canAfford ? '▶  Press ENTER to upgrade!' : `You need ${(1000000 - this.state.money).toLocaleString()} more NOK`, {
            fontSize: '12px', color: canAfford ? '#4ade80' : '#64748b', fontFamily: 'monospace'
          }).setOrigin(0.5).setDepth(56).setScrollFactor(0)
        );
      }
    }

    // Footer hint
    const hint = this.add.text(cx, cy + H/2 - 10, '◀ ▶ Switch tabs   ESC to close', {
      fontSize: '11px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(56).setScrollFactor(0);
    this._duffelObjects.push(hint);
  }

  closeDuffelMenu() {
    if (this._duffelObjects) {
      this._duffelObjects.forEach(o => o.destroy());
      this._duffelObjects = [];
    }
    this.duffelMenuOpen = false;
  }

  getCabinDoor() {
    // Upgraded badder-cabin (7×7 at tx:1, ty:20): door entry row is ty:27,
    // accessible from tx:2 through tx:5 (front face, same row as original)
    if (this.state && this.state.hasBadderCabin) {
      if (this.playerTileY === 27 && this.playerTileX >= 2 && this.playerTileX <= 5) {
        // Return a fake object that triggers the duffel bag (same check as cabin2 at tx:1)
        return { type: 'cabin2', tx: 1, ty: 22 };
      }
    }
    for (const obj of this.MAP.objects) {
      if (obj.type==='cabin1'||obj.type==='cabin2'||obj.type==='shop') {
        if (this.playerTileX===obj.tx+1 && this.playerTileY===obj.ty+5) return obj;
      }
    }
    return null;
  }

  showCabinIdiom() {
    const door = this.getCabinDoor();
    // cabin2 at tx:1 is the Ikke Musikk home cabin → open Duffel Bag menu
    if (door && door.type === 'cabin2' && door.tx === 1) {
      this.openDuffelMenu();
      return;
    }
    // All other cabins: show Norwegian wisdom
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
      if (this.animalRevealOpen) { this.closeAnimalReveal(); return; }
      if (this.animalActionOpen) { this.closeAnimalActionMenu(); return; }
      if (this.dialogOpen || this.travelMenuOpen || this.cabinMenuOpen || this.duffelMenuOpen) { this.closeAll(); return; }
    }

    if (this.duffelMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.escKey)) { this.closeDuffelMenu(); return; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
        this.duffelTabIdx = (this.duffelTabIdx - 1 + 4) % 4;
        this._duffelScrollOffset = 0;
        this._renderDuffelMenu();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
        this.duffelTabIdx = (this.duffelTabIdx + 1) % 4;
        this._duffelScrollOffset = 0;
        this._renderDuffelMenu();
        return;
      }
      if (this.duffelTabIdx === 0) {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
          this._duffelScrollOffset = Math.max(0, this._duffelScrollOffset - 1);
          this._renderDuffelMenu();
          return;
        }
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
          this._duffelScrollOffset++;
          this._renderDuffelMenu();
          return;
        }
      }
      // Baddies tab: ENTER/SPACE to take/send home top baddie
      const _dOK = Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey);
      if (this.duffelTabIdx === 1 && _dOK) {
        const _sortedB = [...(this.state.baddiesCaught || [])].sort((a, b) => b.level - a.level);
        const _top = _sortedB[0];
        if (_top) {
          if (this.state.followingBaddieName === _top.name) {
            if (this.followingBaddie) { this.followingBaddie.sprite.destroy(); this.followingBaddie = null; }
            this.state.followingBaddieName = null;
            SaveSystem.save(this.state);
            this.showMsg('💅 ' + _top.name + ' went home.');
          } else {
            if ((this.state.money || 0) < 1000) {
              this.showMsg('💸 Need 1,000 NOK to take her out!');
              this.closeDuffelMenu();
              return;
            }
            this.state.money -= 1000;
            // Silent aura adjustment
            if (_top.level >= 6) {
              this.state.aura = Math.min(100, (this.state.aura || 0) + 10);
            } else {
              this.state.aura = Math.max(-100, (this.state.aura || 0) - 10);
            }
            if (this.followingBaddie) { this.followingBaddie.sprite.destroy(); this.followingBaddie = null; }
            this.state.followingBaddieName = _top.name;
            const TS = GAME_DATA.TILE_SIZE;
            const _bsx = Math.min(this.playerTileX + 1, GAME_DATA.MAP_COLS - 1);
            const _sprite = this.add.sprite(_bsx*TS+TS/2, this.playerTileY*TS+TS/2, _top.sprite||'ow2', 1).setDepth(8).setScale(0.9);
            const _wk = (_top.sprite||'ow2') + '-idle-down';
            if (this.anims.exists(_wk)) _sprite.play(_wk, true);
            this.followingBaddie = { name: _top.name, tx: _bsx, ty: this.playerTileY, sprite: _sprite, spriteKey: _top.sprite||'ow2' };
            SaveSystem.save(this.state);
            this.showMsg('💅 ' + _top.name + ' is following you! Press G (desktop) or B (mobile) to send home.');
          }
        }
        this.closeDuffelMenu();
        return;
      }
      // Upgrade tab: ENTER/SPACE to confirm purchase
      if (this.duffelTabIdx === 3 && _dOK) {
        if (!this.state.hasBadderCabin && (this.state.money || 0) >= 1000000) {
          this.state.money -= 1000000;
          this.state.hasBadderCabin = true;
          // Bonus rewards
          this.state.aura = Math.min(100, (this.state.aura || 0) + 50);
          const leveled = addXP(this.state, 100000);
          if (leveled) this.game.events.emit('levelUp', this.state.level);
          window.checkAndAwardBadge(this.state, 'upgraded-cabin', 'Upgraded Cabin');
          // Badge msg won't show — scene restarts immediately below; badge is saved above
          SaveSystem.saveNow(this.state);
          this.game.events.emit('updateUI', this.state);
          this.closeDuffelMenu();
          // Restart scene — pass state directly so hasBadderCabin is guaranteed available
          this.scene.restart({ spawnX: this.playerTileX, spawnY: this.playerTileY, state: this.state });
        }
        return;
      }
      return;
    }

    if (this.animalActionOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.animalActionIdx=(this.animalActionIdx-1+2)%2; this.updateAnimalActionCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.animalActionIdx=(this.animalActionIdx+1)%2; this.updateAnimalActionCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)||Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.confirmAnimalAction();
      return;
    }

    // Animal reveal popup — ENTER = follow/stop, ESC = close
    if (this.animalRevealOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
        const animal = this.animalRevealAnimal;
        const def = animal ? (window.ANIMALS.find(a => a.id === animal.id) || {}) : {};
        if (animal) {
          const isFollowing = this.followingAnimal && this.followingAnimal.id === animal.id;
          if (isFollowing) {
            this.followingAnimal = null;
            this.state.followAnimalId = null;
            SaveSystem.save(this.state);
            this.closeAnimalReveal();
            this.showMsg((def.name||'Animal') + ' is staying here.', 2200);
          } else {
            this.followingAnimal = animal;
            this.state.followAnimalId = animal.id;
            SaveSystem.save(this.state);
            this.closeAnimalReveal();
            const hint = def.terrain === 'water' ? 'follows your boat! Press G (desktop) or B (mobile) to send home.' : 'is following you! Press G (desktop) or B (mobile) to send home.';
            this.showMsg((def.name||'Animal') + ' ' + hint, 3000);
          }
        } else {
          this.closeAnimalReveal();
        }
      }
      return;
    }

    if (this.travelMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.travelIndex=(this.travelIndex-1+this.travelDests.length)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.travelIndex=(this.travelIndex+1)%this.travelDests.length; this.updateTravelCursor(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) this.executeTravel(this.travelDests[this.travelIndex]);
      return;
    }

    if (this.cabinMenuOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.cabinMenuIndex=(this.cabinMenuIndex-1+window.RENTAL_CABINS.length+1)%(window.RENTAL_CABINS.length+1); this.updateCabinMenuDisplay(); }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.cabinMenuIndex=(this.cabinMenuIndex+1)%(window.RENTAL_CABINS.length+1); this.updateCabinMenuDisplay(); }
      if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this.executeCabinPurchase();
      return;
    }

    if (this.dialogOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)||Phaser.Input.Keyboard.JustDown(this.enterKey)) this.closeAll();
      return;
    }

    if (this.playerTileX!==this._hTx||this.playerTileY!==this._hTy||this.facing!==this._hFacing) {
      this._hTx=this.playerTileX; this._hTy=this.playerTileY; this._hFacing=this.facing;
      this._canFish=this.isFishingSpot(); this._nearNPC=this.getNearbyNPC();
      this._nearAnimal=this.getNearbyAnimal(); this._nearDoor=!this._nearNPC&&this.getCabinDoor();
      this.fishHint.setVisible(this._canFish);
      this.interactHint.setVisible(!!(this._nearNPC||this._nearAnimal||this._nearDoor));
    }
    const canFish=this._canFish, nearNPC=this._nearNPC, nearAnimal=this._nearAnimal, nearDoor=this._nearDoor;

    this.checkBaddieFollowInput();
    this.checkAnimalFollowInput();

    if (canFish && !this.isFishing && Phaser.Input.Keyboard.JustDown(this.fKey)) { this.startFishing(); return; }
    if (nearNPC  && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.interact(nearNPC); return; }
    if (nearDoor && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.showCabinIdiom(); return; }
    if (nearAnimal && Phaser.Input.Keyboard.JustDown(this.spaceKey)) { this.showAnimalReveal(nearAnimal); return; }

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
            onComplete:()=>{
              this.isMoving=false; this.checkWaterTransform();
              this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true);
              if(this.onWater) this.player.setFlipY(this.facing==='up');
              this.updateCompanion();
              // Following animal: land follows on land, water follows on water (boat)
              if (this.followingAnimal) {
                const fa = this.followingAnimal;
                const faDef = window.ANIMALS.find(a => a.id === fa.id);
                const faWater = faDef && faDef.terrain === 'water';
                if (faWater ? this.onWater : !this.onWater) {
                  const prev = this.lastPlayerTile;
                  fa.tx = prev.tx; fa.ty = prev.ty;
                  this.tweens.add({targets:fa.sprite, x:prev.tx*TS+TS/2, y:prev.ty*TS+TS/2, duration:180});
                }
              }
              if (this.followingBaddie) this.updateBaddieFollow(this.lastPlayerTile);
              this.checkBushEncounter();
              this.checkDragCatch('kakern');
            }});
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
    // Right edge water (col 31, rows 9-16) → Leknes left river
    if (dx === 1 && tx === 31 && (g === 'O' || g === 'D') && ty >= 9 && ty <= 16) {
      this.state.location = 'leknes';
      this.state.followAnimalId = null;
      SaveSystem.saveNow(this.state);
      this.scene.start('LeknesScene', {spawnX: 1, spawnY: Math.max(12, Math.min(20, ty + 3)), spawnFacing: 'right'});
    }
    // Top edge (row 0, cols 0-7) → Kvalvika bottom center (secret mountain pass)
    else if (dy === -1 && ty === 0 && tx >= 0 && tx <= 7) {
      this.state.location = 'kvalvika';
      this.state.followAnimalId = null;
      SaveSystem.saveNow(this.state);
      this.scene.start('KvalvikaScene', {spawnX: 15, spawnY: 30, spawnFacing: 'up'});
    }
    // Left edge water (col 0, rows 9-16) → Reine right deep water
    else if (dx === -1 && tx === 0 && (g === 'O' || g === 'D') && ty >= 9 && ty <= 16) {
      this.state.location = 'reine';
      this.state.followAnimalId = null;
      SaveSystem.saveNow(this.state);
      this.scene.start('ReineScene', {spawnX: 31, spawnY: 20, spawnFacing: 'left'});
    }
    // Lower-right corner → Henningsvær top middle (right edge excludes rows 29-30)
    else if ((dx === 1 && tx === 31 && ty >= 21 && ty !== 29 && ty !== 30) || (dy === 1 && ty === 31 && tx >= 21)) {
      this.state.location = 'henningsvær';
      this.state.followAnimalId = null;
      SaveSystem.saveNow(this.state);
      this.scene.start('HenningsvaarScene', {spawnX: 15, spawnY: 1, spawnFacing: dx===1 ? 'right' : 'down'});
    }
  }
};
