export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        // Laad hier je assets (voorbeeld):
        this.load.image('player', 'assets/images/player.png');
    }

    create() {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        this.add.text(400, 100, 'Game is gestart!', {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }
    }
}