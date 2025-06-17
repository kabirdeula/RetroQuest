export class GameLoop {
  lastFrameTime: number;
  accumulatedTime: number;
  timeStep: number;
  update: (dt: number) => void;
  render: () => void;
  requestAnimationFrameId: number | null;
  isRunning: boolean;

  constructor(update: (dt: number) => void, render: () => void) {
    this.lastFrameTime = 0;
    this.accumulatedTime = 0;
    this.timeStep = 1000 / 60;

    this.update = update;
    this.render = render;

    this.requestAnimationFrameId = null;
    this.isRunning = false;
  }

  mainLoop = (timestamp: number) => {
    if (!this.isRunning) return;

    let deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    this.accumulatedTime += deltaTime;

    while (this.accumulatedTime >= this.timeStep) {
      this.update(this.timeStep);
      this.accumulatedTime -= this.timeStep;
    }

    this.render();

    this.requestAnimationFrameId = requestAnimationFrame(this.mainLoop);
  };

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.requestAnimationFrameId = requestAnimationFrame(this.mainLoop);
    }
  }

  stop() {
    if (this.requestAnimationFrameId) {
      cancelAnimationFrame(this.requestAnimationFrameId);
    }
    this.isRunning = false;
  }
}
