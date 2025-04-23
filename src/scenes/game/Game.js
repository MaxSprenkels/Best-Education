import Preloader from './Preloader.js';
import Player from './Player.js';
import Enemies from './Enemies.js';
import PowerUps from './PowerUps.js';
import UI from './UI.js';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        this.preloader = new Preloader(this);
        this.preloader.loadAssets();
    }

    create() {
        // Game state
        this.gameOverTriggered = false;
        this.isGameOver = false;
        this.score = 0;
        this.isMagnetActive = false;
        this.isShieldActive = false;

        // Initialize components
        this.ui = new UI(this);
        this.player = new Player(this);
        this.enemies = new Enemies(this);
        this.powerUps = new PowerUps(this);

        this.setupInteractions();

        // Start background music
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.3,
            loop: true
        });
        this.backgroundMusic.play();

        // Wereld bounds
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.physics.world.setBoundsCollision(true, true, true, true);
    }

    setupInteractions() {
        this.physics.add.overlap(
            this.player.rocketBody,
            this.enemies.group,
            this.enemies.handleEnemyCollision,
            null,
            this.enemies
        );

        this.physics.add.overlap(
            this.player.rocketBody,
            this.powerUps.group,
            this.powerUps.handlePowerUpCollision,
            null,
            this.powerUps
        );

        this.physics.add.overlap(
            this.player.rocketBody,
            this.enemies.stars,
            this.ui.collectStar,
            null,
            this.ui
        );
    }

    update() {
        if (this.isGameOver) return;

        this.player.update();
        this.enemies.update();
        this.powerUps.update();
        this.ui.updateEffects(this);

        // Wincondition
        if (this.score >= 100 && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.isGameOver = true;

            this.backgroundMusic.stop();

            this.scene.start('WinScene', {
                score: this.score,
                background: this.add.image(0, 0, 'background'),
            });
        }
    }
}
