import { Point } from "pixi.js";
import { game } from "./game";
import { Vector } from "./types";

export class Camera {
    position = new Vector(0, 0);
    smoothPosition = new Vector(0, 0);
    focusPosition = new Vector(0, 0);
    useFocus = false;

    update(dt: number) {
        this.position.set(game.player.position.x, game.player.position.y);

        if (this.useFocus) {
            this.position.x += (this.focusPosition.x - this.position.x) * 0.1 * dt;
            this.position.y += (this.focusPosition.y - this.position.y) * 0.1 * dt;
        }

        this.smoothPosition.x += (this.position.x - this.smoothPosition.x) * 0.3 * dt;
        this.smoothPosition.y += (this.position.y - this.smoothPosition.y) * 0.3 * dt;

        this.smoothPosition.x = this.position.x;
        this.smoothPosition.y = this.position.y;

        game.realContainer.x = Math.floor((-this.smoothPosition.x + game.app.screen.width / 2) / 10) * 10;
        game.realContainer.y = Math.floor((-this.smoothPosition.y + game.app.screen.height / 2) / 10) * 10;
    }
}
