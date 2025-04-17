export default class UI {
    constructor(scene) {
        this.scene = scene;
        this.create();
        this.setupSounds();
    }

    create() {
        // Background
        this.scene.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scene.scale.width, this.scene.scale.height)
            .setDepth(-1);

        // Score text
        this.scoreText = this.scene.add.text(this.scene.scale.width / 2, 16, 'Score: 0', {
            fontSize: '24px',
            fill: '#ffffff'
        }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(100);

        // Glow effect
        const glowGraphics = this.scene.add.graphics();
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

        this.glow = this.scene.add.image(0, 0, 'glowTexture')
            .setOrigin(0.5)
            .setDepth(0)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setVisible(false)
            .setScale(1.2);

        // Shield effect
        this.shieldEffect = this.scene.add.image(0, 0, 'shieldEffect')
            .setOrigin(0.5)
            .setScale(0.4)
            .setDepth(0)
            .setVisible(false);
    }

    setupSounds() {
        this.collectSound = this.scene.sound.add('collectSound');
        this.shieldSound = this.scene.sound.add('shieldSound');
        this.gameOverSound = this.scene.sound.add('gameOverSound');
        this.gameWinSound = this.scene.sound.add('gameWinSound');
    }

    collectStar(rocket, star) {
        this.collectSound.play();
        this.updateScore(star.getData('points'));
        star.destroy();
    }

    updateScore(amount) {
        this.scene.score += amount;
        this.scoreText.setText(`Score: ${this.scene.score}`);
        this.checkWinCondition();
    }

    checkWinCondition() {
        if (this.scene.score >= 15 && !this.scene.gameOverTriggered) {
            this.scene.gameOverTriggered = true;
            this.scene.isGameOver = true;
            this.gameWinSound.play();

            this.scene.scene.start('WinScene', {
                background: this.scene.add.image(0, 0, 'background')
                    .setOrigin(0)
                    .setDisplaySize(this.scene.scale.width, this.scene.scale.height)
                    .setDepth(-1),
                score: this.scoreText.text
            });
        }
    }

    triggerGameOver() {
        if (this.scene.gameOverTriggered || this.scene.isShieldActive) return;

        this.scene.gameOverTriggered = true;
        this.scene.isGameOver = true;
        this.gameOverSound.play();

        this.scene.scene.start('GameOver', {
            background: this.scene.add.image(0, 0, 'background')
                .setOrigin(0)
                .setDisplaySize(this.scene.scale.width, this.scene.scale.height)
                .setDepth(-1),
            score: this.scoreText.text
        });
    }

    activateShield(shield) {
        shield.destroy();
        this.scene.isShieldActive = true;
        this.shieldSound.play();

        this.scene.time.delayedCall(5000, () => {
            this.scene.isShieldActive = false;
        }, [], this);
    }

    updateEffects() {
        this.glow.setVisible(this.scene.isMagnetActive);
        this.glow.setPosition(this.scene.player.rocketContainer.x, this.scene.player.rocketContainer.y);
        this.shieldEffect.setVisible(this.scene.isShieldActive);
        this.shieldEffect.setPosition(this.scene.player.rocketContainer.x, this.scene.player.rocketContainer.y);

        // Magnetisch effect voor sterren
        if (this.scene.isMagnetActive && this.scene.enemies?.stars) {
            this.scene.enemies.stars.getChildren().forEach(star => {
                const dx = this.scene.player.rocketBody.x - star.x;
                const dy = this.scene.player.rocketBody.y - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.scene.powerUps.magnetRadius) {
                    const angle = Math.atan2(dy, dx);
                    star.setVelocity(
                        Math.cos(angle) * this.scene.powerUps.magnetForce,
                        Math.sin(angle) * this.scene.powerUps.magnetForce
                    );
                }
            });
        }
    }
}