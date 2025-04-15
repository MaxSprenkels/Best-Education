export class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('rocketIcon', 'assets/images/rocket.png');
    }

    create(data) {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Achtergrond behouden
        const background = data.background;
        background.setOrigin(0).setDisplaySize(this.scale.width, this.scale.height).setDepth(-1);

        // Sounds
        const hoverSound = this.sound.add('hoverSound');
        const clickSound = this.sound.add('clickSound');
        let soundCooldown = false;

        // Logo
        const logo = this.add.image(centerX, centerY - 200, 'logo');
        logo.setOrigin(0.5);
        logo.setScale(0.08);

        // Titel
        this.add.text(centerX, centerY - 80, 'Game over', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);



        const createButton = (text, onClick, offsetY, icon) => {
            const container = this.add.container(centerX, centerY + offsetY).setDepth(201);

            const bg = this.add.rectangle(0, 0, 270, 60, 0xed1b30)
                .setStrokeStyle(2, 0xffffff)
                .setOrigin(0.5);

            const label = this.add.text(0, 0, text, {
                fontSize: '24px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            if (icon) {
                this.add.image(-90, 0, icon)
                    .setOrigin(0.5)
                    .setScale(0.4);
            }
            [bg, label].forEach(el => {
                el.setInteractive({ useHandCursor: true });

                el.on('pointerover', () => {
                    if (!soundCooldown) {
                        hoverSound.play();
                        soundCooldown = true;
                        setTimeout(() => soundCooldown = false, 300);
                    }

                    this.tweens.add({
                        targets: container,
                        scale: 1.05,
                        duration: 200,
                        ease: 'Power2'
                    });

                    bg.setFillStyle(0xff4c5c);
                });

                el.on('pointerout', () => {
                    this.tweens.add({
                        targets: container,
                        scale: 1,
                        duration: 200,
                        ease: 'Power2'
                    });

                    bg.setFillStyle(0xed1b30);
                });

                el.on('pointerdown', () => {
                    clickSound.play();
                    setTimeout(onClick, 150);
                });
            });

            container.add([bg, label]);
        };

        createButton('🚀 Opnieuw spelen', () => {
            this.scene.start('Game');
        }, 0, 'rocketIcon');

        createButton('🚀 Terug naar menu', () => {
            this.scene.start('StartScene');
        }, 100, 'rocketIcon');

    }
}
