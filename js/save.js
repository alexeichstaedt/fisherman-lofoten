// Fisherman: Lofoten — © 2026 Eichstaedt Ikke Musikk. All rights reserved.
window.SaveSystem = {
  DEFAULT: { playerName:'Ikke Musikk', level:1, xp:0, money:1000, rod:null, hasBoat:false, inventory:[], trophies:[], top10:[], grandTrophy:false, location:'leknes', x:14, y:14, characterKey:'ikke-musikk', companion:null, animals:[], hasTromsoTicket:false, followAnimalId:null, usedIdioms:[], ownedJackets:[], ownedCabins:[], cabinEarnings:0, hasFerryPass:false, hasSeenWelcome:false, hasReceivedStarterKit:false, aura: 20, playerItems: [], baddiesCaught: [], hatersDefeated: [], usaPassportTx: null, norPassportTx: null, norPassportTy: null, hasUsaPassport: false, hasNorPassport: false, tournamentActive: false, tournamentBestFish: null, tournamentEndTime: null, ownedRecords: ['Fisherman','Stranger on the Highway','Kvalvika Beach','Northern Trucker','More than a Brother','Arktis Magi','Rockstar'], myAlbums: [], hasRadio: true, radioStation: 0, radioSongIndex: 0, dragCatches: [], hasKvalvikaKey: false, hasBadderCabin: false, hasTromsoSongs: false, followingBaddieName: null, skilpaddeLastPlayed: null, hasHarpoon: false },
  _timer: null,
  _pending: null,
  save(s) {
    this._pending = s;
    if (this._timer) return;
    this._timer = setTimeout(() => {
      if (this._pending) localStorage.setItem('lofoten_rpg', JSON.stringify(this._pending));
      this._timer = null;
      this._pending = null;
    }, 50);
  },
  saveNow(s) {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    this._pending = null;
    localStorage.setItem('lofoten_rpg', JSON.stringify(s));
  },
  load() {
    const s=localStorage.getItem('lofoten_rpg');
    if (!s) return {...this.DEFAULT};
    const raw=JSON.parse(s);
    const d={...this.DEFAULT,...raw};
    if (d.characterKey==='player') d.characterKey='ikke-musikk';
    if (!d.animals) d.animals=[];
    if (!d.trophies) d.trophies=[];
    if (!d.ownedJackets) d.ownedJackets=[];
    if (!d.ownedCabins) d.ownedCabins=[];
    if (!d.cabinEarnings) d.cabinEarnings=0;
    if (typeof d.aura === 'undefined') d.aura = 20;
    if (!d.playerItems) d.playerItems = [];
    if (!d.baddiesCaught) d.baddiesCaught = [];
    if (!d.hatersDefeated) d.hatersDefeated = [];
    if (typeof d.usaPassportTx === 'undefined') d.usaPassportTx = null;
    if (typeof d.norPassportTx === 'undefined') d.norPassportTx = null;
    if (typeof d.norPassportTy === 'undefined') d.norPassportTy = null;
    if (typeof d.hasUsaPassport === 'undefined') d.hasUsaPassport = false;
    if (typeof d.hasNorPassport === 'undefined') d.hasNorPassport = false;
    if (typeof d.tournamentActive === 'undefined') d.tournamentActive = false;
    if (typeof d.tournamentBestFish === 'undefined') d.tournamentBestFish = null;
    if (typeof d.tournamentEndTime === 'undefined') d.tournamentEndTime = null;
    if (!d.ownedRecords) d.ownedRecords = ['Fisherman','Stranger on the Highway','Kvalvika Beach','Northern Trucker','More than a Brother','Arktis Magi','Rockstar'];
    if (!d.myAlbums) d.myAlbums = [];
    if (d.hasRadio === undefined || d.hasRadio === false) d.hasRadio = true;
    if (typeof d.radioStation !== 'number') d.radioStation = 0;
    if (typeof d.radioSongIndex !== 'number') d.radioSongIndex = 0;
    if (!Array.isArray(d.dragCatches)) d.dragCatches = [];
    if (typeof d.hasKvalvikaKey === 'undefined') d.hasKvalvikaKey = false;
    if (typeof d.hasBadderCabin === 'undefined') d.hasBadderCabin = false;
    // Backwards compat: existing saves already have rod/travel — treat them as onboarded
    if (!('hasReceivedStarterKit' in raw)) {
      d.hasReceivedStarterKit = true;
      d.hasFerryPass = true;
      d.hasSeenWelcome = true;
    }
    return d;
  },
  clear() { localStorage.removeItem('lofoten_rpg'); },
};

// One-time rescue: reset player to ferry captain spawn if position was corrupted
(function() {
  const raw = localStorage.getItem('lofoten_rpg');
  if (!raw) return;
  const safeSpawns = { leknes:{x:12,y:18}, tromso:{x:17,y:26}, henningsvær:{x:15,y:23}, kåkern:{x:11,y:7}, kvalvika:{x:18,y:17}, reine:{x:8,y:14} };
  const d = JSON.parse(raw);
  const spawn = safeSpawns[d.location];
  if (spawn) { d.x = spawn.x; d.y = spawn.y; localStorage.setItem('lofoten_rpg', JSON.stringify(d)); }
})();

window.addEventListener('beforeunload', () => {
  if (SaveSystem._pending) {
    localStorage.setItem('lofoten_rpg', JSON.stringify(SaveSystem._pending));
    SaveSystem._pending = null;
  }
});
