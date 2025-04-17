export default class Enemies {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group();
        this.stars = this.scene.physics.add.group();
        this.lastEnemyY = null;
        this.activeStars = 0;
        this.maxActiveStars = 1;

        this.scene.time.addEvent({
            delay: this.getCurrentEnemyDelay(),
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        this.scene.time.addEvent({
            delay: Phaser.Math.Between(10000, 15000),
            callback: this.tryCreateStar,
            callbackScope: this,
            loop: true
        });

        this.scene.time.addEvent({
            delay: Phaser.Math.Between(20000, 30000),
            callback: this.tryCreatePowerUp,
            callbackScope: this,
            loop: true
        });
    }

    getCurrentEnemyDelay() {
        const score = this.scene.score;
        if (score < 20) return 600;
        if (score < 40) return 500;
        if (score < 60) return 400;
        if (score < 80) return 300;
        return 200;
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
        const enemyTypes = ['enemyBlack1', 'enemyBlue1', 'enemyGreen1', 'enemyRed1'];
        let randomY;

        do {
            randomY = Phaser.Math.Between(60, this.scene.scale.height - 60);
        } while (this.lastEnemyY && Math.abs(randomY - this.lastEnemyY) < 100);

        this.lastEnemyY = randomY;

        const rand = Phaser.Math.Between(1, 10);

        if (rand === 1) {
            if (Phaser.Math.Between(1, 3) === 1) {
                this.tryCreateStar();
            } else {
                this.tryCreatePowerUp();
            }
        } else {
            const enemy = this.group.create(this.scene.scale.width + 50, randomY,
                Phaser.Utils.Array.GetRandom(enemyTypes))
                .setOrigin(0.5)
                .setScale(0.8)
                .setDepth(50)
                .setAngle(Phaser.Math.Between(-180, 180))
                .setVelocityX(-350);
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