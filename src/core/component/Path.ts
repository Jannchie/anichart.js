import { Component } from "./Component";

export class Path extends Component {
  readonly type? = "Line";
  path: Path2D | string;
  constructor(options?: Path) {
    super(options);
    if (!options) return;
    if (options.path) this.path = options.path;
  }
}
