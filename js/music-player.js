// Fisherman: Lofoten — Music Player
// Drop MP3s in assets/music/ using the slug convention below.
// Song title → filename: lowercase, accents stripped, spaces → hyphens
//   e.g. "Fisherman"              → fisherman.mp3
//        "Snakke på Norsk"        → snakke-pa-norsk.mp3
//        "Tusen Takk 4 All My Haters" → tusen-takk-4-all-my-haters.mp3

window.MusicPlayer = (function () {
  const current = document.createElement('audio');
  const preload = document.createElement('audio');
  current.volume = 0.7;
  preload.volume = 0.7;

  let _playlist = [];
  let _idx      = 0;
  let _started  = false;
  let _onchange = null;

  function _slug(title) {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // å→a  ø→o  é→e etc.
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  function _src(title) {
    return 'assets/music/' + _slug(title) + '.mp3';
  }

  // Start buffering the next song in the background while the current one plays.
  // The browser cache means when current.src is set to the same URL later it
  // starts instantly without an extra network round-trip.
  function _preloadNext() {
    if (_playlist.length < 2) return;
    const nextIdx = (_idx + 1) % _playlist.length;
    preload.src = _src(_playlist[nextIdx]);
    preload.load();
  }

  function _play() {
    if (!_playlist.length) return;
    current.src = _src(_playlist[_idx]);
    current.play().catch(() => {});  // silent fail if file not yet added
    _preloadNext();
    if (_onchange) _onchange(_playlist[_idx], _idx);
  }

  // Auto-advance to next song when current finishes
  current.addEventListener('ended', () => {
    _idx = (_idx + 1) % Math.max(1, _playlist.length);
    _play();
  });

  return {
    /** Called once from UIScene.create() — starts from saved position (Fisherman by default). */
    start(playlist, startIdx) {
      if (_started) return;
      _started  = true;
      _playlist = playlist || [];
      _idx      = Math.max(0, Math.min(startIdx || 0, _playlist.length - 1));
      _play();
    },

    /** Replace playlist and restart from a given index (station switch). */
    setPlaylist(playlist, startIdx) {
      current.pause();
      preload.src = '';   // cancel any in-progress background fetch
      _playlist = playlist || [];
      _idx      = Math.max(0, Math.min(startIdx || 0, _playlist.length - 1));
      _play();
    },

    /** Skip to next song (R key / ⏭ SONG button). */
    nextSong() {
      if (!_playlist.length) return;
      _idx = (_idx + 1) % _playlist.length;
      _play();
    },

    /** Register a callback fired whenever the playing song changes (including auto-advance). */
    onSongChange(cb) { _onchange = cb; },

    currentTitle() { return _playlist[_idx] || ''; },
    currentIndex() { return _idx; },
    slug: _slug,
  };
})();
