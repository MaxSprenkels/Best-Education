export default class PowerUps {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group();
    }

    createPowerUp(x, y, type) {
        if (type === 'magnet') {
            return this.group.create(x, y, 'magnet')
                .setOrigin(0.5)
                .setScale(0.7)
                .setDepth(50)
                .setVelocityX(-300);
        } else if (type === 'shield') {
            return this.group.create(x, y, 'shield')
                .setOrigin(0.5)
                .setScale(0.08)
                .setDepth(50)
                .setVelocityX(-300);
        }
    }

    handlePowerUpCollision(player, powerUp) {
        if (powerUp.texture.key === 'magnet') {
            this.scene.powerUps.activateMagnet(powerUp);
        } else if (powerUp.texture.key === 'shield') {
            this.scene.ui.activateShield(powerUp);
        }
    }

    activateMagnet(powerUp) {
        powerUp.destroy();
        this.scene.isMagnetActive = true;
        this.scene.sound.play('magnetSound', { loop: true });

        this.magnetRadius = 300;
        this.magnetForce = 400;

        this.scene.time.delayedCall(5000, () => {
            this.scene.isMagnetActive = false;
            this.scene.sound.stopByKey('magnetSound');
        }, [], this);
    }

    update() {
        this.group.getChildren().forEach(powerUp => {
            if (powerUp.x < -powerUp.width) powerUp.destroy();
        });
    }
}