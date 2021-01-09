import { Component } from "./Component";

export class Line extends Component {
  readonly type? = "Line";
  path: Path2D;
  constructor(options?: Line) {
    super(options);
    if (!options) return;
    if (options.path) this.path = options.path;
  }
}
