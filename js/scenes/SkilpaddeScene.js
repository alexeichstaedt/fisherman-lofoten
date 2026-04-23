// SkilpaddeScene — Norwegian word guessing game (Skilpadde = Turtle). Accessed from Henningsvaar cabin 3.

window.SkilpaddeScene = class SkilpaddeScene extends Phaser.Scene {
  constructor() { super({ key: 'SkilpaddeScene' }); }

  init(data) {
    this.callerScene = data.callerScene || 'HenningsvaarScene';
    this.charKey     = data.charKey || 'ikke-musikk';
    this.state       = data.state || null;

    const words  = window.SKILPADDE_WORDS || [];
    // Use a seeded LCG so the same word appears all day but the sequence
    // is spread across the full list rather than cycling in order.
    const dayNum = Math.floor(Date.now() / 86400000);
    const seed   = (dayNum * 1664525 + 1013904223) >>> 0; // LCG, 32-bit unsigned
    const entry  = words[seed % words.length];
    this.targetWord = entry.word;
    this.literal    = entry.literal;
    this.meaning    = entry.meaning;

    this.revealed   = new Set();
    this.knownIndices = new Set();  // cumulative: kick-revealed + correct-guessed
    this.kicks      = 3;
    this.hearts     = 3;
    this.typedGuess = [];
    this.gameOver   = false;
    this.won        = false;
    this.selectedSlot = 0;
    this.phase      = 'play';
    this._ballAnim  = false;

    // History rows: each entry is array of {bg, txt} Phaser objects
    this.historyRows = [];
  }

  // ── Slot geometry helper (shared by main slots + history rows) ─────────
  _slotLayout() {
    const W = 800, n = this.targetWord.length;
    const slotW = Math.min(44, Math.floor((W - 80) / n));
    const gap   = Math.min(5, Math.floor(4));
    const totalW = n * slotW + (n - 1) * gap;
    const startX = (W - totalW) / 2;
    return { n, slotW, gap, totalW, startX };
  }

  create() {
    const W = 800, H = 600;
    if (this.scene.isActive('UIScene')) this.scene.sleep('UIScene');
    if (window.showMobileSkilpaddeKeyboard) window.showMobileSkilpaddeKeyboard();

    // ── Daily limit check ────────────────────────────────────────────────
    const _todayIdx = Math.floor(Date.now() / 86400000);
    if (this.state && this.state.skilpaddeLastPlayed === _todayIdx) {
      // Already played today — show message and exit
      this.add.rectangle(W/2, H/2, W, H, 0x0f172a).setDepth(0);
      this.add.text(W/2, H/2 - 30, '🐢 SKILPADDE', {
        fontSize: '24px', color: '#fbbf24', fontFamily: 'monospace', stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5).setDepth(1);
      this.add.text(W/2, H/2 + 14, "You've already played today!\nCome back tomorrow for a new word.", {
        fontSize: '16px', color: '#cbd5e1', fontFamily: 'monospace', align: 'center'
      }).setOrigin(0.5).setDepth(1);
      this.add.text(W/2, H/2 + 80, 'Press SPACE or ESC to leave', {
        fontSize: '12px', color: '#475569', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(1);
      const escK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESCAPE);
      const spcK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.input.keyboard.once('keydown-ESC',   () => this._exit());
      this.input.keyboard.once('keydown-SPACE', () => this._exit());
      return;
    }

    // ── Background ─────────────────────────────────────────────────────
    this.add.rectangle(W/2, H/2, W, H, 0x2d7a2d).setDepth(0);
    this.add.rectangle(W/2, H/2, W-60, H-60, 0x2d7a2d).setStrokeStyle(2, 0xffffff, 0.5).setDepth(0);
    this.add.rectangle(W/2, 40, 300, 4, 0xffffff, 0.8).setDepth(1);
    this.add.rectangle(W/2 - 150, 60, 4, 44, 0xffffff, 0.8).setDepth(1);
    this.add.rectangle(W/2 + 150, 60, 4, 44, 0xffffff, 0.8).setDepth(1);

    // ── Title ───────────────────────────────────────────────────────────
    this.add.text(W/2, 10, '🐢 SKILPADDE', {
      fontSize:'18px', color:'#ffffff', fontFamily:'monospace', stroke:'#000', strokeThickness:4
    }).setOrigin(0.5, 0).setDepth(10);

    // ── HUD ─────────────────────────────────────────────────────────────
    this.heartsTxt = this.add.text(14, 10, '', {
      fontSize:'15px', fontFamily:'monospace', stroke:'#000', strokeThickness:3
    }).setDepth(10);
    this.kicksTxt = this.add.text(14, 30, '', {
      fontSize:'12px', color:'#fbbf24', fontFamily:'monospace', stroke:'#000', strokeThickness:3
    }).setDepth(10);
    const streak = (this.state && this.state.skilpaddeStreak) || 0;
    this.add.text(W - 14, 10, `🔥 ${streak}`, {
      fontSize:'14px', color:'#fbbf24', fontFamily:'monospace', stroke:'#000', strokeThickness:3
    }).setOrigin(1, 0).setDepth(10);

    // ── Main word slots ─────────────────────────────────────────────────
    this.slotObjs = [];
    const { n, slotW, gap, startX } = this._slotLayout();
    const mainSlotY = 75;
    for (let i = 0; i < n; i++) {
      const x = startX + i * (slotW + gap) + slotW / 2;
      const bg  = this.add.rectangle(x, mainSlotY, slotW, 38, 0x1e3a5f)
        .setStrokeStyle(2, 0x38bdf8).setDepth(8);
      const txt = this.add.text(x, mainSlotY, '', {
        fontSize: slotW >= 36 ? '18px' : '13px',
        color:'#ffffff', fontFamily:'monospace', stroke:'#000', strokeThickness:3
      }).setOrigin(0.5).setDepth(9);
      this.slotObjs.push({ bg, txt, x, y: mainSlotY });
    }

    // ── Cursor arrow above selected slot ────────────────────────────────
    this.cursorArrow = this.add.text(0, 0, '▼', {
      fontSize:'13px', color:'#fbbf24', fontFamily:'monospace', stroke:'#000', strokeThickness:2
    }).setOrigin(0.5).setDepth(10);

    // ── History area (kick rows + guess feedback rows) ───────────────────
    this.historyStartY = 120;   // top of first history row
    this.historyRowH   = 34;

    // ── Hint (shows after all kicks used) ───────────────────────────────
    this.hintTxt = this.add.text(W/2, 0, '', {
      fontSize:'12px', color:'#fef08a', fontFamily:'monospace', stroke:'#000', strokeThickness:3
    }).setOrigin(0.5, 0).setDepth(10);

    // ── Guess input display ──────────────────────────────────────────────
    this.guessTxt = this.add.text(W/2, 0, '', {
      fontSize:'15px', color:'#ffffff', fontFamily:'monospace', stroke:'#000', strokeThickness:3
    }).setOrigin(0.5, 0).setDepth(10);
    this.guessHintTxt = this.add.text(W/2, 0, '1=Æ  2=Ø  3=Å  ENTER=guess  BKSP=delete', {
      fontSize:'9px', color:'#94a3b8', fontFamily:'monospace'
    }).setOrigin(0.5, 0).setDepth(10);

    this._repositionInputArea();

    // ── Ground + player ──────────────────────────────────────────────────
    this.groundY = H - 90;
    this.add.rectangle(W/2, this.groundY + 45, W, 90, 0x166534, 1).setDepth(1);
    if (this.textures.exists(this.charKey)) {
      this.playerSprite = this.add.sprite(W/2, H + 80, this.charKey, 13)
        .setScale(8).setDepth(15).setOrigin(0.5, 1);
    } else {
      this.playerSprite = null;
    }

    // ── Ball ─────────────────────────────────────────────────────────────
    this.ball = this.add.text(W/2, this.groundY - 20, '⚽', { fontSize:'20px' })
      .setOrigin(0.5).setDepth(13);

    // ── Controls hint ────────────────────────────────────────────────────
    this.add.text(W/2, H - 14, '← → move  SPACE kick  type+ENTER guess  ESC quit', {
      fontSize:'9px', color:'#94a3b8', fontFamily:'monospace'
    }).setOrigin(0.5, 1).setDepth(10);

    // ── Keyboard ─────────────────────────────────────────────────────────
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.keyboard.on('keydown', this._onKeyDown, this);

    this._refreshHUD();
    this._updateSlotDisplay();
    this._moveCursorToSlot(0);
  }

  // ── Reposition input area below history rows ───────────────────────────
  _repositionInputArea() {
    const rowCount = this.historyRows.length;
    const baseY = this.historyStartY + rowCount * this.historyRowH + 8;
    if (this.hintTxt)      this.hintTxt.setY(baseY);
    if (this.guessTxt)     this.guessTxt.setY(baseY + (this.kicks === 0 ? 18 : 0));
    if (this.guessHintTxt) this.guessHintTxt.setY(baseY + (this.kicks === 0 ? 36 : 18));
  }

  // ── History row builder ────────────────────────────────────────────────
  // ── Cumulative knowledge row (shows ALL letters known so far) ────────
  _addCumulativeRow() {
    const { n, slotW, gap, startX } = this._slotLayout();
    const rowY = this.historyStartY + this.historyRows.length * this.historyRowH + this.historyRowH / 2 - 2;
    const rowObjs = [];
    for (let i = 0; i < n; i++) {
      const x = startX + i * (slotW + gap) + slotW / 2;
      const known = this.knownIndices.has(i);
      const bg  = this.add.rectangle(x, rowY, slotW, 28, known ? 0x166534 : 0x0f2444)
        .setStrokeStyle(1, known ? 0x4ade80 : 0x1e3a5f).setDepth(8);
      const txt = this.add.text(x, rowY, known ? this.targetWord[i] : '', {
        fontSize: slotW >= 36 ? '16px' : '12px',
        color:'#ffffff', fontFamily:'monospace', stroke:'#000', strokeThickness:2
      }).setOrigin(0.5).setDepth(9);
      rowObjs.push({ bg, txt });
    }
    this.historyRows.push(rowObjs);
    this._repositionInputArea();
  }

  // ── Slot display ──────────────────────────────────────────────────────
  _updateSlotDisplay() {
    for (let i = 0; i < this.targetWord.length; i++) {
      const s = this.slotObjs[i];
      if (this.revealed.has(i)) {
        s.txt.setText(this.targetWord[i]);
        s.bg.setFillStyle(0x1e5f3a);
      } else {
        s.txt.setText('');
        s.bg.setFillStyle(0x1e3a5f);
      }
    }
  }

  _moveCursorToSlot(idx) {
    this.selectedSlot = Phaser.Math.Clamp(idx, 0, this.targetWord.length - 1);
    const slot = this.slotObjs[this.selectedSlot];
    if (!slot) return;
    this.cursorArrow.setPosition(slot.x, slot.y - 26);
    const targetX = slot.x;
    if (this.playerSprite) {
      this.tweens.add({ targets: this.playerSprite, x: targetX, duration: 120, ease: 'Sine.easeOut' });
    }
    if (!this._ballAnim) {
      this.tweens.add({ targets: this.ball, x: targetX, y: this.groundY - 20, duration: 120, ease: 'Sine.easeOut' });
    }
  }

  // ── HUD ──────────────────────────────────────────────────────────────
  _refreshHUD() {
    this.heartsTxt.setText('❤️'.repeat(this.hearts) + '🖤'.repeat(3 - this.hearts));
    this.kicksTxt.setText('⚽ Kicks left: ' + this.kicks);
  }

  // ── Kick ─────────────────────────────────────────────────────────────
  _kick() {
    if (this.kicks <= 0 || this._ballAnim || this.gameOver) return;
    const kickedIdx    = this.selectedSlot;
    const kickedLetter = this.targetWord[kickedIdx];
    const slot         = this.slotObjs[kickedIdx];   // ← was accidentally removed; this was the freeze

    // Reveal all instances of this letter
    for (let i = 0; i < this.targetWord.length; i++) {
      if (this.targetWord[i] === kickedLetter) { this.revealed.add(i); this.knownIndices.add(i); }
    }

    this.kicks--;
    this._ballAnim = true;

    // Ball flies up to slot
    this.tweens.add({
      targets: this.ball,
      x: slot.x, y: slot.y,
      duration: 260,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this._updateSlotDisplay();
        // Add cumulative knowledge row
        this._addCumulativeRow();
        // Flash main slot
        slot.bg.setFillStyle(0xfbbf24);
        this.time.delayedCall(180, () => {
          slot.bg.setFillStyle(0x1e5f3a);
          // Return ball to current slot position
          const returnSlot = this.slotObjs[this.selectedSlot];
          this.tweens.add({
            targets: this.ball,
            x: returnSlot.x, y: this.groundY - 20,
            duration: 200,
            onComplete: () => { this._ballAnim = false; this._showTurnPrompt(); }
          });
        });
      }
    });

    this._refreshHUD();
    this._checkAllRevealed();

    if (this.kicks === 0) {
      this.hintTxt.setText('💡 Hint: "' + this.literal + '"');
      this._repositionInputArea();
    }
  }

  _checkAllRevealed() {
    if (this.revealed.size === this.targetWord.length) {
      this.time.delayedCall(500, () => this._win());
    }
  }

  // ── Guess ─────────────────────────────────────────────────────────────
  _onKeyDown(event) {
    if (this.gameOver || this.phase === 'result') return;
    const kc = event.keyCode;
    if (kc === 32 || kc === 27 || kc === 13 || kc === 37 || kc === 39) return;
    const key = event.key;
    if (key === 'Backspace') { this.typedGuess.pop(); this._refreshGuessDisplay(); return; }
    if (key === '1') { this.typedGuess.push('Æ'); this._refreshGuessDisplay(); return; }
    if (key === '2') { this.typedGuess.push('Ø'); this._refreshGuessDisplay(); return; }
    if (key === '3') { this.typedGuess.push('Å'); this._refreshGuessDisplay(); return; }
    if (/^[a-zA-Z]$/.test(key)) {
      if (this.typedGuess.length < this.targetWord.length) {
        this.typedGuess.push(key.toUpperCase());
        this._refreshGuessDisplay();
      }
    }
  }

  _refreshGuessDisplay() {
    const g = this.typedGuess.join('');
    this.guessTxt.setText(g || '(type your guess)');
    this.guessTxt.setColor(g ? '#ffffff' : '#64748b');
  }

  _submitGuess() {
    if (this.gameOver) return;
    const guess = this.typedGuess.join('');
    if (guess.length === 0) return;
    this.typedGuess = [];

    if (guess === this.targetWord) {
      this._win();
    } else {
      this.hearts--;
      this._refreshHUD();
      // Add correct-position letters to knownIndices, then push cumulative row
      let anyCorrect = false;
      for (let i = 0; i < this.targetWord.length; i++) {
        if (i < guess.length && guess[i] === this.targetWord[i]) {
          this.knownIndices.add(i);
          anyCorrect = true;
        }
      }
      if (anyCorrect) this._addCumulativeRow();
      // Flash guess red briefly
      this.guessTxt.setColor('#ef4444');
      this.time.delayedCall(350, () => {
        this.guessTxt.setText('');
        this.guessTxt.setColor('#ffffff');
        if (!this.gameOver) this._showTurnPrompt();
      });
      if (this.hearts <= 0) this._lose();
    }
  }

  _showTurnPrompt() {
    if (this.gameOver) return;
    if (this._promptTxt) { this._promptTxt.destroy(); this._promptTxt = null; }
    const W = 800;
    this._promptTxt = this.add.text(W / 2, 168, '👆 Type your guess and press ENTER!', {
      fontSize: '13px', color: '#fef08a', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 3, backgroundColor: '#00000066',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setDepth(20);
    this.tweens.add({ targets: this._promptTxt, alpha: 0, delay: 2500, duration: 500,
      onComplete: () => { if (this._promptTxt) { this._promptTxt.destroy(); this._promptTxt = null; } }
    });
  }
  _win() {
    if (this.gameOver) return;
    this.gameOver = true; this.won = true;
    if (this.state) {
      this.state.money = (this.state.money || 0) + 500;
      this.state.skilpaddeStreak = (this.state.skilpaddeStreak || 0) + 1;
      this.state.skilpaddeLastPlayed = Math.floor(Date.now() / 86400000);
      SaveSystem.save(this.state);
    }
    this._showResult(true);
  }

  _lose() {
    if (this.gameOver) return;
    this.gameOver = true; this.won = false;
    if (this.state) {
      this.state.skilpaddeStreak = 0;
      this.state.skilpaddeLastPlayed = Math.floor(Date.now() / 86400000);
      SaveSystem.save(this.state);
    }
    for (let i = 0; i < this.targetWord.length; i++) this.revealed.add(i);
    this._updateSlotDisplay();
    this._showResult(false);
  }

  _showResult(won) {
    const W = 800, H = 600;
    this.phase = 'result';
    this.time.delayedCall(500, () => {
      const cx = W/2, cy = H/2;
      this.add.rectangle(cx, cy, 560, 260, 0x0f172a, 0.97)
        .setStrokeStyle(2, won ? 0x4ade80 : 0xef4444).setDepth(40);
      this.add.text(cx, cy - 100, won ? '🎉 Goooal!' : '😔 Game Over', {
        fontSize:'24px', color: won ? '#4ade80' : '#ef4444',
        fontFamily:'monospace', stroke:'#000', strokeThickness:5
      }).setOrigin(0.5).setDepth(41);
      this.add.text(cx, cy - 60, this.targetWord, {
        fontSize:'22px', color:'#ffffff', fontFamily:'monospace', stroke:'#000', strokeThickness:4
      }).setOrigin(0.5).setDepth(41);
      this.add.text(cx, cy - 30, '"' + this.literal + '"', {
        fontSize:'14px', color:'#fbbf24', fontFamily:'monospace', stroke:'#000', strokeThickness:3
      }).setOrigin(0.5).setDepth(41);
      this.add.text(cx, cy - 8, 'English: ' + this.meaning, {
        fontSize:'13px', color:'#94a3b8', fontFamily:'monospace'
      }).setOrigin(0.5).setDepth(41);
      if (won) {
        const streak = (this.state && this.state.skilpaddeStreak) || 0;
        this.add.text(cx, cy + 22, `+500 NOK  🔥 Streak: ${streak}`, {
          fontSize:'13px', color:'#4ade80', fontFamily:'monospace', stroke:'#000', strokeThickness:3
        }).setOrigin(0.5).setDepth(41);
      } else {
        this.add.text(cx, cy + 22, 'Better luck tomorrow!', {
          fontSize:'13px', color:'#ef4444', fontFamily:'monospace'
        }).setOrigin(0.5).setDepth(41);
      }
      this.add.text(cx, cy + 60, 'Press SPACE or ESC to leave', {
        fontSize:'11px', color:'#475569', fontFamily:'monospace'
      }).setOrigin(0.5).setDepth(41);
    });
  }

  // ── Update ────────────────────────────────────────────────────────────
  update() {
    if (this.phase === 'result') {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
          Phaser.Input.Keyboard.JustDown(this.escKey)) { this._exit(); }
      return;
    }
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) { this._exit(); return; }
    if (this.gameOver) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left))  this._moveCursorToSlot(this.selectedSlot - 1);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) this._moveCursorToSlot(this.selectedSlot + 1);
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && !this.revealed.has(this.selectedSlot)) this._kick();
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) this._submitGuess();
  }

  _exit() {
    if (window.hideMobileSkilpaddeKeyboard) window.hideMobileSkilpaddeKeyboard();
    this.input.keyboard.off('keydown', this._onKeyDown, this);
    this.scene.stop('SkilpaddeScene');
    this.scene.wake(this.callerScene);
    if (this.scene.isSleeping('UIScene')) this.scene.wake('UIScene');
    if (this.state) this.game.events.emit('updateUI', this.state);
  }
};
