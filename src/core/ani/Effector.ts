import { scaleLinear } from "d3";
import { Component } from "../component/Component";
import { Ani } from "./Ani";
type Scale = (sec: number) => number;
interface FadeOptions {
  alpha: Scale;
}
export class Effector {
  static fade(item: Ani | Component, options: FadeOptions): Ani {
    const res = new Ani();
    res.setup = (stage) => item.setup(stage);
    const wrapper = new Component();
    wrapper.addChild(item);
    res.getComponent = (sec) => {
      wrapper.alpha = options.alpha(sec);
      return wrapper;
    };
    return res;
  }
}
