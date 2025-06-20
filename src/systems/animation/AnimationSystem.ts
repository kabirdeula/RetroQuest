import { AnimationFramePattern } from "./AnimationFramePattern";

/**
 * Manages multiple animation patterns and controls which one is active.
 */
export class AnimationSystem {
  /** Collection of named animation patterns. */
  readonly patterns: Record<string, AnimationFramePattern>;

  /** The key of the currently active animation pattern. */
  private activeKey: string | null;

  constructor(patterns?: Record<string, AnimationFramePattern>) {
    this.patterns = patterns ?? {};
    const keys = Object.keys(this.patterns);
    this.activeKey = keys.length > 0 ? keys[0] : null;
  }

  /**
   * Gets the current frame from the active animation pattern.
   * Returns 0 if no active pattern is set.
   */
  get frame(): number {
    if (this.activeKey && this.patterns[this.activeKey]) {
      return this.patterns[this.activeKey].frame;
    }
    return 0;
  }

  /**
   * Starts playing a specific animation pattern.
   * If switching to a new pattern, resets its time.
   *
   * @param key - The key of the animation pattern to play.
   * @param startAtTime - Optional time (ms) to start the animation at.
   */
  play(key: string, startAtTime = 0): void {
    if (this.activeKey === key) return;

    if (!this.patterns[key]) {
      console.warn('Animation pattern "${key}" not found.');
      return;
    }

    this.activeKey = key;
    (this.patterns[this.activeKey] as any).currentTime = startAtTime; // Direct time reset (could expose setter in AnimationFramePattern for safety)
  }

  /**
   * Updates the active animation pattern's time.
   *
   * @param delta - Time elapsed since last update (ms).
   */
  step(delta: number): void {
    if (this.activeKey && this.patterns[this.activeKey]) {
      this.patterns[this.activeKey].step(delta);
    }
  }
}
