export default class Enemies {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group();
        this.stars = this.scene.physics.add.group();
        this.lastEnemyY = null;
        this.activeStars = 0;
        this.maxActiveStars = 2;

        this.scene.time.addEvent({
            delay: this.getCurrentEnemyDelay(),
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        this.scene.time.addEvent({
            delay: Phaser.Math.Between(4000, 7000),
            callback: this.tryCreateStar,
            callbackScope: this,
            loop: true
        });

        this.scene.time.addEvent({
            delay: Phaser.Math.Between(30000, 45000),
            callback: this.tryCreatePowerUp,
            callbackScope: this,
            loop: true
        });
    }

    getCurrentEnemyDelay() {
        const score = this.scene.score;
        if (score < 20) return 600;
        if (score < 40) return 500;
        if (score < 60) return 450;
        if (score < 80) return 400;
        return 350;
    }

    tryCreateStar() {
        if (this.activeStars >= this.maxActiveStars) return;

        const starTypes = ['star_silver', 'star_gold'];
        const randomY = Phaser.Math.Between(60, this.scene.scale.height - 60);
        const starType = Phaser.Utils.Array.GetRandom(starTypes);

        const star = this.stars.create(this.scene.scale.width + 50, randomY, starType)
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(50)
            .setVelocityX(-300)
            .setData('points', starType === 'star_gold' ? 10 : 5)
            .setSize(starType.width, starType.height);

        this.activeStars++;

        star.on('destroy', () => {
            this.activeStars--;
        });
    }

    tryCreatePowerUp() {
        const powerUpTypes = ['magnet', 'shield'];
        const randomY = Phaser.Math.Between(60, this.scene.scale.height - 60);
        const type = Phaser.Utils.Array.GetRandom(powerUpTypes);
        this.scene.powerUps.createPowerUp(this.scene.scale.width + 50, randomY, type);
    }

    createEnemy() {
        const rand = Phaser.Math.Between(1, 10);
        if (rand <= 2) {
            if (Phaser.Math.Between(1, 3) <= 2) {
                this.tryCreateStar();
            } else {
                this.tryCreatePowerUp();
            }
            return;
        }

        const enemyTypes = ['enemyBlack1', 'enemyBlue1', 'enemyGreen1', 'enemyRed1'];
        const score = this.scene.score;
        const screenHeight = this.scene.scale.height;

        const isSmallScreen = screenHeight <= 768;

        let enemiesToSpawn = 1;

        if (!isSmallScreen) {
            if (score >= 40) enemiesToSpawn = 2;
            if (score >= 80) enemiesToSpawn = 3;

            // Maximale limiet voor grote schermen
            enemiesToSpawn = Math.min(enemiesToSpawn, 3);
        }

        const usedY = [];
        const baseVelocity = -350;

        for (let i = 0; i < enemiesToSpawn; i++) {
            let randomY;
            let attempts = 0;

            do {
                randomY = Phaser.Math.Between(60, screenHeight - 60);
                attempts++;
            } while (
                usedY.some(y => Math.abs(y - randomY) < 100) &&
                attempts < 10
            );

            usedY.push(randomY);

            this.group.create(this.scene.scale.width + 50 + i * 30, randomY,
                Phaser.Utils.Array.GetRandom(enemyTypes))
                .setOrigin(0.5)
                .setScale(0.8)
                .setDepth(50)
                .setAngle(Phaser.Math.Between(-180, 180))
                .setVelocityX(baseVelocity);
        }
    }

    handleEnemyCollision(rocket, enemy) {
        if (this.scene.isShieldActive) {
            enemy.destroy();
        } else {
            this.scene.ui.triggerGameOver();
        }
    }

    update() {
        this.group.getChildren().forEach(enemy => {
            if (enemy.x < -enemy.width) enemy.destroy();
        });

        this.stars.getChildren().forEach(star => {
            if (star.x < -star.width) star.destroy();
        });
    }
}
