import { resources } from "./core/Resources/Resources";
import { Sprite } from "./entities/Sprites";
import { Vector2 } from "./core/Vector2";
import { GameLoop } from "./systems/GameLoop";
import { InputSystem } from "./systems/InputSystem";
import { gridCells } from "./utils/grid";
import { GameObject } from "./systems/GameObject";
import { Hero } from "./entities/hero/Hero";

import "./styles/style.css";

/**
 * Initialize canvas and rendering context.
 */
const canvas = document.querySelector(
  "#game-canvas"
) as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d");

/**
 * Create the main scene graph root.
 */
const mainScene = new GameObject({ position: new Vector2(0, 0) });

/**
 * Add background sky sprite.
 */
const skySprite = new Sprite({
  resource: resources.images.sky,
  frameSize: new Vector2(320, 180),
});
mainScene.addChild(skySprite);

/**
 * Add ground sprite layer.
 */
const groundSprite = new Sprite({
  resource: resources.images.ground,
  frameSize: new Vector2(320, 180),
});
mainScene.addChild(groundSprite);

/**
 * Create and add hero character at grid position (6, 5).
 */
const hero = new Hero(gridCells(6), gridCells(5));
mainScene.addChild(hero);

/**
 * Attach input system to the main scene.
 */
mainScene.input = new InputSystem();

/**
 * Update callback for game loop.
 * @param delta - Time elapsed since last frame (ms).
 */
const update = (delta: number) => {
  mainScene.stepEntry(delta, mainScene);
};

/**
 * Draw callback for game loop.
 */
const draw = () => {
  mainScene.draw(ctx ?? null, 0, 0);
};

/**
 * Create and start the game loop.
 */
const gameLoop = new GameLoop(update, draw);
gameLoop.start();
