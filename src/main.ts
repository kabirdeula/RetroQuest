import { resources } from "./core/Resources";
import { Sprite } from "./entities/Sprites";
import "./styles/style.css";
import { Vector2 } from "./core/Vector2";
import { GameLoop } from "./systems/GameLoop";
import { Input } from "./systems/Input";
import { gridCells } from "./helpers/grid";
import { GameObject } from "./systems/GameObject";
import { Hero } from "./entities/Hero/Hero";

const canvas = document.querySelector("#game-canvas") as HTMLCanvasElement;

const ctx = canvas?.getContext("2d");

const mainScene = new GameObject({ position: new Vector2(0, 0) });

const skySprite = new Sprite({
  resource: resources.images.sky,
  frameSize: new Vector2(320, 180),
});
mainScene.addChild(skySprite);

const groundSprite = new Sprite({
  resource: resources.images.ground,
  frameSize: new Vector2(320, 180),
});
mainScene.addChild(groundSprite);

const hero = new Hero(gridCells(6), gridCells(5));
mainScene.addChild(hero);

mainScene.input = new Input();

const update = (delta: number) => {
  mainScene.stepEntry(delta, mainScene);
};

const draw = () => {
  mainScene.draw(ctx, 0, 0);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
