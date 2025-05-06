export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' }); // Unieke key voor deze scene
    }

    preload() {
        // Laad achtergrond, logo en geluiden
        this.load.image('background', 'assets/images/background.png');
        this.load.image('logo', 'assets/images/logo-zonder-text.png');
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Achtergrond instellen en op juiste laag zetten
        const background = this.add.image(0, 0, 'background')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Geluidsinstellingen
        const hoverSound = this.sound.add('hoverSound');
        const clickSound = this.sound.add('clickSound');
        let soundCooldown = false;

        // Logo bovenaan
        const logo = this.add.image(centerX, centerY - 200, 'logo');
        logo.setOrigin(0.5).setScale(0.08);

        // Titeltekst
        this.add.text(centerX, centerY - 80, 'Best Education', {
            fontSize: '64px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Slogan onder titel
        this.add.text(centerX, centerY, 'Wij lanceren je de toekomst in!', {
            fontSize: '24px',
            fill: '#aaaaaa'
        }).setOrigin(0.5);

        // Container voor de knop
        const buttonContainer = this.add.container(centerX, centerY + 120);

        // Knopachtergrond
        const buttonBg = this.add.rectangle(0, 0, 220, 60, 0xed1b30)
            .setStrokeStyle(2, 0xffffff)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Knoptekst
        const buttonText = this.add.text(0, 0, 'Start Game', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);

        // Hover-effect + geluid
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

        // Hover verlaat
        buttonBg.on('pointerout', () => {
            this.tweens.add({
                targets: buttonContainer,
                scale: 1,
                duration: 200,
                ease: 'Power2'
            });

            buttonBg.setFillStyle(0xed1b30);
        });

        // Klik op knop -> start game
        buttonBg.on('pointerdown', () => {
            clickSound.play();
            this.scene.start('Game');
        });
    }
}
