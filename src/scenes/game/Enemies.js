export default class Enemies {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group();
        this.stars = this.scene.physics.add.group();

        this.scene.time.addEvent({
            delay: 1500,
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });
    }

    createEnemy() {
        const enemyTypes = ['enemyBlack1', 'enemyBlue1', 'enemyGreen1', 'enemyRed1'];
        const starTypes = ['star_silver', 'star_gold'];
        const randomY = Phaser.Math.Between(60, this.scene.scale.height - 60);
        const rand = Phaser.Math.Between(1, 8);
        const isStar = rand === 1;
        const isMagnet = rand === 2;
        const isShield = rand === 3;

        if (isStar) {
            const starType = Phaser.Utils.Array.GetRandom(starTypes);
            const star = this.stars.create(this.scene.scale.width + 50, randomY, starType)
                .setOrigin(0.5)
                .setScale(1)
                .setDepth(50)
                .setVelocityX(-300)
                .setData('points', starType === 'star_gold' ? 10 : 5);

            star.setSize(star.width, star.height);
        }
        else if (isMagnet || isShield) {
            const type = isMagnet ? 'magnet' : 'shield';
            this.scene.powerUps.createPowerUp(this.scene.scale.width + 50, randomY, type);
        }
        else {
            const enemy = this.group.create(this.scene.scale.width + 50, randomY, Phaser.Utils.Array.GetRandom(enemyTypes))
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