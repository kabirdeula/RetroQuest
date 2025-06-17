export class ImageResource {
  image: HTMLImageElement;
  isLoaded: boolean;

  constructor({
    image,
    isLoaded,
  }: {
    image: HTMLImageElement;
    isLoaded: boolean;
  }) {
    this.image = image;
    this.isLoaded = isLoaded;
  }
}
