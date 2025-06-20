/**
 * Represents an image resource used in the game.
 * Tracks the image element and its load status.
 */
export class ImageResource {
  /**
   * The underlying HTML image element.
   */
  readonly image: HTMLImageElement;
  /**
   * Whether the image has finished loading.
   */
  isLoaded: boolean;

  /**
   * Creates an ImageResource.
   * @param params.image - The HTMLImageElement representing the image.
   * @param params.isLoaded - Indicates if the image has loaded successfully.
   */
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
