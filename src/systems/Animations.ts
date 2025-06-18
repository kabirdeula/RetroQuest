import { FrameIndexPattern } from "./FrameIndexPattern";

export class Animations {
  patterns: Record<string, FrameIndexPattern>;
  activeKey: string | null;

  constructor(patterns?: Record<string, FrameIndexPattern>) {
    this.patterns = patterns ?? {};
    const keys = Object.keys(this.patterns);
    this.activeKey = keys.length > 0 ? keys[0] : null;
  }

  get frame() {
    if (this.activeKey && this.patterns[this.activeKey]) {
      return this.patterns[this.activeKey].frame;
    }
    return 0;
  }

  play(key: string, startAtTime = 0) {
    if (this.activeKey === key) {
      return;
    }

    this.activeKey = key;
    this.patterns[this.activeKey].currentTime = startAtTime;
  }

  step(delta: number) {
    if (this.activeKey && this.patterns[this.activeKey]) {
      this.patterns[this.activeKey].step(delta);
    }
  }
}
