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
  PICK_UP_DOWN,
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
import type { ImageResource } from "../../core/Resources/ImageResource";

/**
 * Hero represents the player character with the movement and animation
 */
export class Hero extends GameObject {
  private body: Sprite;
  private facingDirection: string = DOWN;
  private destinationPosition: Vector2;
  private lastX: number = 0;
  private lastY: number = 0;
  private itemPickupTime: number = 0;
  private itemPickupObject: GameObject | null = null;

  /**
   * Create a hero at the given grid position.
   *
   * @param x - Initial X position (in pixels).
   * @param y - Initial Y position (in pixels).
   */
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
        pickUpDown: new AnimationFramePattern(PICK_UP_DOWN),
      }),
    });

    this.addChild(this.body);

    this.destinationPosition = this.position.clone();

    // Listen for item pickup events
    events.on("HERO_PICKS_UP_ITEM", this, (data) => {
      this.onPickUpItem(data);
    });
  }

  /**
   * Called every frame to update position and animation.
   *
   * @param delta - Time elapsed since last frame (ms)
   * @param root - The game root object containing input (optional)
   */
  step(delta: number, root?: { input?: { direction?: string } }) {
    if (this.itemPickupTime > 0) {
      this.updateItemPickup(delta);
      return;
    }

    const distance = moveTowards(this, this.destinationPosition, 1);
    const hasArrived = distance <= 1;

    if (hasArrived && root?.input) {
      this.tryMove(root.input);
    }

    this.body.step(delta);
    this.emitPositionIfChanged();
  }

  /**
   * Emits HERO_POSITION event if the hero's position has changed.
   */
  private emitPositionIfChanged() {
    if (this.lastX === this.position.x && this.lastY === this.position.y)
      return;
    this.lastX = this.position.x;
    this.lastY = this.position.y;
    events.emit("HERO_POSITION", this.position);
  }

  /**
   * Handles movement input and updates destination/animation.
   * @param input - Input object with direction.
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

  /**
   * Handles item pickup logic.
   * @param data - The item data containing image and position
   */
  private onPickUpItem(data: { image: ImageResource; position: Vector2 }) {
    this.destinationPosition = data.position.clone();
    this.itemPickupTime = 500;

    this.itemPickupObject = new GameObject({});
    this.itemPickupObject.addChild(
      new Sprite({ resource: data.image, position: new Vector2(0, -18) })
    );
    this.addChild(this.itemPickupObject);
  }

  /**
   * Updates item pickup animation and timing.
   * @param delta - Time elapsed since last frame.
   */
  private updateItemPickup(delta: number) {
    this.itemPickupTime -= delta;
    this.body.animations.play("pickUpDown");

    if (this.itemPickupTime <= 0) {
      this.itemPickupObject?.destroy();
    }
  }
}
