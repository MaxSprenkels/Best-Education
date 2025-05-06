// Importeer de verschillende scenes van de game
import { StartScene } from './scenes/StartScene.js';
import { GameOver } from './scenes/GameOver.js';
import { WinScene } from './scenes/WinScene.js';
import Game from './scenes/Game/Game.js';

// Configuratie van de Phaser-game
const config = {
    type: Phaser.AUTO, // Kies automatisch tussen WebGL of Canvas
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [StartScene, GameOver, WinScene, Game], // Alle gebruikte scenes
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade', // Gebruik arcade physics
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE, // Zorgt dat het canvas schaalt met het venster
        autoCenter: Phaser.Scale.CENTER_BOTH // Centreert het spel in het scherm
    }
};

// Start de game
const game = new Phaser.Game(config);
