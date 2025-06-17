import { ImageResource } from "./ImageResource";

export class Resources {
  toLoad: Record<string, string>;
  images: Record<string, ImageResource>;

  constructor() {
    this.toLoad = {
      sky: "/sprites/sky.png",
      ground: "/sprites/ground.png",
      hero: "/sprites/hero-sheet.png",
      shadow: "/sprites/shadow.png",
    };

    this.images = {};

    for (const key in this.toLoad) {
      const img = new Image();
      img.src = this.toLoad[key];

      const resource = new ImageResource({ image: img, isLoaded: false });
      this.images[key] = resource;

      img.onload = () => {
        resource.isLoaded = true;
      };
    }
  }
}

export const resources = new Resources();
