import { Graphics, Point } from "pixi.js";
import { game } from "./game";
import { Vector } from "./types";
import { StormParticle } from "./storm";

export class Player {
    graphic = new Graphics();
    cable = new Graphics();
    position = new Vector(0, 0);
    velocity = new Vector(1, 0);
    cableLength = 100;
    cablePoints = new Array<Vector>();
    safety = true;
    get anchor() {
        return this.cablePoints[this.cablePoints.length - 1];
    }

    power = 0;
    mult = 1;
    cableBoost = 200;

    powerUp() {
        this.power += this.mult;
        game.ui.powerUp();
    }

    constructor() {
        game.playerContainer.addChild(this.cable);
        game.playerContainer.addChild(this.graphic);
        this.graphic.rect(-50, -50, 100, 100);
        this.graphic.stroke({ width: 5, color: 0xffffff });
        this.graphic.fill({ color: 0xffffff });
        this.cablePoints.push(new Vector(0, -500));
    }

    damaged = 0;
    update(dt: number) {
        const swingPower = 0.3;
        const cableSpeed = 10;
        if (game.keys["A"]) this.velocity.x -= swingPower * dt;
        if (game.keys["D"]) this.velocity.x += swingPower * dt;
        if (game.keys["S"]) this.cableLength += cableSpeed * dt;
        if (game.keys["W"]) this.cableLength -= cableSpeed * dt;

        if (!this.safety && game.stormManager.isBad) {
            this.damaged += dt;
        } else {
            this.damaged = 0;
        }

        game.blurFilter.strengthX = this.damaged;
        if (this.damaged > 100) {
            game.gameover();
        }

        if (true) {
            this.velocity.y += 0.5 * dt;
        }

        const lastPosition = this.position.result();
        this.position.add(this.velocity.result().mult(dt));
        if (this.anchor.distance(this.position) > this.cableLength) {
            const point = this.position.diff(this.anchor).normalize(this.cableLength).add(this.anchor);
            this.position.set(point.x, point.y);
        }

        this.velocity = this.position.diff(lastPosition).mult(1 / dt);

        if (this.velocity.length() > 50) {
            this.velocity.normalize(50);
        }

        this.cable.clear();
        this.cable.moveTo(this.position.x, this.position.y);
        for (let index = this.cablePoints.length - 1; index >= 0; index--) {
            const point = this.cablePoints[index];
            this.cable.lineTo(point.x, point.y);
        }

        this.cable.stroke({ width: 30, color: 0x333333 });
        this.cable.moveTo(this.position.x, this.position.y);
        for (let index = this.cablePoints.length - 1; index >= 0; index--) {
            const point = this.cablePoints[index];
            this.cable.lineTo(point.x, point.y);
        }

        this.cable.stroke({ width: 5, color: 0x443333 });

        this.graphic.position.set(this.position.x, this.position.y);
        this.safety = false;

        if (this.velocity.x > 0) {
            if (game.isReversed) {
                game.musicReverse.volume(0);
                game.music.volume(1);
                game.music.seek(game.music.duration() - game.musicReverse.seek());
                game.isReversed = false;
            } else {
                game.music.rate(Math.min(1, this.velocity.x / 10));
            }
        } else {
            if (game.isReversed) {
                game.musicReverse.rate(Math.min(1, -this.velocity.x / 10));
            } else {
                game.isReversed = true;
                game.music.volume(0);
                game.musicReverse.volume(1);
                game.musicReverse.seek(game.music.duration() - game.music.seek());
            }
        }
    }
}
