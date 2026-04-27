window.BushEncounterMixin = {
  // Call from create() to initialize encounter state on the scene
  initEncounter() {
    this.encounterOpen = false;
    this.encounterObjects = [];
    this.encounterNPCSprite = null;
    this.encounterChoiceIdx = 0;
    this.encounterData = null;
  },

  // Call from movement tween onComplete — checks if current tile is bush and rolls for encounter
  checkBushEncounter() {
    if (this.encounterOpen || this.isFishing) return;
    const tileKey = this.MAP.ground[this.playerTileY]?.[this.playerTileX];
    if (!['GBu', 'BBu', 'SBu'].includes(tileKey)) return;
    // Never trigger on water tiles (e.g. snow lake in Tromsø has SBu ground under it)
    if (this.waterGrid?.[this.playerTileY]?.[this.playerTileX]) return;
    if (Math.random() >= 0.05) return;

    // If player owns every unique item, item drop chance → 0; redistribute to baddies
    const playerItems = this.state.playerItems || [];
    const hasAllItems = window.ENCOUNTER_ITEMS.every(i => playerItems.includes(i.name));

    const r = Math.random();
    if (hasAllItems) {
      if (r < 0.50) this._triggerHaterEncounter();
      else this._triggerBaddieEncounter();
    } else {
      if (r < 0.33) this._triggerHaterEncounter();
      else if (r < 0.66) this._triggerBaddieEncounter();
      else this._triggerItemEncounter();
    }
  },

  _triggerHaterEncounter() {
    const maxLevel = (this.state && this.state.hasBadderCabin) ? 12 : 10;
    const level = Math.floor(Math.random() * maxLevel) + 1;
    const sprites = ['ow1','ow5','ow7','ow8','ow10'];
    const spriteKey = sprites[Math.floor(Math.random() * sprites.length)];
    // ATK and DEF are each 0–level, but total is always ≥ level
    const haterATK = Math.floor(Math.random() * (level + 1));
    const defMin   = level - haterATK;
    const haterDEF = defMin + Math.floor(Math.random() * (level - defMin + 1));
    this.encounterData = { type: 'hater', level, spriteKey, haterATK, haterDEF };
    this._showEncounterNPC(spriteKey);
    this._showEncounterPanel();
  },

  _triggerBaddieEncounter() {
    const maxLevel = (this.state && this.state.hasBadderCabin) ? 12 : 10;
    const level = Math.floor(Math.random() * maxLevel) + 1;
    const sprites = ['ow2','ow3','ow4','ow6','ow9'];
    const spriteKey = sprites[Math.floor(Math.random() * sprites.length)];
    this.encounterData = { type: 'baddie', level, spriteKey };
    this._showEncounterNPC(spriteKey);
    this._showEncounterPanel();
  },

  _triggerItemEncounter() {
    const owned = this.state.playerItems || [];
    const available = window.ENCOUNTER_ITEMS.filter(i => !owned.includes(i.name));
    if (available.length === 0) { return; } // all items owned, skip
    const item = available[Math.floor(Math.random() * available.length)];
    this.encounterData = { type: 'item', item: item.name };
    this._showEncounterPanel();
  },

  _showEncounterNPC(spriteKey) {
    const TS = GAME_DATA.TILE_SIZE;
    // Try to find an adjacent bush tile for the NPC to appear in
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let nx = this.playerTileX, ny = this.playerTileY;
    for (const [dx, dy] of dirs) {
      const cx = this.playerTileX + dx, cy = this.playerTileY + dy;
      const t = this.MAP.ground[cy]?.[cx];
      if (['GBu','BBu','SBu'].includes(t)) { nx = cx; ny = cy; break; }
    }
    this.encounterNPCSprite = this.add.sprite(nx * TS + TS / 2, ny * TS + TS / 2 - 8, spriteKey, 1)
      .setDepth(15).setScrollFactor(1);
    this.tweens.add({ targets: this.encounterNPCSprite, y: this.encounterNPCSprite.y - 6, duration: 500, yoyo: true, repeat: -1 });
    this.encounterObjects.push(this.encounterNPCSprite);
  },

  _showEncounterPanel() {
    this.encounterOpen = true;
    this._encounterInputReady = false;
    // Delay input by 2 frames so movement key held down doesn't instantly flip the cursor
    this.time.delayedCall(80, () => { this._encounterInputReady = true; });
    const d = this.encounterData;
    const cx = 400, cy = 330;
    const borderColor = d.type === 'hater' ? 0xef4444 : d.type === 'baddie' ? 0xf472b6 : 0xfbbf24;

    const bg = this.add.rectangle(cx, cy, 520, 210, 0x0f172a, 0.97)
      .setStrokeStyle(2, borderColor).setDepth(50).setScrollFactor(0);
    this.encounterObjects.push(bg);

    let title, subtitle, opt1Label, opt2Label;
    // Win chance: base (11 - npcLevel)*10%, +1% per player level, capped at 100%
    const _winChance = d.type !== 'item'
      ? Math.min(100, (11 - d.level) * 10 + this.state.level)
      : 100;
    if (d.type === 'hater') {
      const _patk = window.getPlayerATK ? window.getPlayerATK(this.state) : 1;
      const _pdef = window.getPlayerDEF ? window.getPlayerDEF(this.state) : 1;
      title = `⚔ HATER! (Level ${d.level})`;
      subtitle = `Your ATK: ${_patk}  DEF: ${_pdef}  |  Initiative: ${_winChance}%`;
      opt1Label = `Fight`;
      opt2Label = 'Run Away  (-3 aura)';
    } else if (d.type === 'baddie') {
      title = `💃 BADDIE! (Level ${d.level})`;
      subtitle = `Rizz her with the right answer!  (Lv ${d.level})`;
      opt1Label = `Rizz  (+1 / +3 aura — answer her question right)`;
      opt2Label = 'Run Away  (-3 aura)';
    } else {
      title = '🎁 ITEM FOUND!';
      subtitle = d.item;
      opt1Label = 'Collect  (+1 aura)';
      opt2Label = 'Leave';
    }

    const titleTxt = this.add.text(cx, cy - 80, title, {
      fontSize: '18px', color: '#ffffff', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    const subTxt = this.add.text(cx, cy - 52, subtitle, {
      fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace', wordWrap: { width: 480 }
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    this.encounterOpt1Txt = this.add.text(cx, cy - 10, '▶ ' + opt1Label, {
      fontSize: '13px', color: '#4ade80', fontFamily: 'monospace', wordWrap: { width: 490 }
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    this.encounterOpt2Txt = this.add.text(cx, cy + 25, '  ' + opt2Label, {
      fontSize: '13px', color: '#cbd5e1', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    this.encounterOpt1Txt.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { if (!this._encounterInputReady) return; this.encounterChoiceIdx = 0; this._resolveEncounter(); });
    this.encounterOpt2Txt.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => { if (!this._encounterInputReady) return; this.encounterChoiceIdx = 1; this._resolveEncounter(); });

    const hint = this.add.text(cx, cy + 70, '↑↓ or tap  ·  ENTER confirm  ·  ESC run', {
      fontSize: '11px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    this.encounterObjects.push(titleTxt, subTxt, this.encounterOpt1Txt, this.encounterOpt2Txt, hint);
    this.encounterChoiceIdx = 0;
    this._storeEncounterOptions(opt1Label, opt2Label);
    this._updateEncounterCursor();
  },

  _storeEncounterOptions(opt1Label, opt2Label) {
    this._encOpt1Label = opt1Label;
    this._encOpt2Label = opt2Label;
  },

  _updateEncounterCursor() {
    const idx = this.encounterChoiceIdx;
    this.encounterOpt1Txt.setText((idx === 0 ? '▶ ' : '  ') + this._encOpt1Label);
    this.encounterOpt2Txt.setText((idx === 1 ? '▶ ' : '  ') + this._encOpt2Label);
    this.encounterOpt1Txt.setColor(idx === 0 ? '#4ade80' : '#cbd5e1');
    this.encounterOpt2Txt.setColor(idx === 1 ? '#4ade80' : '#cbd5e1');
  },

  _handleEncounterInput() {
    const d = this.encounterData;
    if (!d) return;

    // Block input for a brief window after panel opens to prevent movement key bleed
    if (!this._encounterInputReady && d.type !== 'result') return;

    const confirm = Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey);
    const esc = Phaser.Input.Keyboard.JustDown(this.escKey);

    // In result phase, any key closes
    if (d.type === 'result') {
      if (confirm || esc) this._closeEncounter();
      return;
    }

    // Quiz phase for baddie
    if (d.phase === 'quiz') {
      const numOpts = (d.quizOptions || []).length;
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        this.encounterChoiceIdx = (this.encounterChoiceIdx - 1 + numOpts) % numOpts;
        this._updateQuizCursor();
        return;
      }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        this.encounterChoiceIdx = (this.encounterChoiceIdx + 1) % numOpts;
        this._updateQuizCursor();
        return;
      }
      if (esc) {
        // ESC during quiz = run away (-3 aura)
        if (typeof this.state.aura === 'undefined') this.state.aura = 20;
        this.state.aura = Math.max(-100, this.state.aura - 3);
        SaveSystem.save(this.state);
        this.game.events.emit('updateUI', this.state);
        this._showEncounterResult('You ran away... -3 AURA', -3);
        return;
      }
      if (confirm) {
        this._resolveQuiz();
        return;
      }
      return;
    }

    // Battle preview: ENTER/SPACE starts animation — no escape once accepted
    if (d.phase === 'battle-preview') {
      if (confirm) { this._startBattleAnimation(); return; }
      return; // ESC and all other input ignored during battle preview
    }

    // Block all input during battle animation
    if (d.phase === 'battle-animating') return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.encounterChoiceIdx = 1 - this.encounterChoiceIdx;
      this._updateEncounterCursor();
    }

    // ESC = auto-select run/leave (index 1)
    if (esc) {
      this.encounterChoiceIdx = 1;
      this._resolveEncounter();
      return;
    }

    if (confirm) this._resolveEncounter();
  },

  _resolveEncounter() {
    const d = this.encounterData;
    const idx = this.encounterChoiceIdx;
    let auraChange = 0;
    let resultMsg = '';
    let loseItem = false;

    if (d.type === 'hater') {
      if (idx === 0) {
        this._showBattleScene();
        return;
      }
      // idx === 1: run away
      auraChange = -3;
      resultMsg = `You ran away from the hater. -3 AURA`;
    } else if (d.type === 'baddie') {
      if (idx === 0) {
        // Initiative check — high-level baddies may walk away before you can rizz
        const seeChance = Math.min(100, Math.max(0, (100 - 10 * (d.level - 1)) + (this.state.level || 1)));
        if (Math.random() * 100 >= seeChance) {
          // She walked away
          if (typeof this.state.aura === 'undefined') this.state.aura = 20;
          this.state.aura = Math.max(-100, this.state.aura - 2);
          SaveSystem.save(this.state);
          this.game.events.emit('updateUI', this.state);
          this._showEncounterResult('She walked away... 💔 -2 AURA', -2);
          return;
        }
        // Show quiz instead of dice roll — pick a random question
        const qs = window.BADDIE_QUESTIONS || [];
        const q  = qs[Math.floor(Math.random() * qs.length)];
        // Build shuffled options: [{text, isCorrect}]
        const opts = [
          { text: q.correct, isCorrect: true },
          { text: q.wrong[0], isCorrect: false },
          { text: q.wrong[1], isCorrect: false },
        ];
        // Fisher-Yates shuffle
        for (let i = opts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [opts[i], opts[j]] = [opts[j], opts[i]];
        }
        d.quizPrompt  = q.prompt;
        d.quizOptions = opts;
        d.phase       = 'quiz';
        this._showQuizPanel();
        return; // don't fall through to result logic yet
      } else {
        auraChange = -3;
        resultMsg = `You ran away... -3 AURA`;
      }
    } else {
      if (idx === 0) {
        auraChange = 1;
        resultMsg = `Collected: ${d.item}! +1 AURA`;
        if (!this.state.playerItems) this.state.playerItems = [];
        this.state.playerItems.push(d.item);
      } else {
        resultMsg = `Left the item behind.`;
      }
    }

    // Item loss or 500 NOK penalty on defeat
    let lostItemMsg = '';
    if (loseItem) {
      if (this.state.playerItems && this.state.playerItems.length > 0) {
        const lostIdx = Math.floor(Math.random() * this.state.playerItems.length);
        lostItemMsg = `\nLost item: ${this.state.playerItems[lostIdx]}!`;
        this.state.playerItems.splice(lostIdx, 1);
      } else {
        const penalty = Math.min(500, this.state.money || 0);
        this.state.money = Math.max(0, (this.state.money || 0) - 500);
        lostItemMsg = penalty > 0 ? `\nPaid ${penalty} NOK!` : `\nNo items or money... 💸`;
      }
    }

    // Apply aura change, clamped to [-100, 100]
    if (typeof this.state.aura === 'undefined') this.state.aura = 20;
    this.state.aura = Math.max(-100, Math.min(100, this.state.aura + auraChange));

    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this._showEncounterResult(resultMsg + lostItemMsg, auraChange);
  },

  _showQuizPanel() {
    // Clear existing encounter objects (the initial panel)
    this.encounterObjects.forEach(o => o.destroy());
    this.encounterObjects = [];
    this.encounterChoiceIdx = 0;
    this._encounterInputReady = false;
    this.time.delayedCall(120, () => { this._encounterInputReady = true; });

    const d = this.encounterData;
    const cx = 400, cy = 310;
    const W = 560, H = 260;

    const bg = this.add.rectangle(cx, cy, W, H, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0xf472b6).setDepth(50).setScrollFactor(0);
    const titleTxt = this.add.text(cx, cy - H/2 + 18, `💃 She says... (Level ${d.level})`, {
      fontSize:'14px', color:'#f472b6', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);
    const promptTxt = this.add.text(cx, cy - H/2 + 46, `"${d.quizPrompt}"`, {
      fontSize:'15px', color:'#fef08a', fontFamily:'monospace',
      wordWrap:{ width: W - 40 }
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    const divider = this.add.rectangle(cx, cy - H/2 + 70, W - 20, 1, 0x334155)
      .setDepth(51).setScrollFactor(0);

    this._quizOptTxts = d.quizOptions.map((opt, i) => {
      const t = this.add.text(cx, cy - H/2 + 90 + i * 44,
        (i === 0 ? '▶ ' : '  ') + opt.text,
        { fontSize:'12px', color: i === 0 ? '#4ade80' : '#cbd5e1',
          fontFamily:'monospace', wordWrap:{ width: W - 60 } }
      ).setOrigin(0.5).setDepth(51).setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => { if (!this._encounterInputReady) return; this.encounterChoiceIdx = i; this._resolveQuiz(); });
      return t;
    });

    const hint = this.add.text(cx, cy + H/2 - 14,
      'Tap or ↑↓  ·  ENTER confirm  ·  ESC run',
      { fontSize:'10px', color:'#475569', fontFamily:'monospace' }
    ).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    this.encounterObjects.push(bg, titleTxt, promptTxt, divider, ...this._quizOptTxts, hint);
  },

  _updateQuizCursor() {
    const idx = this.encounterChoiceIdx;
    (this._quizOptTxts || []).forEach((t, i) => {
      const opt = this.encounterData.quizOptions[i];
      t.setText((i === idx ? '▶ ' : '  ') + opt.text);
      t.setColor(i === idx ? '#4ade80' : '#cbd5e1');
    });
  },

  _resolveQuiz() {
    const d = this.encounterData;
    const chosen = d.quizOptions[this.encounterChoiceIdx];
    let auraChange = 0;
    let resultMsg  = '';
    let loseItem   = false;

    if (chosen.isCorrect) {
      auraChange = d.level >= 6 ? 3 : 1;
      resultMsg  = `Baddie rizzed! 💅 +${auraChange} AURA`;
      if (!this.state.baddiesCaught) this.state.baddiesCaught = [];
      const _bName = window.NORWEGIAN_GIRL_NAMES
        ? window.NORWEGIAN_GIRL_NAMES[Math.floor(Math.random() * window.NORWEGIAN_GIRL_NAMES.length)]
        : 'Baddie';
      const _bHours = 1 + Math.floor(Math.random() * 24);
      this.state.baddiesCaught.unshift({ name: _bName, level: d.level, sprite: d.spriteKey, expiresAt: Date.now() + _bHours * 3600000 });
      this.state.baddiesCaught = this.state.baddiesCaught.slice(0, 10);
      // Update all-time best baddie (persists even after she expires/leaves)
      if (!this.state.allTimeBestBaddie || d.level > this.state.allTimeBestBaddie.level) {
        this.state.allTimeBestBaddie = { name: _bName, level: d.level, sprite: d.spriteKey };
      }
      if (this.state.baddiesCaught.length >= 10 && window.checkAndAwardBadge(this.state, 'baddie-collector', '10 Baddies')) {
        resultMsg += '\n🏆 BADGE: Baddie Collector!';
      }
    } else {
      auraChange = -d.level;
      resultMsg  = `Wrong answer! She left... 😔 -${d.level} AURA`;
      loseItem   = true;
    }

    // Item loss
    let lostItemMsg = '';
    if (loseItem) {
      if (this.state.playerItems && this.state.playerItems.length > 0) {
        const lostIdx = Math.floor(Math.random() * this.state.playerItems.length);
        lostItemMsg = `\nLost item: ${this.state.playerItems[lostIdx]}!`;
        this.state.playerItems.splice(lostIdx, 1);
      } else {
        const penalty = Math.min(500, this.state.money || 0);
        this.state.money = Math.max(0, (this.state.money || 0) - 500);
        lostItemMsg = penalty > 0 ? `\nPaid ${penalty} NOK!` : `\nNo items or money... 💸`;
      }
    }

    if (typeof this.state.aura === 'undefined') this.state.aura = 20;
    this.state.aura = Math.max(-100, Math.min(100, this.state.aura + auraChange));
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this._showEncounterResult(resultMsg + lostItemMsg, auraChange);
  },

  _showBattleScene() {
    this.encounterObjects.forEach(o => o.destroy());
    this.encounterObjects = [];
    this._encounterInputReady = false;
    const d = this.encounterData;
    const allItems = window.MUSEUM_ITEMS || [];

    // Pick hater weapon: best weapon whose atk <= haterATK, random among ties
    const validWeapons = allItems.filter(i => i.type === 'weapon' && i.atk <= d.haterATK)
      .sort((a, b) => b.atk - a.atk);
    const topAtk = validWeapons[0] ? validWeapons[0].atk : -1;
    const bestW = validWeapons.filter(w => w.atk === topAtk);
    d.haterWeapon = bestW.length ? bestW[Math.floor(Math.random() * bestW.length)] : null;

    // Pick hater armour: best piece whose def <= haterDEF, random among ties
    const validArmours = allItems.filter(i => i.type === 'armour' && i.def <= d.haterDEF)
      .sort((a, b) => b.def - a.def);
    const topDef = validArmours[0] ? validArmours[0].def : -1;
    const bestA = validArmours.filter(a => a.def === topDef);
    d.haterArmour = bestA.length ? bestA[Math.floor(Math.random() * bestA.length)] : null;

    // Player gear
    d.playerWeapon = allItems.find(i => i.type === 'weapon' && i.name === this.state.equippedWeapon) || null;
    const slots = this.state.equippedArmour || {};
    d.playerArmours = Object.values(slots).filter(Boolean)
      .map(name => allItems.find(i => i.name === name)).filter(Boolean);

    const render = () => this._renderBattlePanel();
    if (!this.textures.exists('rpgItems')) {
      this.load.spritesheet('rpgItems', 'assets/rpgItems.png', { frameWidth: 16, frameHeight: 16 });
      this.load.once('complete', render);
      this.load.start();
    } else {
      render();
    }
  },

  _renderBattlePanel() {
    const d = this.encounterData;
    d.phase = 'battle-preview';

    // Use canvas dimensions for mobile-safe centering
    const CW = 800, CH = 640;
    const cx = CW / 2, cy = CH / 2;
    const panW = 620, panH = 310;

    const add = o => { this.encounterObjects.push(o); return o; };
    const hasItems = this.textures.exists('rpgItems');

    // Panel background
    add(this.add.rectangle(cx, cy, panW, panH, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0xef4444).setDepth(50).setScrollFactor(0));

    // Title
    add(this.add.text(cx, cy - panH / 2 + 16, `⚔  BATTLE  —  Lv ${d.level} HATER`, {
      fontSize: '14px', color: '#ef4444', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.rectangle(cx, cy - panH / 2 + 30, panW - 30, 1, 0x334155).setDepth(51).setScrollFactor(0));

    const pATK = window.getPlayerATK ? window.getPlayerATK(this.state) : 0;
    const pDEF = window.getPlayerDEF ? window.getPlayerDEF(this.state) : 0;

    // Sprite center Y — positioned in upper half of panel
    const spriteY = cy - panH / 2 + 88;
    const pSpriteX = cx - 175, hSpriteX = cx + 175;

    // ── Player sprite ──
    const pSpr = add(this.add.sprite(pSpriteX, spriteY, this.charKey, 1)
      .setScale(2.5).setDepth(51).setScrollFactor(0));
    const pkIdle = this.charKey + '-idle-down';
    if (this.anims.exists(pkIdle)) pSpr.play(pkIdle, true);

    // Name and stats below sprite (sprite half-height at scale 2.5 = 40px → clear at +50)
    add(this.add.text(pSpriteX, spriteY + 50, this.state.playerName || 'You', {
      fontSize: '11px', color: '#60a5fa', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    add(this.add.text(pSpriteX, spriteY + 64, `ATK: ${pATK}   DEF: ${pDEF}`, {
      fontSize: '11px', color: '#e2e8f0', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    // ── VS ──
    add(this.add.text(cx, spriteY, 'VS', {
      fontSize: '22px', color: '#fbbf24', fontFamily: 'monospace', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    // ── Hater sprite ──
    const hSpr = add(this.add.sprite(hSpriteX, spriteY, d.spriteKey, 1)
      .setScale(2.5).setDepth(51).setScrollFactor(0));
    const hkIdle = d.spriteKey + '-idle-down';
    if (this.anims.exists(hkIdle)) hSpr.play(hkIdle, true);

    add(this.add.text(hSpriteX, spriteY + 50, `Hater  Lv${d.level}`, {
      fontSize: '11px', color: '#ef4444', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0));

    // ── Equipment icons only (no labels, no "Your gear:" heading) ──
    const eqSepY = cy + panH / 2 - 78;
    add(this.add.rectangle(cx, eqSepY, panW - 30, 1, 0x334155).setDepth(51).setScrollFactor(0));

    const gearItems = [];
    if (d.playerWeapon) gearItems.push(d.playerWeapon);
    d.playerArmours.forEach(a => gearItems.push(a));

    if (gearItems.length > 0 && hasItems) {
      const iconSpacing = 32;
      const gearRowY = eqSepY + 22;
      const totalW = (gearItems.length - 1) * iconSpacing;
      gearItems.forEach((item, i) => {
        add(this.add.image(cx - totalW / 2 + i * iconSpacing, gearRowY, 'rpgItems', item.frame)
          .setScale(2.5).setDepth(51).setScrollFactor(0));
      });
    } else if (gearItems.length === 0) {
      add(this.add.text(cx, eqSepY + 22, '(no gear equipped)', {
        fontSize: '10px', color: '#475569', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(51).setScrollFactor(0));
    }

    // ── FIGHT button — large and tappable for mobile ──
    const btnY = cy + panH / 2 - 22;
    const fightBtn = add(this.add.rectangle(cx, btnY, 220, 34, 0xef4444, 0.92)
      .setStrokeStyle(2, 0xff8888).setDepth(51).setScrollFactor(0).setInteractive());
    add(this.add.text(cx, btnY, '⚔  FIGHT', {
      fontSize: '15px', color: '#ffffff', fontFamily: 'monospace', stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(52).setScrollFactor(0));
    fightBtn.on('pointerdown', () => {
      if (d.phase === 'battle-preview') this._startBattleAnimation();
    });

    // Store sprite refs for animation
    d._pSpr = pSpr; d._hSpr = hSpr;
    d._pBaseX = pSpriteX; d._hBaseX = hSpriteX;
    this.time.delayedCall(150, () => { this._encounterInputReady = true; });
  },

  _startBattleAnimation() {
    const d = this.encounterData;
    d.phase = 'battle-animating';
    this._encounterInputReady = false;

    const pATK = window.getPlayerATK ? window.getPlayerATK(this.state) : 1;
    const pDEF = window.getPlayerDEF ? window.getPlayerDEF(this.state) : 1;
    const initiativeChance = Math.min(100, (11 - d.level) * 10 + this.state.level);
    const playerFirst = Math.random() * 100 < initiativeChance;

    const win = playerFirst ? (pATK > d.haterDEF) : (pDEF > d.haterATK);
    const tie = playerFirst ? (pATK === d.haterDEF) : (pDEF === d.haterATK);

    d._battlePlayerFirst = playerFirst;
    d._battleWin = win; d._battleTie = tie;
    d._battlePATK = pATK; d._battlePDEF = pDEF;

    const attacker = playerFirst ? d._pSpr : d._hSpr;
    const target   = playerFirst ? d._hSpr : d._pSpr;
    const lungeX   = (playerFirst ? d._pBaseX : d._hBaseX) + (playerFirst ? 90 : -90);

    const walkKey = playerFirst ? (this.charKey + '-walk-right') : (d.spriteKey + '-walk-left');
    const idleKey = playerFirst ? (this.charKey + '-idle-down')  : (d.spriteKey + '-idle-down');
    if (this.anims.exists(walkKey)) attacker.play(walkKey, true);

    this.tweens.add({
      targets: attacker, x: lungeX, duration: 220, ease: 'Power2',
      onComplete: () => {
        target.setTint(0xff3333);
        this.tweens.add({
          targets: target, alpha: 0.25, duration: 80, yoyo: true, repeat: 2,
          onComplete: () => {
            target.clearTint(); target.setAlpha(1);
            this.tweens.add({
              targets: attacker, x: playerFirst ? d._pBaseX : d._hBaseX, duration: 180,
              onComplete: () => {
                if (this.anims.exists(idleKey)) attacker.play(idleKey, true);
                this._applyBattleOutcome();
              }
            });
          }
        });
      }
    });
  },

  _applyBattleOutcome() {
    const d = this.encounterData;
    const { _battlePlayerFirst: pFirst, _battleWin: win, _battleTie: tie,
            _battlePATK: pATK, _battlePDEF: pDEF } = d;

    let auraChange = 0, loseItem = false;
    let resultMsg;

    const strikeDetail = pFirst
      ? `You struck first!  ATK ${pATK} vs DEF ${d.haterDEF}`
      : `Hater struck first!  DEF ${pDEF} vs ATK ${d.haterATK}`;

    if (tie) {
      resultMsg = `${strikeDetail}\nStalemate! Nobody wins. 🤝`;
    } else if (win) {
      auraChange = d.level > this.state.level ? 3 : 1;
      resultMsg = `${strikeDetail}\nYou DEFEATED the hater! ⚔ +${auraChange} AURA`;
      if (!this.state.hatersDefeated) this.state.hatersDefeated = [];
      this.state.hatersDefeated.unshift({ name: `Hater Lv${d.level}`, level: d.level, sprite: d.spriteKey });
      this.state.hatersDefeated = this.state.hatersDefeated.slice(0, 10);
      if (this.state.hatersDefeated.length >= 10 && window.checkAndAwardBadge(this.state, 'hater-slayer', '10 Haters')) {
        resultMsg += '\n🏆 BADGE: Hater Slayer!';
      }
    } else {
      auraChange = -d.level;
      resultMsg = `${strikeDetail}\nThe hater beat you! 💀 -${d.level} AURA`;
      loseItem = true;
    }

    let lostItemMsg = '';
    if (loseItem) {
      if (this.state.playerItems && this.state.playerItems.length > 0) {
        const idx = Math.floor(Math.random() * this.state.playerItems.length);
        lostItemMsg = `\nLost item: ${this.state.playerItems[idx]}!`;
        this.state.playerItems.splice(idx, 1);
      } else {
        const penalty = Math.min(500, this.state.money || 0);
        this.state.money = Math.max(0, (this.state.money || 0) - 500);
        lostItemMsg = penalty > 0 ? `\nPaid ${penalty} NOK!` : `\nNo items or money... 💸`;
      }
    }

    if (typeof this.state.aura === 'undefined') this.state.aura = 20;
    this.state.aura = Math.max(-100, Math.min(100, this.state.aura + auraChange));
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
    this._showEncounterResult(resultMsg + lostItemMsg, auraChange);
  },

  _showEncounterResult(msg, auraChange) {
    // Destroy choice panel (but keep NPC sprite reference — destroy it separately)
    this.encounterObjects.forEach(o => {
      if (o !== this.encounterNPCSprite) o.destroy();
    });
    this.encounterObjects = this.encounterNPCSprite ? [this.encounterNPCSprite] : [];

    const cx = 400, cy = 330;
    const posColor = 0x4ade80, negColor = 0xef4444, neutColor = 0x94a3b8;
    const borderCol = auraChange > 0 ? posColor : auraChange < 0 ? negColor : neutColor;
    const textCol = auraChange > 0 ? '#4ade80' : auraChange < 0 ? '#ef4444' : '#ffffff';

    const bg = this.add.rectangle(cx, cy, 520, 180, 0x0f172a, 0.97)
      .setStrokeStyle(2, borderCol).setDepth(50).setScrollFactor(0);
    bg.setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this._closeEncounter());
    const txt = this.add.text(cx, cy - 45, msg, {
      fontSize: '15px', color: textCol, fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3, wordWrap: { width: 480 }, align: 'center'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);
    const auraLine = this.add.text(cx, cy + 30, `Aura: ${this.state.aura}`, {
      fontSize: '14px', color: this.state.aura >= 0 ? '#60a5fa' : '#f87171', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);
    const hint = this.add.text(cx, cy + 58, 'Tap or SPACE / ENTER to continue', {
      fontSize: '11px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51).setScrollFactor(0);

    this.encounterObjects.push(bg, txt, auraLine, hint);
    this.encounterData = { type: 'result' };
  },

  _closeEncounter() {
    this.encounterObjects.forEach(o => o.destroy());
    this.encounterObjects = [];
    if (this.encounterNPCSprite) { this.encounterNPCSprite.destroy(); this.encounterNPCSprite = null; }
    this.encounterOpen = false;
    this.encounterData = null;
    this.encounterChoiceIdx = 0;
  }
};

// ─── Animal Follow Mixin (applied to all non-Kåkern scenes) ───────────────────
window.AnimalFollowMixin = {
  initAnimalFollow() {
    this.followingAnimal = null;
    this._animalGKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this._escKeyAnimal = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);
    const id = this.state.followAnimalId;
    if (id == null) return;
    const animalDef = window.ANIMALS.find(a => a.id === id);
    if (!animalDef) return;
    const TS = GAME_DATA.TILE_SIZE;
    // Spawn behind or next to the player
    const sx = this.playerTileX;
    const sy = Math.min(this.playerTileY + 1, GAME_DATA.MAP_ROWS - 1);
    const sprite = this.add.sprite(sx * TS + TS/2, sy * TS + TS/2, `animal${id}`, 0)
      .setDepth(8).setScale(0.34);
    sprite.play(`animal${id}-idle`, true);
    this.followingAnimal = { id, tx: sx, ty: sy, sprite };
  },

  checkAnimalFollowInput() {
    if (!this._animalGKey) return;
    const gJust = Phaser.Input.Keyboard.JustDown(this._animalGKey);
    const escJust = this._escKeyAnimal && Phaser.Input.Keyboard.JustDown(this._escKeyAnimal);
    if ((!gJust && !escJust) || !this.followingAnimal) return;
    const hasMenu = !!(this.shopOpen || this.travelMenuOpen || this.dialogOpen || this.museumOpen ||
                       this.recordShopOpen || this.duffelMenuOpen || this.dragShopOpen || this.marketOpen);
    if (escJust && hasMenu) return;
    const def = window.ANIMALS.find(a => a.id === this.followingAnimal.id) || {};
    this.followingAnimal.sprite.destroy();
    this.followingAnimal = null;
    this.state.followAnimalId = null;
    SaveSystem.save(this.state);
    this.showMsg('🏡 ' + (def.name || 'Your animal') + ' returned to Kåkern!');
  },

  updateAnimalFollow(lastTile) {
    if (!this.followingAnimal) return;
    const fa = this.followingAnimal;
    const faDef = window.ANIMALS.find(a => a.id === fa.id);
    const faWater = faDef && faDef.terrain === 'water';
    // Land animals follow on land, water animals follow when on water (boat)
    if (faWater ? this.onWater : !this.onWater) {
      const TS = GAME_DATA.TILE_SIZE;
      fa.tx = lastTile.tx; fa.ty = lastTile.ty;
      this.tweens.add({ targets: fa.sprite, x: lastTile.tx*TS+TS/2, y: lastTile.ty*TS+TS/2, duration: 180 });
    }
  }
};

// ── Shared utility: add fish to inventory (replace smallest if full) ──────────
window.addFishToInventory = function(state, fish, extraFields) {
  const entry = Object.assign({ name: fish.name, weight: fish.weight, rarity: fish.rarity }, extraFields || {});
  const inv = state.inventory;
  const isTrophy = (n) => (GAME_DATA.TROPHY_FISH || []).includes(n);

  if (inv.length < GAME_DATA.MAX_INVENTORY) {
    inv.push(entry);
    return { added: true, replaced: null };
  }
  // Find smallest non-trophy fish
  let smallestIdx = -1, smallestW = Infinity;
  for (let i = 0; i < inv.length; i++) {
    if (!isTrophy(inv[i].name) && inv[i].weight < smallestW) {
      smallestW = inv[i].weight;
      smallestIdx = i;
    }
  }
  if (smallestIdx === -1) return { added: false, replaced: null }; // all trophies

  if (isTrophy(entry.name) || entry.weight > smallestW) {
    const replaced = inv[smallestIdx];
    inv[smallestIdx] = entry;
    return { added: true, replaced };
  }
  return { added: false, replaced: null }; // new fish too small
};

// ── Baddie timer check: call at scene start to expire old baddies ─────────────
window.checkBaddieTimers = function(state) {
  if (!state.baddiesCaught || !state.baddiesCaught.length) return false;
  const now = Date.now();
  let changed = false;
  state.baddiesCaught = state.baddiesCaught.filter(b => {
    if (!b.expiresAt || b.expiresAt > now) return true;
    // Expired — penalty for low-level baddies
    if ((b.level || 1) < 7) {
      if (typeof state.aura === 'undefined') state.aura = 20;
      state.aura = Math.max(-100, state.aura - (b.level || 1));
    }
    if (state.followingBaddieName === b.name) state.followingBaddieName = null;
    changed = true;
    return false;
  });
  return changed;
};

// ── Travel animation overlay (ferry or plane) ─────────────────────────────────
window.showTravelAnim = function(scene, type, cb) {
  const cx = 400, cy = 320;
  const emoji = type === 'plane' ? '✈️' : '⛴️';
  const label = type === 'plane' ? 'Flying to Tromsø...' : 'Setting sail...';
  scene.add.rectangle(cx, cy, 800, 640, 0x0a0f1a, 0.93).setDepth(200).setScrollFactor(0);
  const icon = scene.add.text(type === 'plane' ? 150 : 620, cy + 20, emoji,
    { fontSize: '60px', padding: { top: 16, bottom: 8, left: 8, right: 8 } })
    .setOrigin(0.5).setDepth(201).setScrollFactor(0);
  scene.add.text(cx, cy + 90, label, { fontSize: '18px', color: '#94a3b8', fontFamily: 'monospace' })
    .setOrigin(0.5).setDepth(201).setScrollFactor(0);
  scene.tweens.add({ targets: icon, x: type === 'plane' ? 620 : 180, duration: 1300, ease: 'Sine.easeInOut' });
  scene.time.delayedCall(1500, cb);
};

// ── Baddie Follow Mixin ───────────────────────────────────────────────────────
window.BaddieFollowMixin = {
  initBaddieFollow() {
    this.followingBaddie = null;
    this._gKeyBaddie = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    // Use an event-based flag instead of JustDown — escKey is shared with scene menu
    // handlers which consume justDown first, causing B button to silently fail.
    this._bddEscFlag = false;
    this._bddEscFn = () => { this._bddEscFlag = true; };
    this.input.keyboard.on('keydown-ESC', this._bddEscFn, this);
    const name = this.state.followingBaddieName;
    if (!name) return;
    const b = (this.state.baddiesCaught || []).find(x => x.name === name);
    if (!b) { this.state.followingBaddieName = null; return; }
    const TS = GAME_DATA.TILE_SIZE;
    const sx = Math.min(this.playerTileX + 1, (GAME_DATA.MAP_COLS || 40) - 1);
    const sy = this.playerTileY;
    const sprite = this.add.sprite(sx * TS + TS / 2, sy * TS + TS / 2, b.sprite || 'ow2', 1)
      .setDepth(8).setScale(0.9);
    const wk = (b.sprite || 'ow2') + '-idle-down';
    if (this.anims && this.anims.exists(wk)) sprite.play(wk, true);
    sprite.setVisible(!this.onWater);
    this.followingBaddie = { name: b.name, tx: sx, ty: sy, sprite, spriteKey: b.sprite || 'ow2', facing: 'down' };
  },

  checkBaddieFollowInput() {
    if (!this._gKeyBaddie || !this.followingBaddie) return;
    const gJust   = Phaser.Input.Keyboard.JustDown(this._gKeyBaddie);
    const escJust = this._bddEscFlag;
    if (escJust) this._bddEscFlag = false; // consume
    if (!gJust && !escJust) return;
    // Only send home via ESC when no menus are open
    const hasMenu = !!(this.shopOpen || this.travelMenuOpen || this.dialogOpen || this.museumOpen ||
                       this.recordShopOpen || this.duffelMenuOpen || this.dragShopOpen || this.marketOpen);
    if (escJust && hasMenu) return;
    this.followingBaddie.sprite.destroy();
    this.followingBaddie = null;
    this.state.followingBaddieName = null;
    SaveSystem.save(this.state);
    this.showMsg('💅 She went home.');
  },

  updateBaddieFollow(lastTile) {
    if (!this.followingBaddie) return;
    const fb = this.followingBaddie;
    const TS = GAME_DATA.TILE_SIZE;

    // Hide while on boat — reappear when back on land
    if (this.onWater) {
      fb.sprite.setVisible(false);
      return;
    }
    fb.sprite.setVisible(true);

    // Determine movement direction from old position → player's previous tile
    const dx = lastTile.tx - fb.tx;
    const dy = lastTile.ty - fb.ty;
    let dir = fb.facing || 'down';
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? 'right' : 'left';
      } else {
        dir = dy > 0 ? 'down' : 'up';
      }
    }
    fb.facing = dir;

    // Play walk anim during tween, idle anim on arrival
    const walkKey = fb.spriteKey + '-walk-' + dir;
    const idleKey = fb.spriteKey + '-idle-' + dir;
    if (this.anims && this.anims.exists(walkKey)) fb.sprite.play(walkKey, true);

    fb.tx = lastTile.tx; fb.ty = lastTile.ty;
    this.tweens.add({
      targets: fb.sprite,
      x: lastTile.tx * TS + TS / 2,
      y: lastTile.ty * TS + TS / 2,
      duration: 180,
      onComplete: () => {
        if (fb.sprite && this.anims && this.anims.exists(idleKey)) fb.sprite.play(idleKey, true);
      }
    });
  }
};
