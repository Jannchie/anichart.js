import { Component } from "../component/Component";
import * as d3 from "d3";
import { Ani } from "./Ani";
function easeInterpolate<T extends Component>(e: (i: number) => number) {
  return (a: T, b: T) => {
    const i = d3.interpolate(a, b);
    return (t: number): T => {
      return i(e(t));
    };
  };
}
class CustomAniNeedFrame {
  private keyFrames: Component[] = [];
  private keyTimes: number[] = [];
  constructor(startSec = 0) {
    this.keyTimes.push(startSec);
  }

  keyFrame(c: Component) {
    this.keyFrames.push(c);
    return new CustomAni(this, this.keyTimes, this.keyFrames);
  }
}
// tslint:disable-next-line:max-classes-per-file
class CustomAni extends Ani {
  private aniSeries: CustomAniNeedFrame;
  private keyTimes: number[];
  keyFrames: Component[];
  constructor(
    aniSeries: CustomAniNeedFrame,
    keyTimes: number[],
    keyFrames: Component[]
  ) {
    super();
    this.aniSeries = aniSeries;
    this.keyTimes = keyTimes;
    this.keyFrames = keyFrames;
  }
  getComponent(sec: number): Component {
    const scale = d3
      .scaleLinear(this.keyTimes, this.keyFrames)
      // .interpolate(easeInterpolate(ease))
      .clamp(true);
    return scale(sec);
  }
  duration(sec: number) {
    this.keyTimes.push(sec);
    return this.aniSeries;
  }
}

export function customAni(startSec?: number) {
  return new CustomAniNeedFrame(startSec ? startSec : 0);
}

export function createAni<T extends Component>(
  keyFrames: T[],
  keyTimes: number[] = [0, 1],
  ease: (n: number) => number = d3.easeLinear
): Ani {
  const scale = d3
    .scaleLinear(keyTimes, keyFrames)
    .interpolate(easeInterpolate(ease))
    .clamp(true);
  return {
    setup() {
      return;
    },
    getComponent: (i: number): T => {
      return scale(i);
    },
  };
}
