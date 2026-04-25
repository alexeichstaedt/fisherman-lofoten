// Fisherman: Lofoten — Player Card overlay
// Opens a screenshot-friendly stats card. Triggered by the CARD button on mobile.
(function () {

  // Badge ID → display label
  const BADGE_LABELS = {
    'baddie-collector': '😈 10 Baddies',
    'hater-boss':       '⚔️ 10 Haters',
    'fisher-100':       '🐟 100 Fish',
    'fisher-1000':      '🎣 1000 Fish',
  };

  function ordinal(n) {
    if (!n) return '—';
    const s = ['th','st','nd','rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]) + ' Place';
  }

  function fmtMoney(n) {
    return (n || 0).toLocaleString('no-NO') + ' NOK';
  }

  window.showPlayerCard = function () {
    const state = window.SaveSystem ? window.SaveSystem.load() : null;
    if (!state) return;

    // ── Gather stats ──────────────────────────────────────────────────────
    const charKey  = state.characterKey || 'ikke-musikk';
    const name     = state.playerName   || 'Ikke Musikk';
    const level    = state.level        || 1;
    const money    = state.money        || 0;
    const aura     = state.aura         || 0;
    const fishTotal= state.totalFishCaught || 0;

    const topFish  = (state.top10 && state.top10[0]) || null;
    const bigFishLabel = topFish
      ? `${topFish.name} · ${topFish.weight} kg`
      : '—';

    const sortedBaddies = [...(state.baddiesCaught || [])].sort((a, b) => b.level - a.level);
    const bestBaddie    = sortedBaddies[0];
    const baddieLabel   = bestBaddie ? `${bestBaddie.name} (Lv ${bestBaddie.level})` : '—';

    const sortedHaters = [...(state.hatersDefeated || [])].sort((a, b) => b.level - a.level);
    const topHater     = sortedHaters[0];
    const haterLabel   = topHater ? `Lv ${topHater.level}` : '—';

    const tournamentLabel = state.grandTrophy
      ? '🏆 Champion'
      : (state.tournamentBestPlace ? ordinal(state.tournamentBestPlace) : '—');

    const badges = (state.badges || []).map(id => BADGE_LABELS[id] || id);

    // ── Build overlay ─────────────────────────────────────────────────────
    const overlay = document.createElement('div');
    overlay.id = 'player-card-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.82);
      display: flex; align-items: center; justify-content: center;
      font-family: monospace;
      touch-action: none;
    `;

    // Card container — 4:5 aspect ratio
    const card = document.createElement('div');
    card.style.cssText = `
      width: min(82vw, 340px);
      aspect-ratio: 4 / 5;
      background: #0f172a;
      border: 2px solid #334155;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    `;

    // ── Header (avatar + name + level) ──────────────────────────────────
    const header = document.createElement('div');
    header.style.cssText = `
      background: linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%);
      display: flex; flex-direction: column; align-items: center;
      padding: 14px 0 10px;
      border-bottom: 1px solid #1e293b;
    `;

    // Avatar: crop idle-down frame (frame 1 = col 1, row 0) from the sprite sheet.
    // Sheet is 128×128, 32×32 per frame (4 cols × 4 rows).
    // Scale 4× so each frame is 80px. margin-left: -80px skips col 0 to land on col 1.
    const avatarWrap = document.createElement('div');
    avatarWrap.style.cssText = `
      width: 72px; height: 72px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #3b82f6;
      background: #1e293b;
      image-rendering: pixelated;
    `;
    const avatarImg = document.createElement('img');
    avatarImg.src = `assets/characters/${charKey}.png`;
    avatarImg.style.cssText = `
      width: 320px; height: 320px;
      margin-left: -80px;
      margin-top: 0px;
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    `;
    avatarImg.onerror = () => { avatarImg.style.display = 'none'; };
    avatarWrap.appendChild(avatarImg);

    const hName = document.createElement('div');
    hName.textContent = name;
    hName.style.cssText = `color:#e2e8f0; font-size:14px; font-weight:bold; margin-top:8px; letter-spacing:0.5px;`;

    const hLevel = document.createElement('div');
    hLevel.textContent = `⭐ Level ${level}`;
    hLevel.style.cssText = `color:#f59e0b; font-size:12px; margin-top:2px;`;

    header.appendChild(avatarWrap);
    header.appendChild(hName);
    header.appendChild(hLevel);

    // ── Stats body ───────────────────────────────────────────────────────
    const body = document.createElement('div');
    body.style.cssText = `
      flex: 1;
      display: flex; flex-direction: column;
      padding: 0 14px;
      overflow: hidden;
    `;

    function statRow(icon, label, value, color = '#94a3b8') {
      const row = document.createElement('div');
      row.style.cssText = `
        display: flex; justify-content: space-between; align-items: baseline;
        padding: 6px 0;
        border-bottom: 1px solid #1e293b;
        font-size: 12px;
      `;
      const left = document.createElement('span');
      left.textContent = `${icon} ${label}`;
      left.style.color = '#64748b';
      const right = document.createElement('span');
      right.textContent = value;
      right.style.cssText = `color: ${color}; font-weight: bold; text-align: right; max-width: 55%;`;
      row.appendChild(left);
      row.appendChild(right);
      return row;
    }

    body.appendChild(statRow('💰', 'Money',         fmtMoney(money),   '#22c55e'));
    body.appendChild(statRow('✨', 'Aura',           `${aura}`,         '#a78bfa'));
    body.appendChild(statRow('🐟', 'Fish Caught',    `${fishTotal}`,    '#38bdf8'));
    body.appendChild(statRow('🎣', 'Biggest Catch',  bigFishLabel,      '#e2e8f0'));
    body.appendChild(statRow('😈', 'Best Baddie',    baddieLabel,       '#f472b6'));
    body.appendChild(statRow('⚔️', 'Top Hater',      haterLabel,        '#fb923c'));
    body.appendChild(statRow('🏆', 'Tournament',     tournamentLabel,   '#f59e0b'));

    // ── Badges row ───────────────────────────────────────────────────────
    const badgeSection = document.createElement('div');
    badgeSection.style.cssText = `padding: 6px 0; border-bottom: 1px solid #1e293b;`;
    const badgeTitle = document.createElement('div');
    badgeTitle.textContent = '🥇 Badges';
    badgeTitle.style.cssText = `color:#64748b; font-size:11px; margin-bottom:3px;`;
    const badgeList = document.createElement('div');
    badgeList.style.cssText = `color:#e2e8f0; font-size:11px; line-height:1.6;`;
    badgeList.textContent = badges.length ? badges.join('  ') : '—';
    badgeSection.appendChild(badgeTitle);
    badgeSection.appendChild(badgeList);
    body.appendChild(badgeSection);

    // ── Footer ────────────────────────────────────────────────────────────
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 8px 14px;
      display: flex; justify-content: space-between; align-items: center;
    `;
    const ftTitle = document.createElement('span');
    ftTitle.textContent = 'FISHERMAN: LOFOTEN';
    ftTitle.style.cssText = `color:#334155; font-size:9px; letter-spacing:1px;`;
    const ftHint = document.createElement('span');
    ftHint.textContent = 'tap to close';
    ftHint.style.cssText = `color:#334155; font-size:9px;`;
    footer.appendChild(ftTitle);
    footer.appendChild(ftHint);

    // ── Assemble ─────────────────────────────────────────────────────────
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Dismiss on tap/click outside card (or anywhere — it's a stats card, not a dialog)
    overlay.addEventListener('pointerdown', () => {
      overlay.remove();
    });
  };

})();
