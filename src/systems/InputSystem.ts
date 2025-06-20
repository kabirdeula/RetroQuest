export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

/**
 * Handles directional input (keyboard arrows and WASD keys).
 */
export class InputSystem {
  private heldDirections: string[] = [];

  constructor() {
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  }
  /**
   * Returns the currently held direction (most recent).
   */
  get direction(): string | undefined {
    return this.heldDirections[0];
  }

  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.onArrowPressed(UP);
        break;
      case "ArrowDown":
      case "KeyS":
        this.onArrowPressed(DOWN);
        break;
      case "ArrowLeft":
      case "KeyA":
        this.onArrowPressed(LEFT);
        break;
      case "ArrowRight":
      case "KeyD":
        this.onArrowPressed(RIGHT);
        break;
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.onArrowReleased(UP);
        break;
      case "ArrowDown":
      case "KeyS":
        this.onArrowReleased(DOWN);
        break;
      case "ArrowLeft":
      case "KeyA":
        this.onArrowReleased(LEFT);
        break;
      case "ArrowRight":
      case "KeyD":
        this.onArrowReleased(RIGHT);
        break;
    }
  };

  private onArrowPressed(direction: string) {
    if (!this.heldDirections.includes(direction)) {
      this.heldDirections.unshift(direction);
    }
  }

  private onArrowReleased(direction: string) {
    const index = this.heldDirections.indexOf(direction);
    if (index !== -1) {
      return this.heldDirections.splice(index, 1);
    }
  }
}
