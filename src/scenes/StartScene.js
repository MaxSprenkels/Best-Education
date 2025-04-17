export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('logo', 'assets/images/logo-zonder-text.png');
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Achtergrond
        const background = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1); // Zorg dat hij achter alles ligt

        const hoverSound = this.sound.add('hoverSound');
        const clickSound = this.sound.add('clickSound');
        let soundCooldown = false;

        // Logo
        const logo = this.add.image(centerX, centerY - 200, 'logo');
        logo.setOrigin(0.5);
        logo.setScale(0.08);

        // Titel
        this.add.text(centerX, centerY - 80, 'Best Education', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Slogan
        this.add.text(centerX, centerY, 'Wij lanceren je de toekomst in!', {
            fontSize: '24px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);

        // Knop container
        const buttonContainer = this.add.container(centerX, centerY + 120);

        const buttonBg = this.add.rectangle(0, 0, 220, 60, 0xed1b30)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const buttonText = this.add.text(0, 0, 'Start Game', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);

        // Hover effect
        buttonBg.on('pointerover', () => {
            if (!soundCooldown) {
                hoverSound.play();
                soundCooldown = true;
                setTimeout(() => soundCooldown = false, 300);
            }

            this.tweens.add({
                targets: buttonContainer,
                scale: 1.05,
                duration: 200,
                ease: 'Power2'
            });

            buttonBg.setFillStyle(0xff4c5c);
        });

        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 200,
                ease: 'Power2'
            });
            buttonBg.setFillStyle(0xed1b30);
        });

        buttonBg.on('pointerdown', () => {
            clickSound.play();
            this.scene.start('Game');
        });
    }
}
