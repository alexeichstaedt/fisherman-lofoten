// BirdWatchingScene — Puffin dodges clouds. Lazy-loads sprites in preload().

window.BirdWatchingScene = class BirdWatchingScene extends Phaser.Scene {
  constructor() { super({ key: 'BirdWatchingScene' }); }

  preload() {
    if (!this.textures.exists('simpleBird')) {
      this.load.spritesheet('simpleBird', 'assets/simpleBird-Sheet.png', {
        frameWidth: 50, frameHeight: 50
      });
    }
    if (!this.textures.exists('clouds')) {
      this.load.spritesheet('clouds', 'assets/clouds.png', {
        frameWidth: 32, frameHeight: 32
      });
    }
  }

  init(data) {
    this.callerScene   = data.callerScene || 'ReineScene';
    this.charKey       = data.charKey || 'ikke-musikk';
    this.state         = data.state || null;
    this.dead          = false;
    this.started       = false;
    this.score         = 0;
    this.speed         = 4;
    this.birdVY        = 0;
    this.gravity       = 0.5;
    this.flapPower     = -9;
    this.clouds        = [];
    this.spawnTimer    = 0;
    this.speedTimer    = 0;
  }

  // Dynamic spawn interval — gets shorter as score rises
  get spawnInterval() {
    if (this.score >= 40) return 30;
    if (this.score >= 30) return 40;
    if (this.score >= 20) return 55;
    if (this.score >= 10) return 70;
    return 85;
  }

  create() {
    const W = 800, H = 600;

    // Sky
    this.add.rectangle(W/2, H/2, W, H, 0x87ceeb).setDepth(0);
    // Ocean at bottom
    this.groundY = H - 80;
    this.add.rectangle(W/2, this.groundY + 40, W, 80, 0x1a6b9a).setDepth(1);
    this.add.rectangle(W/2, this.groundY, W, 4, 0x0d3a6a).setDepth(2);

    // ── Player watcher at bottom-center ──────────────────────────────────
    // Show player from behind (up-facing frame = 9), zoomed in at shoulders/head
    // Frame layout: rows of 3 (down=0-2, left=3-5, right=6-8, up=9-11)
    if (this.textures.exists(this.charKey)) {
      // Frame 13 = idle-up (back of head). Scale 10 → 320px tall.
      // Bottom anchor at H+140 → feet 140px below canvas; only head + jacket back visible.
      this.add.sprite(W / 2, H + 140, this.charKey, 13)
        .setScale(10).setDepth(15).setOrigin(0.5, 1);
      // Shadow at the water line
      this.add.ellipse(W / 2, this.groundY + 6, 100, 14, 0x000000, 0.3).setDepth(14);
    }

    // ── Bird ──────────────────────────────────────────────────────────────
    this.birdX = 150;
    this.birdY = H / 2 - 60;
    if (this.textures.exists('simpleBird')) {
      this.bird = this.add.sprite(this.birdX, this.birdY, 'simpleBird', 20)
        .setScale(60 / 50).setDepth(10);
    } else {
      this.bird = this.add.rectangle(this.birdX, this.birdY, 40, 30, 0xffffff).setDepth(10);
    }

    // Score (center)
    this.scoreTxt = this.add.text(W / 2, 16, 'Clouds dodged: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5, 0).setDepth(20);

    // Top-3 scores (top right)
    const scores = (this.state && this.state.birdScores) ? this.state.birdScores : [];
    const scoreLines = ['🏆 Best:',
      '1: ' + (scores[0] !== undefined ? scores[0] : '-'),
      '2: ' + (scores[1] !== undefined ? scores[1] : '-'),
      '3: ' + (scores[2] !== undefined ? scores[2] : '-'),
    ].join('\n');
    this.top3Txt = this.add.text(W - 10, 10, scoreLines, {
      fontSize: '13px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3, lineSpacing: 4
    }).setOrigin(1, 0).setDepth(20);

    // Start prompt
    this.startTxt = this.add.text(W / 2, this.birdY - 60, '🐦 Tap or SPACE or ↑ to start!', {
      fontSize: '16px', color: '#ffffff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(20);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.upKey    = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

    // Touch / pointer support for mobile flapping
    this.input.on('pointerdown', () => {
      if (this.dead) return;
      if (!this.started) {
        this.started = true;
        if (this.startTxt) { this.startTxt.destroy(); this.startTxt = null; }
      }
      this.birdVY = this.flapPower;
    });

    // Hide the HUD while playing
    if (this.scene.isActive('UIScene')) this.scene.sleep('UIScene');

    // Small tight hitbox for fair collision
    this.birdRadius = 9;
  }

  update() {
    if (this.dead) return;

    const flap = Phaser.Input.Keyboard.JustDown(this.spaceKey) ||
                 Phaser.Input.Keyboard.JustDown(this.upKey);

    if (!this.started) {
      if (flap) { this.started = true; if (this.startTxt) this.startTxt.destroy(); this.birdVY = this.flapPower; }
      return;
    }

    // Bird physics — ceiling clamps, ocean kills
    this.birdVY += this.gravity;
    if (flap) this.birdVY = this.flapPower;
    this.birdY += this.birdVY;
    // Ceiling = hard wall, just bounce off
    if (this.birdY <= this.birdRadius) {
      this.birdY = this.birdRadius;
      this.birdVY = 0;
    }
    // Ocean = death
    if (this.birdY >= this.groundY - this.birdRadius) {
      this._crash('ocean'); return;
    }
    if (this.bird.setFrame) this.bird.setFrame(this.birdVY < 0 ? 20 : 21);
    if (this.bird.setPosition) this.bird.setPosition(this.birdX, this.birdY);

    // Speed ramp: accelerates faster as score climbs, higher cap
    this.speedTimer++;
    const rampEvery = this.score >= 40 ? 200 : this.score >= 20 ? 280 : 400;
    if (this.speedTimer % rampEvery === 0) {
      const inc = this.score >= 40 ? 0.6 : this.score >= 20 ? 0.5 : 0.4;
      this.speed = Math.min(this.speed + inc, 14);
    }

    // Spawn clouds
    this.spawnTimer++;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this._spawnWave();
    }

    // Move + check clouds
    const toRemove = [];
    for (const c of this.clouds) {
      c.sprite.x -= this.speed;
      if (!c.passed && c.sprite.x + c.sprite.displayWidth / 2 < this.birdX) {
        c.passed = true;
        this.score++;
        this.scoreTxt.setText('Clouds dodged: ' + this.score);
      }
      if (this._hitsBird(c.sprite)) { this._crash('cloud'); return; }
      if (c.sprite.x < -150) toRemove.push(c);
    }
    for (const c of toRemove) {
      c.sprite.destroy();
      this.clouds.splice(this.clouds.indexOf(c), 1);
    }
  }

  _spawnWave() {
    // Wave size grows with score: 1 → 2 → 3 clouds
    const count = this.score >= 30 ? 3 : this.score >= 10 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      const xOffset = i * 130;
      // 25% chance cloud spawns in top zone (y 10–60) to prevent ceiling-hugging
      // At score >= 30 also force one cloud to top zone per wave
      let y;
      const forceTop = (count === 3 && i === 1);
      if (forceTop || Math.random() < 0.25) {
        y = Phaser.Math.Between(10, 60);
      } else {
        y = Phaser.Math.Between(80, this.groundY - 50);
      }
      const frame   = Phaser.Math.Between(0, 3);
      const scale   = Phaser.Math.Between(2, 4);
      const sprite  = this.add.sprite(810 + xOffset, y, 'clouds', frame)
        .setScale(scale).setDepth(5);
      this.clouds.push({ sprite, passed: false });
    }
  }

  _hitsBird(sprite) {
    // Proportional shrink: 22% each side so hitbox = ~56% of visual size — consistent across all cloud scales
    const shrinkX = sprite.displayWidth  * 0.22;
    const shrinkY = sprite.displayHeight * 0.22;
    const r  = this.birdRadius;
    const bx = this.birdX, by = this.birdY;
    const hw = Math.max(4, sprite.displayWidth  / 2 - shrinkX);
    const hh = Math.max(4, sprite.displayHeight / 2 - shrinkY);
    const nearX = Phaser.Math.Clamp(bx, sprite.x - hw, sprite.x + hw);
    const nearY = Phaser.Math.Clamp(by, sprite.y - hh, sprite.y + hh);
    const dx = bx - nearX, dy = by - nearY;
    return dx * dx + dy * dy < r * r;
  }

  _crash(reason) {
    if (this.dead) return;
    this.dead = true;
    if (this.bird.setFrame) this.bird.setFrame(21);

    // Save top-3 scores
    if (this.state) {
      const scores = this.state.birdScores || [];
      scores.push(this.score);
      scores.sort((a, b) => b - a);
      this.state.birdScores = scores.slice(0, 3);
      SaveSystem.save(this.state);
    }

    const msg  = reason === 'ocean' ? '🌊  Hit the ocean!' : '☁️  Hit a cloud!';
    const W = 800, H = 600;
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55).setDepth(30);
    this.add.text(W / 2, H / 2 - 50, msg, {
      fontSize: '28px', color: '#ef4444', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5).setDepth(31);
    this.add.text(W / 2, H / 2 + 10, 'Clouds dodged: ' + this.score, {
      fontSize: '22px', color: '#fbbf24', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(31);
    this.add.text(W / 2, H / 2 + 55, 'Returning to Reine...', {
      fontSize: '14px', color: '#94a3b8', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(31);

    this.time.delayedCall(2200, () => {
      this.scene.stop('BirdWatchingScene');
      this.scene.wake(this.callerScene);
      if (this.scene.isSleeping('UIScene')) this.scene.wake('UIScene');
    });
  }
};


