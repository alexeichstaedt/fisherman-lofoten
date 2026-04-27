window.TournamentScene = class extends Phaser.Scene {
  constructor() { super({ key: 'TournamentScene' }); }

  init() {
    this.state = SaveSystem.load();
    this.charKey = this.state.characterKey === 'player' ? 'ikke-musikk' : (this.state.characterKey || 'ikke-musikk');
    this.MAP = TOURNAMENT_MAP_DATA;
    this.walkGrid = null;
    this.waterGrid = null;
    this.playerTileX = 15;
    this.playerTileY = 15;
    this.player = null;
    this.cursors = null;
    this.fKey = null;
    this.spaceKey = null;
    this.isFishing = false;
    this.isMoving = false;
    this.moveCooldown = 0;
    this.facing = 'down';
    this.onWater = false;
    this.bestFish = null;         // heaviest single catch this tournament
    this.tournamentActive = false;
    this.timeLeft = 300;          // 5 minutes in seconds
    this.resultOpen = false;
  }

  create() {
    this.drawMap();
    const grids = buildMapGrids(this.MAP);
    this.walkGrid = grids.walkGrid;
    this.waterGrid = grids.waterGrid;

    this.player = this.add.sprite(0, 0, this.charKey, 1).setDepth(10);
    this.updatePlayerPos();
    this.cameras.main.setBounds(0, 0, GAME_DATA.MAP_COLS * GAME_DATA.TILE_SIZE, GAME_DATA.MAP_ROWS * GAME_DATA.TILE_SIZE);
    this.cameras.main.startFollow(this.player, true, 1, 1);

    // Place rival NPCs visually
    const TS = GAME_DATA.TILE_SIZE;
    const rivalPositions = [{tx:10,ty:12},{tx:20,ty:12},{tx:13,ty:20}];
    GAME_DATA.TOURNAMENT_RIVALS.forEach((r,i) => {
      const pos = rivalPositions[i];
      const s = this.add.sprite(pos.tx*TS+TS/2, pos.ty*TS+TS/2, r.sprite, 1).setDepth(9);
      this.tweens.add({targets:s, y:s.y-4, duration:900+i*150, yoyo:true, repeat:-1, delay:i*200});
      this.add.text(pos.tx*TS+TS/2, pos.ty*TS-4, r.name, {fontSize:'11px',color:'#fbbf24',fontFamily:'monospace',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(11);
    });

    // HUD elements (scroll-fixed)
    this.timerBg   = this.add.rectangle(400,16,320,28,0x0f172a,0.9).setDepth(30).setScrollFactor(0);
    this.timerLabel= this.add.text(400,16,'',{fontSize:'18px',color:'#f87171',fontFamily:'monospace',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(31).setScrollFactor(0);
    this.bestLabel = this.add.text(400,36,'Best catch: none',{fontSize:'13px',color:'#4ade80',fontFamily:'monospace',stroke:'#000',strokeThickness:2}).setOrigin(0.5).setDepth(31).setScrollFactor(0);
    this.fishHint  = this.add.text(400,612,'Press F to fish',{fontSize:'14px',color:'#fbbf24',stroke:'#000',strokeThickness:3}).setOrigin(0.5).setDepth(20).setVisible(false).setScrollFactor(0);
    this.msgText   = this.add.text(400,580,'',{fontSize:'14px',color:'#ffffff',stroke:'#000',strokeThickness:3,backgroundColor:'#00000088',padding:{x:8,y:4}}).setOrigin(0.5).setDepth(20).setScrollFactor(0).setVisible(false);
    this.locLabel  = this.add.text(400,615,'🎣 Grand Tournament',{fontSize:'18px',color:'#f59e0b',stroke:'#000',strokeThickness:4}).setOrigin(0.5).setDepth(20).setScrollFactor(0);

    // Build result overlay (hidden)
    this.resultLayer = this.add.container(0,0).setDepth(70).setVisible(false).setScrollFactor(0);
    const rbg = this.add.rectangle(400,320,600,460,0x0f172a,0.97).setStrokeStyle(3,0xf59e0b);
    this.resultTitle = this.add.text(400,120,'TOURNAMENT RESULTS',{fontSize:'26px',color:'#f59e0b',fontFamily:'monospace',stroke:'#000',strokeThickness:4}).setOrigin(0.5);
    this.resultBoard = this.add.text(400,280,'',{fontSize:'16px',color:'#e2e8f0',fontFamily:'monospace',align:'center'}).setOrigin(0.5);
    this.resultSub   = this.add.text(400,460,'',{fontSize:'15px',color:'#4ade80',fontFamily:'monospace',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
    this.resultHint  = this.add.text(400,510,'Press ENTER to return to Leknes',{fontSize:'13px',color:'#64748b',fontFamily:'monospace'}).setOrigin(0.5);
    this.resultLayer.add([rbg,this.resultTitle,this.resultBoard,this.resultSub,this.resultHint]);

    this.cursors  = this.input.keyboard.createCursorKeys();
    this.fKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Countdown ticker
    this.tournamentActive = true;
    this.countdownEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        if (!this.tournamentActive) return;
        this.timeLeft--;
        this.updateTimerDisplay();
        if (this.timeLeft <= 0) {
          this.tournamentActive = false;
          this.countdownEvent.remove();
          this.time.delayedCall(400, () => this.showResults());
        }
      }
    });
    this.updateTimerDisplay();

    if (!this.scene.isActive('UIScene')) this.scene.launch('UIScene');
    this.game.events.emit('updateUI', this.state);

    this.game.events.off('fishingComplete');
    this.game.events.on('fishingComplete', this.onFishCaught, this);
  }

  updateTimerDisplay() {
    const m = Math.floor(this.timeLeft / 60);
    const s = this.timeLeft % 60;
    const str = m + ':' + String(s).padStart(2,'0');
    this.timerLabel.setText('⏱ ' + str);
    if (this.timeLeft <= 30) this.timerLabel.setColor('#ef4444');
    else if (this.timeLeft <= 60) this.timerLabel.setColor('#f97316');
  }

  drawMap() {
    const TS = GAME_DATA.TILE_SIZE;
    for (let r = 0; r < GAME_DATA.MAP_ROWS; r++) {
      for (let c = 0; c < GAME_DATA.MAP_COLS; c++) {
        const g = this.MAP.ground[r][c];
        const key = GAME_DATA.GROUND_KEYS[g] || 'tile-grass';
        this.add.image(c*TS+TS/2, r*TS+TS/2, key).setDepth(0);
      }
    }
    for (const obj of this.MAP.objects) {
      const def = OBJECT_DEFS[obj.type];
      if (!def) continue;
      const img = this.add.image(obj.tx*TS+TS/2*def.tw, obj.ty*TS+TS/2*def.th, def.key).setDepth(obj.ty+1);
      img.setScale(2);
    }
  }

  updatePlayerPos() {
    const TS = GAME_DATA.TILE_SIZE;
    this.player.setPosition(this.playerTileX*TS+TS/2, this.playerTileY*TS+TS/2);
  }

  isPassable(col, row) {
    if (col<0||row<0||col>=GAME_DATA.MAP_COLS||row>=GAME_DATA.MAP_ROWS) return false;
    const g = this.MAP.ground[row][col];
    if (g==='O'||g==='D') return this.state.hasBoat;
    return this.walkGrid[row][col];
  }

  checkWaterTransform() {
    const g = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    const nowWater = g==='O'||g==='D';
    if (nowWater === this.onWater) return;
    this.onWater = nowWater;
    if (nowWater) {
      this.player.setTexture('boat').setScale(0.5);
    } else {
      this.player.setTexture(this.charKey).setScale(1);
    }
  }

  isFishingSpot() {
    const og = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    if ((og==='O'||og==='D') && this.state.hasBoat) return true;
    const dirMap={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [dx,dy] = dirMap[this.facing]||[0,1];
    const nr=this.playerTileY+dy, nc=this.playerTileX+dx;
    if (nr<0||nc<0||nr>=GAME_DATA.MAP_ROWS||nc>=GAME_DATA.MAP_COLS) return false;
    return !!(this.waterGrid[nr][nc]);
  }

  startFishing() {
    if (!this.state.rod) {
      this.showMsg('Need a rod to fish!');
      return;
    }
    this.isFishing = true;
    const dirMap={right:[1,0],left:[-1,0],up:[0,-1],down:[0,1]};
    const [ddx,ddy] = dirMap[this.facing]||[0,1];
    const ft = this.MAP.ground[this.playerTileY+ddy]?.[this.playerTileX+ddx];
    const ct = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    const isDeepOcean = ct==='D' || ft==='D';
    this.scene.sleep();
    this.scene.launch('FishingScene', {location:'reine', state:this.state, hasBoat:this.state.hasBoat, playerLevel:this.state.level, rod:this.state.rod, isDeepOcean, callerScene:'TournamentScene'});
  }

  onFishCaught(result) {
    this.isFishing = false;
    if (!result.caught) return;
    const leveled = addXP(this.state, result.xp);
    if (leveled) this.game.events.emit('levelUp', this.state.level);
    const newTrophy = addTrophy(this.state, result.fish.name);
    if (newTrophy) {
      this.game.events.emit('trophy', result.fish.name);
      if (newTrophy.badgeUnlocked) this.showMsg('🏆 BADGE UNLOCKED: All Trophy Fish! 🏆');
    }
    if (!this.bestFish || result.fish.weight > this.bestFish.weight) {
      this.bestFish = result.fish;
      this.bestLabel.setText('Best catch: ' + result.fish.weight + 'kg ' + result.fish.name);
    }
    this.showMsg('Caught ' + result.fish.weight + 'kg ' + result.fish.name + '!');
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
  }

  showResults() {
    // Generate rival catches based on skill
    const rivals = GAME_DATA.TOURNAMENT_RIVALS.map(r => {
      const minW = Math.round(5 + r.skill * 30);
      const maxW = Math.round(28 + r.skill * 47);
      const w = Phaser.Math.Between(minW, maxW);
      return { name: r.name, weight: w };
    });

    const playerWeight = this.bestFish ? this.bestFish.weight : 0;
    const playerEntry = { name: this.state.playerName || 'You', weight: playerWeight, isPlayer: true };

    const all = [playerEntry, ...rivals].sort((a,b) => b.weight - a.weight);
    const playerRank = all.findIndex(e => e.isPlayer) + 1;

    const lines = all.map((e, i) => {
      const medal = i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : '   ';
      const tag = e.isPlayer ? ' ← YOU' : '';
      return `${medal}  ${e.name.padEnd(12)} ${e.weight}kg${tag}`;
    });

    const won = playerRank === 1;
    if (won && !this.state.grandTrophy) {
      this.state.grandTrophy = true;
      SaveSystem.save(this.state);
      this.game.events.emit('updateUI', this.state);
    }

    this.resultBoard.setText(lines.join('\n'));
    this.resultSub.setText(won
      ? '🏆 CHAMPION! Grand Trophy earned!'
      : `You placed ${playerRank}${['st','nd','rd','th'][Math.min(playerRank-1,3)]} — try again!`);
    this.resultSub.setColor(won ? '#f59e0b' : '#f87171');
    this.resultLayer.setVisible(true);
    this.resultOpen = true;
  }

  showMsg(txt) {
    this.msgText.setVisible(true);
    this.msgText.setText(txt);
    if (this.msgTimer) this.msgTimer.remove();
    this.msgTimer = this.time.delayedCall(2500, () => {
      if (this.msgText) {
        this.msgText.setText('');
        this.msgText.setVisible(false);
      }
    });
  }

  returnToLeknes() {
    this.state.location = 'leknes';
    this.state.x = 11; this.state.y = 20;
    SaveSystem.save(this.state);
    if (this.countdownEvent) this.countdownEvent.remove();
    this.scene.stop('TournamentScene');
    this.scene.start('LeknesScene');
  }

  update(time, delta) {
    this.moveCooldown -= delta;

    if (this.resultOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.escKey)) {
        this.returnToLeknes();
      }
      return;
    }

    if (!this.tournamentActive) return;

    const canFish = this.isFishingSpot();
    this.fishHint.setVisible(canFish);

    if (canFish && !this.isFishing && Phaser.Input.Keyboard.JustDown(this.fKey)) {
      this.startFishing();
      return;
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
        if (this.isPassable(nx,ny)) {
          this.playerTileX=nx; this.playerTileY=ny;
          this.state.x=nx; this.state.y=ny;
          SaveSystem.save(this.state);
          const TS=GAME_DATA.TILE_SIZE;
          this.isMoving=true;
          this.tweens.add({targets:this.player, x:nx*TS+TS/2, y:ny*TS+TS/2, duration:160,
            onComplete:()=>{ this.isMoving=false; this.checkWaterTransform(); this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing,true); }});
          this.moveCooldown=160;
        }
      } else {
        this.player.play((this.onWater?'boat':this.charKey)+'-idle-'+this.facing, true);
      }
    }
  }
};
