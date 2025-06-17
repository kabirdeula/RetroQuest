import { resources } from "./core/Resources";
import { Sprite } from "./entities/Sprites";
import "./styles/style.css";
import { Vector2 } from "./core/Vector2";
import { GameLoop } from "./systems/GameLoop";
import { DOWN, Input, LEFT, RIGHT, UP } from "./systems/Input";

const canvas = document.querySelector("#game-canvas") as HTMLCanvasElement;

const ctx = canvas?.getContext("2d");

const skySprite = new Sprite({
  resource: resources.images.sky,
  frameSize: new Vector2(320, 180),
});
const groundSprite = new Sprite({
  resource: resources.images.ground,
  frameSize: new Vector2(320, 180),
});

const heroSprite = new Sprite({
  resource: resources.images.hero,
  frameSize: new Vector2(32, 32),
  hFrames: 3,
  vFrames: 8,
  frame: 1,
});

const shadowSprite = new Sprite({
  resource: resources.images.shadow,
  frameSize: new Vector2(32, 32),
});

const heroPosition = new Vector2(16 * 14, 16 * 5);
const input = new Input();

const update = () => {
  if (input.direction === DOWN) {
    heroPosition.y += 1;
    heroSprite.frame = 0; 
  }
  if (input.direction === UP) {
    heroPosition.y -= 1;
    heroSprite.frame = 6;
  }
  if (input.direction === RIGHT) {
    heroPosition.x += 1;
    heroSprite.frame = 3;
  }
  if (input.direction === LEFT) {
    heroPosition.x -= 1;
    heroSprite.frame = 9; 
  }
};

const draw = () => {
  const heroOffset = new Vector2(-8, -21);
  const heroPositionX = heroPosition.x + heroOffset.x;
  const heroPositionY = heroPosition.y + heroOffset.y;

  skySprite.drawImage(ctx, 0, 0);
  groundSprite.drawImage(ctx, 0, 0);
  shadowSprite.drawImage(ctx, heroPositionX, heroPositionY);
  heroSprite.drawImage(ctx, heroPositionX, heroPositionY);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
