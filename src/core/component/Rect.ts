import { BaseCompOptions, Component } from "./Component";
export interface RectOptions extends BaseCompOptions {
  shape?: { width: number; height: number };
  radius?: number;
  clip?: boolean;
}
export class Rect extends Component {
  readonly type = "Rect";
  shape: { width: number; height: number };
  radius: number;
  clip: boolean;
  constructor(rect?: RectOptions) {
    super(rect);
    if (rect) {
      this.shape = rect.shape ?? { width: 20, height: 20 };
      this.radius = rect.radius ?? 0;
      this.clip = rect.clip ?? false;
    }
  }
}
