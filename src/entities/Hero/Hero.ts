import { resources } from "../../core/Resources/Resources";
import { Vector2 } from "../../core/Vector2";
import { isSpaceFree } from "../../utils/grid";
import { moveTowards } from "../../utils/moveTowards";
import { walls } from "../../levels/Level1";
import { AnimationSystem } from "../../systems/animation/AnimationSystem";
import { AnimationFramePattern } from "../../systems/animation/AnimationFramePattern";
import { GameObject } from "../../systems/GameObject";
import { DOWN, LEFT, RIGHT, UP } from "../../systems/InputSystem";
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
} from "./HeroAnimation";
import { events } from "../../core/Event";

/**
 * Hero represents the player character with the movement and animation
 */
export class Hero extends GameObject {
  private body: Sprite;
  private facingDirection: string = DOWN;
  private destinationPosition: Vector2;
  private lastX: number = 0;
  private lastY: number = 0;

  constructor(x: number, y: number) {
    super({ position: new Vector2(x, y) });

    // Add shadow sprite
    const shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8, -19),
    });
    this.addChild(shadow);

    // Add main hero body sprite
    this.body = new Sprite({
      resource: resources.images.hero,
      frameSize: new Vector2(32, 32),
      hFrames: 3,
      vFrames: 8,
      position: new Vector2(-8, -21),
      animations: new AnimationSystem({
        walkDown: new AnimationFramePattern(WALK_DOWN),
        walkUp: new AnimationFramePattern(WALK_UP),
        walkLeft: new AnimationFramePattern(WALK_LEFT),
        walkRight: new AnimationFramePattern(WALK_RIGHT),
        standDown: new AnimationFramePattern(STAND_DOWN),
        standUp: new AnimationFramePattern(STAND_UP),
        standLeft: new AnimationFramePattern(STAND_LEFT),
        standRight: new AnimationFramePattern(STAND_RIGHT),
      }),
    });

    this.addChild(this.body);

    this.destinationPosition = this.position.clone();
  }

  /**
   * Called every frame to update position and animation.
   */
  step(delta: number, root?: { input?: { direction?: string } }) {
    const distance = moveTowards(this, this.destinationPosition, 1);
    const hasArrived = distance <= 1;

    if (hasArrived && root?.input) {
      this.tryMove(root.input);
    }

    this.body.step(delta);

    this.tryEmit();
  }

  private tryEmit() {
    if (this.lastX === this.position.x && this.lastY === this.position.y)
      return;
    this.lastX = this.position.x;
    this.lastY = this.position.y;
    events.emit("HERO_POSITION", this.position);
  }

  /**
   * Handles movement input and updates destination/animation.
   */
  private tryMove(input: { direction?: string }) {
    if (!input.direction) {
      this.playStandAnimation();
      return;
    }

    const gridSize = 16;
    let nextX = this.destinationPosition.x;
    let nextY = this.destinationPosition.y;

    switch (input.direction) {
      case DOWN:
        nextY += gridSize;
        this.body.animations?.play("walkDown");
        break;
      case UP:
        nextY -= gridSize;
        this.body.animations?.play("walkUp");
        break;
      case LEFT:
        nextX -= gridSize;
        this.body.animations?.play("walkLeft");
        break;
      case RIGHT:
        nextX += gridSize;
        this.body.animations?.play("walkRight");
        break;
    }

    this.facingDirection = input.direction ?? this.facingDirection;

    if (isSpaceFree(walls, nextX, nextY)) {
      console.log("Moving to:", nextX, nextY);
      this.destinationPosition.set(nextX, nextY);
    }
  }

  /**
   * Plays idle animation based on last facing direction.
   */
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
