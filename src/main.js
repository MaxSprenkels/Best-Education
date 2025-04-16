import { StartScene } from './scenes/StartScene.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { WinScene } from './scenes/WinScene.js';


const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: [StartScene, Game, GameOver, WinScene],
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);