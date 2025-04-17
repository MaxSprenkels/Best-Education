export default class Player {
    constructor(scene) {
        this.scene = scene;
        this.create();
        this.setupControls();
    }

    create() {
        const startX = 100;
        const startY = this.scene.scale.height / 2;

        this.rocketContainer = this.scene.add.container(startX, startY, [
            this.scene.add.image(0, 0, 'rocket_base').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, -30, 'rocket_finns').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, 30, 'rocket_fuel').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, 0, 'rocket_sides').setOrigin(0.5).setScale(0.7),
            this.scene.add.image(0, -60, 'rocket_top').setOrigin(0.5).setScale(0.7),
        ]);
        this.rocketContainer.rotation = Phaser.Math.DegToRad(90);

        this.rocketBody = this.scene.physics.add.sprite(startX, startY, null)
            .setSize(100, 40)
            .setVisible(false)
            .setCollideWorldBounds(true);

        // World bounds
        this.rocketBody.body.onWorldBounds = true;

        // Bounds check
        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.rocketBody && !this.scene.isGameOver) {
                this.scene.ui.triggerGameOver();
            }
        });
}

setupControls() {
    this.scene.input.keyboard.on('keydown', (event) => {
        if ([32, 37, 38, 39, 40].includes(event.keyCode)) {
            event.preventDefault();
        }
    });

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keys = this.scene.input.keyboard.addKeys('W,S');
}

update() {
    const speed = 300;
    this.rocketBody.setVelocity(0);

    if (this.cursors.up.isDown || this.keys.W.isDown) {
        this.rocketBody.setVelocityY(-speed);
    } else if (this.cursors.down.isDown || this.keys.S.isDown) {
        this.rocketBody.setVelocityY(speed);
    }

    if (this.rocketBody.y < 0 || this.rocketBody.y > this.scene.scale.height) {
        if (!this.scene.isGameOver) {
            this.scene.ui.triggerGameOver();
        }
    }

    this.rocketContainer.x = this.rocketBody.x;
    this.rocketContainer.y = this.rocketBody.y;
}
}