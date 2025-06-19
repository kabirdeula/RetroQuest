import { resources } from "../../core/Resources";
import { Vector2 } from "../../core/Vector2";
import { isSpaceFree } from "../../helpers/grid";
import { moveTowards } from "../../helpers/move_towards";
import { walls } from "../../levels/level1";
import { Animations } from "../../systems/Animations";
import { FrameIndexPattern } from "../../systems/FrameIndexPattern";
import { GameObject } from "../../systems/GameObject";
import { DOWN, LEFT, RIGHT, UP } from "../../systems/Input";
import { Sprite } from "../Sprites";
import {
  STAND_DOWN,
  STAND_LEFT,
  STAND_RIGHT,
  STAND_UP,
  WALK_DOWN,
  WALK_LEFT,
  WALK_RIGHT,
  WALK_UP,
} from "./heroAnimation";

export class Hero extends GameObject {
  body: Sprite;
  facingDirection: string;
  destinationPosition: Vector2;

  constructor(x: number, y: number) {
    super({ position: new Vector2(x, y) });

    const shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8, -19),
    });
    this.addChild(shadow);

    this.body = new Sprite({
      resource: resources.images.hero,
      frameSize: new Vector2(32, 32),
      hFrames: 3,
      vFrames: 8,
      position: new Vector2(-8, -21),
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

    this.addChild(this.body);

    this.facingDirection = DOWN;
    this.destinationPosition = this.position.clone();

    console.log("Hero created at position:", this.position);
    console.log("Hero Destination Position:", this.destinationPosition);
  }

  step(delta: number, root?: { input?: { direction?: string } }) {
    const distance = moveTowards(this, this.destinationPosition, 1);

    const hasArrived = distance <= 1;

    if (hasArrived && root?.input) {
      this.tryMove(root.input);
    }

    this.body.step(delta);
  }

  private tryMove(input: { direction?: string }) {
    if (!input.direction) {
      this.playStandAnimation();
      return;
    }

    const gridSize = 16;
    let nextX = this.destinationPosition.x;
    let nextY = this.destinationPosition.y;

    if (input.direction === DOWN) {
      nextY += gridSize;
      this.body.animations?.play("walkDown");
    } else if (input.direction === UP) {
      nextY -= gridSize;
      this.body.animations?.play("walkUp");
    } else if (input.direction === LEFT) {
      nextX -= gridSize;
      this.body.animations?.play("walkLeft");
    } else if (input.direction === RIGHT) {
      nextX += gridSize;
      this.body.animations?.play("walkRight");
    }

    this.facingDirection = input.direction ?? this.facingDirection;

    if (isSpaceFree(walls, nextX, nextY)) {
      console.log("Moving to:", nextX, nextY);
      this.destinationPosition.x = nextX;
      this.destinationPosition.y = nextY;
    }
  }

  private playStandAnimation() {
    switch (this.facingDirection) {
      case LEFT:
        this.body.animations?.play("standLeft");
        break;
      case RIGHT:
        this.body.animations?.play("standRight");
        break;
      case UP:
        this.body.animations?.play("standUp");
        break;
      case DOWN:
        this.body.animations?.play("standDown");
        break;
    }
  }
}
