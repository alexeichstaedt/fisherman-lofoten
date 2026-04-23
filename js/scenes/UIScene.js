window.UIScene = class extends Phaser.Scene {
  constructor() { super({ key: 'UIScene' }); }

  create() {
    this.state = SaveSystem.load();
    this.resultOpen = false;
    this._lastTournamentCheck = 0;
    this._resultOverlayObjects = [];

    // Panel: original 76px — fish row 2 and AURA share the same row
    this.panel = this.add.rectangle(400, 38, 800, 76, 0x000000, 0.80);
    // Row 1
    this.nameText    = this.add.text(8,  4,  '', {fontSize:'13px',color:'#ffffff',fontFamily:'monospace'});
    this.levelText   = this.add.text(8,  18, '', {fontSize:'12px',color:'#fbbf24',fontFamily:'monospace'});
    this.moneyText   = this.add.text(190, 4,  '', {fontSize:'13px',color:'#4ade80',fontFamily:'monospace'});
    this.rodText     = this.add.text(190, 18, '', {fontSize:'12px',color:'#818cf8',fontFamily:'monospace'});
    this.trophyText  = this.add.text(540, 4,  '', {fontSize:'11px',color:'#f59e0b',fontFamily:'monospace'});
    this.trophyCount = this.add.text(540, 17, '', {fontSize:'10px',color:'#94a3b8',fontFamily:'monospace'});
    this.xpBg        = this.add.rectangle(720, 11, 140, 6, 0x1e293b);
    this.xpBar       = this.add.rectangle(650, 11, 0, 6, 0x4ade80).setOrigin(0, 0.5);
    this.levelProgressLabel = this.add.text(650, 22, 'LEVEL', {fontSize:'10px',color:'#94a3b8',fontFamily:'monospace'}).setOrigin(0, 0);
    this.levelProgressVal   = this.add.text(790, 22, '0/1000', {fontSize:'10px',color:'#4ade80',fontFamily:'monospace'}).setOrigin(1, 0);
    // Center: location name
    this.locationText= this.add.text(400, 10, '', {fontSize:'14px',color:'#7dd3fc',fontFamily:'monospace',stroke:'#000',strokeThickness:3}).setOrigin(0.5);
    // Row 2: fish row 1 (left) — full width
    this.invText     = this.add.text(8, 37, '', {fontSize:'10px',color:'#cbd5e1',fontFamily:'monospace'});
    // Row 3: fish row 2 (left) shares row with AURA label+val (right); bar sits just below
    this.invText2    = this.add.text(8, 50, '', {fontSize:'10px',color:'#cbd5e1',fontFamily:'monospace'});
    this.auraLabel   = this.add.text(650, 50, 'AURA', {fontSize:'10px',color:'#94a3b8',fontFamily:'monospace'}).setOrigin(0, 0);
    this.auraVal     = this.add.text(790, 50, '+20',  {fontSize:'10px',color:'#60a5fa',fontFamily:'monospace'}).setOrigin(1, 0);
    this.auraBg      = this.add.rectangle(720, 68, 140, 6, 0x1e293b);
    this.auraBar     = this.add.rectangle(650, 68, 0,   6, 0x3b82f6).setOrigin(0, 0.5);

    // Radio — compact, same column/width as trophies, aligned with aura row
    this.radioIcon     = this.add.text(540, 50, '📻', { fontSize: '10px', fontFamily: 'monospace' }).setOrigin(0, 0);
    this.radioStText   = this.add.text(553, 50, 'Default BGM', { fontSize: '10px', color: '#fbbf24', fontFamily: 'monospace' }).setOrigin(0, 0);
    this.radioSongText = this.add.text(0, -999, '', { fontSize: '9px', color: '#93c5fd', fontFamily: 'monospace' }).setOrigin(0, 0);
    this.radioHint     = this.add.text(0, -999, '', { fontSize: '8px', color: '#475569', fontFamily: 'monospace' }).setOrigin(0, 0);

    // Tournament timer — bottom of screen, hidden when inactive
    this.tournamentTimer = this.add.text(400, 590, '', {
      fontSize: '15px', color: '#fbbf24', fontFamily: 'monospace',
      stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(100).setVisible(false);

    [this.panel,this.nameText,this.levelText,this.trophyText,this.trophyCount,
     this.moneyText,this.rodText,this.xpBg,this.xpBar,this.invText,this.invText2,this.locationText,
     this.levelProgressLabel,this.levelProgressVal,
     this.auraLabel,this.auraVal,this.auraBg,this.auraBar,
     this.radioIcon,this.radioStText,this.radioSongText,this.radioHint].forEach(o=>o.setDepth(100));

    // Keyboard for dismissing results overlay
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey   = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.tKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);

    this.updateDisplay();

    // Initialize radio visibility
    this._updateRadioDial();

    this.game.events.on('updateUI', state => { this.state = state; this.updateDisplay(); });
    this.game.events.on('levelUp', lvl => {
      const t = this.add.text(400, 300, 'LEVEL UP! ' + lvl, {fontSize:'32px',color:'#ffff00',stroke:'#000000',strokeThickness:5}).setOrigin(0.5).setDepth(200);
      this.tweens.add({targets:t, y:200, alpha:0, duration:2000, onComplete:()=>t.destroy()});
    });
    this.game.events.on('trophy', name => {
      this.updateDisplay();  // refresh count immediately
      const t = this.add.text(400, 300, '🏆 Trophy: ' + name + '!', {fontSize:'22px',color:'#f59e0b',stroke:'#000000',strokeThickness:5}).setOrigin(0.5).setDepth(200);
      this.tweens.add({targets:t, y:180, alpha:0, duration:3000, onComplete:()=>t.destroy()});
    });
  }

  update(time) {
    // Handle results overlay dismissal
    if (this.resultOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.escKey)) {
        this._dismissResults();
      }
      return;
    }

    // Radio controls
    if (Phaser.Input.Keyboard.JustDown(this.tKey)) {
      this._cycleStation(1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this._cycleRadioSong(1);
    }

    // Throttle tournament check to once per second
    if (time - this._lastTournamentCheck < 1000) return;
    this._lastTournamentCheck = time;

    if (!this.state.tournamentActive || !this.state.tournamentEndTime) return;

    const remaining = this.state.tournamentEndTime - Date.now();
    if (remaining <= 0) {
      this.endTournament();
    } else {
      const totalSec = Math.ceil(remaining / 1000);
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      const pad = n => String(n).padStart(2, '0');
      this.tournamentTimer.setText('🎣 TOURNAMENT  ' + mins + ':' + pad(secs)).setVisible(true);
    }
  }

  _getRadioStations() {
    const s = this.state || {};
    // Station 0: Default BGM (single track)
    const stations = [{ name: 'Default BGM', songs: ['Default BGM'] }];
    // Station 1: My Records — all owned records as a playlist
    const records = s.ownedRecords || [];
    if (records.length > 0) {
      stations.push({ name: 'My Records', songs: [...records] });
    }
    // Stations 2-4: each made album (up to 3)
    (s.myAlbums || []).forEach(album => {
      stations.push({ name: album.title, songs: album.tracks || [] });
    });
    return stations;
  }

  _updateRadioDial() {
    const s = this.state || {};
    const visible = !!s.hasRadio;
    this.radioIcon.setVisible(visible);
    this.radioStText.setVisible(visible);
    this.radioSongText.setVisible(false);
    this.radioHint.setVisible(false);
    if (visible) {
      const stations = this._getRadioStations();
      const stIdx   = Math.max(0, Math.min(s.radioStation || 0, stations.length - 1));
      const stName  = stations[stIdx].name;
      // Truncate to fit within the 87px text area (~13 chars at monospace 10px)
      this.radioStText.setText(stName.length > 13 ? stName.slice(0, 12) + '…' : stName);
    }
  }

  _cycleStation(dir) {
    const s = this.state;
    if (!s || !s.hasRadio) return;
    const stations = this._getRadioStations();
    s.radioStation    = ((s.radioStation || 0) + dir + stations.length) % stations.length;
    s.radioSongIndex  = 0;
    SaveSystem.save(s);
    this._updateRadioDial();
  }

  _cycleRadioSong(dir) {
    const s = this.state;
    if (!s || !s.hasRadio) return;
    const stations = this._getRadioStations();
    const stIdx   = Math.max(0, Math.min(s.radioStation || 0, stations.length - 1));
    const songs   = stations[stIdx].songs || [];
    if (songs.length === 0) return;
    s.radioSongIndex = ((s.radioSongIndex || 0) + dir + songs.length) % songs.length;
    SaveSystem.save(s);
    this._updateRadioDial();
  }

  endTournament() {
    if (this.resultOpen) return;
    this.resultOpen = true;
    this.state.tournamentActive = false;

    const playerBest = this.state.tournamentBestFish;
    const playerWeight = playerBest ? playerBest.weight : 0;

    // Generate 9 rivals with random catches between 40–400 kg
    const allNames = ['Erik','Lars','Bjørn','Ingrid','Astrid','Olaf','Sigrid','Magnus','Freya','Gunnar','Kari','Tor','Helga','Leif','Signe'];
    const shuffled = allNames.slice().sort(() => Math.random() - 0.5);
    const rivals = shuffled.slice(0, 9).map(name => {
      const w = Math.floor(Math.random() * 361) + 40; // 40–400 kg
      return { name, weight: w };
    });

    // Build sorted leaderboard
    const entries = [
      { name: this.state.playerName || 'You', weight: playerWeight, isPlayer: true },
      ...rivals.map(r => ({ name: r.name, weight: r.weight, isPlayer: false }))
    ].sort((a, b) => b.weight - a.weight);

    const playerRank = entries.findIndex(e => e.isPlayer) + 1;
    const playerWon = playerRank === 1;

    if (playerWon) {
      this.state.grandTrophy = true;
    }
    SaveSystem.saveNow(this.state);
    this.tournamentTimer.setVisible(false);
    this.game.events.emit('updateUI', this.state);

    this._showResultsOverlay(entries, playerRank, playerWon);
  }

  _showResultsOverlay(entries, playerRank, playerWon) {
    const objs = this._resultOverlayObjects;

    // Background — tap to dismiss
    const bg = this.add.rectangle(400, 320, 800, 640, 0x000000, 0.88).setDepth(300).setScrollFactor(0);
    bg.setInteractive().on('pointerdown', () => this._dismissResults());
    objs.push(bg);

    // Title
    const title = this.add.text(400, 80, '🏆 GRAND TOURNAMENT RESULTS', {
      fontSize: '22px', color: '#f59e0b', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setDepth(301).setScrollFactor(0);
    objs.push(title);

    const medals = ['🥇', '🥈', '🥉', '4.', '5.', '6.', '7.', '8.', '9.', '10.'];
    entries.forEach((entry, i) => {
      const y = 130 + i * 40;
      const medal = medals[i] || (i + 1) + '.';
      const youTag = entry.isPlayer ? ' ←YOU' : '';
      const fishInfo = entry.weight > 0 ? entry.weight + ' kg' : 'no catch';
      const color = entry.isPlayer ? '#fbbf24' : '#e2e8f0';
      const line = this.add.text(400, y,
        medal.padEnd(4) + entry.name.padEnd(10) + fishInfo + youTag,
        { fontSize: '15px', color, fontFamily: 'monospace', stroke: '#000', strokeThickness: 3 }
      ).setOrigin(0.5).setDepth(301).setScrollFactor(0);
      objs.push(line);
    });

    // Result message
    const resultMsg = playerWon
      ? '🏆 Congrats ' + (this.state.playerName || 'Ikke Musikk') + ', you just won the Grand Fishing Tournament of Lofoten. You are King of the North!'
      : 'Rank #' + playerRank + ' — keep fishing!';
    const resultColor = playerWon ? '#4ade80' : '#94a3b8';
    const msg = this.add.text(400, 545, resultMsg, {
      fontSize: playerWon ? '15px' : '20px', color: resultColor, fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3, wordWrap: { width: 560 }, align: 'center'
    }).setOrigin(0.5).setDepth(301).setScrollFactor(0);
    objs.push(msg);

    const hint = this.add.text(400, 600, 'Tap or ENTER / ESC to continue', {
      fontSize: '13px', color: '#64748b', fontFamily: 'monospace'
    }).setOrigin(0.5).setDepth(302).setScrollFactor(0);
    objs.push(hint);
  }

  _dismissResults() {
    this._resultOverlayObjects.forEach(o => o.destroy());
    this._resultOverlayObjects = [];
    this.resultOpen = false;
    this.state.tournamentActive = false;
    this.state.tournamentEndTime = null;
    SaveSystem.save(this.state);
    this.game.events.emit('updateUI', this.state);
  }

  updateDisplay() {
    const s = this.state;
    this.nameText.setText(s.playerName || 'Fisher');
    this.levelText.setText('LVL ' + s.level);
    const trophies = s.trophies || [];
    const total = GAME_DATA.TROPHY_FISH.length;
    const crown = s.grandTrophy ? ' 👑' : '';
    this.trophyText.setText(trophies.length ? '🏆'.repeat(Math.min(trophies.length,5)) + crown : '');
    this.trophyText.setColor(s.grandTrophy ? '#f59e0b' : '#94a3b8');
    this.trophyCount.setText('(' + trophies.length + ' / ' + total + ' trophies)');
    this.trophyCount.setColor(trophies.length >= total ? '#f59e0b' : '#64748b');
    const locNames = {leknes:'Leknes',reine:'Reine','kåkern':'Kåkern',kvalvika:'Kvalvika','henningsvær':'Henningsvær',tromso:'Tromsø'};
    this.locationText.setText(locNames[s.location] || '');
    this.moneyText.setText('NOK ' + s.money.toLocaleString());
    const rod = GAME_DATA.RODS[s.rod];
    this.rodText.setText((s.rod ? (rod ? rod.name : 'Basic Rod') : 'No Rod') + (s.hasBoat ? ' [BOAT]' : ''));
    const xpPct = s.xp / (s.level * 1000);
    this.xpBg.setSize(140, 6);
    this.xpBar.setSize(Math.max(0, Math.floor(140*xpPct)), 6);
    this.levelProgressVal.setText(s.xp + ' / ' + (s.level * 1000));
    const aura = (typeof s.aura !== 'undefined') ? s.aura : 20;
    const auraPct = Math.abs(aura) / 100;
    this.auraBg.setSize(140, 6);
    this.auraBar.setSize(Math.max(0, Math.floor(140 * auraPct)), 6);
    this.auraBar.setFillStyle(aura >= 0 ? 0x3b82f6 : 0xef4444);
    const auraColor = aura >= 0 ? '#60a5fa' : '#f87171';
    this.auraVal.setText((aura >= 0 ? '+' : '') + aura).setColor(auraColor);
    const inv = s.inventory || [];
    if (inv.length === 0) {
      this.invText.setText('No fish');
      this.invText2.setText('');
    } else {
      const parts = inv.map(f => {
        const icon = f.magical ? '✨' : (f.rarity === 'legendary' || f.rarity === 'secret') ? '🌟' : (f.rarity === 'rare') ? '⭐' : '🐟';
        return icon + f.name + ' ' + f.weight + 'kg';
      });
      const row1 = parts.slice(0, 3).join('  ·  ');
      const row2 = parts.slice(3, 6).join('  ·  ');
      this.invText.setText(row1);
      this.invText2.setText(row2);
    }
    // Tournament timer visibility
    if (this.tournamentTimer) {
      if (!s.tournamentActive) this.tournamentTimer.setVisible(false);
    }
    this._updateRadioDial();
  }
};
