import { Graphics, PlaneGeometry } from "pixi.js";
import { Vector } from "./types";
import { game } from "./game";
import { StormParticle } from "./storm";

export enum NodeType {
    empty,
    safety,
}

export class PowerNode {
    graphic = new Graphics();
    position = new Vector(0, 0);
    anchored = false;
    type: NodeType = NodeType.empty;
    constructor(x: number, y: number, type: NodeType) {
        this.type = type;
        this.position.set(x, y);
        game.nodeContainer.addChild(this.graphic);
        this.graphic.x = x;
        this.graphic.y = y;
        this.draw();
    }
    readonly safetyRange = 300;

    draw() {
        this.graphic.circle(0, 0, 100);
        if (this.type === NodeType.safety) {
            if (this.anchored) {
                this.graphic.fill({ color: 0x6666ff });
                this.graphic.circle(0, 0, this.safetyRange);
                this.graphic.stroke({ color: 0x336699, width: 10, alpha: 0.1 });
            } else {
                this.graphic.fill({ color: 0x333355 });
            }
        } else {
            if (this.anchored) {
                this.graphic.fill({ color: 0xffffff });
            } else {
                this.graphic.fill({ color: 0x333333 });
            }
        }
    }

    remove() {
        this.graphic.destroy();
        game.nodes.delete(this);
    }

    update(dt: number) {
        if (game.player.position.x - 5000 > this.position.x) {
            this.remove();
            game.spawnNode();
        }
        if (!this.anchored) {
            if (game.player.position.distanceSquared(this.position) < 100 ** 2) {
                this.anchored = true;
                game.player.cablePoints.push(new Vector(this.position.x, this.position.y));
                if (this.type != NodeType.safety) {
                    game.player.cableLength = game.player.cableBoost;
                } else {
                    game.player.cableLength = 100;
                    game.stormManager.stormCooldown = 0;
                }
                this.draw();
                game.player.powerUp();
            }
        } else {
        }

        if (this.type === NodeType.safety) {
            if (this.anchored) {
                for (const particle of game.stormParticles) {
                    if (particle.position.distanceSquared(this.position) < (this.safetyRange + particle.size) ** 2) {
                        particle.impact(this.position, this.safetyRange);
                    }
                }

                if (game.player.position.distanceSquared(this.position) < (100 + this.safetyRange) ** 2) {
                    game.player.safety = true;
                }
            }
        }
    }
}
