import * as d3 from "d3";
import { Ani } from "./Ani";
import { Text } from "../component/Text";
import { Rect } from "../component/Rect";
interface RectOptions {
  shape?: (sec: number) => { width?: number; height?: number };
}
export class BarAni extends Ani {
  component: Rect = new Rect();
  constructor(options = {} as RectOptions) {
    super();
  }
  getComponent(sec: number) {
    return this.component;
  }
}
