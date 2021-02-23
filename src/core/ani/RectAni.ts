import { Ani } from "./Ani";
import { Rect } from "../component/Rect";
interface RectOptions {
  shape?: (sec: number) => { width: number; height: number };
}
export class RectAni extends Ani {
  component: Rect = new Rect();
  shape: (sec: number) => { width: number; height: number };
  constructor(options = {} as RectOptions) {
    super();
    if (options.shape) this.shape = options.shape;
  }
  getComponent(sec: number) {
    if (this.shape) this.component.shape = this.shape(sec);
    return this.component;
  }
}
