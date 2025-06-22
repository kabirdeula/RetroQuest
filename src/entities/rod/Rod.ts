import { events } from "../../core/Event";
import { resources } from "../../core/Resources/Resources";
import { Vector2 } from "../../core/Vector2";
import { GameObject } from "../../systems/GameObject";
import { Sprite } from "../Sprites";

/**
 * Rod represents a collectible item on the map.
 * When the hero collides with it, the rod is picked up and removed from the scene.
 */
export class Rod extends GameObject {
  private rodSprite: Sprite;

  /**
   * Constructs a Rod collectible at the specified grid position.
   * @param gridX - X position in grid cells.
   * @param gridY - Y position in grid cells.
   */
  constructor(gridX: number, gridY: number) {
    super({ position: new Vector2(gridX, gridY) });

    // Create and add rod sprite
    this.rodSprite = new Sprite({
      resource: resources.images.rod,
      position: new Vector2(0, -5),
    });
    this.addChild(this.rodSprite);
  }

  ready() {
    // Subscribe to hero position updates to check for collision.
    events.on("HERO_POSITION", this, (heroPosition: Vector2) => {
      this.checkCollisionWithHero(heroPosition);
    });
  }

  /**
   * Checks if the hero has collided with the rod.
   * @param heroPosition - The current position of the hero.
   */
  private checkCollisionWithHero(heroPosition: Vector2): void {
    const roundedHeroX = Math.round(heroPosition.x);
    const roundedHeroY = Math.round(heroPosition.y);

    if (roundedHeroX === this.position.x && roundedHeroY === this.position.y) {
      this.handleHeroCollision();
    }
  }

  /**
   * Handles logic when the hero collides with this rod.
   */
  private handleHeroCollision(): void {
    // Remove the rod from the scene
    this.destroy();

    // Notify the system that the hero has picked up this item
    events.emit("HERO_PICKS_UP_ITEM", {
      image: resources.images.rod,
      position: this.position.clone(),
    });
  }
}
