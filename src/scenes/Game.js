export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        // Background
        this.load.image('background', 'assets/images/background.png');
        // Player
        this.load.image('rocket_base', 'assets/images/rocket_baseA.png');
        this.load.image('rocket_finns', 'assets/images/rocket_finsA.png');
        this.load.image('rocket_fuel', 'assets/images/rocket_fuelA.png');
        this.load.image('rocket_sides', 'assets/images/rocket_sidesA.png');
        this.load.image('rocket_top', 'assets/images/rocket_topA.png');
        // Enemies
        this.load.image('enemyBlack1', 'assets/images/enemyBlack1.png');
        this.load.image('enemyBlue1', 'assets/images/enemyBlue1.png');
        this.load.image('enemyGreen1', 'assets/images/enemyGreen1.png');
        this.load.image('enemyRed1', 'assets/images/enemyRed1.png');
        // Stars
        this.load.image('star_gold', 'assets/images/star_gold.png');
        this.load.image('star_silver', 'assets/images/star_silver.png');
        // Sounds
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
        this.load.audio('gameOverSound', 'assets/sounds/game-over.wav');
        this.load.audio('collectSound', 'assets/sounds/collect.mp3');
        this.load.audio('shieldSound', 'assets/sounds/shield.wav');
        this.load.audio('gameWinSound', 'assets/sounds/game-win.wav');
        // Powerups
        this.load.image('magnet', 'assets/images/magnet.png');
        this.load.audio('magnetSound', 'assets/sounds/magnet.mp3');
        this.load.image('shield', 'assets/images/shield.png');
        this.load.image('shieldEffect', 'assets/images/shield-effect.png');
        this.load.image('boost', 'assets/boost.png');
        this.load.audio('boostSound', 'assets/boost.mp3');

    }

    create() {
        const glowGraphics = this.add.graphics();
        const glowColor = 0x00ffff;
        const outerRadius = 80;
        const innerRadius = 40;

        const gradientSteps = 10;
        for (let i = gradientSteps; i >= 1; i--) {
            const alpha = 0.05 * i;
            const radius = innerRadius + ((outerRadius - innerRadius) * (i / gradientSteps));
            glowGraphics.fillStyle(glowColor, alpha);
            glowGraphics.fillCircle(outerRadius, outerRadius, radius);
        }

        glowGraphics.generateTexture('glowTexture', outerRadius * 2, outerRadius * 2);
        glowGraphics.destroy();

        this.glow = this.add.image(0, 0, 'glowTexture')
            .setOrigin(0.5)
            .setDepth(0)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setVisible(false)
            .setScale(1.2);

        this.shieldEffect = this.add.image(0, 0, 'shieldEffect')
            .setOrigin(0.5)
            .setScale(0.4)
            .setDepth(0)
            .setVisible(false);

            

        this.gameOverTriggered = false;
        this.isGameOver = false;
        this.score = 0;
        this.isMagnetActive = false;
        this.isShieldActive = false;

        this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        this.scoreText = this.add.text(this.scale.width / 2, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        const startX = 100;
        const startY = this.scale.height / 2;

        this.rocketContainer = this.add.container(startX, startY, [
            this.add.image(0, 0, 'rocket_base').setOrigin(0.5).setScale(0.7),
            this.add.image(0, -30, 'rocket_finns').setOrigin(0.5).setScale(0.7),
            this.add.image(0, 30, 'rocket_fuel').setOrigin(0.5).setScale(0.7),
            this.add.image(0, 0, 'rocket_sides').setOrigin(0.5).setScale(0.7),
            this.add.image(0, -60, 'rocket_top').setOrigin(0.5).setScale(0.7),
        ]);
        this.rocketContainer.rotation = Phaser.Math.DegToRad(90);

        this.rocketBody = this.physics.add.sprite(startX, startY, null)
            .setSize(100, 40)
            .setVisible(false)
            .setCollideWorldBounds(true);

        this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.rocketBody.body.onWorldBounds = true;

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.rocketBody) {
                this.triggerGameOver();
            }
        });

        this.enemies = this.physics.add.group();
        this.stars = this.physics.add.group();

        this.time.addEvent({
            delay: 1500,
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.rocketBody, this.stars, this.collectStar, null, this);
        this.setupControls();
        this.collectSound = this.sound.add('collectSound');
        this.shieldSound = this.sound.add('shieldSound');
        this.magnetSound = this.sound.add('magnetSound', { loop: true });

        this.powerUps = this.physics.add.group();

        this.physics.add.overlap(this.rocketBody, this.powerUps, (player, powerUp) => {
            if (powerUp.texture.key === 'magnet') {
                this.activateMagnet(powerUp);
            } else if (powerUp.texture.key === 'shield') {
                this.activateShield(powerUp);
            }
        }, null, this);
    }

    setupControls() {
        this.input.keyboard.on('keydown', (event) => {
            if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
                event.preventDefault();
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,S');
    }

    update() {
        this.glow.setVisible(this.isMagnetActive);
        this.glow.setPosition(this.rocketContainer.x, this.rocketContainer.y);
        this.shieldEffect.setVisible(this.isShieldActive);
        this.shieldEffect.setPosition(this.rocketContainer.x, this.rocketContainer.y);

        if (this.isMagnetActive) {
            const scale = 1.2 + Math.sin(this.time.now * 0.005) * 0.05;
            this.glow.setScale(scale);
        }

        const speed = 300;
        this.rocketBody.setVelocity(0);

        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.rocketBody.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.rocketBody.setVelocityY(speed);
        }

        this.rocketContainer.x = this.rocketBody.x;
        this.rocketContainer.y = this.rocketBody.y;

        if (this.rocketBody.y < 0 || this.rocketBody.y > this.scale.height) {
            this.triggerGameOver();
        }

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.x < -enemy.width) {
                enemy.destroy();
            }
        });

        this.stars.getChildren().forEach(star => {
            if (star.x < -star.width) {
                star.destroy();
            }

            if (this.isMagnetActive) {
                const dx = this.rocketBody.x - star.x;
                const dy = this.rocketBody.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 200) {
                    const pullSpeed = 200;
                    const angle = Math.atan2(dy, dx);
                    star.setVelocity(
                        Math.cos(angle) * pullSpeed,
                        Math.sin(angle) * pullSpeed
                    );
                }
            }
        });
    }

    createEnemy() {
        const enemyTypes = ['enemyBlack1', 'enemyBlue1', 'enemyGreen1', 'enemyRed1'];
        const starTypes = ['star_silver', 'star_gold'];
        const randomY = Phaser.Math.Between(60, this.scale.height - 60);
        const rand = Phaser.Math.Between(1, 8);
        const isStar = rand === 1;
        const isMagnet = rand === 2;
        const isShield = rand === 3;

        if (isStar) {
            const starType = Phaser.Utils.Array.GetRandom(starTypes);
            const star = this.stars.create(this.scale.width + 50, randomY, starType)
                .setOrigin(0.5)
                .setScale(1)
                .setDepth(50)
                .setVelocityX(-300)
                .setData('points', starType === 'star_gold' ? 10 : 5);

            star.setSize(star.width, star.height);
        } else if (isMagnet) {
            const magnet = this.powerUps.create(this.scale.width + 50, randomY, 'magnet')
                .setOrigin(0.5)
                .setScale(0.7)
                .setDepth(50)
                .setVelocityX(-300);
        } else if (isShield) {
            const shield = this.powerUps.create(this.scale.width + 50, randomY, 'shield')
                .setOrigin(0.5)
                .setScale(0.08)
                .setDepth(50)
                .setVelocityX(-300);
        } else {
            const enemy = this.enemies.create(this.scale.width + 50, randomY, Phaser.Utils.Array.GetRandom(enemyTypes))
                .setOrigin(0.5)
                .setScale(0.8)
                .setDepth(50)
                .setAngle(Phaser.Math.Between(-180, 180))
                .setVelocityX(-350);

            this.physics.add.overlap(this.rocketBody, enemy, (rocket, enemy) => {
                if (this.isShieldActive) {
                    enemy.destroy();
                } else {
                    this.triggerGameOver();
                }
            }, null, this);
        }
    }

    collectStar(rocket, star) {
        this.collectSound.play();
        this.updateScore(star.getData('points'));
        star.destroy();
    }

    activateMagnet(magnet) {
        magnet.destroy();
        this.isMagnetActive = true;
        this.magnetSound.play();

        this.time.delayedCall(5000, () => {
            this.isMagnetActive = false;
            this.magnetSound.stop();
        }, [], this);
    }


    activateShield(shield) {
        shield.destroy();
        this.isShieldActive = true;
        this.shieldSound.play();

        this.time.delayedCall(5000, () => {
            this.isShieldActive = false;
        }, [], this);
    }

    updateScore(amount) {
        this.score += amount;
        this.scoreText.setText(`Score: ${this.score}`);
        this.checkWinCondition();
    }

    checkWinCondition() {
        if (this.score >= 15 && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.isGameOver = true;

            // Speel de win-sound af
            this.sound.play('gameWinSound');

            this.scene.start('WinScene', {
                background: this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1),
                score: this.scoreText.text
            });
        }
    }


    triggerGameOver() {
        if (this.gameOverTriggered || this.isShieldActive) return;

        this.gameOverTriggered = true;
        this.isGameOver = true;
        this.sound.play('gameOverSound');

        this.scene.start('GameOver', {
            background: this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1),
            score: this.scoreText.text
        });
    }
}
