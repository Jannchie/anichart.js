import { Component } from "./Component";
export class Rect extends Component {
  readonly type? = "Rect";
  shape?: { width: number; height: number } = { width: 10, height: 10 };
  radius?: number = 0;
  clip?: boolean = false;
  constructor(rect?: Rect) {
    super(rect);
    if (rect) {
      if (rect.shape) this.shape = rect.shape;
      if (rect.radius) this.radius = rect.radius;
      if (rect.clip) this.clip = rect.clip;
    }
  }
}
