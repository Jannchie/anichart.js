import { BaseCompOptions, Component } from "./Component";

export interface ArcOptions extends BaseCompOptions {
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  anticlockwise?: boolean;
}

export class Arc extends Component {
  readonly type = "Arc";
  radius: number;
  startAngle: number;
  endAngle: number;
  anticlockwise: boolean;
  constructor(options?: ArcOptions) {
    super(options);
    if (!options) return;
    this.radius = options.radius ?? 10;
    this.startAngle = options.startAngle ?? 0;
    this.endAngle = options.endAngle ?? 2 * Math.PI;
    this.anticlockwise = options.anticlockwise ?? false;
  }
}
