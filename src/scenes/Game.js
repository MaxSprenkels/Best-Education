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
        // Powerups
        this.load.image('magnet', 'assets/images/magnet.png');
    }

    create() {
        const glowGraphics = this.add.graphics();
        const glowColor = 0x00ffff;
        const outerRadius = 80;
        const innerRadius = 40;

        // Gradient ring effect
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


        this.gameOverTriggered = false;
        this.isGameOver = false;
        this.score = 0;
        this.isMagnetActive = false;


        // Achtergrond
        this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Score
        this.scoreText = this.add.text(this.scale.width / 2, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        // Startpositie raket
        const startX = 100;
        const startY = this.scale.height / 2;

        // Raket
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

        // Groepen
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

        this.powerUps = this.physics.add.group();

        this.physics.add.overlap(this.rocketBody, this.powerUps, this.activateMagnet, null, this);

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
        this.glow.x = this.rocketContainer.x;
        this.glow.y = this.rocketContainer.y;
        this.glow.setVisible(this.isMagnetActive);

        if (this.isMagnetActive) {
            this.glow.setVisible(true);
            const scale = 1.2 + Math.sin(this.time.now * 0.005) * 0.05;
            this.glow.setScale(scale);
        } else {
            this.glow.setVisible(false);
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
                this.stars.getChildren().forEach(star => {
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
                });
            }

        });
    }

    createEnemy() {
        const enemyTypes = ['enemyBlack1', 'enemyBlue1', 'enemyGreen1', 'enemyRed1'];
        const starTypes = ['star_silver', 'star_gold'];
        const randomY = Phaser.Math.Between(60, this.scale.height - 60);
        const rand = Phaser.Math.Between(1, 6);
        const isStar = rand === 1;
        const isMagnet = rand === 2;


        if (isStar) {
            const starType = Phaser.Utils.Array.GetRandom(starTypes);
            const star = this.stars.create(this.scale.width + 50, randomY, starType)
                .setOrigin(0.5)
                .setScale(1)
                .setDepth(50)
                .setVelocityX(-300)
                .setData('points', starType === 'star_gold' ? 10 : 5);

            const width = star.width * 1;
            const height = star.height * 1;
            star.setSize(width, height);
            star.setOffset((star.width - width) / 2, (star.height - height) / 2);
        }
        else if (isMagnet) {
            const magnet = this.powerUps.create(this.scale.width + 50, randomY, 'magnet')
                .setOrigin(0.5)
                .setScale(0.7)
                .setDepth(50)
                .setVelocityX(-300);

            const width = magnet.width * 0.7;
            const height = magnet.height * 0.7;
            magnet.setSize(width, height);
            magnet.setOffset((magnet.width - width) / 2, (magnet.height - height) / 2);
        }
        else {
            const randomEnemy = Phaser.Utils.Array.GetRandom(enemyTypes);
            const enemy = this.enemies.create(this.scale.width + 50, randomY, randomEnemy)
                .setOrigin(0.5)
                .setScale(0.8)
                .setDepth(50)
                .setAngle(Phaser.Math.Between(-180, 180))
                .setVelocityX(-350);

            const width = enemy.width * 0.8;
            const height = enemy.height * 0.8;
            enemy.setSize(width, height);
            enemy.setOffset((enemy.width - width) / 2, (enemy.height - height) / 2);

            this.physics.add.overlap(this.rocketBody, enemy, this.triggerGameOver, null, this);
        }
    }

    collectStar(rocket, star) {
        this.collectSound.play();
        this.updateScore(star.getData('points'));
        star.destroy();
    }


    activateMagnet(player, magnet) {
        magnet.destroy();
        this.isMagnetActive = true;

        // Na 5 seconden stopt het effect
        this.time.delayedCall(5000, () => {
            this.isMagnetActive = false;
        }, [], this);
    }



    updateScore(amount) {
        this.score += amount;
        this.scoreText.setText(`Score: ${this.score}`);
        this.checkWinCondition();
    }

    checkWinCondition() {
        if (this.score >= 100 && !this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.isGameOver = true;

            this.scene.start('WinScene', {
                background: this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1),
                score: this.scoreText.text
            });

        }
    }

    triggerGameOver() {
        if (this.gameOverTriggered) return;
        this.gameOverTriggered = true;
        this.isGameOver = true;

        this.sound.play('gameOverSound');

        this.scene.start('GameOver', {
            background: this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1),
            score: this.scoreText.text
        });
    }
}
