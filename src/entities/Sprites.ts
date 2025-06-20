import type { ImageResource } from "../core/Resources/ImageResource";
import { Vector2 } from "../core/Vector2";
import { AnimationSystem } from "../systems/animation/AnimationSystem";
import { GameObject } from "../systems/GameObject";

interface SpriteParams {
  resource: ImageResource;
  frameSize?: Vector2;
  hFrames?: number;
  vFrames?: number;
  frame?: number;
  scale?: Vector2;
  position?: Vector2;
  animations?: AnimationSystem;
}

/**
 * Represents a sprite with optional animations and frame management.
 */
export class Sprite extends GameObject {
  /** Image resource for the sprite. */
  readonly resource: ImageResource;

  /** Size of each frame in the sprite sheet. */
  readonly frameSize: Vector2;

  /** Number of horizontal frames in the sprite sheet. */
  readonly hFrames: number;

  /** Number of vertical frames in the sprite sheet. */
  readonly vFrames: number;

  /** Current frame index to render. */
  frame: number;

  /** Scaling applied to the sprite when drawn. */
  readonly scale: Vector2;

  /** Offset position relative to parent GameObject. */
  readonly position: Vector2;

  /** Map of frame index to frame coordinates in the sprite sheet. */
  readonly frameMap: Map<number, Vector2>;

  /** Animation controller for this sprite. */
  readonly animations: AnimationSystem;

  constructor({
    resource,
    frameSize,
    hFrames = 1,
    vFrames = 1,
    frame = 0,
    scale = new Vector2(1, 1),
    position = new Vector2(0, 0),
    animations = new AnimationSystem(),
  }: SpriteParams) {
    super({ position });
    this.resource = resource;
    this.frameSize = frameSize ?? new Vector2(16, 16);
    this.hFrames = hFrames;
    this.vFrames = vFrames;
    this.frame = frame;
    this.scale = scale;
    this.position = position;
    this.animations = animations;
    this.frameMap = new Map();

    this.buildFrameMap();
  }

  /**
   * Builds the frame map to associate frame indices with their coordinates in the sprite sheet.
   */
  private buildFrameMap() {
    let frameCount = 0;

    for (let v = 0; v < this.vFrames; v++) {
      for (let h = 0; h < this.hFrames; h++) {
        this.frameMap.set(
          frameCount,
          new Vector2(this.frameSize.x * h, this.frameSize.y * v)
        );
        frameCount++;
      }
    }
  }

  /**
   * Updates the sprite's animation state.
   * @param delta - Time elapsed since last update (ms).
   */
  step(delta: number) {
    if (!this.animations) return;

    this.animations.step(delta);
    this.frame = this.animations.frame;
  }

  /**
   * Draws the sprite onto the canvas.
   * @param ctx - The canvas rendering context.
   * @param x - X position on the canvas to draw at.
   * @param y - Y position on the canvas to draw at.
   */
  drawImage(ctx: CanvasRenderingContext2D | null, x: number, y: number) {
    if (!this.resource.isLoaded) return;

    const framePosition = this.frameMap.get(this.frame) ?? new Vector2(0, 0);

    ctx?.drawImage(
      this.resource.image,
      framePosition.x,
      framePosition.y,
      this.frameSize.x,
      this.frameSize.y,
      x,
      y,
      this.frameSize.x * this.scale.x,
      this.frameSize.y * this.scale.y
    );
  }
}
