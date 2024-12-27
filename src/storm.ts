import { Graphics } from "pixi.js";
import { Vector, Vectorlike } from "./types";
import { game } from "./game";

export class StormParticle {
    group = true;
    graphics = new Graphics();
    points = new Array<Vectorlike>();
    count = 10;
    get size() {
        return this.count * 10;
    }
    position = new Vector(0, 0);
    velocity = new Vector(0, 1);

    constructor(count: number) {
        game.stormContainer.addChild(this.graphics);
        this.count = count;
        this.draw();
    }

    draw() {
        for (let index = 0; index < this.count; index++) {
            const angle = Math.random() * Math.PI * 2;
            const pos = Vector.fromAngle(angle).mult(Math.random() * 10 * this.count);
            this.points.push(pos);
            this.graphics.circle(pos.x, pos.y, 10);
            this.graphics.fill({ color: 0x6688ff, alpha: 1 });
        }
    }

    update(dt) {
        this.velocity.y -= Math.sign(this.velocity.y) * 0.1 * dt;
        if (this.velocity.x < 50) {
            this.velocity.x += 1 * dt;
        }

        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
        this.position.add(this.velocity.result().mult(dt));

        if (this.position.x > 3000 + game.player.position.x) this.remove();
    }

    remove() {
        game.stormParticles.delete(this);
        this.graphics.destroy();
    }

    impact(on: Vectorlike, range: number) {
        if (this.count > 1) {
            this.remove();
            for (let index = 0; index < this.count; index++) {
                const particle = new StormParticle(1);
                const pos = this.points[index];
                particle.position.x = this.position.x + pos.x;
                particle.position.y = this.position.y + pos.y;
                game.stormParticles.add(particle);
                particle.velocity.set(this.velocity.x, this.velocity.y);
            }
        } else {
            this.position = this.position.diff(on).normalize(range).add(on);
            const yVel = on.y - this.position.y;
            this.velocity.set(-10, Math.sign(yVel) * -10);
        }
    }
}

export class StormManager {
    spawnTimer = 0;
    stormTimer = 0;
    stormCooldown = 0;
    stormLength = 300;
    stormCooling = 2000;
    ready = true;

    get isBad() {
        return this.stormTimer > 0 && this.stormTimer < this.stormLength - 100 && this.stormCooldown <= 0;
    }
    spawner(dt: number) {
        if (!this.ready) return;
        if (this.stormCooldown > 0) {
            this.stormCooldown -= dt;
            return;
        }
        if (this.stormTimer > 0) {
            this.stormTimer -= dt;
        } else {
            this.stormCooldown = this.stormCooling;
            this.stormTimer = this.stormLength;
        }
        this.spawnTimer += dt;
        if (this.spawnTimer < 10) return;
        this.spawnTimer = 0;
        const particle = new StormParticle(50);
        particle.position.x = game.player.position.x - 1500;
        particle.position.y = game.player.position.y + -500 + Math.random() * 1000;
        game.stormParticles.add(particle);
    }
}
