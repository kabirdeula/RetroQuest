/**
 * GameLoop manages the main update-render loop using fixed timestep logic.
 */
export class GameLoop {
  private lastFrameTime: number = 0;
  private accumulatedTime: number = 0;
  private readonly timeStep: number = 1000 / 60;

  private readonly update: (dt: number) => void;
  private readonly render: () => void;

  private requestAnimationFrameId: number | null = null;
  private isRunning: boolean = false;

  constructor(update: (dt: number) => void, render: () => void) {
    this.update = update;
    this.render = render;
  }

  /**
   * Starts the game loop.
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastFrameTime = performance.now();
      this.requestAnimationFrameId = requestAnimationFrame(this.mainLoop);
    }
  }

  /**
   * Stops the game loop.
   */
  stop() {
    if (this.requestAnimationFrameId !== null) {
      cancelAnimationFrame(this.requestAnimationFrameId);
      this.requestAnimationFrameId = null;
    }
    this.isRunning = false;
  }

  /**
   * The core loop that updates and renders.
   */
  private mainLoop = (timestamp: number) => {
    if (!this.isRunning) return;

    let deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    this.accumulatedTime += deltaTime;

    // Update the game logic in fixed time steps
    while (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep);
      this.accumulatedTime -= this.timeStep;
    }

    this.render();

    this.requestAnimationFrameId = requestAnimationFrame(this.mainLoop);
  };
}
