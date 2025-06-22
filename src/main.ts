import { resources } from "./core/Resources/Resources";
import { Sprite } from "./entities/Sprites";
import { Vector2 } from "./core/Vector2";
import { GameLoop } from "./systems/GameLoop";
import { InputSystem } from "./systems/InputSystem";
import { gridCells } from "./utils/grid";
import { GameObject } from "./systems/GameObject";
import { Hero } from "./entities/hero/Hero";

import "./styles/style.css";
import { Camera } from "./systems/Camera";
import { Rod } from "./entities/rod/Rod";

/**
 * Initialize canvas and rendering context.
 */
const canvas = document.querySelector(
  "#game-canvas"
) as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d");

if (!canvas || !ctx) {
  throw new Error("Canvas element or rendering context not found.");
}

/**
 * Constants for canvas dimensions.
 */
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 180;

/**
 * Create the main scene graph root.
 */
const mainScene = new GameObject({ position: new Vector2(0, 0) });

/**
 * Add background sky sprite.
 */
const skySprite = new Sprite({
  resource: resources.images.sky,
  frameSize: new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
});
// mainScene.addChild(skySprite);

/**
 * Add ground sprite layer.
 */
const groundSprite = new Sprite({
  resource: resources.images.ground,
  frameSize: new Vector2(CANVAS_WIDTH, CANVAS_HEIGHT),
});
mainScene.addChild(groundSprite);

/**
 * Create and add hero character at grid position (6, 5).
 */
const hero = new Hero(gridCells(6), gridCells(5));
mainScene.addChild(hero);

/**
 * Create and add camera to the scene (follows hero's position).
 */
const camera = new Camera();
mainScene.addChild(camera);

const rod = new Rod(gridCells(7), gridCells(6));
mainScene.addChild(rod);

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
  // Clear entire canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw static sky background
  skySprite.drawImage(ctx ?? null, 0, 0);

  // Apply camera transform for scene
  ctx.save();
  ctx.translate(camera.position.x, camera.position.y);

  // Draw scene graph
  mainScene.draw(ctx ?? null, 0, 0);

  ctx.restore();
};

/**
 * Create and start the game loop.
 */
const gameLoop = new GameLoop(update, draw);
gameLoop.start();
