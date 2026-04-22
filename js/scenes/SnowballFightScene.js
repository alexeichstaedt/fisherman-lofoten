// SnowballFightScene — 60-second snowball fight mini-game.
// Player on the left, NPC on the right, center dividing line.
// ARROWS/WASD to dodge, SPACE to throw.
// Most hits on opponent wins. Win = +3 Aura, Loss = -3 Aura.

window.SnowballFightScene = class SnowballFightScene extends Phaser.Scene {
  constructor() { super({ key: 'SnowballFightScene' }); }

  // Lazy-load snowball frames only when this scene is used
  preload() {
    for (let i = 1; i <= 6; i++) {
      const key = 'snowball_0' + i;
      if (!this.textures.exists(key)) {
        this.load.image(key, 'assets/snowball_0' + i + '.png');
      }
    }
  }

  init(data) {
    this.callerScene = data.callerScene || 'TromsoScene';
    this.charKey     = data.charKey || 'ikke-musikk';
    this.state       = data.state || null;

    this.gameOver   = false;
    this.started    = false;
    this.timeLeft   = 60;

    // hit counters (hits RECEIVED by each side)
    this.playerHits = 0;
    this.npcHits    = 0;

    // player position & facing
    this.px      = 180;
    this.py      = 300;
    this.pSpeed  = 160; // px/s
    this.facing  = 'right'; // always faces right (toward NPC) unless moving
    this.playerThrowCooldown = 0; // ms since last throw; must reach 1000 to throw again

    // NPC position (right half)
    this.nx = 620;
    this.ny = 300;
    this.nFacing = 'left';  // NPC faces left (toward player) by default
    this.npcMoveTimer  = 0;
    this.npcMoveTarget = { x: 620, y: 300 };
    this.npcThrowTimer = 0;
    this.elapsed       = 0; // total game time in ms (for difficulty ramp)

    // snowballs in flight: {x, y, vx, vy, owner, sprite}
    this.snowballs = [];

    // animation frame cycling
    this.sbFrame     = 0;
    this.sbFrameTick = 0;
  }

  create() {
    const W = 800, H = 600;

    // ── Background ──────────────────────────────────────────────────────────
    // Sky
    this.add.rectangle(W/2, H/2, W, H, 0xc8e8ff).setDepth(0);
    // Snow ground
    this.add.rectangle(W/2, H - 24, W, 48, 0xeaf6ff).setDepth(1)
      .setStrokeStyle(2, 0xaad4f0);
    // Snowy hills (decorative)
    this.add.ellipse(150, H - 24, 260, 80, 0xddf0ff).setDepth(1);
    this.add.ellipse(650, H - 24, 300, 90, 0xddf0ff).setDepth(1);

    // Centre dividing line
    this.add.rectangle(W/2, H/2, 3, H, 0x4488bb, 0.55).setDepth(3);
    this.add.text(W/2, H/2 - 130, 'SNOWBALL\nARENÅ', {
      fontSize: '11px', color: '#4488bb', fontFamily: 'monospace', align: 'center'
    }).setOrigin(0.5).setDepth(3);

    // Side labels
    this.add.text(180, 28, 'YOU', {
      fontSize: '16px', color: '#1e3a5f', fontFamily: 'monospace',
      stroke: '#ffffff', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10);
    this.add.text(620, 28, 'FIGHTER', {
      fontSize: '16px', color: '#1e3a5f', fontFamily: 'monospace',
      stroke: '#ffffff', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10);

    // Timer
    this.timerTxt = this.add.text(W/2, 14, '⏱ 1:00', {
      fontSize: '22px', color: '#1e3a5f', fontFamily: 'monospace',
      stroke: '#ffffff', strokeThickness: 4
    }).setOrigin(0.5, 0).setDepth(20);

    // Hit counters (hits received = bad)
    this.playerHitTxt = this.add.text(180, 52, '❄ Hits: 0', {
      fontSize: '13px', color: '#cc2222', fontFamily: 'monospace',
      stroke: '#ffffff', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10);
    this.npcHitTxt = this.add.text(620, 52, '❄ Hits: 0', {
      fontSize: '13px', color: '#2255cc', fontFamily: 'monospace',
      stroke: '#ffffff', strokeThickness: 3
    }).setOrigin(0.5).setDepth(10);

    // ── Sprites ──────────────────────────────────────────────────────────────
    if (this.textures.exists(this.charKey)) {
      this.playerSprite = this.add.sprite(this.px, this.py, this.charKey, 9)
        .setScale(2.5).setDepth(8);
      // Start facing right (toward the opponent)
      this.playerSprite.play(this.charKey + '-idle-right', true);
    } else {
      this.playerSprite = this.add.rectangle(this.px, this.py, 28, 40, 0x2255cc)
        .setDepth(8);
    }

    this.npcSprite = this.add.sprite(this.nx, this.ny, 'ow5', 5)
      .setScale(2.5).setDepth(8);
    this.npcSprite.play('ow5-idle-left', true);

    // ── Input ────────────────────────────────────────────────────────────────
    this.cursors  = this.input.keyboard.createCursorKeys();
    this.wasd     = {
      up:    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // ── Countdown timer ──────────────────────────────────────────────────────
    this._tickEvent = this.time.addEvent({
      delay: 1000,
      repeat: 59,
      callback: () => {
        if (this.gameOver) return;
        this.timeLeft = Math.max(0, this.timeLeft - 1);
        this.timerTxt.setText('⏱ ' + (this.timeLeft >= 60 ? '1:00' : '0:' + String(this.timeLeft).padStart(2, '0')));
        if (this.timeLeft <= 10) this.timerTxt.setColor('#ef4444');
        if (this.timeLeft === 0) this._endGame();
      }
    });

    // ── HUD ──────────────────────────────────────────────────────────────────
    if (this.scene.isActive('UIScene')) this.scene.sleep('UIScene');

    // Instructions bar
    this.add.text(W/2, H - 10, 'ARROWS/WASD: dodge   SPACE: throw', {
      fontSize: '11px', color: '#335577', fontFamily: 'monospace'
    }).setOrigin(0.5, 1).setDepth(10);

    // Start overlay
    this._startOverlay = this.add.container(0, 0).setDepth(30).setScrollFactor(0);
    const oRect = this.add.rectangle(W/2, H/2, 420, 160, 0x0f172a, 0.92)
      .setStrokeStyle(2, 0x7dd3fc);
    const oTxt = this.add.text(W/2, H/2 - 28, '❄  SNOWBALL FIGHT!', {
      fontSize: '22px', color: '#7dd3fc', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);
    const oSub = this.add.text(W/2, H/2 + 14, 'Press SPACE to start!', {
      fontSize: '14px', color: '#cbd5e1', fontFamily: 'monospace'
    }).setOrigin(0.5);
    this._startOverlay.add([oRect, oTxt, oSub]);
  }

  update(time, delta) {
    if (this.gameOver) return;
    const dt = delta / 1000;

    // ── Wait for start ───────────────────────────────────────────────────────
    if (!this.started) {
      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.started = true;
        if (this._startOverlay) { this._startOverlay.destroy(); this._startOverlay = null; }
      }
      return;
    }

    // ── Track elapsed game time (for NPC difficulty ramp) ────────────────────
    this.elapsed += delta;

    // ── Player throw cooldown ────────────────────────────────────────────────
    this.playerThrowCooldown += delta;

    // ── Player movement ──────────────────────────────────────────────────────
    let dx = 0, dy = 0;
    if (this.cursors.left.isDown  || this.wasd.left.isDown)  dx -= 1;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx += 1;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    dy -= 1;
    if (this.cursors.down.isDown  || this.wasd.down.isDown)  dy += 1;

    if (dx !== 0 || dy !== 0) {
      const len = Math.sqrt(dx*dx + dy*dy);
      this.px = Phaser.Math.Clamp(this.px + (dx/len) * this.pSpeed * dt, 20,  385);
      this.py = Phaser.Math.Clamp(this.py + (dy/len) * this.pSpeed * dt, 70, 530);
      if (this.playerSprite.setPosition) this.playerSprite.setPosition(this.px, this.py);

      // Determine primary direction for animation
      let newFacing;
      if (Math.abs(dx) >= Math.abs(dy)) {
        newFacing = dx > 0 ? 'right' : 'left';
      } else {
        newFacing = dy > 0 ? 'down' : 'up';
      }
      if (newFacing !== this.facing) {
        this.facing = newFacing;
        if (this.playerSprite.play) {
          this.playerSprite.play(this.charKey + '-walk-' + this.facing, true);
        }
      }
    } else {
      // Idle — always face right (toward the opponent)
      if (this.facing !== 'right') {
        this.facing = 'right';
        if (this.playerSprite.play) {
          this.playerSprite.play(this.charKey + '-idle-right', true);
        }
      }
    }

    // Player throw (1-second cooldown)
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.playerThrowCooldown >= 1000) {
      this.playerThrowCooldown = 0;
      this._throw('player', this.px, this.py, this.nx, this.ny);
    }

    // ── NPC AI ───────────────────────────────────────────────────────────────
    // NPC throw interval ramps from 900ms → 400ms as game progresses
    const npcThrowInterval = this.elapsed < 15000 ? 900
                           : this.elapsed < 30000 ? 700
                           : this.elapsed < 45000 ? 550
                           : 400;
    // NPC movement speed ramps too
    const npcMoveSpeed = this.elapsed < 20000 ? 110
                       : this.elapsed < 40000 ? 160
                       : 220;

    // Drift toward move target (change target more frequently as game goes on)
    this.npcMoveTimer += delta;
    const npcRetargetInterval = this.elapsed < 20000 ? 1000 : this.elapsed < 40000 ? 800 : 550;
    if (this.npcMoveTimer >= npcRetargetInterval) {
      this.npcMoveTimer = 0;
      this.npcMoveTarget = {
        x: Phaser.Math.Between(430, 760),
        y: Phaser.Math.Between(80, 510)
      };
    }
    const nDx = this.npcMoveTarget.x - this.nx;
    const nDy = this.npcMoveTarget.y - this.ny;
    const nDist = Math.sqrt(nDx*nDx + nDy*nDy);
    if (nDist > 2) {
      this.nx += (nDx/nDist) * npcMoveSpeed * dt;
      this.ny += (nDy/nDist) * npcMoveSpeed * dt;

      // Determine NPC facing direction from movement
      let newNFacing;
      if (Math.abs(nDx) >= Math.abs(nDy)) {
        newNFacing = nDx > 0 ? 'right' : 'left';
      } else {
        newNFacing = nDy > 0 ? 'down' : 'up';
      }
      if (newNFacing !== this.nFacing) {
        this.nFacing = newNFacing;
        if (this.npcSprite && this.npcSprite.play) this.npcSprite.play('ow5-walk-' + this.nFacing, true);
      }
    } else {
      // NPC idle — always face left (toward the player)
      if (this.nFacing !== 'left') {
        this.nFacing = 'left';
        if (this.npcSprite && this.npcSprite.play) this.npcSprite.play('ow5-idle-left', true);
      }
    }
    if (this.npcSprite && this.npcSprite.setPosition) this.npcSprite.setPosition(this.nx, this.ny);

    // NPC throws on dynamic interval
    this.npcThrowTimer += delta;
    if (this.npcThrowTimer >= npcThrowInterval) {
      this.npcThrowTimer = 0;
      this._throw('npc', this.nx, this.ny, this.px, this.py);
    }

    // ── Snowball frame cycling ───────────────────────────────────────────────
    this.sbFrameTick++;
    if (this.sbFrameTick >= 5) {
      this.sbFrameTick = 0;
      this.sbFrame = (this.sbFrame + 1) % 6;
    }
    const frameKey = 'snowball_0' + (this.sbFrame + 1);

    // ── Move & collide snowballs ─────────────────────────────────────────────
    const toRemove = [];
    for (const sb of this.snowballs) {
      sb.x += sb.vx * dt;
      sb.y += sb.vy * dt;
      if (sb.sprite) {
        sb.sprite.setPosition(sb.x, sb.y);
        if (this.textures.exists(frameKey)) sb.sprite.setTexture(frameKey);
      }

      // Off-screen
      if (sb.x < -60 || sb.x > 860 || sb.y < -60 || sb.y > 660) {
        toRemove.push(sb);
        continue;
      }

      // Hit detection
      if (sb.owner === 'npc') {
        if (Math.hypot(sb.x - this.px, sb.y - this.py) < 24) {
          this.playerHits++;
          this.playerHitTxt.setText('❄ Hits: ' + this.playerHits);
          this._flashHit(this.playerSprite);
          toRemove.push(sb);
        }
      } else {
        if (Math.hypot(sb.x - this.nx, sb.y - this.ny) < 24) {
          this.npcHits++;
          this.npcHitTxt.setText('❄ Hits: ' + this.npcHits);
          this._flashHit(this.npcSprite);
          toRemove.push(sb);
        }
      }
    }

    for (const sb of toRemove) {
      if (sb.sprite) sb.sprite.destroy();
      const idx = this.snowballs.indexOf(sb);
      if (idx !== -1) this.snowballs.splice(idx, 1);
    }
  }

  _throw(owner, fromX, fromY, toX, toY) {
    const speed  = 380;
    const angle  = Math.atan2(toY - fromY, toX - fromX);
    const vx     = Math.cos(angle) * speed;
    const vy     = Math.sin(angle) * speed;
    const texKey = this.textures.exists('snowball_01') ? 'snowball_01' : null;
    const sprite = texKey
      ? this.add.image(fromX, fromY, texKey).setScale(0.055).setDepth(9)
      : this.add.circle(fromX, fromY, 7, 0xffffff).setDepth(9);
    this.snowballs.push({ x: fromX, y: fromY, vx, vy, owner, sprite });
  }

  _flashHit(target) {
    if (!target || !target.setAlpha) return;
    this.tweens.add({
      targets: target, alpha: 0.15, duration: 70, yoyo: true, repeat: 2,
      onComplete: () => { if (target && target.active) target.setAlpha(1); }
    });
  }

  _endGame() {
    if (this.gameOver) return;
    this.gameOver = true;

    // Destroy all snowballs
    for (const sb of this.snowballs) { if (sb.sprite) sb.sprite.destroy(); }
    this.snowballs = [];

    // player wins if they landed MORE hits on the npc
    const playerWon = this.npcHits > this.playerHits;

    if (this.state) {
      if (playerWon) {
        this.state.money = (this.state.money || 0) + 500;
        this.state.aura  = Phaser.Math.Clamp((this.state.aura || 0) + 3, -100, 100);
      } else {
        this.state.aura  = Phaser.Math.Clamp((this.state.aura || 0) - 10, -100, 100);
      }
      SaveSystem.save(this.state);
      this.game.events.emit('updateUI', this.state);
    }

    const auraDelta = playerWon ? 3 : -10;

    const W = 800, H = 600;
    const col = playerWon ? 0x4ade80 : 0xef4444;
    this.add.rectangle(W/2, H/2, 500, 290, 0x0f172a, 0.96)
      .setStrokeStyle(2, col).setDepth(50);
    this.add.text(W/2, H/2 - 100, playerWon ? '🏆 YOU WON!' : '❄ YOU LOST!', {
      fontSize: '30px', color: playerWon ? '#4ade80' : '#ef4444',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W/2, H/2 - 48, `Your hits on opponent: ${this.npcHits}`, {
      fontSize: '15px', color: '#4ade80', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W/2, H/2 - 22, `Opponent's hits on you: ${this.playerHits}`, {
      fontSize: '15px', color: '#ef4444', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51);
    this.add.text(W/2, H/2 + 18, (auraDelta > 0 ? '+' : '') + auraDelta + ' Aura' + (playerWon ? ' ✨' : ' 💔'), {
      fontSize: '20px', color: playerWon ? '#fbbf24' : '#94a3b8',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(51);
    if (playerWon) {
      this.add.text(W/2, H/2 + 46, '+500 NOK 💰', {
        fontSize: '16px', color: '#4ade80', fontFamily: 'monospace', stroke: '#000', strokeThickness: 2
      }).setOrigin(0.5).setDepth(51);
    }
    this.add.text(W/2, H/2 + 80, 'Press SPACE or ESC to leave', {
      fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(51);

    this.input.keyboard.once('keydown-SPACE', () => this._exit());
    this.input.keyboard.once('keydown-ESC',   () => this._exit());
  }

  _exit() {
    if (this.scene.isSleeping('UIScene') || this.scene.isActive('UIScene')) {
      this.scene.wake('UIScene');
    } else {
      this.scene.launch('UIScene');
    }
    if (this.state) this.game.events.emit('updateUI', this.state);
    this.scene.stop('SnowballFightScene');
    this.scene.wake(this.callerScene);
  }
};
