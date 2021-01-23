import { Component } from "./Component";

export class Arc extends Component {
  readonly type? = "Arc";
  radius? = 10;
  startAngle? = 0;
  endAngle? = 2 * Math.PI;
  anticlockwise? = false;
  constructor(options?: Arc) {
    super(options);
    if (!options) return;
    if (options.radius !== undefined) this.radius = options.radius;
    if (options.startAngle) this.startAngle = options.startAngle;
    if (options.endAngle) this.endAngle = options.endAngle;
    if (options.anticlockwise) this.anticlockwise = options.anticlockwise;
  }
}
