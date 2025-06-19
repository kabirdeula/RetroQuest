import { Vector2 } from "../core/Vector2";
import type { Input } from "./Input";

export class GameObject {
  position: Vector2;
  drawOffset: Vector2;
  children: GameObject[];
  input?: Input;

  constructor({
    position,
    drawOffset,
  }: {
    position?: Vector2;
    drawOffset?: Vector2;
  } = {}) {
    this.position = position ?? new Vector2(0, 0);
    this.drawOffset = drawOffset ?? new Vector2(0, 0);
    this.children = [];
  }

  stepEntry(delta: number, root?: unknown) {
    // Update children first
    this.children.forEach((child) => child.stepEntry(delta, root));

    // Self
    this.step(delta, root);
  }

  step(_delta: number, _root?: unknown) {
    // Override this method in subclasses to implement custom behavior
  }

  draw(ctx: CanvasRenderingContext2D | null, parentX = 0, parentY = 0) {
    const x = parentX + this.position.x + this.drawOffset.x;
    const y = parentY + this.position.y + this.drawOffset.y;

    this.drawImage(ctx, x, y);

    this.children.forEach((child) => child.draw(ctx, x, y));
  }

  drawImage(_ctx: CanvasRenderingContext2D | null, _x: number, _y: number) {}

  addChild(child: GameObject) {
    this.children.push(child);
  }

  removeChild(child: GameObject) {
    this.children = this.children.filter((c) => c !== child);
  }
}
