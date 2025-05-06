export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.create();         // Maak de raket en physics body aan
        this.setupControls();  // Stel keyboardbesturing in
    }

    create() {
        const startX = 100;
        const startY = this.scene.scale.height / 2;

        // Maak een container voor de raket met meerdere afbeeldingslagen
        this.rocketContainer = this.scene.add.container(startX, startY, [
            this.scene.add.image(0, 0, 'rocket_base').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, -30, 'rocket_finns').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, 30, 'rocket_fuel').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, 0, 'rocket_sides').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, -60, 'rocket_top').setOrigin(0.5).setScale(0.7),
        ]);

        // Draai de raket zodat deze naar rechts wijst
        this.rocketContainer.rotation = Phaser.Math.DegToRad(90);

        // Maak een onzichtbare physics body voor botsingen
        this.rocketBody = this.scene.physics.add.sprite(startX, startY, null)
            .setSize(100, 40)                // Stel hitbox in
            .setVisible(false)              // Geen zichtbare sprite
            .setCollideWorldBounds(true);   // Bots met rand van scherm

        // Activeer event als speler de wereldgrenzen raakt
        this.rocketBody.body.onWorldBounds = true;

        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.rocketBody && !this.scene.isGameOver) {
                this.scene.ui.triggerGameOver(); // Game over als raket uit beeld vliegt
            }
        });
    }

    setupControls() {
        // Voorkom scrollen bij gebruik van pijltjes en spatie
        this.scene.input.keyboard.on('keydown', (event) => {
            if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
                event.preventDefault();
            }
        });

        // Voeg toetsen toe voor pijltjes en W/S
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.keys = this.scene.input.keyboard.addKeys('W,S');
    }

    update() {
        const speed = 300;

        // Reset snelheid voor deze frame
        this.rocketBody.setVelocity(0);

        // Beweeg omhoog of omlaag afhankelijk van input
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            this.rocketBody.setVelocityY(-speed);
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {
            this.rocketBody.setVelocityY(speed);
        }

        // Game over als speler buiten scherm vliegt
        if (this.rocketBody.y < 0 || this.rocketBody.y > this.scene.scale.height) {
            if (!this.scene.isGameOver) {
                this.scene.ui.triggerGameOver();
            }
        }

        // Synchroniseer de containerpositie met de physics body
        this.rocketContainer.x = this.rocketBody.x;
        this.rocketContainer.y = this.rocketBody.y;
    }
}
