import { Application, BlurFilter, Container, Ticker } from "pixi.js";
import { Player } from "./player";
import { Camera } from "./camera";
import { Background } from "./background";
import { PixelateFilter } from "pixi-filters";
import { NodeType, PowerNode } from "./node";
import { Spotlight } from "./spotlight";
import { StormManager, StormParticle } from "./storm";
import { UI } from "./ui";
import { Howl } from "howler";

export let game: Game;

export class Game {
    app: Application;
    updateRef: { (time: any): void; (this: any, ticker: Ticker): any; };
    constructor(app: Application) {
        game = this;
        this.app = app;
        this.updateRef = (time) => {
            this.update(time.deltaTime);
        };
        app.ticker.add(this.updateRef);

        document.addEventListener("keydown", (e) => {
            this.keys[e.key.toLocaleUpperCase()] = true;
        });

        document.addEventListener("keyup", (e) => {
            delete this.keys[e.key.toLocaleUpperCase()];
        });
    }

    keys: { [key: string]: boolean } = {};

    player!: Player;
    camera!: Camera;
    background!: Background;
    spotlight!: Spotlight;
    ui!: UI;
    stormManager = new StormManager();
    realContainer = new Container();
    playerContainer = new Container();
    nodeContainer = new Container();
    backgroundContainer = new Container();
    stormContainer = new Container();
    uiContainer = new Container();

    nodes = new Set<PowerNode>();
    stormParticles = new Set<StormParticle>();

    blurFilter = new BlurFilter({ strength: 1 });

    music = new Howl({ src: "./kabel.ogg" });
    musicReverse = new Howl({ src: "./kabel_reverse.ogg" });

    isReversed = false;

    init() {
        this.app.stage.addChild(this.realContainer);
        this.app.stage.addChild(this.uiContainer);
        this.realContainer.addChild(this.backgroundContainer);
        this.realContainer.addChild(this.nodeContainer);
        this.realContainer.addChild(this.playerContainer);
        this.realContainer.addChild(this.stormContainer);
        this.player = new Player();
        this.background = new Background();
        this.spotlight = new Spotlight();
        this.camera = new Camera();
        this.ui = new UI();
        this.resize();

        this.realContainer.filters = [this.blurFilter, new PixelateFilter(10)];

        this.music.play();
        this.music.loop(true);

        this.musicReverse.play();
        this.musicReverse.loop(true);
        this.musicReverse.volume(0);

        for (let index = 0; index < 15; index++) {
            this.spawnNode();
        }
    }

    resize() {}

    update(dt: number) {
        if (this.isgameover) dt = 0;
        this.player.update(dt);
        this.camera.update(dt);
        for (const node of this.nodes) {
            node.update(dt);
        }

        this.stormManager.spawner(dt);

        for (const particle of this.stormParticles) {
            particle.update(dt);
        }

        this.background.draw();
        this.spotlight.draw();
        this.ui.update(dt);
    }

    isgameover = false;
    gameover() {
        game.isgameover = true;
        this.music.stop();
        this.musicReverse.stop();
        this.app.stage.removeChildren();
        this.app.ticker.remove(this.updateRef);
        new Game(this.app).init();
    }

    nodeIndex = 0;
    dist = 500;
    height = 300;
    spawnNode() {
        let type = NodeType.empty;
        if (this.nodeIndex % 5 === 0) type = NodeType.safety;
        const node = new PowerNode(this.nodeIndex * this.dist, Math.random() * this.height, type);
        this.nodes.add(node);
        this.nodeIndex++;
        this.dist += 5;
        this.height + 5;
    }
}
