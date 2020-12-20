import * as d3 from "d3";
import { Ani } from "./Ani";
import { Text } from "../component/Text";
interface TextAniOptions {
  time?: number;
  last?: number;
  fade?: number;
  type: "rise" | "blur" | "fade";
}
export class TextAni extends Ani {
  component: Text = new Text();
  fade: number;
  last: number;
  time: number;
  type: string;
  constructor(options = {} as TextAniOptions) {
    super();
    this.fade = options.fade ? options.fade : 0.5;
    this.last = options.last ? options.last : 2;
    this.time = options.time ? options.time : 0;
    this.type = options.type ? options.type : "fade";
  }
  getComponent(sec: number) {
    const alphaScale = d3
      .scaleLinear(
        [
          this.time,
          this.time + this.fade,
          this.time + this.last - this.fade,
          this.time + this.last,
        ],
        [0, 1, 1, 0]
      )
      .clamp(true);
    this.component.alpha = alphaScale(sec);
    return this.component;
  }
}
