export default class Preloader {
    constructor(scene) {
        this.scene = scene;
    }

    loadAssets() {
        // Background
        this.scene.load.image('background', 'assets/images/background.png');
        // Player
        this.scene.load.image('rocket_base', 'assets/images/rocket_baseA.png');
        this.scene.load.image('rocket_finns', 'assets/images/rocket_finsA.png');
        this.scene.load.image('rocket_fuel', 'assets/images/rocket_fuelA.png');
        this.scene.load.image('rocket_sides', 'assets/images/rocket_sidesA.png');
        this.scene.load.image('rocket_top', 'assets/images/rocket_topA.png');
        // Enemies
        this.scene.load.image('enemyBlack1', 'assets/images/enemyBlack1.png');
        this.scene.load.image('enemyBlue1', 'assets/images/enemyBlue1.png');
        this.scene.load.image('enemyGreen1', 'assets/images/enemyGreen1.png');
        this.scene.load.image('enemyRed1', 'assets/images/enemyRed1.png');
        // Stars
        this.scene.load.image('star_gold', 'assets/images/star_gold.png');
        this.scene.load.image('star_silver', 'assets/images/star_silver.png');
        // Sounds
        this.scene.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.scene.load.audio('clickSound', 'assets/sounds/click.wav');
        this.scene.load.audio('gameOverSound', 'assets/sounds/game-over.wav');
        this.scene.load.audio('collectSound', 'assets/sounds/collect.mp3');
        this.scene.load.audio('shieldSound', 'assets/sounds/shield.wav');
        this.scene.load.audio('gameWinSound', 'assets/sounds/game-win.wav');
        this.scene.load.audio('backgroundMusic', 'assets/sounds/background.mp3');
        // Powerups
        this.scene.load.image('magnet', 'assets/images/magnet.png');
        this.scene.load.audio('magnetSound', 'assets/sounds/magnet.mp3');
        this.scene.load.image('shield', 'assets/images/shield.png');
        this.scene.load.image('shieldEffect', 'assets/images/shield-effect.png');
        this.scene.load.image('boost', 'assets/boost.png');
        this.scene.load.audio('boostSound', 'assets/boost.mp3');
    }
}