window.CharacterSelectScene = class extends Phaser.Scene {
  constructor() { super({ key: 'CharacterSelectScene' }); }

  create() {
    const CHARACTERS = [
      { key: 'ikke-musikk', name: 'Ikke Musikk' },
    ];

    this.characters = CHARACTERS;
    this.selectedIndex = 0;

    // Background
    this.add.image(400, 320, 'bg2').setDisplaySize(800, 640);
    this.add.rectangle(400, 320, 800, 640, 0x000000, 0.55);

    // Title
    this.add.text(400, 38, 'Choose Your Fisherman', {
      fontSize: '30px', color: '#ffffff', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5);
    this.add.text(400, 75, 'Who will cast the line in Lofoten?', {
      fontSize: '15px', color: '#94a3b8', fontStyle: 'italic'
    }).setOrigin(0.5);

    // Character grid: 5 per row, 3 rows
    this.cards = CHARACTERS.map((c, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 85 + col * 128;
      const y = 165 + row * 155;

      // Card bg
      const cardBg = this.add.rectangle(x, y, 100, 150, 0x1e293b, 0.9)
        .setStrokeStyle(2, 0x38bdf8)
        .setInteractive({ useHandCursor: true });

      // Tap: first tap selects, second tap confirms
      cardBg.on('pointerdown', () => {
        if (this.selectedIndex === i) {
          this.confirmSelection();
        } else {
          this.selectedIndex = i;
          this.updateSelection();
        }
      });

      // Animated sprite (idle-down)
      const sprite = this.add.sprite(x, y - 22, c.key, 1)
        .setScale(2.2)
        .play(`${c.key}-idle-down`, true);

      // Name label
      const label = this.add.text(x, y + 52, c.name, {
        fontSize: '12px', color: '#e2e8f0', fontFamily: 'monospace',
        stroke: '#000000', strokeThickness: 2
      }).setOrigin(0.5);

      // "Ikke Musikk" badge
      const badge = i === 0
        ? this.add.text(x, y + 66, '★ Default', {
            fontSize: '10px', color: '#fbbf24', fontFamily: 'monospace'
          }).setOrigin(0.5)
        : null;

      return { cardBg, sprite, label, badge, x, y };
    });

    // Selection highlight (separate so it renders on top)
    this.highlight = this.add.rectangle(0, 0, 108, 158, 0x000000, 0)
      .setStrokeStyle(3, 0xfef08a);

    // Name display
    this.nameDisplay = this.add.text(400, 558, '', {
      fontSize: '22px', color: '#fef08a', fontStyle: 'bold',
      stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5);

    this.subDisplay = this.add.text(400, 585, '', {
      fontSize: '13px', color: '#94a3b8', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(400, 620, 'Tap card to select  ·  Tap again to confirm  ·  ENTER / SPACE', {
      fontSize: '13px', color: '#475569', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.cooldown = 0;

    this.updateSelection();
  }

  updateSelection() {
    const c = this.characters[this.selectedIndex];
    const card = this.cards[this.selectedIndex];

    // Move highlight
    this.highlight.setPosition(card.x, card.y);

    // Update name display
    this.nameDisplay.setText(c.name);
    const descs = {
      'ikke-musikk': 'The legendary fisherman of Lofoten.',
      ow2:    'A fearless angler from Reine.',
      ow3:    'Veteran sailor of the Norwegian Sea.',
      ow4:    'Champion of the Henningsvær Regatta.',
      ow5:    'Mountain guide turned deep-sea fisher.',
      ow6:    'Knows every fishing spot in Lofoten.',
      ow7:    'Silent but deadly with a rod.',
      ow8:    'Collector of legendary fish stories.',
      ow9:    'Has caught an Orca — twice.',
      ow10:   'The fastest math solver in the fjords.',
      'im-norway-jacket': 'Repping the flag. Red, white and blue on the water.',
      'im-pink-bape':     'Dripped out at the docks. Fresh fit, fresh catch.',
      'im-yellow-jacket': 'Bright as the midnight sun. Can\'t miss this guy.',
    };
    this.subDisplay.setText(descs[c.key] || '');

    // Play walk-down animation on selected, idle on others
    this.cards.forEach((card, i) => {
      const ch = this.characters[i];
      if (i === this.selectedIndex) {
        card.sprite.play(`${ch.key}-walk-down`, true);
        card.cardBg.setStrokeStyle(2, 0xfef08a).setFillStyle(0x1e3a5f, 0.95);
        card.label.setColor('#fef08a');
      } else {
        card.sprite.play(`${ch.key}-idle-down`, true);
        card.cardBg.setStrokeStyle(2, 0x38bdf8).setFillStyle(0x1e293b, 0.9);
        card.label.setColor('#e2e8f0');
      }
    });
  }

  update(time, delta) {
    this.cooldown -= delta;
    if (this.cooldown > 0) return;

    const cols = 5;
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      if (this.selectedIndex % cols > 0) this.selectedIndex--;
      this.updateSelection(); this.cooldown = 150;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      if (this.selectedIndex % cols < cols - 1 && this.selectedIndex < this.characters.length - 1) this.selectedIndex++;
      this.updateSelection(); this.cooldown = 150;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      if (this.selectedIndex >= cols) this.selectedIndex -= cols;
      this.updateSelection(); this.cooldown = 150;
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      if (this.selectedIndex + cols < this.characters.length) this.selectedIndex += cols;
      this.updateSelection(); this.cooldown = 150;
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.confirmSelection();
    }
  }

  confirmSelection() {
    const chosen = this.characters[this.selectedIndex];
    this.tweens.add({
      targets: this.cards[this.selectedIndex].cardBg,
      alpha: 0, duration: 80, yoyo: true, repeat: 3,
      onComplete: () => this._finishCharacterSelect(chosen, 'Ikke Musikk')
    });
  }

  _finishCharacterSelect(chosen, playerName) {
    const state = SaveSystem.load();
    state.characterKey = chosen.key;
    state.playerName = playerName;
    SaveSystem.save(state);
    this.scene.start('LeknesScene');
  }
};
