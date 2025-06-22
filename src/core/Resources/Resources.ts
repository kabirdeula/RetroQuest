import { ImageResource } from "./ImageResource";

/**
 * Manages loading and access to game image resources.
 */
export class Resources {
  /**
   * Map of resource keys to image file paths.
   */
  private readonly toLoad: Record<string, string>;

  /**
   * Map of resource keys to their loaded ImageResource objects.
   */
  readonly images: Record<string, ImageResource>;

  constructor() {
    this.toLoad = {
      sky: "/sprites/sky.png",
      ground: "/sprites/ground.png",
      hero: "/sprites/hero-sheet.png",
      shadow: "/sprites/shadow.png",
      rod: "/sprites/rod.png",
    };

    this.images = {};
    this.loadImages();
  }

  /**
   * Initiates loading of all images defined in `toLoad`.
   */
  private loadImages() {
    for (const key in this.toLoad) {
      const src = this.toLoad[key];
      const img = new Image();
      img.src = src;

      const resource = new ImageResource({ image: img, isLoaded: false });
      this.images[key] = resource;

      img.onload = () => {
        // Mark the resource as loaded when the image finishes loading.
        // Note: In a more strict design, `ImageResource` would provide a method to do this safely
        resource.isLoaded = true;
      };
    }
  }

  /**
   * Checks if all images are fully loaded.
   * @returns True if all resources are loaded, false otherwise
   */
  areAllLoaded(): boolean {
    return Object.values(this.images).every((res) => res.isLoaded);
  }
}

/**
 * Singleton instance of Resources to be used globally.
 */
export const resources = new Resources();
