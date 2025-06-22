import { events } from "../core/Event";
import { Vector2 } from "../core/Vector2";
import { GameObject } from "./GameObject";

/**
 * Represents a camera that follows the hero's position.
 * Updates its position automatically based on HERO_POSITION events.
 */
export class Camera extends GameObject {
  constructor() {
    super({});

    // Subscribe to HERO_POSITION events to update camera position
    events.on("HERO_POSITION", this, (heroPosition) => {
      const personHalf = 8; // Assuming hero is 16x16, so center offset is 8
      const canvasWidth = 320;
      const canvasHeight = 180;
      const halfWidth = -personHalf + canvasWidth / 2;
      const halfHeight = -personHalf + canvasHeight / 2;

      this.position = new Vector2(
        -heroPosition.x + halfWidth,
        -heroPosition.y + halfHeight
      );
    });
  }
}
