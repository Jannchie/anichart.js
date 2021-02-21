import { BaseCompOptions, Component } from "./Component";

export interface PathOptions extends BaseCompOptions {
  path?: Path2D | string | null | undefined;
}
export class Path extends Component {
  readonly type = "Line";
  path: Path2D | string | null | undefined;
  constructor(options?: PathOptions) {
    super(options);
    this.path = options?.path;
  }
}
