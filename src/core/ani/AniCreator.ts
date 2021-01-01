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
