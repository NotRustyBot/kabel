import { Graphics, Text } from "pixi.js";
import { game } from "./game";

export class UI {
    storm = new Graphics();
    count = new Text({style: {fill: 0xffffff, fontFamily: "monospace", fontSize: 60, align: "center"}});
    constructor() {
        game.uiContainer.addChild(this.storm);
        game.uiContainer.addChild(this.count);
        this.count.anchor.set(0.5, 0);
        this.count.alpha = 0.1;
    }

    update(dt: number) {
        const stormHeight = 30;
        this.storm.clear();
        this.storm.rect(0, game.app.screen.height - stormHeight, game.app.screen.width, stormHeight);
        this.storm.fill({ color: 0xffffff, alpha: 0.1 });
        if (game.stormManager.stormCooldown > 0) {
            const ratio = game.stormManager.stormCooldown / game.stormManager.stormCooling;
            this.storm.rect(0, game.app.screen.height - stormHeight, game.app.screen.width * ratio, stormHeight);
            this.storm.fill({ color: 0x5555ff, alpha: 1 });
        } else {
            const ratio = game.stormManager.stormTimer / game.stormManager.stormLength;
            this.storm.rect(0, game.app.screen.height - stormHeight, game.app.screen.width * ratio, stormHeight);
            this.storm.fill({ color: 0xff5555, alpha: 1 });
        }

        this.count.text = `${game.player.power}`;
        this.count.position.set(game.app.screen.width / 2, 10);
        this.count.scale.set(1 + 0.5 * this.count.alpha)
        if(this.count.alpha > 0.1) this.count.alpha -= 0.01 * dt;
    }

    powerUp() {
        this.count.alpha = 1;
    }
}
