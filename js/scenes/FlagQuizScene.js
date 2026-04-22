// FlagQuizScene — replaces FishingScene math challenge with a flag identification quiz.
// Launched the same way as FishingScene (scene.launch), emits 'fishingComplete' on finish
// so all caller scenes work unchanged.
//
// To enable: set state.flagQuizMode = true (via New Game option or in-game purchase — TBD).
// This scene is never launched directly by map scenes; FishingScene checks the flag and
// delegates here when flagQuizMode is active.

window.FlagQuizScene = class FlagQuizScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FlagQuizScene' });
  }

  // ── Lazy-load all flag assets on first launch ─────────────────────────────
  preload() {
    const data = window.FLAG_QUIZ_DATA || [];
    data.forEach(entry => {
      if (!this.textures.exists('flag_' + entry.code)) {
        this.load.image('flag_' + entry.code, 'assets/flags/' + entry.code + '.png');
      }
    });
  }

  init(data) {
    this.fishingData = data;      // same payload as FishingScene receives
    this.currentFish = data.fish || null;
    this.answered    = false;
    this.choiceIdx   = 0;
    this.choices     = [];        // [{label, isCorrect}]
    this.quizEntry   = null;
    this.timeLeft    = 20;
    this.inputReady  = false;
  }

  create() {
    const W = 800, H = 600;
    const cx = W / 2, cy = H / 2;

    // Dark overlay background
    this.add.rectangle(cx, cy, W, H, 0x0a0f1a).setDepth(0);

    // Pick a random flag question
    const pool = window.FLAG_QUIZ_DATA || [];
    if (pool.length === 0) {
      // No data — fall back to immediate success so game isn't broken
      this._finish(true);
      return;
    }

    this.quizEntry = pool[Math.floor(Math.random() * pool.length)];

    // Build 3 choices: 1 correct + 2 random wrong
    const wrong = pool
      .filter(e => e.code !== this.quizEntry.code)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const all = [
      { label: this.quizEntry.name, isCorrect: true },
      { label: wrong[0].name,       isCorrect: false },
      { label: wrong[1].name,       isCorrect: false },
    ];
    // Fisher-Yates shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    this.choices = all;

    // Title
    this.add.text(cx, 40, '🌍  Which country is this flag?', {
      fontSize: '18px', color: '#fbbf24', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(1);

    // Flag image
    const flagKey = 'flag_' + this.quizEntry.code;
    if (this.textures.exists(flagKey)) {
      const img = this.add.image(cx, 200, flagKey).setDepth(1);
      // Scale to fit nicely — max 320×200
      const scaleX = 320 / img.width;
      const scaleY = 200 / img.height;
      img.setScale(Math.min(scaleX, scaleY, 1));
    }

    // Fish context line (if triggered by fishing)
    if (this.currentFish) {
      this.add.text(cx, 340, `🎣 ${this.currentFish.name}  — Answer to catch it!`, {
        fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace'
      }).setOrigin(0.5).setDepth(1);
    }

    // Choice buttons
    this._choiceTxts = this.choices.map((c, i) => {
      const t = this.add.text(cx, 380 + i * 48,
        (i === 0 ? '▶ ' : '  ') + c.label,
        { fontSize: '14px', color: i === 0 ? '#4ade80' : '#cbd5e1', fontFamily: 'monospace' }
      ).setOrigin(0.5).setDepth(1);
      return t;
    });

    // Timer
    this._timerTxt = this.add.text(cx, 565, 'Time: 20s', {
      fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(1);

    // Hint
    this.add.text(cx, 585, '↑↓ choose   ENTER confirm', {
      fontSize: '10px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(1);

    // Countdown timer
    this._timerEvent = this.time.addEvent({
      delay: 1000, repeat: 19,
      callback: () => {
        this.timeLeft--;
        const col = this.timeLeft <= 5 ? '#ef4444' : '#94a3b8';
        this._timerTxt.setText('Time: ' + this.timeLeft + 's').setColor(col);
        if (this.timeLeft <= 0) this._onTimeout();
      }
    });

    // Keys
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Brief input delay so held movement key doesn't immediately confirm
    this.time.delayedCall(120, () => { this.inputReady = true; });
  }

  update() {
    if (this.answered || !this.inputReady) return;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.choiceIdx = (this.choiceIdx - 1 + this.choices.length) % this.choices.length;
      this._updateCursor();
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.choiceIdx = (this.choiceIdx + 1) % this.choices.length;
      this._updateCursor();
    }
    if (Phaser.Input.Keyboard.JustDown(this.enterKey) ||
        Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this._confirm();
    }
  }

  _updateCursor() {
    this._choiceTxts.forEach((t, i) => {
      t.setText((i === this.choiceIdx ? '▶ ' : '  ') + this.choices[i].label);
      t.setColor(i === this.choiceIdx ? '#4ade80' : '#cbd5e1');
    });
  }

  _confirm() {
    if (this.answered) return;
    const correct = this.choices[this.choiceIdx].isCorrect;
    this._finish(correct);
  }

  _onTimeout() {
    if (this.answered) return;
    this._showResult('⏰ Time\'s up! Flag escaped...', false, () => this._finish(false));
  }

  _finish(success) {
    if (this.answered) return;
    this.answered = true;
    if (this._timerEvent) this._timerEvent.remove();

    if (success) {
      this._showResult('✅ Correct! Fish caught!', true, () => {
        this.game.events.emit('fishingComplete', {
          caught: true,
          fish:   this.currentFish,
          xp:     this.fishingData.xp    || 0,
          value:  this.fishingData.value || 0,
        });
        this.scene.stop('FlagQuizScene');
        this.scene.wake(this.fishingData.callerScene);
      });
    } else {
      this._showResult('❌ Wrong! Fish got away...', false, () => {
        this.game.events.emit('fishingComplete', {
          caught: false,
          fish:   this.currentFish,
        });
        this.scene.stop('FlagQuizScene');
        this.scene.wake(this.fishingData.callerScene);
      });
    }
  }

  _showResult(msg, success, cb) {
    const cx = 400, cy = 300;
    const col = success ? 0x4ade80 : 0xef4444;
    const tcol = success ? '#4ade80' : '#ef4444';
    this.add.rectangle(cx, cy, 500, 120, 0x0f172a, 0.97)
      .setStrokeStyle(2, col).setDepth(10).setScrollFactor(0);
    this.add.text(cx, cy, msg, {
      fontSize: '20px', color: tcol, fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(11).setScrollFactor(0);
    this.time.delayedCall(1600, cb);
  }
};
