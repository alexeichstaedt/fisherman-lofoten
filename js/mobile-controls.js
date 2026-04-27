/**
 * Mobile Game Boy Controls
 * Portrait:  game canvas top ~42%, control panel below.
 * Landscape: game canvas center square, d-pad+CARD on left, action buttons on right.
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
    a:     { keyCode: 32, key: ' ',          code: 'Space'      },
    b:     { keyCode: 27, key: 'Escape',     code: 'Escape'     },
    start: { keyCode: 13, key: 'Enter',      code: 'Enter'      },
    fish:  { keyCode: 70, key: 'f',          code: 'KeyF'       },
    radio: { keyCode: 84, key: 't',          code: 'KeyT'       },
    skip:  { keyCode: 82, key: 'r',          code: 'KeyR'       },
    home:  { keyCode: 71, key: 'g',          code: 'KeyG'       },
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

  // Held key: quick tap → 1 tile, hold 150ms+ → continuous
  function bindHeld(el, name) {
    let holdTimer = null, continuous = false;
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      continuous = false;
      fireDown(name);
      setTimeout(() => { if (!continuous) fireUp(name); }, 80);
      holdTimer = setTimeout(() => { continuous = true; fireDown(name); }, 150);
    });
    const release = e => {
      e.preventDefault();
      clearTimeout(holdTimer); holdTimer = null;
      if (continuous) { fireUp(name); continuous = false; }
    };
    el.addEventListener('pointerup',     release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave',  release);
  }

  function bindTap(el, name) {
    el.addEventListener('pointerdown', e => {
      e.preventDefault();
      fireDown(name);
      setTimeout(() => fireUp(name), 80);
    });
  }

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const gameContainer = document.getElementById('game-container');
  const controlsPanel = document.getElementById('controls-panel');
  const controlsLeft  = document.getElementById('controls-left');
  const controlsRight = document.getElementById('controls-right');

  // ── Panel mode (shared between portrait and landscape) ────────────────────
  let panelMode = 'dpad';

  // ── Shared d-pad config ───────────────────────────────────────────────────
  const dpadDefs = [null, 'up', null, 'left', 'center', 'right', null, 'down', null];
  const arrows   = { up: '↑', down: '↓', left: '←', right: '→' };

  // ── Numpad key config (shared between portrait and landscape) ─────────────
  const numpadKeys = [
    { label: '7', key: '7', keyCode: 55 }, { label: '8', key: '8', keyCode: 56 }, { label: '9', key: '9', keyCode: 57 },
    { label: '4', key: '4', keyCode: 52 }, { label: '5', key: '5', keyCode: 53 }, { label: '6', key: '6', keyCode: 54 },
    { label: '1', key: '1', keyCode: 49 }, { label: '2', key: '2', keyCode: 50 }, { label: '3', key: '3', keyCode: 51 },
    { label: '⌫', key: 'Backspace', keyCode: 8 }, { label: '0', key: '0', keyCode: 48 }, { label: '✓', key: 'Enter', keyCode: 13 },
  ];

  // ── Helper: make a numpad cell element ────────────────────────────────────
  function makeNumCell({ label, key, keyCode }) {
    const isEnter  = key === 'Enter';
    const isDelete = key === 'Backspace';
    const bg = isEnter  ? 'rgba(74,222,128,0.85)'
             : isDelete ? 'rgba(239,68,68,0.70)'
             : 'rgba(255,255,255,0.18)';
    const b = document.createElement('div');
    b.innerHTML = label;
    b.style.cssText = `
      display:flex; align-items:center; justify-content:center;
      font-family:monospace; font-weight:bold; color:#fff;
      background:${bg}; border:2px solid rgba(255,255,255,0.2); border-radius:8px;
      touch-action:none; user-select:none; cursor:pointer;`;
    b.addEventListener('pointerdown', e => {
      e.preventDefault();
      fireKey({ key, keyCode, code: key, bubbles: true, cancelable: true });
    });
    return b;
  }

  // ── Helper: make a d-pad cell element ─────────────────────────────────────
  function makeDpadCell(dir) {
    const cell = document.createElement('div');
    if (!dir) {
      // empty spacer
    } else if (dir === 'center') {
      cell.style.background    = 'rgba(255,255,255,0.06)';
      cell.style.borderRadius  = '6px';
      cell.style.touchAction   = 'none';
    } else {
      const span = document.createElement('span');
      span.textContent = arrows[dir];
      span.style.cssText = 'pointer-events:none; -webkit-user-select:none; user-select:none;';
      cell.appendChild(span);
      cell.style.cssText = `
        display:flex; align-items:center; justify-content:center;
        color:#fff; font-weight:bold;
        background:rgba(255,255,255,0.15); border:2px solid rgba(255,255,255,0.2);
        border-radius:8px; touch-action:none;
        -webkit-user-select:none; user-select:none;
        cursor:pointer; -webkit-tap-highlight-color:transparent;`;
      bindHeld(cell, dir);
    }
    return cell;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PORTRAIT CONTROLS (inside #controls-panel)
  // ══════════════════════════════════════════════════════════════════════════

  // D-pad (portrait, uses vw units)
  const dpad = document.createElement('div');
  dpad.style.cssText = `
    position: absolute; left: 4vw; top: 10%;
    display: grid; grid-template-columns: repeat(3, 14vw); grid-template-rows: repeat(3, 14vw); gap: 2px;`;
  dpadDefs.forEach(dir => {
    const cell = makeDpadCell(dir);
    if (!dir) {
      cell.style.cssText = 'width:14vw; height:14vw;';
    } else if (dir === 'center') {
      cell.style.width = '14vw'; cell.style.height = '14vw';
    } else {
      cell.style.width = '14vw'; cell.style.height = '14vw'; cell.style.fontSize = '22px';
    }
    dpad.appendChild(cell);
  });
  controlsPanel.appendChild(dpad);

  // A button (portrait)
  const btnA = document.createElement('div');
  btnA.innerHTML = 'A';
  btnA.style.cssText = `
    position:absolute; width:16vw; height:16vw; font-size:20px; right:6vw; top:25%;
    display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(59,130,246,0.80); border:2px solid rgba(255,255,255,0.2);
    border-radius:50%; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;
    text-shadow:0 1px 3px #000;`;
  bindTap(btnA, 'a');
  controlsPanel.appendChild(btnA);

  // B button (portrait)
  const btnB = document.createElement('div');
  btnB.innerHTML = 'B';
  btnB.style.cssText = `
    position:absolute; width:12vw; height:12vw; font-size:16px; right:24vw; top:35%;
    display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(100,116,139,0.70); border:2px solid rgba(255,255,255,0.2);
    border-radius:50%; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;
    text-shadow:0 1px 3px #000;`;
  bindTap(btnB, 'b');
  controlsPanel.appendChild(btnB);

  // Fish button (portrait)
  const btnFish = document.createElement('div');
  btnFish.innerHTML = '🎣';
  btnFish.style.cssText = `
    position:absolute; width:12vw; height:12vw; font-size:20px; right:6vw; top:5%;
    display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(74,222,128,0.65); border:2px solid rgba(255,255,255,0.2);
    border-radius:50%; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;
    text-shadow:0 1px 3px #000;`;
  bindTap(btnFish, 'fish');
  controlsPanel.appendChild(btnFish);

  // CARD button (portrait)
  const btnStart = document.createElement('div');
  btnStart.innerHTML = 'CARD';
  btnStart.style.cssText = `
    position:absolute; width:20vw; height:8vw; font-size:11px;
    left:50%; bottom:10px; transform:translateX(-50%);
    display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(255,255,255,0.18); border:2px solid rgba(255,255,255,0.2);
    border-radius:12px; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;`;
  btnStart.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (window.showPlayerCard) window.showPlayerCard();
  });
  controlsPanel.appendChild(btnStart);

  // STN button (portrait)
  const btnStation = document.createElement('div');
  btnStation.innerHTML = '📻 STN';
  btnStation.style.cssText = `
    position:absolute; width:22vw; height:8vw; font-size:10px; right:4vw; bottom:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(251,191,36,0.50); border:2px solid rgba(255,255,255,0.2);
    border-radius:12px; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;`;
  bindTap(btnStation, 'radio');
  controlsPanel.appendChild(btnStation);

  // SONG button (portrait)
  const btnSong = document.createElement('div');
  btnSong.innerHTML = '⏭ SONG';
  btnSong.style.cssText = `
    position:absolute; width:22vw; height:8vw; font-size:10px; left:4vw; bottom:10px;
    display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(147,197,253,0.45); border:2px solid rgba(255,255,255,0.2);
    border-radius:12px; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;`;
  bindTap(btnSong, 'skip');
  controlsPanel.appendChild(btnSong);

  // Numpad (portrait)
  const numpad = document.createElement('div');
  numpad.id = 'mobile-numpad';
  numpad.style.cssText = `
    position: absolute; left: 4vw; top: 10%;
    display: none; grid-template-columns: repeat(3, 13vw); grid-template-rows: repeat(4, 10vw);
    gap: 2px; pointer-events: all; z-index: 10001; touch-action: none;`;
  numpadKeys.forEach(k => numpad.appendChild(makeNumCell(k)));
  controlsPanel.appendChild(numpad);

  // Alpha keyboard (portrait — legacy name-entry keyboard, kept for API compat)
  const alphaKeyboard = document.createElement('div');
  alphaKeyboard.id = 'mobile-alpha-keyboard';
  alphaKeyboard.style.cssText = `
    position: absolute; left: 1vw; top: 6%;
    display: none; flex-direction: column; gap: 3px;
    z-index: 10001; touch-action: none; width: 98vw;`;
  const alphaRows = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L','⌫'],
    ['Z','X','C','V','B','N','M','Æ','Ø','Å'],
    ['←','→','✓'],
  ];
  alphaRows.forEach((row, rowIdx) => {
    const rowDiv = document.createElement('div');
    const isNavRow = rowIdx === 3;
    rowDiv.style.cssText = 'display:flex; justify-content:center; gap:2px;';
    row.forEach(ltr => {
      const isDel  = ltr === '⌫';
      const isNO   = ['Æ','Ø','Å'].includes(ltr);
      const isNav  = ['←','→'].includes(ltr);
      const isConf = ltr === '✓';
      const bg = isDel  ? 'rgba(239,68,68,0.75)' : isConf ? 'rgba(74,222,128,0.85)'
               : isNav  ? 'rgba(59,130,246,0.70)' : isNO   ? 'rgba(251,191,36,0.65)'
               : 'rgba(255,255,255,0.18)';
      const b = document.createElement('div');
      b.innerHTML = ltr;
      const w = isNavRow ? '30vw' : 'calc((98vw - 18px) / 10)';
      b.style.cssText = `
        width:${w}; height:9vw; max-height:44px;
        display:flex; align-items:center; justify-content:center;
        font-size:${isNavRow ? '18px' : '14px'}; font-family:monospace; font-weight:bold; color:#fff;
        background:${bg}; border:1px solid rgba(255,255,255,0.2); border-radius:6px;
        touch-action:none; user-select:none; cursor:pointer;`;
      b.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (isDel)       fireKey({ key:'Backspace',  keyCode:8,  code:'Backspace',  bubbles:true, cancelable:true });
        else if (ltr==='←') fireKey({ key:'ArrowLeft',  keyCode:37, code:'ArrowLeft',  bubbles:true, cancelable:true });
        else if (ltr==='→') fireKey({ key:'ArrowRight', keyCode:39, code:'ArrowRight', bubbles:true, cancelable:true });
        else if (ltr==='✓') fireKey({ key:'Enter',      keyCode:13, code:'Enter',      bubbles:true, cancelable:true });
        else if (ltr==='Æ') fireKey({ key:'1', keyCode:49, code:'Digit1', bubbles:true, cancelable:true });
        else if (ltr==='Ø') fireKey({ key:'2', keyCode:50, code:'Digit2', bubbles:true, cancelable:true });
        else if (ltr==='Å') fireKey({ key:'3', keyCode:51, code:'Digit3', bubbles:true, cancelable:true });
        else fireKey({ key:ltr.toLowerCase(), keyCode:ltr.charCodeAt(0), code:'Key'+ltr, bubbles:true, cancelable:true });
      });
      rowDiv.appendChild(b);
    });
    alphaKeyboard.appendChild(rowDiv);
  });
  controlsPanel.appendChild(alphaKeyboard);

  // ══════════════════════════════════════════════════════════════════════════
  // LANDSCAPE CONTROLS (inside #controls-left and #controls-right)
  // Uses pixel values computed from window dimensions in _applyLandscape().
  // ══════════════════════════════════════════════════════════════════════════

  // ── Left panel: D-pad ─────────────────────────────────────────────────────
  const lDpad = document.createElement('div');
  lDpad.style.position = 'absolute';
  const lDpadCells = []; // { el, dir }
  dpadDefs.forEach(dir => {
    const cell = makeDpadCell(dir);
    lDpadCells.push({ el: cell, dir });
    lDpad.appendChild(cell);
  });
  controlsLeft.appendChild(lDpad);

  // ── Left panel: numpad ────────────────────────────────────────────────────
  const lNumpad = document.createElement('div');
  lNumpad.style.cssText = `
    position: absolute; display: none;
    grid-template-columns: repeat(3, 1fr); gap: 3px;
    pointer-events: all; z-index: 10001; touch-action: none;`;
  numpadKeys.forEach(k => lNumpad.appendChild(makeNumCell(k)));
  controlsLeft.appendChild(lNumpad);

  // ── Left panel: CARD button ───────────────────────────────────────────────
  const lBtnCard = document.createElement('div');
  lBtnCard.innerHTML = 'CARD';
  lBtnCard.style.cssText = `
    position: absolute; display:flex; align-items:center; justify-content:center;
    font-family:monospace; font-weight:bold; color:#fff;
    background:rgba(255,255,255,0.18); border:2px solid rgba(255,255,255,0.2);
    border-radius:12px; cursor:pointer;
    user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;`;
  lBtnCard.addEventListener('pointerdown', e => {
    e.preventDefault();
    if (window.showPlayerCard) window.showPlayerCard();
  });
  controlsLeft.appendChild(lBtnCard);

  // ── Right panel: action buttons ───────────────────────────────────────────
  function makeLBtn(label, bg, circle = true) {
    const b = document.createElement('div');
    b.innerHTML = label;
    b.style.cssText = `
      position:absolute; display:flex; align-items:center; justify-content:center;
      font-family:monospace; font-weight:bold; color:#fff;
      background:${bg}; border:2px solid rgba(255,255,255,0.2);
      border-radius:${circle ? '50%' : '12px'}; cursor:pointer;
      user-select:none; touch-action:none; -webkit-tap-highlight-color:transparent;
      text-shadow:0 1px 3px #000;`;
    return b;
  }

  const lBtnA       = makeLBtn('A',       'rgba(59,130,246,0.80)');
  const lBtnB       = makeLBtn('B',       'rgba(100,116,139,0.70)');
  const lBtnFish    = makeLBtn('🎣',      'rgba(74,222,128,0.65)');
  const lBtnSong    = makeLBtn('⏭ SONG', 'rgba(147,197,253,0.45)', false);
  const lBtnStation = makeLBtn('📻 STN', 'rgba(251,191,36,0.50)',  false);

  bindTap(lBtnA, 'a');
  bindTap(lBtnB, 'b');
  bindTap(lBtnFish, 'fish');
  bindTap(lBtnSong, 'skip');
  bindTap(lBtnStation, 'radio');

  [lBtnA, lBtnB, lBtnFish, lBtnSong, lBtnStation].forEach(b => controlsRight.appendChild(b));

  // ── Landscape button sizing / positioning ─────────────────────────────────
  function _positionLandscapeButtons(sideW, h) {
    // Extra left inset to keep buttons clear of the phone notch (left side in landscape)
    const notchGuard = 16;

    // ── Left panel: D-pad ───────────────────────────────────────────────────
    const dCell  = Math.floor(Math.min(sideW * 0.27, h * 0.12));
    const dGap   = 2;
    const dGridW = 3 * dCell + 2 * dGap;
    const dLeft  = Math.floor((sideW - dGridW) / 2) + notchGuard;
    const dTop   = Math.floor(h * 0.20);

    lDpad.style.left                 = dLeft + 'px';
    lDpad.style.top                  = dTop  + 'px';
    lDpad.style.display              = panelMode === 'dpad' ? 'grid' : 'none';
    lDpad.style.gridTemplateColumns  = `repeat(3, ${dCell}px)`;
    lDpad.style.gridTemplateRows     = `repeat(3, ${dCell}px)`;
    lDpad.style.gap                  = dGap + 'px';
    lDpadCells.forEach(({ el, dir }) => {
      el.style.width  = dCell + 'px';
      el.style.height = dCell + 'px';
      if (dir && dir !== 'center') el.style.fontSize = Math.floor(dCell * 0.4) + 'px';
    });

    // ── Left panel: numpad ──────────────────────────────────────────────────
    const npCols  = 3;
    const npRows  = 4;
    const npGap   = 3;
    const avail   = sideW - notchGuard * 2;
    const npCellW = Math.floor((avail - (npCols - 1) * npGap) / npCols);
    const npCellH = Math.floor(h * 0.10);
    const npW     = npCols * npCellW + (npCols - 1) * npGap;
    const npLeft  = Math.floor((sideW - npW) / 2) + notchGuard;

    lNumpad.style.left                = npLeft + 'px';
    lNumpad.style.top                 = Math.floor(h * 0.08) + 'px';
    lNumpad.style.width               = npW + 'px';
    lNumpad.style.gridTemplateColumns = `repeat(${npCols}, ${npCellW}px)`;
    lNumpad.style.gridTemplateRows    = `repeat(${npRows}, ${npCellH}px)`;
    lNumpad.style.display             = panelMode === 'numpad' ? 'grid' : 'none';
    lNumpad.querySelectorAll('div').forEach(b => {
      b.style.fontSize = Math.floor(npCellH * 0.45) + 'px';
    });

    // ── Left panel: CARD button ─────────────────────────────────────────────
    const cardW = Math.floor((sideW - notchGuard * 2) * 0.80);
    const cardH = Math.floor(h * 0.09);
    lBtnCard.style.width    = cardW + 'px';
    lBtnCard.style.height   = cardH + 'px';
    lBtnCard.style.fontSize = Math.floor(cardH * 0.42) + 'px';
    lBtnCard.style.left     = Math.floor((sideW - cardW) / 2) + 'px';
    lBtnCard.style.bottom   = Math.floor(h * 0.06) + 'px';

    // ── Right panel: action buttons ─────────────────────────────────────────
    // Notch guard on the right side (right panel is on the right edge of the screen)
    const notchR = 16;
    const aSize  = Math.floor(Math.min(sideW * 0.42, h * 0.16));
    const bSize  = Math.floor(aSize * 0.70);
    const smSize = Math.floor(aSize * 0.70);
    const rcW    = Math.floor((sideW - notchR * 2) * 0.90);
    const rcH    = Math.floor(h * 0.10);
    const aRight = notchR + Math.floor(sideW * 0.06);

    // Fish: top center
    lBtnFish.style.width    = smSize + 'px';
    lBtnFish.style.height   = smSize + 'px';
    lBtnFish.style.fontSize = Math.floor(smSize * 0.50) + 'px';
    lBtnFish.style.left     = Math.floor((sideW - smSize) / 2) + 'px';
    lBtnFish.style.top      = Math.floor(h * 0.05) + 'px';

    // A: center right
    lBtnA.style.width    = aSize + 'px';
    lBtnA.style.height   = aSize + 'px';
    lBtnA.style.fontSize = Math.floor(aSize * 0.38) + 'px';
    lBtnA.style.right    = aRight + 'px';
    lBtnA.style.top      = Math.floor(h * 0.30) + 'px';

    // B: left of A, slightly lower
    lBtnB.style.width    = bSize + 'px';
    lBtnB.style.height   = bSize + 'px';
    lBtnB.style.fontSize = Math.floor(bSize * 0.42) + 'px';
    lBtnB.style.right    = aRight + aSize + Math.floor(sideW * 0.07) + 'px';
    lBtnB.style.top      = Math.floor(h * 0.42) + 'px';

    // SONG: bottom, second row
    lBtnSong.style.width    = rcW + 'px';
    lBtnSong.style.height   = rcH + 'px';
    lBtnSong.style.fontSize = Math.floor(rcH * 0.38) + 'px';
    lBtnSong.style.left     = Math.floor((sideW - rcW) / 2) + 'px';
    lBtnSong.style.bottom   = rcH + Math.floor(h * 0.04) * 2 + 'px';

    // STN: bottom row
    lBtnStation.style.width    = rcW + 'px';
    lBtnStation.style.height   = rcH + 'px';
    lBtnStation.style.fontSize = Math.floor(rcH * 0.38) + 'px';
    lBtnStation.style.left     = Math.floor((sideW - rcW) / 2) + 'px';
    lBtnStation.style.bottom   = Math.floor(h * 0.04) + 'px';
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LAYOUT APPLICATION
  // ══════════════════════════════════════════════════════════════════════════

  function _applyPortrait(h) {
    // Hide landscape panels (fully inert)
    controlsLeft.style.display        = 'none';
    controlsLeft.style.pointerEvents  = 'none';
    controlsRight.style.display       = 'none';
    controlsRight.style.pointerEvents = 'none';

    // Show portrait panel
    controlsPanel.style.display = 'block';

    // Reset game container to portrait flow (clear landscape overrides individually)
    gameContainer.style.position = '';
    gameContainer.style.left     = '';
    gameContainer.style.top      = '';
    gameContainer.style.width    = '';
    gameContainer.style.flex     = '';

    const gameH = Math.round(h * 0.42);
    const ctrlH = h - gameH - 2;
    gameContainer.style.height = gameH + 'px';
    gameContainer.style.flex   = '0 0 ' + gameH + 'px';
    controlsPanel.style.height = ctrlH + 'px';
  }

  function _applyLandscape(w, h) {
    const sideW = Math.floor((w - h) / 2);

    // If the side panels are too narrow (very square screen), fall back to portrait
    if (sideW < 80) {
      _applyPortrait(h);
      return;
    }

    // Hide portrait panel (fully inert)
    controlsPanel.style.display = 'none';

    // Game container: fixed square centered between side panels
    gameContainer.style.position = 'fixed';
    gameContainer.style.left     = sideW + 'px';
    gameContainer.style.top      = '0';
    gameContainer.style.width    = h + 'px';
    gameContainer.style.height   = h + 'px';
    gameContainer.style.flex     = 'none';

    // Left panel
    controlsLeft.style.display       = 'block';
    controlsLeft.style.pointerEvents = 'auto';
    controlsLeft.style.width         = sideW + 'px';
    controlsLeft.style.height        = h + 'px';
    controlsLeft.style.top           = '0';
    controlsLeft.style.left          = '0';

    // Right panel
    controlsRight.style.display       = 'block';
    controlsRight.style.pointerEvents = 'auto';
    controlsRight.style.width         = sideW + 'px';
    controlsRight.style.height        = h + 'px';
    controlsRight.style.top           = '0';
    controlsRight.style.right         = '0';

    _positionLandscapeButtons(sideW, h);
  }

  // Debounced layout application (RAF-based to avoid double-firing from
  // window resize + visualViewport resize events on the same frame)
  let _rafPending = false;
  function _applyLayout() {
    if (_rafPending) return;
    _rafPending = true;
    requestAnimationFrame(() => {
      _rafPending = false;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w > h) {
        _applyLandscape(w, h);
      } else {
        _applyPortrait(h);
      }
      // Notify Phaser to refresh its scale/input bounds after layout change
      if (window.game && window.game.scale) {
        window.game.scale.refresh();
      }
    });
  }

  // Show portrait panel immediately so it's visible on load
  controlsPanel.style.display = 'block';

  // Initial layout + listeners
  _applyLayout();
  window.addEventListener('resize', _applyLayout);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', _applyLayout);
  }

  // ── Panel mode: 'dpad' | 'numpad' | 'alpha' ──────────────────────────────
  function setMode(mode) {
    panelMode = mode;

    // Portrait panel elements
    dpad.style.display           = mode === 'dpad'   ? 'grid' : 'none';
    numpad.style.display         = mode === 'numpad'  ? 'grid' : 'none';
    alphaKeyboard.style.display  = mode === 'alpha'   ? 'flex' : 'none';
    const hideForAlpha = mode === 'alpha';
    [btnFish, btnStation, btnSong].forEach(el => {
      el.style.display = hideForAlpha ? 'none' : 'flex';
    });

    // Landscape panel elements (left panel only — right panel always visible)
    lDpad.style.display   = mode === 'dpad'   ? 'grid' : 'none';
    lNumpad.style.display = mode === 'numpad'  ? 'grid' : 'none';
  }

  // Public API
  window.showMobileNumpad  = () => setMode('numpad');
  window.hideMobileNumpad  = () => setMode('dpad');
  window.showMobileSkilpaddeKeyboard = () => setMode('alpha');
  window.hideMobileSkilpaddeKeyboard = () => setMode('dpad');
})();
