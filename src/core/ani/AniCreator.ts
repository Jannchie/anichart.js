import { Component } from "../component/Component";
import { Ani } from "./Ani";
import { getFadeWrapped } from "../wrapper/Fade";
import { bisectLeft, easeLinear, interpolate, scaleLinear } from "d3";
export function easeInterpolate<T extends Component | number>(
  e: (i: number) => number
) {
  return (a: T, b: T) => {
    const i = interpolate(a, b as any);
    return (t: number): T => {
      return i(e(t));
    };
  };
}

class CustomAniNeedFrame {
  private keyFrames: Component[] = [];
  private keyTimes: number[] = [];
  private eases: ((n: number) => number)[] = [];
  constructor(startSec = 0) {
    this.keyTimes.push(startSec);
  }

  keyFrame(c: Component) {
    this.keyFrames.push(c);
    return new CustomAni(this, this.keyTimes, this.keyFrames, this.eases);
  }
}
// tslint:disable-next-line:max-classes-per-file
class CustomAni extends Ani {
  private aniSeries: CustomAniNeedFrame;
  private keyTimes: number[];
  private eases: ((n: number) => number)[];
  private keyFrames: Component[];
  constructor(
    aniSeries: CustomAniNeedFrame,
    keyTimes: number[],
    keyFrames: Component[],
    eases: ((n: number) => number)[]
  ) {
    super();
    this.aniSeries = aniSeries;
    this.keyTimes = keyTimes;
    this.keyFrames = keyFrames;
    this.eases = eases;
  }
  getComponent(sec: number): Component | null {
    // [0, 3, 6]
    let rIdx = bisectLeft(this.keyTimes, sec);
    if (rIdx >= this.keyFrames.length) {
      rIdx = this.keyFrames.length - 1;
    }
    const lIdx = rIdx - 1;
    if (lIdx < 0) {
      return null;
    }
    const eIdx = lIdx >= this.eases.length ? this.eases.length - 1 : lIdx;
    const scale = scaleLinear(
      [this.keyTimes[lIdx], this.keyTimes[rIdx]],
      [this.keyFrames[lIdx], this.keyFrames[rIdx]]
    )
      .interpolate(easeInterpolate(this.eases[eIdx]))
      .clamp(true);
    return scale(sec);
  }
  duration(duration: number, ease: (n: number) => number = easeLinear) {
    this.keyTimes.push(this.keyTimes[this.keyTimes.length - 1] + duration);
    this.eases.push(ease);
    return this.aniSeries;
  }
}

export function customAni(startSec?: number) {
  return new CustomAniNeedFrame(startSec ? startSec : 0);
}

export function createAni<T extends Component>(
  keyFrames: T[],
  keyTimes: number[] = [0, 1],
  ease: (n: number) => number = easeLinear
): Ani {
  const scale = scaleLinear(keyTimes, keyFrames)
    .interpolate(easeInterpolate(ease))
    .clamp(true);
  const ani = new Ani();
  ani.getComponent = (i) => {
    return scale(i);
  };
  return ani;
}

export function getFadeAni(
  obj: Component | Ani,
  options?: { startSec?: number; durationSec?: number; fadeSec?: number }
) {
  const startSec = options?.startSec ?? 0;
  const durationSec = options?.durationSec ?? 3;
  const fadeSec = options?.fadeSec ?? 1;
  const alphaScale = scaleLinear(
    [
      startSec,
      startSec + fadeSec,
      startSec + durationSec - fadeSec,
      startSec + durationSec,
    ],
    [0, 1, 1, 0]
  ).clamp(true);
  return getFadeWrapped(obj, alphaScale);
}
