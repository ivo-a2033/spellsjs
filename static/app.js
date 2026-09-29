// game.js

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    backgroundColor: "#222",

    scene: {
        create() {
            this.add.text(20, 20, "Hello Phaser");

            this.pixels = [];
            for (let i = 0; i < 80; i++){ this.pixels[i] = []; for (let j = 0; j < 80; j++){ this.pixels[i][j] = 0; } }

            this.graphics = this.add.graphics();
            this.hue = 0;
        },

        update() {
            this.graphics.clear();

            this.hue = (this.hue + 1) % 360;

            let color;


            for (let i = 0; i < 80; i++) {
                for (let j = 0; j < 80; j++) {

                    color = Phaser.Display.Color.HSLToColor(
                        (this.hue + Math.sin((j+i) * 0.01))/ 360,
                        1,
                        0.5
                    ).color;
                    this.graphics.fillStyle(color);

                    this.graphics.fillRect(
                        i * 5 + 100,
                        j * 5 + 100,
                        4,
                        4
                    );
                }
            }
        }
    }
};

new Phaser.Game(config);