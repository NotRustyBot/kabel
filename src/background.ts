import { Container, Graphics } from "pixi.js";
import { game } from "./game";
import { Vector, Vectorlike } from "./types";

export class Background {
    graphic = new Graphics();
    splats = new Graphics();
    container = new Container();
    constructor() {
        this.container.addChild(this.graphic);
        this.container.addChild(this.splats);
        game.backgroundContainer.addChild(this.container);

        this.addSplat();
    }

    draw() {
        this.graphic.clear();
        this.graphic.rect(0, 0, game.app.screen.width, game.app.screen.height);
        this.graphic.fill({ color: 0x071918 });

        const color = 0x17292a;

        for (let i = -game.camera.smoothPosition.y % 100; i < game.app.screen.height; i += 100) {
            this.graphic.moveTo(0, i);
            this.graphic.lineTo(game.app.screen.width, i);
            this.graphic.stroke({ width: 10, color: color });
        }

        for (let i = -game.camera.smoothPosition.x % 100; i < game.app.screen.width; i += 100) {
            this.graphic.moveTo(i, 0);
            this.graphic.lineTo(i, game.app.screen.height);
            this.graphic.stroke({ width: 10, color: color });
        }

        this.graphic.position.set(game.camera.smoothPosition.x - game.app.screen.width / 2, game.camera.smoothPosition.y - game.app.screen.height / 2);

        if (game.player.position.x > this.lowest) {
            if (Math.floor(game.player.position.x / 100) != Math.floor(this.lowest / 100)) this.addSplat();
            this.lowest = game.player.position.x;
        }
    }

    lowest = 0;

    addSplat() {
        const polygon = new Array<Vectorlike>();

        const points = 10;
        for (let i = 0; i < points; i++) {
            const angle = i / points;
            polygon.push(Vector.fromAngle(angle * Math.PI * 2).mult(100 + Math.random() * 50));
        }

        const pos = game.player.position.result();
        pos.x += 1000 + Math.random() * 1000;

        let first = true;
        for (const poly of polygon) {
            poly.x += pos.x;
            poly.y += pos.y;
            if (first) {
                first = false;
                this.splats.moveTo(poly.x, poly.y);
            } else {
                this.splats.lineTo(poly.x, poly.y);
            }
        }

        this.splats.lineTo(polygon[0].x, polygon[0].y);
        this.splats.fill({ color: 0x17292a, alpha: 0.5 });
    }
}
