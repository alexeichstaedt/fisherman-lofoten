// FishingScene — Math challenge to catch fish.
// Launched via scene.launch('FishingScene', { location, hasBoat, playerLevel, rod, callerScene })

window.FishingScene = class FishingScene extends Phaser.Scene {
  constructor() { super({ key: 'FishingScene' }); }

  init(data) {
    this.fishingData = data;
    this.phase = 'waiting'; // waiting, bite, harpoon, math, result
    this.biteTimer = null;
    this.timerEvent = null;
    this.currentFish = null;
    this.typedAnswer = '';
    this.mathProblem = null;
    this.isKillerWhaleChallenge = false;
    this._harpoonChoice = 0; // 0=use, 1=skip
  }

  create() {
    const W = 800, H = 600;
    const cx = W/2, cy = H/2;

    // Background overlay
    this.add.rectangle(cx, cy, W, H, 0x000000, 0.7).setDepth(0);

    // Styled panel box
    this.add.rectangle(cx, cy + 5, 700, 360, 0x060f1e, 0.97)
      .setStrokeStyle(2, 0x38bdf8).setDepth(1);

    // Main status text
    this.statusText = this.add.text(cx, cy - 80, 'Casting line...', {
      fontSize: '32px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(10);

    this.trophyText = this.add.text(cx, cy - 130, '', {
      fontSize: '24px', color: '#f59e0b', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(10);

    this.subText = this.add.text(cx, cy - 35, 'Waiting for a bite...', {
      fontSize: '18px', color: '#94a3b8', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(10);

    this.timerText = this.add.text(cx, cy + 40, '', {
      fontSize: '22px', color: '#fbbf24', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(10);

    this.answerText = this.add.text(cx, cy + 90, '', {
      fontSize: '28px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(10);

    this.hintText = this.add.text(cx, cy + 140, '', {
      fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(10);

    // ── Harpoon prompt UI (hidden until needed) ──
    this._harpoonPanel = this.add.rectangle(cx, cy, 520, 200, 0x0f172a, 0.97)
      .setStrokeStyle(2, 0x38bdf8).setDepth(20).setScrollFactor(0).setVisible(false);
    this._harpoonTitle = this.add.text(cx, cy - 68, '🔱 You have a Harpoon!', {
      fontSize:'20px', color:'#38bdf8', fontFamily:'monospace', stroke:'#000', strokeThickness:4
    }).setOrigin(0.5).setDepth(21).setVisible(false);
    this._harpoonSub = this.add.text(cx, cy - 30, '', {
      fontSize:'14px', color:'#e2e8f0', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(21).setVisible(false);
    // Choice buttons
    this._harpoonUseBtn = this.add.rectangle(cx - 100, cy + 30, 160, 34, 0x166534, 0.9)
      .setStrokeStyle(2, 0x4ade80).setDepth(21).setScrollFactor(0).setVisible(false).setInteractive();
    this._harpoonUseTxt = this.add.text(cx - 100, cy + 30, '🔱 Use Harpoon', {
      fontSize:'13px', color:'#ffffff', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(22).setVisible(false);
    this._harpoonSkipBtn = this.add.rectangle(cx + 100, cy + 30, 160, 34, 0x1e293b, 0.9)
      .setStrokeStyle(2, 0x475569).setDepth(21).setScrollFactor(0).setVisible(false).setInteractive();
    this._harpoonSkipTxt = this.add.text(cx + 100, cy + 30, 'Solve Math', {
      fontSize:'13px', color:'#94a3b8', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(22).setVisible(false);
    this._harpoonHint = this.add.text(cx, cy + 75, '← → to choose  ENTER to confirm', {
      fontSize:'10px', color:'#475569', fontFamily:'monospace'
    }).setOrigin(0.5).setDepth(21).setVisible(false);

    this._harpoonUseBtn.on('pointerdown', () => { if (this.phase==='harpoon') this._confirmHarpoonChoice(0); });
    this._harpoonSkipBtn.on('pointerdown', () => { if (this.phase==='harpoon') this._confirmHarpoonChoice(1); });

    // Start waiting
    this.time.delayedCall(Phaser.Math.Between(0,2000), ()=>{ if(this.phase==='waiting') this.startBitePhase(); });

    // Ensure we don't have multiple listeners if scene is restarted
    this.input.keyboard.off('keydown');
    this.input.keyboard.on('keydown', this.handleKey, this);
  }

  _showHarpoonUI(visible) {
    [this._harpoonPanel, this._harpoonTitle, this._harpoonSub,
     this._harpoonUseBtn, this._harpoonUseTxt, this._harpoonSkipBtn,
     this._harpoonSkipTxt, this._harpoonHint].forEach(o => o.setVisible(visible));
  }

  _updateHarpoonCursor() {
    const c = this._harpoonChoice;
    this._harpoonUseBtn.setFillStyle(c === 0 ? 0x166534 : 0x1e293b, 0.9)
      .setStrokeStyle(2, c === 0 ? 0x4ade80 : 0x475569);
    this._harpoonUseTxt.setColor(c === 0 ? '#ffffff' : '#64748b');
    this._harpoonSkipBtn.setFillStyle(c === 1 ? 0x1e3a5f : 0x1e293b, 0.9)
      .setStrokeStyle(2, c === 1 ? 0x38bdf8 : 0x475569);
    this._harpoonSkipTxt.setColor(c === 1 ? '#ffffff' : '#94a3b8');
  }

  _confirmHarpoonChoice(choice) {
    this._showHarpoonUI(false);
    if (choice === 0) {
      // Use harpoon — auto-catch, consume it
      this.fishingData.state.hasHarpoon = false;
      if (window.SaveSystem) SaveSystem.save(this.fishingData.state);
      this.mathStartTime = Date.now(); // counts as instant solve — no quick bonus
      this.catchFish();
    } else {
      this.startMathPhase();
    }
  }

  startBitePhase() {
    this.phase = 'bite';
    this.statusText.setText('‼ BITE ‼').setColor('#ef4444');
    this.subText.setText('Press SPACE to reel in!');
    this.tweens.add({targets:this.statusText, alpha:0.2, duration:150, yoyo:true, repeat:14});
    this.biteTimer = this.time.delayedCall(3000, ()=>{ if(this.phase==='bite') this.fishEscaped(); });
    
    // One-time space listener for the bite
    const spaceHandler = (e) => {
      if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE && this.phase === 'bite') {
        this.input.keyboard.off('keydown', spaceHandler);
        if(this.biteTimer){this.biteTimer.remove();this.biteTimer=null;}
        this.startMathPhase();
      }
    };
    this.input.keyboard.on('keydown', spaceHandler);
  }

  startMathPhase() {
    this.phase = 'math';
    const rodData = GAME_DATA.RODS[this.fishingData.rod] || GAME_DATA.RODS.basic;
    this.currentFish = window.getRandomFish(this.fishingData.location, this.fishingData.hasBoat, this.fishingData.isDeepOcean, this.fishingData.northernLightsActive);
    if (!this.currentFish) { this.fishEscaped(); return; }

    // Apply rod weight bonus
    if (!this.currentFish.isKillerWhale && this.currentFish.maxW <= 99) {
      this.currentFish.weight = Math.min(99, this.currentFish.weight + (rodData.weightBonus || 0));
    }

    // ── Harpoon prompt: offer auto-catch for fish > 50kg ──
    if (this.currentFish.weight > 50 && this.fishingData.state && this.fishingData.state.hasHarpoon) {
      this.phase = 'harpoon';
      this._harpoonChoice = 0;
      this.statusText.setText(this.currentFish.name).setColor('#38bdf8');
      this._harpoonSub.setText(`${this.currentFish.weight}kg — harpoon for auto-catch?`).setVisible(true);
      this._showHarpoonUI(true);
      this._updateHarpoonCursor();
      return;
    }

    const isHeavy = this.currentFish.weight > 100;
    const isTrophy = GAME_DATA.TROPHY_FISH.includes(this.currentFish.name);

    if (isHeavy) {
      this.isKillerWhaleChallenge = true;
      this.mathProblem = window.generateAlgebraChallenge();
      this.typedAnswer = '';
      if (this.currentFish.isKillerWhale) {
        this.statusText.setText('⚠ KILLER WHALE! ⚠').setColor('#ef4444');
        this.trophyText.setText('Solve the algebra or perish!').setColor('#fbbf24');
      } else {
        this.statusText.setText(this.currentFish.name).setColor('#ef4444');
        this.trophyText.setText(this.currentFish.weight + 'kg — Solve the algebra to reel it in!').setColor('#fbbf24');
      }
      this.subText.setText('');
      this.timerText.setText('⚠ Time: 20s').setColor('#ef4444');
      this.answerText.setText('Answer: _');
      this.hintText.setText(this.mathProblem.question).setStyle({fontSize:'20px', color:'#ffffff', fontFamily:'monospace'});
      this.timeLeft = 20;
    } else {
      this.isKillerWhaleChallenge = false;
      this.mathProblem = window.generateMathProblem(this.currentFish.weight, this.fishingData.playerLevel);
      this.typedAnswer = '';
      this.statusText.setText(this.mathProblem.question).setColor(isTrophy ? '#f59e0b' : '#ffffff');
      this.trophyText.setText(isTrophy ? '🏆 TROPHY FISH! 🏆' : '').setColor('#f59e0b');
      this.subText.setText(this.currentFish.weight + 'kg  ' + this.currentFish.name).setColor(isTrophy ? '#fef08a' : '#93c5fd');
      this.answerText.setText('Answer: _');
      this.hintText.setText('Type digits  ENTER to submit  ESC to let go').setStyle({fontSize:'13px', color:'#64748b', fontFamily:'monospace'});
      this.timeLeft = 20;
      this.timerText.setText('Time: ' + this.timeLeft + 's').setColor('#fbbf24');
    }

    if (rodData.autoCatch && !isHeavy) { this.catchFish(); return; }

    this.mathStartTime = Date.now(); // track solve speed for quick-catch bonus

    this.timerEvent = this.time.addEvent({ delay:1000, loop:true, callback:()=>{
      if(this.phase!=='math') return;
      this.timeLeft--;
      if (this.isKillerWhaleChallenge) {
        this.timerText.setText('⚠ Time: ' + this.timeLeft + 's');
      } else {
        this.timerText.setText('Time: ' + this.timeLeft + 's');
        if(this.timeLeft<=5) this.timerText.setColor('#ef4444');
      }
      if(this.timeLeft<=0){ if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;} this.isKillerWhaleChallenge ? this.killerWhaleDeath() : this.fishEscaped(); }
    }});

    if (window.showMobileNumpad) window.showMobileNumpad();
  }

  handleKey(e) {
    // ── Harpoon choice phase ──
    if (this.phase === 'harpoon') {
      if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT ||
          e.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
        this._harpoonChoice = 1 - this._harpoonChoice;
        this._updateHarpoonCursor();
        return;
      }
      if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.ENTER ||
          e.keyCode === Phaser.Input.Keyboard.KeyCodes.SPACE) {
        this._confirmHarpoonChoice(this._harpoonChoice);
        return;
      }
      return;
    }

    if(this.phase!=='math') return;
    
    // ESC to exit math phase
    if (e.keyCode === Phaser.Input.Keyboard.KeyCodes.ESC) {
      this.fishEscaped();
      return;
    }

    if(e.key>='0'&&e.key<='9'&&this.typedAnswer.length<6){
      this.typedAnswer+=e.key;
      this.answerText.setText('Answer: '+this.typedAnswer);
    }
    else if(e.key==='Backspace'){
      this.typedAnswer=this.typedAnswer.slice(0,-1);
      this.answerText.setText('Answer: '+(this.typedAnswer||'_'));
    }
    else if(e.key==='Enter') {
      this.submitAnswer();
    }
  }

  submitAnswer() {
    if(!this.typedAnswer) return;
    if(parseInt(this.typedAnswer,10)===this.mathProblem.answer){
      if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
      this.catchFish();
    } else {
      if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
      if (window.hideMobileNumpad) window.hideMobileNumpad();
      if(this.isKillerWhaleChallenge) { this.killerWhaleDeath(); return; }
      this.statusText.setText('Wrong!').setColor('#ef4444');
      this.trophyText.setText('');
      this.subText.setText('The fish got away...').setColor('#94a3b8');
      this.answerText.setText(''); this.hintText.setText('');
      this.game.events.emit('fishingComplete',{caught:false, fish: this.currentFish || null});
      this.time.delayedCall(1500, ()=>{ this.cleanup(); this.scene.stop('FishingScene'); this.scene.wake(this.fishingData.callerScene); });
      this.phase = 'result';
    }
  }

  catchFish() {
    this.phase = 'result';
    if (window.hideMobileNumpad) window.hideMobileNumpad();

    const elapsed = this.mathStartTime ? (Date.now() - this.mathStartTime) : 9999;
    const quickCatch = elapsed < 3000;

    let xp = Math.floor(this.currentFish.weight * 10);
    if (quickCatch) xp = Math.floor(xp * 1.5);

    const value = Math.floor(this.currentFish.weight * 50);

    this.statusText.setText('CAUGHT!').setColor('#4ade80');
    this.subText.setText('You reeled in the ' + this.currentFish.name + '!').setColor('#ffffff');
    if (quickCatch) {
      this.trophyText.setText('⚡ QUICK CATCH! +50% XP').setColor('#fbbf24');
    }
    this.answerText.setText(''); this.hintText.setText('');
    this.timerText.setText('');

    this.game.events.emit('fishingComplete', {
      caught: true,
      fish: this.currentFish,
      xp: xp,
      value: value
    });

    this.time.delayedCall(2000, () => {
      this.cleanup();
      this.scene.stop('FishingScene');
      this.scene.wake(this.fishingData.callerScene);
    });
  }

  fishEscaped() {
    if (this.phase === 'result') return;
    this.phase = 'result';
    if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
    if(this.biteTimer){this.biteTimer.remove();this.biteTimer=null;}
    if (window.hideMobileNumpad) window.hideMobileNumpad();

    this.statusText.setText('Escaped!').setColor('#94a3b8');
    this.trophyText.setText('');
    this.subText.setText('It got away...').setColor('#64748b');
    this.answerText.setText(''); this.hintText.setText('');
    this.timerText.setText('');

    this.game.events.emit('fishingComplete', { caught: false, fish: this.currentFish || null });
    this.time.delayedCall(1500, () => {
      this.cleanup();
      this.scene.stop('FishingScene');
      this.scene.wake(this.fishingData.callerScene);
    });
  }

  killerWhaleDeath() {
    this.phase = 'result';
    if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
    if (window.hideMobileNumpad) window.hideMobileNumpad();

    this.statusText.setText('WASTED').setColor('#ef4444');
    this.subText.setText('The Killer Whale destroyed your boat and you!').setColor('#ffffff');
    this.answerText.setText(''); this.hintText.setText('');
    this.timerText.setText('');

    // Reset some state or money as penalty
    this.game.events.emit('fishingComplete', { caught: false, death: true, fish: this.currentFish });
    
    this.time.delayedCall(3000, () => {
      this.cleanup();
      this.scene.stop('FishingScene');
      this.scene.start('LeknesScene', { wasted: true });
    });
  }

  cleanup() {
    this.input.keyboard.off('keydown');
    if (this.timerEvent) { this.timerEvent.remove(); this.timerEvent = null; }
    if (this.biteTimer) { this.biteTimer.remove(); this.biteTimer = null; }
  }
};
