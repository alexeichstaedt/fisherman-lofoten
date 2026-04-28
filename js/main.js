// Fisherman: Lofoten — © 2026 Ikke Musikk Eichstaedt. All rights reserved.
const _isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
               || navigator.maxTouchPoints > 0;

// Prevent accidental browser shortcuts (copy, paste, undo, etc.) during gameplay
window.addEventListener('keydown', function(e) {
  if (e.metaKey || e.ctrlKey) {
    if (['c','v','x','z','y','a','s'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  }
}, false);

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 800,
  height: 640,
  backgroundColor: '#1a2a3a',
  scale: {
    mode:       _isMobile ? Phaser.Scale.FIT       : Phaser.Scale.NONE,
    autoCenter: _isMobile ? Phaser.Scale.CENTER_BOTH : Phaser.Scale.NO_CENTER,
  },
  scene: [BootScene, CharacterSelectScene, LeknesScene, ReineScene, KakernScene, KvalvikaScene, HenningsvaarScene, FishingScene, FlagQuizScene, BirdWatchingScene, SkilpaddeScene, TournamentScene, TromsoScene, SnowballFightScene, UIScene],
  pixelArt: true,
  roundPixels: true,
};
window.game = new Phaser.Game(config);
