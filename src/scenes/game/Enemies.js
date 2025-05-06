export default class Enemies {
    constructor(scene) {
        this.scene = scene;
        this.group = this.scene.physics.add.group(); // Groep voor vijanden
        this.stars = this.scene.physics.add.group(); // Groep voor sterren (punten)
        this.lastEnemyY = null;
        this.activeStars = 0;
        this.maxActiveStars = 2; // Beperk het aantal actieve sterren op het scherm

        // Event om herhaaldelijk vijanden te spawnen
        this.scene.time.addEvent({
            delay: this.getCurrentEnemyDelay(),
            callback: this.createEnemy,
            callbackScope: this,
            loop: true
        });

        // Event om sterren te spawnen
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(4000, 7000),
            callback: this.tryCreateStar,
            callbackScope: this,
            loop: true
        });

        // Event om power-ups te spawnen
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(30000, 45000),
            callback: this.tryCreatePowerUp,
            callbackScope: this,
            loop: true
        });
    }

    // Bepaalt spawnvertraging voor vijanden gebaseerd op de score
    getCurrentEnemyDelay() {
        const score = this.scene.score;
        if (score < 20) return 600;
        if (score < 40) return 500;
        if (score < 60) return 450;
        if (score < 80) return 400;
        return 350;
    }

    // Probeert een ster te spawnen als het maximum nog niet bereikt is
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

        // Verlaag actief aantal sterren wanneer een ster verdwijnt
        star.on('destroy', () => {
            this.activeStars--;
        });
    }

    // Probeert een power-up te spawnen
    tryCreatePowerUp() {
        const powerUpTypes = ['magnet', 'shield'];
        const randomY = Phaser.Math.Between(60, this.scene.scale.height - 60);
        const type = Phaser.Utils.Array.GetRandom(powerUpTypes);
        this.scene.powerUps.createPowerUp(this.scene.scale.width + 50, randomY, type);
    }

    // Spawnt vijanden (en soms een ster of power-up)
    createEnemy() {
        const rand = Phaser.Math.Between(1, 10);

        // 20% kans op ster of power-up in plaats van vijand
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

        // Bepaalt hoeveel vijanden er tegelijk gespawned worden
        let enemiesToSpawn = 1;
        if (!isSmallScreen) {
            if (score >= 40) enemiesToSpawn = 2;
            if (score >= 80) enemiesToSpawn = 3;
            enemiesToSpawn = Math.min(enemiesToSpawn, 3);
        }

        const usedY = []; // Houdt bij welke Y-posities al gebruikt zijn
        const baseVelocity = -350;

        // Spawn meerdere vijanden zonder overlap
        for (let i = 0; i < enemiesToSpawn; i++) {
            let randomY;
            let attempts = 0;

            // Vermijd dat vijanden te dicht bij elkaar spawnen
            do {
                randomY = Phaser.Math.Between(60, screenHeight - 60);
                attempts++;
            } while (
                usedY.some(y => Math.abs(y - randomY) < 100) &&
                attempts < 10
            );

            usedY.push(randomY);

            // Maak vijand en stel eigenschappen in
            this.group.create(this.scene.scale.width + 50 + i * 30, randomY,
                Phaser.Utils.Array.GetRandom(enemyTypes))
                .setOrigin(0.5)
                .setScale(0.8)
                .setDepth(50)
                .setAngle(Phaser.Math.Between(-180, 180))
                .setVelocityX(baseVelocity);
        }
    }

    // Behandelt botsingen tussen raket en vijand
    handleEnemyCollision(rocket, enemy) {
        if (this.scene.isShieldActive) {
            enemy.destroy(); // Raket is beschermd
        } else {
            this.scene.ui.triggerGameOver(); // Spel is voorbij
        }
    }

    // Update-functie: verwijder vijanden/sterren die buiten het scherm zijn
    update() {
        this.group.getChildren().forEach(enemy => {
            if (enemy.x < -enemy.width) enemy.destroy();
        });

        this.stars.getChildren().forEach(star => {
            if (star.x < -star.width) star.destroy();
        });
    }
}
