import { Application } from "pixi.js";
import "./style.css";
import { Game } from "./game";


(async () => {
    const app = new Application();

    await app.init({ background: "#000000", resizeTo: window });

    document.body.appendChild(app.canvas);
    let game = new Game(app);
    game.init();

    // @ts-ignore
    window.game = game;
})();