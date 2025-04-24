# 🚀 Best Education

Een raketgame gemaakt in Phaser 3 waarin je sterren verzamelt, obstakels ontwijkt en power-ups gebruikt om een score van 100 te halen. De game bevat een hoofdmenu, pauze-functie en scenes voor zowel game over als winnen.

## 🎮 Gameplay

- Bestuur een raket met de pijltjestoetsen of W/S.
- Verzamel sterren om punten te scoren.
  - Zilveren ster = 5 punten
  - Gouden ster = 10 punten
- Ontwijk vijanden. Bij een botsing zonder schild is het game over.
- Verzamel power-ups:
  - 🛡️ **Shield** – Beschermt tegen vijanden
  - 🧲 **Magnet** – Trekt sterren aan
- Pauzeren kan met **ESC** of **P**.
- Je wint bij **100 punten**!

## 🧱 Structuur

```txt
📁 src/
├── main.js
├── Scenes/
│   ├── MenuScene.js         # Startmenu
│   ├── GameScene.js         # Gameplay
│   ├── GameOverScene.js     # Game over scherm
│   └── WinScene.js          # Win scherm (bij 100 punten)
├── Components/
│   ├── Player.js            # Speler (raket)
│   ├── Enemies.js           # Vijanden en sterren
│   ├── PowerUps.js          # Power-ups genereren en verwerken
│   └── UI.js                # UI zoals score en pauze
```

## ⚙️ Features

- Aangepaste moeilijkheid op basis van schermgrootte:
  - Kleine schermen = minder vijanden, maar snellere gameplay
- Pauze-overlay met keybinds
- Win- en game-over schermen met score en knoppen

## ✅ Mogelijke uitbreidingen

- Highscores opslaan
- Extra vijandtypes en levels
- Geluid en animaties toevoegen
- Mobiele touch support

## 🛠️ Installatie & starten

1. Clone deze repo
2. Installeer afhankelijkheden
3. Start de development server:

```bash
npm install
npm run dev
```


---

Veel plezier met spelen of ontwikkelen! 🚀