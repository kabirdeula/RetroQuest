export class AnimationConfig {
  duration: number;
  frames: { time: number; frame: number }[];

  constructor({
    duration,
    frames,
  }: {
    duration: number;
    frames: { time: number; frame: number }[];
  }) {
    this.duration = duration;
    this.frames = frames;
  }
}
