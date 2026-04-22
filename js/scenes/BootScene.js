window.BootScene = class extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    const bar = this.add.rectangle(400, 320, 0, 20, 0x4a9eff);
    this.load.on('progress', v => bar.setSize(600*v, 20));

    // Ground tiles (16×16)
    const groundTiles = ['tile-grass','tile-grass-flowers-red','tile-grass-flowers-blue','tile-grass-bush',
      'tile-beach','tile-beach-flowers-red','tile-beach-flowers-blue','tile-beach-bush',
      'tile-ocean','tile-deep-ocean',
      'tile-snow','tile-ice','tile-snow-bush','tile-snow-flowers-blue','tile-snow-flowers-red'];
    for (const t of groundTiles) this.load.image(t, `assets/tiles/${t}.png`);

    // Object tiles
    const objTiles = ['obj-mountain-forest','obj-mountain-beach','obj-tree1','obj-tree2',
      'obj-cabin1','obj-cabin2','obj-shop','obj-ferry-zone',
      'obj-lake','obj-island-rock','obj-lake-beach','obj-island-beach',
      'obj-ice-mountain','obj-snow-tree','obj-snow-lake'];
    for (const t of objTiles) this.load.image(t, `assets/tiles/${t}.png`);

    // Character spritesheets
    this.load.spritesheet('boat', 'assets/characters/boat.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ikke-musikk', 'assets/characters/ikke-musikk.png', { frameWidth: 32, frameHeight: 32 });
    for (let i=1; i<=10; i++) {
      this.load.spritesheet(`ow${i}`, `assets/characters/ow${i}.png`, { frameWidth: 32, frameHeight: 32 });
    }
    this.load.spritesheet('im-norway-jacket', `assets/characters/im-norway-jacket.png?v=${Date.now()}`, { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('im-pink-bape',     'assets/characters/im-pink-bape.png',     { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('im-yellow-jacket', 'assets/characters/im-yellow-jacket.png', { frameWidth: 32, frameHeight: 32 });
    this.load.image('bg1', 'assets/backgrounds/background1.png');
    this.load.image('bg2', 'assets/backgrounds/background2.png');
    this.load.image('bg3', 'assets/backgrounds/background3.png');
    this.load.image('soccer-pitch', 'assets/tiles/soccer-pitch.png');
    this.load.image('snowball-arena', 'assets/snowball-arena.png');
    this.load.image('badder-cabin', 'assets/badder-cabin.png');
    this.load.image('kvalvika-key', 'assets/kvalvika-key.png');
    for (let i=1;i<=7;i++) this.load.image(`baricon${i}`, `assets/ui/baricon${i}.png`);
    for (let i=1;i<=16;i++) this.load.image(`menusprite${i}`, `assets/ui/menusprite${i}.png`);
    // Animal icons (shop menu) and idle spritesheets (on-map)
    for (let i=1;i<=16;i++) {
      this.load.image(`animal-icon${i}`, `assets/animals/menu/menusprite${i}.png`);
      this.load.spritesheet(`animal${i}`, `assets/animals/sprite${i}_idle.png`, { frameWidth:96, frameHeight:96 });
    }
  }

  create() {
    const sheets = ['ikke-musikk','ow1','ow2','ow3','ow4','ow5','ow6','ow7','ow8','ow9','ow10','im-norway-jacket','im-pink-bape','im-yellow-jacket'];
    sheets.forEach(key => {
      this.anims.create({ key:`${key}-walk-down`,  frames: this.anims.generateFrameNumbers(key,{start:0,end:3}),  frameRate:8, repeat:-1 });
      this.anims.create({ key:`${key}-walk-left`,  frames: this.anims.generateFrameNumbers(key,{start:4,end:7}),  frameRate:8, repeat:-1 });
      this.anims.create({ key:`${key}-walk-right`, frames: this.anims.generateFrameNumbers(key,{start:8,end:11}), frameRate:8, repeat:-1 });
      this.anims.create({ key:`${key}-walk-up`,    frames: this.anims.generateFrameNumbers(key,{start:12,end:15}),frameRate:8, repeat:-1 });
      this.anims.create({ key:`${key}-idle-down`,  frames:[{key,frame:1}],  frameRate:1 });
      this.anims.create({ key:`${key}-idle-left`,  frames:[{key,frame:5}],  frameRate:1 });
      this.anims.create({ key:`${key}-idle-right`, frames:[{key,frame:9}],  frameRate:1 });
      this.anims.create({ key:`${key}-idle-up`,    frames:[{key,frame:13}], frameRate:1 });
    });
    // Boat animations (strip16: frames 0-3=down, 4-7=left, 8-11=right, 12-15=up)
    this.anims.create({ key:'boat-walk-down',  frames:this.anims.generateFrameNumbers('boat',{start:0, end:3}),  frameRate:8, repeat:-1 });
    this.anims.create({ key:'boat-walk-left',  frames:this.anims.generateFrameNumbers('boat',{start:4, end:7}),  frameRate:8, repeat:-1 });
    this.anims.create({ key:'boat-walk-up',    frames:this.anims.generateFrameNumbers('boat',{start:0, end:3}),  frameRate:8, repeat:-1 });
    this.anims.create({ key:'boat-walk-right', frames:this.anims.generateFrameNumbers('boat',{start:12,end:15}), frameRate:8, repeat:-1 });
    this.anims.create({ key:'boat-idle-down',  frames:[{key:'boat',frame:1}],  frameRate:1 });
    this.anims.create({ key:'boat-idle-left',  frames:[{key:'boat',frame:5}],  frameRate:1 });
    this.anims.create({ key:'boat-idle-up',    frames:[{key:'boat',frame:1}],  frameRate:1 });
    this.anims.create({ key:'boat-idle-right', frames:[{key:'boat',frame:13}], frameRate:1 });
    // Animal idle animations (4 frames each, 96x96)
    for (let i=1;i<=16;i++) {
      this.anims.create({ key:`animal${i}-idle`, frames:this.anims.generateFrameNumbers(`animal${i}`,{start:0,end:3}), frameRate:4, repeat:-1 });
    }

    this.add.image(400, 320, 'bg1').setDisplaySize(800, 640);

    this.add.text(400, 120, 'Fisherman', { fontSize:'72px', color:'#ffffff', fontStyle:'bold', stroke:'#000033', strokeThickness:8 }).setOrigin(0.5);
    this.add.text(400, 200, 'Lofoten', { fontSize:'36px', color:'#7dd3fc', stroke:'#000000', strokeThickness:4 }).setOrigin(0.5);
    this.add.text(400, 248, 'A Norwegian Adventure', { fontSize:'16px', color:'#94a3b8', fontStyle:'italic' }).setOrigin(0.5);

    const hasSave = localStorage.getItem('lofoten_rpg') !== null;
    this.menuItems = hasSave ? ['Continue','New Game'] : ['New Game'];
    this.selectedIndex = 0;
    const startY = hasSave ? 320 : 340;
    this.menuTexts = this.menuItems.map((item, i) =>
      this.add.text(400, startY + i*60, item, { fontSize:'32px', color: i===0?'#ffff00':'#aaaaaa', stroke:'#000000', strokeThickness:3 }).setOrigin(0.5)
    );
    this.cursor = this.add.text(0,0,'>', {fontSize:'24px',color:'#ffff00'});
    this.updateCursor();
    this.add.text(400, 600, 'Up/Down Navigate   ENTER Select', { fontSize:'13px', color:'#475569' }).setOrigin(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.cooldown = 0;
  }

  updateCursor() {
    const sel = this.menuTexts[this.selectedIndex];
    this.cursor.setPosition(sel.x - sel.width/2 - 36, sel.y - 12);
    this.menuTexts.forEach((t,i) => t.setColor(i===this.selectedIndex?'#ffff00':'#aaaaaa'));
  }

  update(time, delta) {
    this.cooldown -= delta;
    if (this.cooldown > 0) return;
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up))   { this.selectedIndex=(this.selectedIndex-1+this.menuItems.length)%this.menuItems.length; this.updateCursor(); this.cooldown=150; }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { this.selectedIndex=(this.selectedIndex+1)%this.menuItems.length; this.updateCursor(); this.cooldown=150; }
    else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) { this.cooldown=300; this.confirmSelection(); }
  }

  confirmSelection() {
    const item = this.menuItems[this.selectedIndex];
    if (item === 'Continue') {
      const state = SaveSystem.load();
      const map = { leknes:'LeknesScene', reine:'ReineScene', kåkern:'KakernScene', kvalvika:'KvalvikaScene', henningsvær:'HenningsvaarScene', tromso:'TromsoScene' };
      this.scene.start(map[state.location]||'LeknesScene');
    } else {
      SaveSystem.clear();
      this.scene.start('CharacterSelectScene');
    }
  }
};
