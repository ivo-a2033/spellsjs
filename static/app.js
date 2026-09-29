// game.js

const GRID_SIZE = 32;
const CELL_SIZE = 20;

const config = {
    type: Phaser.AUTO,
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE + 600,
    backgroundColor: "#222",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: {

        preload() {
            // Load here
            this.load.image("sorcerer", "/static/sorcerer.png");
        },
        create() {
            this.pixels = [];
            for (let i = 0; i < GRID_SIZE; i++){ this.pixels[i] = []; for (let j = 0; j < GRID_SIZE; j++){ this.pixels[i][j] = [0,0]; } }

            this.graphics = this.add.graphics();
            this.hue = 0;
            this.mouse_down = false;

            this.input.on('pointerdown', (pointer) => {
                this.mouse_down = true;
                this.last_pointer = {
                    x: Math.floor(pointer.x / CELL_SIZE),
                    y: Math.floor(pointer.y / CELL_SIZE)
                };
            });

            this.input.on('pointerup', (pointer) => {
                this.mouse_down = false;
                this.last_pointer = null;
            });

            this.last_pointer = null;

            this.textures.get("sorcerer").setFilter(Phaser.Textures.FilterMode.NEAREST);

            this.add.image(0, GRID_SIZE * CELL_SIZE, "sorcerer")
                .setOrigin(0, 0)
                .setDisplaySize(64, 64);   // exact width & height you want        
        },

        update() {
            this.graphics.clear();

            this.hue = (this.hue + 2) % 360;

            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {

                    const hueColor = Phaser.Display.Color.HSLToColor((this.hue + this.pixels[i][j][1])/ 360, 1, 0.5);

                    const intensity = this.pixels[i][j][0];
                    const color = Phaser.Display.Color.GetColor(
                        Math.round(hueColor.red * intensity),
                        Math.round(hueColor.green * intensity),
                        Math.round(hueColor.blue * intensity)
                    );
                    this.graphics.fillStyle(color);

                    this.graphics.fillRect(
                        i * CELL_SIZE,
                        j * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                }
            }

            if (this.mouse_down){
                const pointer = this.input.activePointer;
                const gridX = Math.floor(pointer.x / CELL_SIZE);
                const gridY = Math.floor(pointer.y / CELL_SIZE);

                const start = this.last_pointer || { x: gridX, y: gridY };
                const linePixels = [];
                let x = start.x;
                let y = start.y;
                const deltaX = Math.abs(gridX - x);
                const stepX = x < gridX ? 1 : -1;
                const deltaY = -Math.abs(gridY - y);
                const stepY = y < gridY ? 1 : -1;
                let error = deltaX + deltaY;

                while (true) {
                    linePixels.push({ x, y });
                    if (x === gridX && y === gridY) break;

                    const doubledError = 2 * error;
                    if (doubledError >= deltaY) {
                        error += deltaY;
                        x += stepX;
                    }
                    if (doubledError <= deltaX) {
                        error += deltaX;
                        y += stepY;
                    }
                }

                for (const pixel of linePixels) {
                    if (pixel.x >= 0 && pixel.x < GRID_SIZE && pixel.y >= 0 && pixel.y < GRID_SIZE) {
                        this.pixels[pixel.x][pixel.y] = [1, this.hue];
                    }
                }

                for (const pixel of linePixels) {
                    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                        const adjacentX = pixel.x + dx;
                        const adjacentY = pixel.y + dy;
                        if (adjacentX >= 0 && adjacentX < GRID_SIZE && adjacentY >= 0 && adjacentY < GRID_SIZE && this.pixels[adjacentX][adjacentY][0] < 1) {
                            this.pixels[adjacentX][adjacentY] = [0.5, this.hue];
                        }
                    }
                }

                this.last_pointer = { x: gridX, y: gridY };
            }
        }
    }
};

new Phaser.Game(config);