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
        // Sounds
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
        this.load.audio('gameOverSound', 'assets/sounds/game-over.wav');
    }

    create() {
        this.gameOverTriggered = false;
        this.isGameOver = false;

        // Achtergrond
        this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Score in het midden bovenaan
        this.scoreText = this.add.text(this.scale.width / 2, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        })
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(100);

        // Startpositie raket
        const startX = 100;
        const startY = this.scale.height / 2;

        // Raket container
        this.rocketContainer = this.add.container(startX, startY, [
            this.add.image(0, 0, 'rocket_base').setOrigin(0.5).setScale(0.7),
            this.add.image(0, -30, 'rocket_finns').setOrigin(0.5).setScale(0.7),
            this.add.image(0, 30, 'rocket_fuel').setOrigin(0.5).setScale(0.7),
            this.add.image(0, 0, 'rocket_sides').setOrigin(0.5).setScale(0.7),
            this.add.image(0, -60, 'rocket_top').setOrigin(0.5).setScale(0.7),
        ]);

        // Raket 90 graden draaien
        this.rocketContainer.rotation = Phaser.Math.DegToRad(90);

        // Physics body
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

        // Enemy groep
        this.enemies = this.physics.add.group();

        // Spawn enemies
        this.time.addEvent({
            delay: 1500,
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        // Controls
        this.setupControls();
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
        const speed = 300;
        this.rocketBody.setVelocity(0);

        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.rocketBody.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.rocketBody.setVelocityY(speed);
        }

        // Sync container met physics body
        this.rocketContainer.x = this.rocketBody.x;
        this.rocketContainer.y = this.rocketBody.y;

        // Check world bounds
        if (this.rocketBody.y < 0 || this.rocketBody.y > this.scale.height) {
            this.triggerGameOver();
        }

        // Verwijder enemies buiten scherm
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.x < -enemy.width) {
                enemy.destroy();
            }
        });
    }

    createEnemy() {
        const enemyTypes = ['enemyBlack1', 'enemyBlue1', 'enemyGreen1', 'enemyRed1'];
        const randomY = Phaser.Math.Between(60, this.scale.height - 60);
        const randomEnemy = Phaser.Utils.Array.GetRandom(enemyTypes);

        const enemy = this.enemies.create(this.scale.width + 50, randomY, randomEnemy)
            .setOrigin(0.5)
            .setScale(0.8)
            .setDepth(50)
            .setAngle(Phaser.Math.Between(-180, 180));

        const width = enemy.width * 0.8;
        const height = enemy.height * 0.8;
        enemy.setSize(width, height);
        enemy.setOffset((enemy.width - width) / 2, (enemy.height - height) / 2);

        enemy.setVelocityX(-350);

        this.physics.add.overlap(this.rocketBody, enemy, this.triggerGameOver, null, this);
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
