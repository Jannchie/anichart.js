import * as d3 from "d3";
import { Ani } from "./Ani";
import { Text } from "../component/Text";
import { Rect } from "../component/Rect";
interface RectOptions {
  shape?: (sec: number) => { width: number; height: number };
}
export class RectAni extends Ani {
  component: Rect = new Rect();
  shape: (sec: number) => { width: number; height: number };
  constructor(options = {} as RectOptions) {
    super();
    this.shape = options.shape;
  }
  getComponent(sec: number) {
    if (this.shape) this.component.shape = this.shape(sec);
    return this.component;
  }
}
