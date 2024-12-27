import { Container, Graphics } from "pixi.js";
import { game } from "./game";
import { Vector, Vectorlike } from "./types";

export class Spotlight {
    graphic = new Graphics();
    position = new Vector(0, -1000);
    constructor() {
        game.backgroundContainer.addChild(this.graphic);
    }

    draw() {
        this.graphic.clear();
        this.graphic.moveTo(this.position.x, this.position.y);
        const distance = game.player.position.distance(this.position);
        const diff = game.player.position.diff(this.position).normalize(distance + 1000);
        this.graphic.lineTo(this.position.x + diff.x, this.position.y + diff.y);
        this.graphic.stroke({ width: 1000, color: 0xffffff, alpha: 0.02 });
    }


}
