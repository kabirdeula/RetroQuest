import { resources } from "./core/Resources";
import { Sprite } from "./entities/Sprites";
import "./styles/style.css";
import { Vector2 } from "./core/Vector2";
import { GameLoop } from "./systems/GameLoop";
import { DOWN, Input, LEFT, RIGHT, UP } from "./systems/Input";
import { gridCells, isSpaceFree } from "./helpers/grid";
import { moveTowards } from "./helpers/move_towards";
import { walls } from "./levels/level1";
import { Animations } from "./systems/Animations";
import { FrameIndexPattern } from "./systems/FrameIndexPattern";
import {
  STAND_DOWN,
  STAND_LEFT,
  STAND_RIGHT,
  STAND_UP,
  WALK_DOWN,
  WALK_LEFT,
  WALK_RIGHT,
  WALK_UP,
} from "./entities/Hero/heroAnimation";

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
  position: new Vector2(gridCells(6), gridCells(5)),
  animations: new Animations({
    walkDown: new FrameIndexPattern(WALK_DOWN),
    walkUp: new FrameIndexPattern(WALK_UP),
    walkLeft: new FrameIndexPattern(WALK_LEFT),
    walkRight: new FrameIndexPattern(WALK_RIGHT),
    standDown: new FrameIndexPattern(STAND_DOWN),
    standUp: new FrameIndexPattern(STAND_UP),
    standLeft: new FrameIndexPattern(STAND_LEFT),
    standRight: new FrameIndexPattern(STAND_RIGHT),
  }),
});

const heroDestinationPosition = heroSprite.position.clone();

let heroFacing = DOWN;

const shadowSprite = new Sprite({
  resource: resources.images.shadow,
  frameSize: new Vector2(32, 32),
});

const input = new Input();

const update = (delta: number) => {
  const distance = moveTowards(heroSprite, heroDestinationPosition, 1);
  const hasArrived = distance <= 1;
  if (hasArrived) {
    tryMove();
  }

  heroSprite.step(delta);
  // return;
};

const tryMove = () => {
  if (!input.direction) {
    if (heroFacing === LEFT) {
      heroSprite.animations.play("standLeft");
    }
    if (heroFacing === RIGHT) {
      heroSprite.animations.play("standRight");
    }
    if (heroFacing === UP) {
      heroSprite.animations.play("standUp");
    }
    if (heroFacing === DOWN) {
      heroSprite.animations.play("standDown");
    }
    return;
  }

  let nextX = heroDestinationPosition.x;
  let nextY = heroDestinationPosition.y;
  const gridSize = 16;

  if (input.direction === DOWN) {
    nextY += gridSize;
    heroSprite.animations.play("walkDown");
  }
  if (input.direction === UP) {
    nextY -= gridSize;
    heroSprite.animations.play("walkUp");
  }
  if (input.direction === RIGHT) {
    nextX += gridSize;
    heroSprite.animations.play("walkRight");
  }
  if (input.direction === LEFT) {
    nextX -= gridSize;
    heroSprite.animations.play("walkLeft");
  }

  heroFacing = input.direction ?? heroFacing;

  // TODO - check if that space is free
  if (isSpaceFree(walls, nextX, nextY)) {
    heroDestinationPosition.x = nextX;
    heroDestinationPosition.y = nextY;
  }
};

const draw = () => {
  const heroOffset = new Vector2(-8, -21);
  const heroPositionX = heroSprite.position.x + heroOffset.x;
  const heroPositionY = heroSprite.position.y + heroOffset.y;

  skySprite.drawImage(ctx, 0, 0);
  groundSprite.drawImage(ctx, 0, 0);
  shadowSprite.drawImage(ctx, heroPositionX, heroPositionY);
  heroSprite.drawImage(ctx, heroPositionX, heroPositionY);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
