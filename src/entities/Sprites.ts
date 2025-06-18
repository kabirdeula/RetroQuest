import type { ImageResource } from "../core/ImageResource";
import { Vector2 } from "../core/Vector2";
import { Animations } from "../systems/Animations";

interface SpriteParams {
  resource: ImageResource;
  frameSize?: Vector2;
  hFrames?: number;
  vFrames?: number;
  frame?: number;
  scale?: Vector2;
  position?: Vector2;
  animations?: Animations;
}

export class Sprite {
  resource: ImageResource;
  frameSize: Vector2;
  hFrames: number;
  vFrames: number;
  frame: number;
  scale: Vector2;
  position: Vector2;
  frameMap: Map<any, any>;
  animations: Animations;

  constructor({
    resource,
    frameSize,
    hFrames,
    vFrames,
    frame,
    scale = new Vector2(1, 1),
    position = new Vector2(0, 0),
    animations,
  }: SpriteParams) {
    this.resource = resource;
    this.frameSize = frameSize ?? new Vector2(16, 16);
    this.hFrames = hFrames ?? 1;
    this.vFrames = vFrames ?? 1;
    this.frame = frame ?? 0;
    this.frameMap = new Map();
    this.scale = scale ?? 1;
    this.position = position ?? new Vector2(0, 0);
    this.animations = animations ?? new Animations();
    this.buildFrameMap();
  }

  buildFrameMap() {
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

  step(delta: number) {
    if (!this.animations) {
      return;
    }

    this.animations.step(delta);
    this.frame = this.animations.frame;
  }

  drawImage(ctx: CanvasRenderingContext2D | null, x: number, y: number) {
    if (!this.resource.isLoaded) {
      return;
    }

    let frameCoordinateX = 0;
    let frameCoordinateY = 0;
    const frame = this.frameMap.get(this.frame);

    if (frame) {
      frameCoordinateX = frame.x;
      frameCoordinateY = frame.y;
    }

    const frameSizeX = this.frameSize.x;
    const frameSizeY = this.frameSize.y;

    ctx?.drawImage(
      this.resource.image,
      frameCoordinateX,
      frameCoordinateY,
      frameSizeX,
      frameSizeY,
      x,
      y,
      frameSizeX * this.scale.x,
      frameSizeY * this.scale.y
    );
  }
}
