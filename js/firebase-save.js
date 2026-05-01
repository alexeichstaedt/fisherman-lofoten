// Fisherman: Lofoten — Firebase Cloud Save
// Handles anonymous auth + Firestore persistence.
// SaveSystem._mem is seeded before the Phaser game starts so load() is still synchronous.

window.FirebaseSave = (function () {
  const FIREBASE_CONFIG = {
    apiKey:            'AIzaSyAgbtTvKwwTUr-jwLcgXMxNxOfMkOF1wtA',
    authDomain:        'fisherman-b2abd.firebaseapp.com',
    projectId:         'fisherman-b2abd',
    storageBucket:     'fisherman-b2abd.firebasestorage.app',
    messagingSenderId: '419864893398',
    appId:             '1:419864893398:web:c9c75aae844d7fd615b677',
    measurementId:     'G-TMVC2S3CMQ',
  };

  const TIMEOUT_MS = 6000;  // give up waiting for Firebase after 6s — game starts anyway
  const CLOUD_THROTTLE_MS = 5000;  // max one Firestore write per 5 seconds

  let _db   = null;
  let _uid  = null;
  let _cloudTimer = null;
  let _cloudPending = null;

  function _docRef() {
    if (!_db || !_uid) return null;
    return _db.collection('saves').doc(_uid);
  }

  function _updateLoadingText(msg) {
    const el = document.getElementById('firebase-loading-text');
    if (el) el.textContent = msg;
  }

  function _hideLoadingOverlay() {
    const el = document.getElementById('firebase-loading');
    if (el) el.style.display = 'none';
  }

  return {
    /**
     * Call before new Phaser.Game(). Returns a Promise that always resolves
     * (never rejects) — game starts regardless of Firebase status.
     */
    init() {
      return new Promise(resolve => {
        const timeout = setTimeout(() => {
          console.warn('[FirebaseSave] Timeout — starting game with local/default save.');
          _hideLoadingOverlay();
          resolve();
        }, TIMEOUT_MS);

        try {
          // Init Firebase app (guard against double-init)
          const app = firebase.apps.length
            ? firebase.apps[0]
            : firebase.initializeApp(FIREBASE_CONFIG);

          // Analytics (optional, non-blocking)
          try { firebase.analytics(); } catch(e) {}

          _db = firebase.firestore();

          _updateLoadingText('🐟 Signing in...');

          firebase.auth().signInAnonymously().then(cred => {
            _uid = cred.user.uid;
            _updateLoadingText('🐟 Loading your save...');

            return _docRef().get();
          }).then(doc => {
            clearTimeout(timeout);

            const cloudData = doc && doc.exists ? doc.data() : null;
            const localRaw  = (() => { try { return localStorage.getItem('lofoten_rpg'); } catch(e) { return null; } })();
            const localData = localRaw ? JSON.parse(localRaw) : null;

            // Pick whichever save is newer (cloud vs local)
            let best = null;
            if (cloudData && localData) {
              best = (cloudData._savedAt || 0) >= (localData._savedAt || 0) ? cloudData : localData;
            } else {
              best = cloudData || localData;
            }

            if (best) {
              // Strip internal timestamp before seeding into SaveSystem
              const { _savedAt, ...gameData } = best;
              const migrated = SaveSystem._migrate(gameData);
              SaveSystem._mem = migrated;
              // Also write back to localStorage so it's available as a fallback
              try { localStorage.setItem('lofoten_rpg', JSON.stringify(migrated)); } catch(e) {}
              console.log('[FirebaseSave] Save loaded. Source:', cloudData && (!localData || (cloudData._savedAt || 0) >= (localData._savedAt || 0)) ? 'cloud' : 'local');
            } else {
              console.log('[FirebaseSave] No existing save — fresh start.');
            }

            _hideLoadingOverlay();
            resolve();
          }).catch(err => {
            clearTimeout(timeout);
            console.warn('[FirebaseSave] Auth/load error:', err);
            _hideLoadingOverlay();
            resolve();
          });

        } catch (err) {
          clearTimeout(timeout);
          console.warn('[FirebaseSave] Init error:', err);
          _hideLoadingOverlay();
          resolve();
        }
      });
    },

    /**
     * Throttled async write to Firestore. Called by SaveSystem.save/saveNow.
     * Never blocks the game — fire and forget.
     */
    saveAsync(state) {
      if (!_db || !_uid) return;
      _cloudPending = state;
      if (_cloudTimer) return;
      _cloudTimer = setTimeout(() => {
        if (_cloudPending) {
          const payload = { ..._cloudPending, _savedAt: Date.now() };
          _docRef().set(payload).catch(err => console.warn('[FirebaseSave] Write error:', err));
        }
        _cloudTimer   = null;
        _cloudPending = null;
      }, CLOUD_THROTTLE_MS);
    },

    /** Wipe the cloud save (used by SaveSystem.clear). */
    clearAsync() {
      if (!_db || !_uid) return;
      _docRef().delete().catch(err => console.warn('[FirebaseSave] Clear error:', err));
    },
  };
})();
