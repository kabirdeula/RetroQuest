import { Vector2 } from "./Vector2";

interface SpriteParams {
  resource: HTMLImageElement;
  frameSize?: Vector2;
  hFrames: number;
  vFrames: number;
  frame?: number;
  scale?: Vector2;
  position?: Vector2;
}

export class Sprites {
  resource: HTMLImageElement;
  frameSize: Vector2;
  hFrames: number;
  vFrames: number;
  frame: number;
  scale: Vector2;
  position: Vector2;
  frameMap: Map<any, any>;

  constructor({
    resource,
    frameSize,
    hFrames,
    vFrames,
    frame = 0,
    scale = new Vector2(1, 1),
    position = new Vector2(0, 0),
  }: SpriteParams) {
    this.resource = resource;
    this.frameSize = frameSize ?? new Vector2(16, 16);
    this.hFrames = hFrames ?? 1;
    this.vFrames = vFrames ?? 1;
    this.frame = frame ?? 0;
    this.frameMap = new Map();
    this.scale = scale ?? 1;
    this.position = position ?? new Vector2(0, 0);
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

  // drawImage(ctx, x, y) {}
}
