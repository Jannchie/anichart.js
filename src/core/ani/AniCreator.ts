import { Component } from "../component/Component";
import * as d3 from "d3";
import { Ani } from "./Ani";
export function createAni<T extends Component>(
  start: T,
  end: T,
  ease: (n: number) => number = d3.easeLinear,
  timer = [0, 1]
): Ani {
  const inter = d3.interpolateObject(start, end);
  const scale = d3.scaleLinear(timer, [0, 1]).clamp(true);
  return {
    getComponent: (i: number): T => {
      return inter(ease(scale(i)));
    },
  };
}
