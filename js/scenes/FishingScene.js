window.FishingScene = class extends Phaser.Scene {
  constructor() { super({ key: 'FishingScene' }); }

  init(data) {
    this.fishingData = data;
    this.phase = 'waiting';
    this.typedAnswer = '';
    this.currentFish = null;
    this.mathProblem = null;
    this.dotTimer = null;
    this.biteTimer = null;
    this.timerEvent = null;
    this.timeLeft = 0;
  }

  create() {
    // If Flag Quiz mode is active, hand off to FlagQuizScene instead
    if (this.fishingData.state && this.fishingData.state.flagQuizMode) {
      this.scene.stop('FishingScene');
      this.scene.launch('FlagQuizScene', this.fishingData);
      return;
    }

    this.add.rectangle(400, 320, 800, 640, 0x000000, 0.7);
    this.add.rectangle(400, 340, 540, 430, 0x0f172a, 1).setStrokeStyle(2, 0x38bdf8);

    this.rodIcon    = this.add.text(400, 150, '[ROD]', {fontSize:'52px',color:'#60a5fa'}).setOrigin(0.5);
    this.statusText = this.add.text(400, 215, 'Casting line...', {fontSize:'24px',color:'#ffffff',fontFamily:'monospace',wordWrap:{width:520}}).setOrigin(0.5);
    this.trophyText = this.add.text(400, 252, '', {fontSize:'18px',color:'#f59e0b',fontFamily:'monospace',stroke:'#000000',strokeThickness:3}).setOrigin(0.5);
    this.subText    = this.add.text(400, 284, '', {fontSize:'15px',color:'#93c5fd',fontFamily:'monospace',wordWrap:{width:500}}).setOrigin(0.5);
    this.timerText  = this.add.text(400, 314, '', {fontSize:'16px',color:'#fbbf24',fontFamily:'monospace'}).setOrigin(0.5);
    this.answerText = this.add.text(400, 360, '', {fontSize:'22px',color:'#fef08a',fontFamily:'monospace',backgroundColor:'#00000099',padding:{x:12,y:6}}).setOrigin(0.5);
    this.hintText   = this.add.text(400, 410, '', {fontSize:'14px',color:'#64748b',fontFamily:'monospace',wordWrap:{width:500}}).setOrigin(0.5);
    this.rarityText = this.add.text(400, 452, '', {fontSize:'14px',color:'#94a3b8',fontFamily:'monospace'}).setOrigin(0.5);
    const rodName   = GAME_DATA.RODS[this.fishingData.rod]?.name || 'Basic Rod';
    this.add.text(400, 488, 'Using: ' + rodName, {fontSize:'12px',color:'#475569',fontFamily:'monospace'}).setOrigin(0.5);
    this._escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);
    this._enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.startWaitingPhase();
  }

  update() {
    if (this._escKey && Phaser.Input.Keyboard.JustDown(this._escKey)) {
      if (this.phase === 'waiting' || this.phase === 'bite') {
        this.cleanup();
        this.game.events.emit('fishingComplete', { caught: false, fish: null });
        this.phase = 'cancelled';
        this.scene.stop('FishingScene');
        this.scene.wake(this.fishingData.callerScene);
      }
      if (this.phase === 'harpoon') {
        // Decline harpoon — proceed to algebra
        this.phase = 'math';
        this._startHeavyFishAlgebra();
      }
    }
    if (this._enterKey && Phaser.Input.Keyboard.JustDown(this._enterKey)) {
      if (this.phase === 'harpoon') {
        const state = this.fishingData.state;
        state.hasHarpoon = false;
        SaveSystem.save(state);
        this.game.events.emit('updateUI', state);
        this.phase = 'math'; // briefly set so catchFish works
        this.catchFish();
      }
    }
  }

  clearTexts() {
    this.trophyText.setText('');
    this.subText.setText('');
    this.timerText.setText('');
    this.answerText.setText('');
    this.hintText.setText('');
    this.rarityText.setText('');
  }

  startWaitingPhase() {
    this.phase = 'waiting';
    this.statusText.setText('Fishing...').setColor('#ffffff');
    this.clearTexts();
    let dots = 0;
    this.dotTimer = this.time.addEvent({ delay:500, loop:true, callback:()=>{ dots=(dots+1)%4; this.statusText.setText('Fishing'+'.'.repeat(dots)); }});
    this.time.delayedCall(Phaser.Math.Between(1000,4000), ()=>{ if(this.phase==='waiting') this.startBitePhase(); });
  }

  startBitePhase() {
    if (this.dotTimer) { this.dotTimer.remove(); this.dotTimer=null; }
    this.phase = 'bite';
    this.statusText.setText('BITE!').setColor('#fef08a');
    this.subText.setText('Press SPACE now!').setColor('#ffffff');
    this.hintText.setText('3 second window!');
    this.tweens.add({targets:this.statusText, alpha:0.2, duration:150, yoyo:true, repeat:14});
    this.biteTimer = this.time.delayedCall(3000, ()=>{ if(this.phase==='bite') this.fishEscaped(); });
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.once('down', ()=>{ if(this.phase==='bite'){ if(this.biteTimer){this.biteTimer.remove();this.biteTimer=null;} this.startMathPhase(); }});
  }

  startMathPhase() {
    this.phase = 'math';
    const rodData = GAME_DATA.RODS[this.fishingData.rod] || GAME_DATA.RODS.basic;
    this.currentFish = getRandomFish(this.fishingData.location, this.fishingData.hasBoat, this.fishingData.isDeepOcean, this.fishingData.northernLightsActive);
    if (!this.currentFish) { this.fishEscaped(); return; }

    // Apply rod weight bonus (capped at 99 for normal fish; heavy fish keep their real weight)
    if (!this.currentFish.isKillerWhale && this.currentFish.maxW <= 99) {
      this.currentFish.weight = Math.min(99, this.currentFish.weight + (rodData.weightBonus || 0));
    }

    const isHeavy = this.currentFish.weight > 100;
    const isTrophy = GAME_DATA.TROPHY_FISH.includes(this.currentFish.name);

    // Harpoon prompt: intercept heavy fish before algebra
    if (isHeavy && this.fishingData.state && this.fishingData.state.hasHarpoon) {
      this.phase = 'harpoon';
      if (this.currentFish.isKillerWhale) {
        this.statusText.setText('⚠ KILLER WHALE! ⚠').setColor('#ef4444');
        this.trophyText.setText('Use your Harpoon for auto-catch!').setColor('#fbbf24');
      } else {
        this.statusText.setText(this.currentFish.name).setColor('#ef4444');
        this.trophyText.setText(this.currentFish.weight + 'kg — Use your Harpoon?').setColor('#fbbf24');
      }
      this.subText.setText('🔱 HARPOON — Auto-catch guaranteed!').setColor('#4ade80');
      this.hintText.setText('ENTER = Use Harpoon   ESC = Face algebra').setStyle({fontSize:'13px', color:'#fef08a', fontFamily:'monospace'});
      this.answerText.setText('');
      this.timerText.setText('');
      return;
    }

    if (isHeavy) {
      this._startHeavyFishAlgebra();
      return;
    }

    if (rodData.autoCatch) { this.catchFish(); return; }

    this.isKillerWhaleChallenge = false;
    this.mathProblem = generateMathProblem(this.currentFish.weight, this.fishingData.playerLevel);
    this.typedAnswer = '';
    this.statusText.setText(this.mathProblem.question).setColor(isTrophy ? '#f59e0b' : '#ffffff');
    this.trophyText.setText(isTrophy ? '🏆 TROPHY FISH! 🏆' : '').setColor('#f59e0b');
    this.subText.setText(this.currentFish.weight + 'kg  ' + this.currentFish.name).setColor(isTrophy ? '#fef08a' : '#93c5fd');
    this.answerText.setText('Answer: _');
    this.hintText.setText('Type digits  BACKSPACE  ENTER to submit').setStyle({fontSize:'13px', color:'#64748b', fontFamily:'monospace'});
    this.timeLeft = 20;
    this.timerText.setText('Time: ' + this.timeLeft + 's').setColor('#fbbf24');
    this.timerEvent = this.time.addEvent({ delay:1000, loop:true, callback:()=>{
      if(this.phase!=='math') return;
      this.timeLeft--;
      this.timerText.setText('Time: ' + this.timeLeft + 's');
      if(this.timeLeft<=5) this.timerText.setColor('#ef4444');
      if(this.timeLeft<=0){ if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;} this.fishEscaped(); }
    }});
    this.input.keyboard.on('keydown', this.handleKey, this);
    if (window.showMobileNumpad) window.showMobileNumpad();
  }

  _startHeavyFishAlgebra() {
    this.phase = 'math';
    this.isKillerWhaleChallenge = true;
    this.mathProblem = generateAlgebraChallenge();
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
    this.timerEvent = this.time.addEvent({ delay:1000, loop:true, callback:()=>{
      if(this.phase!=='math') return;
      this.timeLeft--;
      this.timerText.setText('⚠ Time: ' + this.timeLeft + 's').setColor('#ef4444');
      if(this.timeLeft<=0){ if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;} this.currentFish.isKillerWhale ? this.killerWhaleDeath() : this.fishEscaped(); }
    }});
    this.input.keyboard.on('keydown', this.handleKey, this);
    if (window.showMobileNumpad) window.showMobileNumpad();
  }

  handleKey(e) {
    if(this.phase!=='math') return;
    if(e.key>='0'&&e.key<='9'&&this.typedAnswer.length<6){ this.typedAnswer+=e.key; this.answerText.setText('Answer: '+this.typedAnswer); }
    else if(e.key==='Backspace'){ this.typedAnswer=this.typedAnswer.slice(0,-1); this.answerText.setText('Answer: '+(this.typedAnswer||'_')); }
    else if(e.key==='Enter') this.submitAnswer();
  }

  submitAnswer() {
    if(!this.typedAnswer) return;
    if(parseInt(this.typedAnswer,10)===this.mathProblem.answer){
      if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
      this.input.keyboard.off('keydown',this.handleKey,this);
      this.catchFish();
    } else {
      if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
      this.input.keyboard.off('keydown',this.handleKey,this);
      if (window.hideMobileNumpad) window.hideMobileNumpad();
      if(this.currentFish.isKillerWhale) { this.killerWhaleDeath(); return; }
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
    this.input.keyboard.off('keydown',this.handleKey,this);
    if (window.hideMobileNumpad) window.hideMobileNumpad();
    if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
    const fish = this.currentFish;
    const xp = Math.round(fish.weight * fish.xpMult * 100);
    const value = Math.round(fish.weight * (fish.pricePerKg || GAME_DATA.FISH_PRICE_PER_KG));
    const isTrophy = GAME_DATA.TROPHY_FISH.includes(fish.name);
    const rarityColors = {common:'#94a3b8', uncommon:'#4ade80', rare:'#60a5fa', legendary:'#f59e0b', secret:'#e879f9'};
    this.statusText.setText('CAUGHT!').setColor('#4ade80');
    this.trophyText.setText(isTrophy ? '🏆 TROPHY FISH! 🏆' : '').setColor('#f59e0b');
    this.subText.setText(fish.name).setColor(isTrophy ? '#fef08a' : '#ffffff');
    this.timerText.setText(fish.weight + 'kg  +' + xp.toLocaleString() + ' XP').setColor('#fef08a');
    this.answerText.setText('');
    this.hintText.setText('').setStyle({fontSize:'14px', color:'#64748b', fontFamily:'monospace'});
    this.rarityText.setText('[' + fish.rarity.toUpperCase() + ']').setColor(rarityColors[fish.rarity] || '#fff');
    this.game.events.emit('fishingComplete',{caught:true,fish,xp,value});
    this.time.delayedCall(2200, ()=>{ this.cleanup(); this.scene.stop('FishingScene'); this.scene.wake(this.fishingData.callerScene); });
  }

  killerWhaleDeath() {
    if(this.phase==='result') return;
    this.phase = 'result';
    if (window.hideMobileNumpad) window.hideMobileNumpad();
    this.cleanup();
    this.cameras.main.setBackgroundColor('#1a0000');
    this.statusText.setText('💀 YOU WERE EATEN 💀').setColor('#ef4444');
    this.trophyText.setText('The Killer Whale devoured you...').setColor('#fbbf24');
    this.subText.setText('');
    this.timerText.setText('').setColor('#ffffff');
    this.answerText.setText('You wake up in Leknes.').setStyle({fontSize:'14px',color:'#94a3b8',fontFamily:'monospace'});
    this.hintText.setText('Boat · Money · Rod — all lost.').setStyle({fontSize:'13px',color:'#94a3b8',fontFamily:'monospace'});
    this.game.events.emit('fishingComplete',{caught:false, killerWhaleDeath:true});
    this.time.delayedCall(3500, ()=>{ this.scene.stop('FishingScene'); this.scene.wake(this.fishingData.callerScene); });
  }

  fishEscaped() {
    this.phase = 'result';
    if (window.hideMobileNumpad) window.hideMobileNumpad();
    this.cleanup();
    this.statusText.setText('Fish Escaped!').setColor('#f87171');
    this.trophyText.setText('');
    this.subText.setText('Better luck next time...').setColor('#94a3b8');
    this.timerText.setText(''); this.answerText.setText(''); this.hintText.setText('');
    this.game.events.emit('fishingComplete',{caught:false, fish: this.currentFish || null});
    this.time.delayedCall(1500, ()=>{ this.scene.stop('FishingScene'); this.scene.wake(this.fishingData.callerScene); });
  }

  cleanup() {
    if(this.dotTimer){this.dotTimer.remove();this.dotTimer=null;}
    if(this.biteTimer){this.biteTimer.remove();this.biteTimer=null;}
    if(this.timerEvent){this.timerEvent.remove();this.timerEvent=null;}
    this.input.keyboard.off('keydown',this.handleKey,this);
  }
};
