/**
 * Mobile Game Boy Controls
 * On touch devices: shrinks the game canvas to the top ~42% of the screen
 * and renders a Game Boy-style control panel in the bottom ~58%.
 * Buttons dispatch real DOM KeyboardEvents so Phaser handles them natively.
 */
(function () {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
                || navigator.maxTouchPoints > 0;
  if (!isMobile) return;

  // ── Key mappings ──────────────────────────────────────────────────────────
  const KEYS = {
    up:    { keyCode: 38, key: 'ArrowUp',    code: 'ArrowUp'    },
    down:  { keyCode: 40, key: 'ArrowDown',  code: 'ArrowDown'  },
    left:  { keyCode: 37, key: 'ArrowLeft',  code: 'ArrowLeft'  },
    right: { keyCode: 39, key: 'ArrowRight', code: 'ArrowRight' },
    a:     { keyCode: 32, key: ' ',          code: 'Space'      }, // SPACE
    b:     { keyCode: 27, key: 'Escape',     code: 'Escape'     }, // ESC
    start: { keyCode: 13, key: 'Enter',      code: 'Enter'      }, // ENTER
    fish:  { keyCode: 70, key: 'f',          code: 'KeyF'       }, // F
    radio: { keyCode: 84, key: 't',          code: 'KeyT'       }, // T - station
    skip:  { keyCode: 82, key: 'r',          code: 'KeyR'       }, // R - next song
    home:  { keyCode: 71, key: 'g',          code: 'KeyG'       }, // G - animal home
  };

  function fireDown(name) {
    const k = KEYS[name]; if (!k) return;
    window.dispatchEvent(new KeyboardEvent('keydown', { ...k, bubbles: true, cancelable: true }));
  }
  function fireUp(name) {
    const k = KEYS[name]; if (!k) return;
    window.dispatchEvent(new KeyboardEvent('keyup', { ...k, bubbles: true, cancelable: true }));
  }
  function fireKey(keyObj) {
    window.dispatchEvent(new KeyboardEvent('keydown', { ...keyObj, bubbles: true, cancelable: true }));
  }

  // Held key — smart tap/hold:
  // • Quick tap  → fires keydown + keyup burst = exactly 1 tile move
  // • Hold 320ms+ → fires continuous keydown until released (tile tween is 160ms,
  //   so 320ms = 2 tween durations before continuous kicks in, feels intentional)
  function bindHeld(el, name) {
    let holdTimer = null;
    let continuous = false;

    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      continuous = false;
      // Immediate single-step burst
      fireDown(name);
      setTimeout(() => { if (!continuous) fireUp(name); }, 80);
      // If still held after 320ms, switch to continuous mode
      holdTimer = setTimeout(() => {
        continuous = true;
        fireDown(name); // re-engage for continuous movement
      }, 320);
    });

    const release = e => {
      e.preventDefault();
      clearTimeout(holdTimer);
      holdTimer = null;
      if (continuous) {
        fireUp(name);
        continuous = false;
      }
    };
    el.addEventListener('pointerup',     release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave',  release);
  }
  // Tap key — single burst keydown+keyup (for JustDown actions)
  function bindTap(el, name) {
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      fireDown(name);
      setTimeout(() => fireUp(name), 80);
    });
  }

  // ── Layout: shrink game container, show controls panel ───────────────────
  const gameContainer = document.getElementById('game-container');
  const controlsPanel = document.getElementById('controls-panel');

  // Top 42% for game, remaining for controls
  gameContainer.style.height  = '42vh';
  gameContainer.style.flex    = '0 0 42vh';
  controlsPanel.style.display        = 'block';
  controlsPanel.style.height         = 'calc(58vh - 2px)';
  controlsPanel.style.paddingBottom  = 'env(safe-area-inset-bottom, 0px)';

  // ── Button factory ────────────────────────────────────────────────────────
  function btn(label, bg, extra = '') {
    const b = document.createElement('div');
    b.innerHTML = label;
    b.style.cssText = `
      position: absolute;
      display: flex; align-items: center; justify-content: center;
      font-family: monospace; font-weight: bold; color: #fff;
      background: ${bg}; border: 2px solid rgba(255,255,255,0.2);
      border-radius: 50%; cursor: pointer;
      user-select: none; touch-action: none; -webkit-tap-highlight-color: transparent;
      text-shadow: 0 1px 3px #000;
      ${extra}`;
    return b;
  }
  function rectBtn(label, bg, extra = '') {
    const b = btn(label, bg, extra);
    b.style.borderRadius = '12px';
    return b;
  }

  // ── D-Pad ─────────────────────────────────────────────────────────────────
  const dpad = document.createElement('div');
  dpad.style.cssText = `
    position: absolute; left: 4vw; top: 10%;
    display: grid; grid-template-columns: repeat(3, 14vw); grid-template-rows: repeat(3, 14vw); gap: 2px;`;

  const dpadDefs = [
    null, 'up', null,
    'left', 'center', 'right',
    null, 'down', null,
  ];
  const arrows = { up: '▲', down: '▼', left: '◀', right: '▶' };
  dpadDefs.forEach(dir => {
    const cell = document.createElement('div');
    if (!dir) {
      cell.style.cssText = 'width:14vw; height:14vw;';
    } else if (dir === 'center') {
      cell.style.cssText = 'width:14vw; height:14vw; background:rgba(255,255,255,0.06); border-radius:6px; touch-action:none;';
    } else {
      const span = document.createElement('span');
      span.textContent = arrows[dir];
      span.style.cssText = 'pointer-events:none; -webkit-user-select:none; user-select:none;';
      cell.appendChild(span);
      cell.style.cssText = `
        width:14vw; height:14vw;
        display:flex; align-items:center; justify-content:center;
        font-size:18px; color:#fff; font-weight:bold;
        background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.2);
        border-radius:8px; touch-action:none;
        -webkit-user-select:none; user-select:none;
        cursor:pointer; -webkit-tap-highlight-color:transparent;`;
      bindHeld(cell, dir);
    }
    dpad.appendChild(cell);
  });
  controlsPanel.appendChild(dpad);

  // ── A button (SPACE — interact/confirm) ───────────────────────────────────
  const btnA = btn('A', 'rgba(59,130,246,0.80)', 'width:16vw; height:16vw; font-size:20px; right:6vw; top:25%;');
  bindTap(btnA, 'a');
  controlsPanel.appendChild(btnA);

  // ── B button (ESC — back/cancel) ──────────────────────────────────────────
  const btnB = btn('B', 'rgba(100,116,139,0.70)', 'width:12vw; height:12vw; font-size:16px; right:24vw; top:35%;');
  bindTap(btnB, 'b');
  controlsPanel.appendChild(btnB);

  // ── Fish button (F) ───────────────────────────────────────────────────────
  const btnFish = btn('🎣', 'rgba(74,222,128,0.65)', 'width:12vw; height:12vw; font-size:20px; right:6vw; top:5%;');
  bindTap(btnFish, 'fish');
  controlsPanel.appendChild(btnFish);

  // ── START / HOME button (Enter + G) ─────────────────────────────────────
  // Fires Enter to confirm dialogs AND G to send animal home if one is following.
  // G is a no-op when no animal follows, so combining is safe.
  const btnStart = rectBtn('START', 'rgba(255,255,255,0.18)', `
    width:20vw; height:8vw; font-size:11px;
    left:50%; bottom:18%; transform:translateX(-50%);`);
  btnStart.addEventListener('pointerdown', e => {
    e.preventDefault();
    fireDown('start'); setTimeout(() => fireUp('start'), 80);
    fireDown('home');  setTimeout(() => fireUp('home'),  80);
  });
  controlsPanel.appendChild(btnStart);

  // ── Radio buttons (T = station, R = next song) ────────────────────────────
  const btnStation = rectBtn('📻 STN', 'rgba(251,191,36,0.50)', `
    width:22vw; height:8vw; font-size:10px;
    right:4vw; bottom:30%;`);
  bindTap(btnStation, 'radio');
  controlsPanel.appendChild(btnStation);

  const btnSong = rectBtn('⏭ SONG', 'rgba(147,197,253,0.45)', `
    width:22vw; height:8vw; font-size:10px;
    right:4vw; bottom:18%;`);
  bindTap(btnSong, 'skip');
  controlsPanel.appendChild(btnSong);

  // ── Numpad overlay (shown during fishing math phase) ─────────────────────
  const numpad = document.createElement('div');
  numpad.id = 'mobile-numpad';
  numpad.style.cssText = `
    position: absolute; bottom: 2%; left: 50%; transform: translateX(-50%);
    display: none; grid-template-columns: repeat(3, 20vw);
    gap: 6px; padding: 10px; border-radius: 16px;
    background: rgba(0,0,0,0.92); pointer-events: all;
    z-index: 10001; touch-action: none;`;

  const numpadKeys = [
    { label: '7', key: '7', keyCode: 55 },
    { label: '8', key: '8', keyCode: 56 },
    { label: '9', key: '9', keyCode: 57 },
    { label: '4', key: '4', keyCode: 52 },
    { label: '5', key: '5', keyCode: 53 },
    { label: '6', key: '6', keyCode: 54 },
    { label: '1', key: '1', keyCode: 49 },
    { label: '2', key: '2', keyCode: 50 },
    { label: '3', key: '3', keyCode: 51 },
    { label: '⌫', key: 'Backspace', keyCode: 8 },
    { label: '0', key: '0', keyCode: 48 },
    { label: '✓', key: 'Enter',     keyCode: 13 },
  ];
  numpadKeys.forEach(({ label, key, keyCode }) => {
    const isEnter  = key === 'Enter';
    const isDelete = key === 'Backspace';
    const bg = isEnter  ? 'rgba(74,222,128,0.85)' :
               isDelete ? 'rgba(239,68,68,0.70)'   : 'rgba(255,255,255,0.18)';
    const b = document.createElement('div');
    b.innerHTML = label;
    b.style.cssText = `
      width:20vw; height:12vw; max-height:52px;
      display:flex; align-items:center; justify-content:center;
      font-size:22px; font-family:monospace; font-weight:bold; color:#fff;
      background:${bg}; border:2px solid rgba(255,255,255,0.2); border-radius:10px;
      touch-action:none; user-select:none; cursor:pointer;`;
    b.addEventListener('pointerdown', e => {
      e.preventDefault();
      fireKey({ key, keyCode, code: key, bubbles: true, cancelable: true });
    });
    numpad.appendChild(b);
  });
  controlsPanel.appendChild(numpad);

  // ── Skilpadde (word game) alphabet keyboard ───────────────────────────
  // Shows when the Skilpadde word-guessing game is active.
  // D-pad (← → to move slot cursor) + A (SPACE kick) + START (Enter submit) remain visible.
  // Only letter input buttons are added here; radio/fish buttons are hidden.
  const alphaKeyboard = document.createElement('div');
  alphaKeyboard.id = 'mobile-alpha-keyboard';
  alphaKeyboard.style.cssText = `
    position: absolute; bottom: 2%; left: 50%; transform: translateX(-50%);
    display: none; z-index: 10001; touch-action: none;`;

  const alphaRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','⌫'],
    ['Z','X','C','V','B','N','M','Æ','Ø','Å'],
  ];
  alphaRows.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.style.cssText = 'display:flex; justify-content:center; gap:2px; margin-bottom:3px;';
    row.forEach(ltr => {
      const isDel = ltr === '⌫';
      const isNO  = ['Æ','Ø','Å'].includes(ltr);
      const bg = isDel ? 'rgba(239,68,68,0.75)' : isNO ? 'rgba(251,191,36,0.65)' : 'rgba(255,255,255,0.18)';
      const b = document.createElement('div');
      b.innerHTML = ltr;
      b.style.cssText = `
        width:8.5vw; height:9vw; max-height:38px;
        display:flex; align-items:center; justify-content:center;
        font-size:14px; font-family:monospace; font-weight:bold; color:#fff;
        background:${bg}; border:1px solid rgba(255,255,255,0.2); border-radius:6px;
        touch-action:none; user-select:none; cursor:pointer;`;
      b.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (isDel) {
          fireKey({ key:'Backspace', keyCode:8, code:'Backspace', bubbles:true, cancelable:true });
        } else if (ltr === 'Æ') {
          fireKey({ key:'1', keyCode:49, code:'Digit1', bubbles:true, cancelable:true });
        } else if (ltr === 'Ø') {
          fireKey({ key:'2', keyCode:50, code:'Digit2', bubbles:true, cancelable:true });
        } else if (ltr === 'Å') {
          fireKey({ key:'3', keyCode:51, code:'Digit3', bubbles:true, cancelable:true });
        } else {
          fireKey({ key:ltr.toLowerCase(), keyCode:ltr.charCodeAt(0), code:'Key'+ltr, bubbles:true, cancelable:true });
        }
      });
      rowDiv.appendChild(b);
    });
    alphaKeyboard.appendChild(rowDiv);
  });
  controlsPanel.appendChild(alphaKeyboard);

  // Public API for FishingScene
  window.showMobileNumpad = () => {
    numpad.style.display = 'grid';
    // Hide regular buttons while numpad is shown
    [btnA, btnB, btnFish, btnStart, btnStation, btnSong, dpad]
      .forEach(el => { el._savedDisplay = el.style.display; el.style.display = 'none'; });
  };
  window.hideMobileNumpad = () => {
    numpad.style.display = 'none';
    [btnA, btnB, btnFish, btnStart, btnStation, btnSong, dpad]
      .forEach(el => { el.style.display = el._savedDisplay || ''; });
  };

  // Public API for SkilpaddeScene — shows alphabet keyboard, hides radio/fish buttons
  window.showMobileSkilpaddeKeyboard = () => {
    alphaKeyboard.style.display = 'block';
    [btnFish, btnStation, btnSong].forEach(el => {
      el._savedDisplay3 = el.style.display; el.style.display = 'none';
    });
  };
  window.hideMobileSkilpaddeKeyboard = () => {
    alphaKeyboard.style.display = 'none';
    [btnFish, btnStation, btnSong].forEach(el => {
      el.style.display = el._savedDisplay3 || '';
    });
  };
})();
