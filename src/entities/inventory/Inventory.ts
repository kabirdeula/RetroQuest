import { events } from "../../core/Event";
import type { ImageResource } from "../../core/Resources/ImageResource";
import { resources } from "../../core/Resources/Resources";
import { Vector2 } from "../../core/Vector2";
import { GameObject } from "../../systems/GameObject";
import { Sprite } from "../Sprites";

/**
 * Represents an item stored in the inventory.
 */
interface InventoryItem {
  /** Unique identifier for the item. */
  id: number;
  /** The image resource representing the item. */
  image: ImageResource;
}

/**
 * Represents the player's inventory for storing and displaying collected items.
 */
export class Inventory extends GameObject {
  /** ID counter for assigning unique item IDs. */
  private nextId: number = 0;

  /** The list of items currently in the inventory. */
  private items: InventoryItem[] = [
    { id: -1, image: resources.images.rod },
    { id: -2, image: resources.images.rod },
  ];

  constructor() {
    super({
      position: new Vector2(0, 1),
    });

    // Subscribe to item pickup events
    events.on("HERO_PICKS_UP_ITEM", this, () => {
      this.addItem(resources.images.rod);
    });

    // ? Demo removing of inventory
    // setTimeout(() => {
    //   this.removeFromInventory(-2);
    // }, 2000);

    this.renderInventory();
  }

  /**
   * Adds a new item to the inventory and re-renders.
   *
   * @param image - The image resource for the new item.
   */
  private addItem(image: ImageResource): void {
    this.nextId += 1;
    this.items.push({
      id: this.nextId,
      image,
    });
    this.renderInventory();
  }

  /**
   * Removes an item by its ID and updates the visual display.
   *
   * @param id - The ID of the item to remove.
   */
  removeFromInventory(id: number): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.renderInventory();
  }

  /**
   * Updates the inventory UI by clearing and recreating item sprites.
   */
  private renderInventory() {
    this.children.forEach((child) => child.destroy());

    this.items.forEach((item, index) => {
      const sprite = new Sprite({
        resource: item.image,
        position: new Vector2(index * 12, 0),
      });
      this.addChild(sprite);
    });
  }
}
