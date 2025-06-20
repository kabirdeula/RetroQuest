import type { AnimationConfig } from "../../core/AnimationConfig";

/**
 * Handles timing and frame selection for a sequence of animation keyframes.
 */
export class AnimationFramePattern {
  /** The configuration during the animation's frames and duration. */
  readonly animationConfig: AnimationConfig;

  /** Duration of the animation in milliseconds. */
  readonly duration: number;

  /** Time elapsed in the current animation cycle. */
  currentTime: number = 0;

  constructor(animationConfig: AnimationConfig) {
    this.animationConfig = animationConfig;
    this.duration = animationConfig.duration ?? 500;
  }

  /**
   * Gets the current frame based on elapsed time.
   * @throws - If current time is before the first keyframe (should not happen in normal looping usage)
   */
  get frame(): number {
    const { frames } = this.animationConfig;

    // Find the last keyframe whose time <= currentTime
    for (let i = frames.length - 1; i >= 0; i--) {
      if (this.currentTime >= frames[i].time) {
        return frames[i].frame;
      }
    }

    throw new Error("Current time is before the first keyframe.");
  }

  /**
   * Advances the animation's internal clock.
   * Loops back to 0 when duration is exceeded.
   *
   * @param delta - Time elapsed since last update (ms).
   */
  step(delta: number): void {
    this.currentTime += delta;
    
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }
  }
}
