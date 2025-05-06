export default class PowerUps {
    constructor(scene) {
        this.scene = scene;

        // Maak een physics group aan voor power-ups
        this.group = this.scene.physics.add.group();
    }

    createPowerUp(x, y, type) {
        // Maak een power-up aan op positie (x, y) met het juiste type
        if (type === 'magnet') {
            return this.group.create(x, y, 'magnet')
                .setOrigin(0.5)
                .setScale(0.7)
                .setDepth(50)
                .setVelocityX(-300); // Laat naar links bewegen
        } else if (type === 'shield') {
            return this.group.create(x, y, 'shield')
                .setOrigin(0.5)
                .setScale(0.08)
                .setDepth(50)
                .setVelocityX(-300); // Laat naar links bewegen
        }
    }

    handlePowerUpCollision(player, powerUp) {
        // Reageer op botsing tussen speler en power-up
        if (powerUp.texture.key === 'magnet') {
            this.scene.powerUps.activateMagnet(powerUp); // Activeer magneet
        } else if (powerUp.texture.key === 'shield') {
            this.scene.ui.activateShield(powerUp); // Activeer schild
        }
    }

    activateMagnet(powerUp) {
        // Activeer magneet-effect
        powerUp.destroy();
        this.scene.isMagnetActive = true;

        // Speel magneetgeluid af in loop
        this.scene.sound.play('magnetSound', { loop: true });

        // Stel radius en kracht van magneet in
        this.magnetRadius = 300;
        this.magnetForce = 400;

        // Deactiveer magneet na 5 seconden
        this.scene.time.delayedCall(5000, () => {
            this.scene.isMagnetActive = false;
            this.scene.sound.stopByKey('magnetSound');
        }, [], this);
    }

    update() {
        // Verwijder power-ups die buiten het scherm zijn
        this.group.getChildren().forEach(powerUp => {
            if (powerUp.x < -powerUp.width) powerUp.destroy();
        });
    }
}
