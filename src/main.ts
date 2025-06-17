import { resources } from "./Resources";
import { Sprite } from "./Sprites";
import "./style.css";
import { Vector2 } from "./Vector2";

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

const draw = () => {
  const heroOffset = new Vector2(-8, -21);
  const heroPositionX = heroPosition.x + heroOffset.x;
  const heroPositionY = heroPosition.y + heroOffset.y;

  skySprite.drawImage(ctx, 0, 0);
  groundSprite.drawImage(ctx, 0, 0);
  shadowSprite.drawImage(ctx, heroPositionX, heroPositionY);
  heroSprite.drawImage(ctx, heroPositionX, heroPositionY);
};

setInterval(() => {
  heroSprite.frame += 1;
  draw();
}, 300);
