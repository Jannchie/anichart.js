import * as d3 from "d3";
import { Ani } from "./Ani";
import { Text } from "../component/Text";
interface TextAniOptions {
  time?: number;
  last?: number;
  fade?: number;
  type: "rise" | "blur" | "fade";
  blur?: number;
  rise?: number;
}
export class TextAni extends Ani {
  component: Text = new Text();
  fade: number;
  last: number;
  time: number;
  type: string;
  blur: number;
  rise: number;
  constructor(options = {} as TextAniOptions) {
    super();
    this.fade = options.fade ? options.fade : 0.5;
    this.last = options.last ? options.last : 2;
    this.time = options.time ? options.time : 0;
    this.type = options.type ? options.type : "fade";
    this.blur = options.blur ? options.blur : 20;
    this.rise = options.rise ? options.rise : 10;
  }
  getComponent(sec: number) {
    const scale = d3
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
    switch (this.type) {
      case "fade":
        this.component.alpha = scale(sec);
        break;
      case "blur":
        this.component.filter = `blur(${(1 - scale(sec)) * this.blur}px)`;
        break;
      case "rise":
        this.component.offset = { x: 0, y: (1 - scale(sec)) * this.rise };
        break;
    }
    return this.component;
  }
}
