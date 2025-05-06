export class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' }); // Unieke key voor deze scene
    }

    preload() {
        // Laad benodigde assets
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
        this.load.image('logo', 'assets/images/logo.png');
        this.load.image('rocketIcon', 'assets/images/rocket.png');
    }

    create(data) {
        // Stop achtergrondmuziek als die nog speelt
        if (this.sound.get('backgroundMusic')?.isPlaying) {
            this.sound.get('backgroundMusic').stop();
        }

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Gebruik de background uit de vorige scene
        const background = data.background;
        background.setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Geluidsinstellingen
        const hoverSound = this.sound.add('hoverSound');
        const clickSound = this.sound.add('clickSound');
        let soundCooldown = false;

        // Logo bovenaan
        const logo = this.add.image(centerX, centerY - 200, 'logo');
        logo.setOrigin(0.5).setScale(0.08);

        // "Game over" tekst
        this.add.text(centerX, centerY - 120, 'Game over', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Score tonen
        this.add.text(centerX, centerY - 50, `Score: ${data.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Herbruikbare functie voor het maken van knoppen
        const createButton = (text, onClick, offsetY, icon) => {
            const container = this.add.container(centerX, centerY + offsetY).setDepth(201);

            // Achtergrond van knop
            const bg = this.add.rectangle(0, 0, 270, 60, 0xed1b30)
                .setStrokeStyle(2, 0xffffff)
                .setOrigin(0.5);

            // Knoptekst
            const label = this.add.text(0, 0, text, {
                fontSize: '24px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            // Icoon links van de knoptekst
            if (icon) {
                this.add.image(-90, 0, icon)
                    .setOrigin(0.5)
                    .setScale(0.4);
            }

            // Interactieve events voor zowel bg als label
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

        // Knop: Opnieuw spelen
        createButton('🔁 Opnieuw spelen', () => {
            this.scene.start('Game');
        }, 40);

        // Knop: Terug naar het hoofdmenu
        createButton('🏠 Terug naar menu', () => {
            this.scene.start('StartScene');
        }, 120);
    }
}
