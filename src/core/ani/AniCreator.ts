import { Component } from "../component/Component";
import * as d3 from "d3";
import { Ani } from "./Ani";
export function createAni<T extends Component>(
  keyFrames: T[],
  ease: (n: number) => number = d3.easeLinear,
  timer = [0, 1]
): Ani {
  const easeInterpolate = (e: (i: number) => number) => {
    return (a: T, b: T) => {
      const i = d3.interpolate(a, b);
      return (t: number): T => {
        return i(e(t));
      };
    };
  };
  const scale = d3
    .scaleLinear(timer, keyFrames)
    .interpolate(easeInterpolate(ease))
    .clamp(true);
  return {
    getComponent: (i: number): T => {
      return scale(i);
    },
  };
}
