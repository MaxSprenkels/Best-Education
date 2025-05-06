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
        // Laad alle assets in via de Preloader-klasse
        this.preloader = new Preloader(this);
        this.preloader.loadAssets();
    }

    create() {
        // Interne gamestates
        this.gameOverTriggered = false; // voorkomt dubbele triggers
        this.isGameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.isMagnetActive = false;  // wordt geactiveerd door power-up
        this.isShieldActive = false;  // wordt geactiveerd door power-up

        // Initialiseer alle spelcomponenten
        this.ui = new UI(this);
        this.player = new Player(this);
        this.enemies = new Enemies(this);
        this.powerUps = new PowerUps(this);

        // Stel overlap/botsingslogica in
        this.setupInteractions();

        // Speel achtergrondmuziek af
        this.backgroundMusic = this.sound.add('backgroundMusic', {
            volume: 0.3,
            loop: true
        });
        this.backgroundMusic.play();

        // Stel wereldgrenzen in voor physics
        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.physics.world.setBoundsCollision(true, true, true, true);

        // Maak explosieanimatie aan
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 11 }),
            frameRate: 15,
            hideOnComplete: true
        });

        // Pauze-overlay en tekst
        this.pauseOverlay = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.6
        ).setDepth(200).setVisible(false);

        this.pauseText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'PAUSED',
            {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold',
            }
        ).setOrigin(0.5).setDepth(201).setVisible(false);

        // Pauzeer het spel via ESC of P
        this.input.keyboard.on('keydown-P', this.togglePause, this);
        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
    }

    setupInteractions() {
        // Botsing tussen speler en vijanden → trigger enemy collision
        this.physics.add.overlap(
            this.player.rocketBody,
            this.enemies.group,
            this.enemies.handleEnemyCollision,
            null,
            this.enemies
        );

        // Botsing tussen speler en power-ups → activeer power-up effect
        this.physics.add.overlap(
            this.player.rocketBody,
            this.powerUps.group,
            this.powerUps.handlePowerUpCollision,
            null,
            this.powerUps
        );

        // Botsing tussen speler en sterren → verhoog score
        this.physics.add.overlap(
            this.player.rocketBody,
            this.enemies.stars,
            this.ui.collectStar,
            null,
            this.ui
        );
    }

    update() {
        // Stop update-loop als spel gepauzeerd of afgelopen is
        if (this.isGameOver || this.isPaused) return;

        // Update alle game-onderdelen per frame
        this.player.update();
        this.enemies.update();
        this.powerUps.update();
        this.ui.updateEffects(this);

        // Winvoorwaarde: 100 punten
        if (this.score >= 100 && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.isGameOver = true;

            this.backgroundMusic.stop();

            // Ga naar WinScene met score en achtergrond
            this.scene.start('WinScene', {
                score: this.score,
                background: this.add.image(0, 0, 'background'),
            });
        }
    }

    togglePause() {
        // Zet de pauzestatus om
        this.isPaused = !this.isPaused;

        // Toon/verberg overlay en tekst
        this.pauseOverlay.setVisible(this.isPaused);
        this.pauseText.setVisible(this.isPaused);

        // Pauzeer of hervat physics en muziek
        if (this.isPaused) {
            this.physics.world.pause();
            this.backgroundMusic.pause();
        } else {
            this.physics.world.resume();
            this.backgroundMusic.resume();
        }
    }
}
