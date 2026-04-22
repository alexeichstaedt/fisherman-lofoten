# Fisherman: Lofoten

A Norwegian adventure RPG set across the Lofoten Islands. Fish legendary waters, explore villages, build your aura, and win the Grand Fishing Tournament.

**Author:** Alex William Eichstaedt  
**Protagonist:** Ikke Musikk  
**Business:** Eichstaedt Ikke Musikk - Org.nr. 935 387 825 - Oslo  
© 2026 Eichstaedt Ikke Musikk. All rights reserved.

---

## How to Run

No build step required. Open `index.html` directly in a browser, or serve locally to avoid any asset loading restrictions:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys | Move player |
| ENTER / SPACE | Interact with NPCs, doors, objects |
| ESC | Close menus / cancel fishing |
| F | Fish |
| G | Send following baddie or animal home |
| ◀ ▶ | Navigate tabs in shops and menus |

---

## Locations

| Location | How to reach |
|----------|-------------|
| Leknes | Starting town — ferry & flight hub |
| Reine | Ferry from Leknes |
| Henningsvær | Ferry from Leknes |
| Kvalvika Beach | Ferry from Reine |
| Kakern | Ferry from Leknes |
| Tromsø | Plane from Leknes |

---

## 🌟 Key Features

### 🎣 Advanced Fishing System
*   **Legendary Catch:** Hunt for over 20+ species including **Atlantic Cod**, **Giant Halibut**, and the elusive **Magical Greenland Shark**.
*   **Specialized Gear:** Upgrade from a **Basic Rod** to the elite **Bape Rod**. Use the **Harpoon** for automatic heavy catches (over 100kg).
*   **Dynamic Conditions:** Some secret fish only appear during the **Northern Lights** or in the deep ocean.
*   **Matematikk Reel-in:** Master mental math to successfully reel in heavy trophy fish.

### 🇳🇴 Immersive Norwegian Adventure
*   **Authentic Locations:** Explore meticulously crafted scenes of **Leknes**, **Reine**, **Henningsvær**, **Kvalvika Beach**, and fly to **Tromsø**.
*   **Cultural Depth:** Experience local Norwegian idioms, Samí culture references, and a soundtrack featuring lyrics from **Ikke Musikk**.
*   **Travel System:** Navigate the archipelago via **Ferry** or **Plane** (Tromsø hub).

### ✨ Aura & Social Mechanics
*   **Aura System:** Your reputation (from -100 to 100) fluctuates based on your actions—win encounters to build your legendary status.
*   **Baddie Followers:** Catch "Baddies" in random encounters and have them follow you across the islands from your **Badder Cabin**.
*   **Hater Encounters:** Defend your aura in "Bush Encounters" against local haters.

### 🎮 Educational Mini-Games
*   **Matematikk Bibliotek:** A dedicated learning hub in Henningsvær for mastering Algebra and arithmetic.
*   **Diverse Challenges:**
    *   **Flag Quiz:** Test your global knowledge.
    *   **Skilpadde:** A daily luck-based mini-game.
    *   **Snowball Fights:** Action-packed encounters in the snowy north.
    *   **Bird Watching:** Discover the local fauna of Lofoten.

### 🏆 RPG Progression & Economy
*   **Live the Life:** Earn **NOK** from your catches, buy your own **Boat**, and shop at local markets.
*   **Grand Fishing Tournament:** Rise through the ranks in Leknes to defeat rivals like **Lars**, **Erik**, and **Bjørn**.
*   **Persistent World:** Robust **Auto-save system** via `localStorage` ensures your journey is never lost.

### 📱 Technical Highlights
*   **Engine:** Powered by **Phaser 3** for high-performance pixel-art rendering.
*   **Universal Play:** Full **Mobile Support** with custom virtual controls and responsive layouts.
*   **Zero Install:** Runs directly in any modern web browser.

---

## Save System

The game auto-saves to `localStorage` after encounters, purchases, and key events. Progress persists between sessions in the same browser.
