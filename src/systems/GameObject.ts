import { Vector2 } from "../core/Vector2";
import type { InputSystem } from "./InputSystem";

/**
 * Represents a base game object with position, children, and rendering logic.
 * Acts as the root of a scene graph hierarchy.
 */
export class GameObject {
  /** The object's local position relative to its parent. */
  position: Vector2;

  /** Additional offset applied during drawing (useful for centering or tweaking visuals). */
  drawOffset: Vector2;

  /** Child game objects, forming a hierarchy. */
  children: GameObject[];

  /** Optional input system reference, if this object responds to input. */
  input?: InputSystem;

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

  /**
   * Updates this object and its children recursively.
   *
   * @param delta - Time elapsed since last update (ms).
   * @param root - Optional root context, e.g., scene or game state.
   */
  stepEntry(delta: number, root?: unknown): void {
    // Update all children first
    this.children.forEach((child) => child.stepEntry(delta, root));

    // Then update self
    this.step(delta, root);
  }

  /**
   * Custom update logic for this object.
   * Override in subclasses to implement behavior.
   *
   * @param delta - Time elapsed since last update (ms).
   * @param root - Optional root context.
   */
  step(_delta: number, _root?: unknown): void {
    // To be overridden by subclasses
  }

  /**
   * Draws this object and its children recursively.
   *
   * @param ctx - The canvas rendering context.
   * @param parentX - Accumulated X position from parent transforms.
   * @param parentY - Accumulated Y position from parent transforms.
   */
  draw(ctx: CanvasRenderingContext2D | null, parentX = 0, parentY = 0): void {
    const x = parentX + this.position.x + this.drawOffset.x;
    const y = parentY + this.position.y + this.drawOffset.y;

    this.drawImage(ctx, x, y);

    this.children.forEach((child) => child.draw(ctx, x, y));
  }

  /**
   * Renders this object's image or visual.
   * Override in subclasses to provide specific rendering.
   *
   * @param ctx - The canvas rendering context.
   * @param x - Final X position to draw at.
   * @param y - Final Y position to draw at.
   */
  drawImage(
    _ctx: CanvasRenderingContext2D | null,
    _x: number,
    _y: number
  ): void {
    // To be overridden by subclasses
  }

  /**
   * Adds a child object to this object's hierarchy.
   *
   * @param child - The GameObject to add as a child.
   */
  addChild(child: GameObject) {
    this.children.push(child);
  }

  /**
   * Removes a child object from this object's hierarchy.
   *
   * @param child - The GameObject to remove.
   */
  removeChild(child: GameObject) {
    this.children = this.children.filter((c) => c !== child);
  }
}
