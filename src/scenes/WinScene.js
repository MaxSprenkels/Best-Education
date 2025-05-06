export class WinScene extends Phaser.Scene {
    constructor() {
        super({ key: 'WinScene' }); // Geef de scene een unieke key
    }

    preload() {
        // Laad audio en logo voor deze scene
        this.load.audio('hoverSound', 'assets/sounds/hover.wav');
        this.load.audio('clickSound', 'assets/sounds/click.wav');
        this.load.image('logo', 'assets/images/logo.png');
    }

    init(data) {
        // Ontvang score en achtergrond mee vanuit de vorige scene
        this.score = data.score;
        this.background = data.background;
    }

    create() {
        // Stop achtergrondmuziek als die nog speelt
        if (this.sound.get('backgroundMusic')?.isPlaying) {
            this.sound.get('backgroundMusic').stop();
        }

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Toon de achtergrondafbeelding
        this.background
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(-1);

        // Voeg geluidseffecten toe
        const hoverSound = this.sound.add('hoverSound');
        const clickSound = this.sound.add('clickSound');
        let soundCooldown = false;

        // Logo
        const logo = this.add.image(centerX, centerY - 200, 'logo');
        logo.setOrigin(0.5).setScale(0.08);

        // Tekst "Je hebt gewonnen!" en de score
        this.add.text(centerX, centerY - 120, '🎉 Je hebt gewonnen! 🎉', {
            fontSize: '48px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(centerX, centerY - 50, `${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Herbruikbare functie om knoppen aan te maken
        const createButton = (text, onClick, offsetY) => {
            const container = this.add.container(centerX, centerY + offsetY).setDepth(201);

            const bg = this.add.rectangle(0, 0, 270, 60, 0xff4c5c)
                .setStrokeStyle(2, 0xffffff)
                .setOrigin(0.5);

            const label = this.add.text(0, 0, text, {
                fontSize: '24px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            [bg, label].forEach(el => {
                el.setInteractive({ useHandCursor: true });

                // Hover effect + geluidsfeedback
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

                // Verlaat hover
                el.on('pointerout', () => {
                    this.tweens.add({
                        targets: container,
                        scale: 1,
                        duration: 200,
                        ease: 'Power2'
                    });

                    bg.setFillStyle(0xff4c5c);
                });

                // Klik op knop
                el.on('pointerdown', () => {
                    clickSound.play();
                    setTimeout(onClick, 150);
                });
            });

            container.add([bg, label]);
        };

        // Speel opnieuw knop
        createButton('🔁 Opnieuw spelen', () => {
            this.scene.start('Game');
        }, 40);

        // Terug naar het menu knop
        createButton('🏠 Terug naar menu', () => {
            this.scene.start('StartScene');
        }, 120);
    }
}
