import { Stage } from "../Stage";
import { BaseCompOptions, Component } from "./Component";

export interface GridOptions extends BaseCompOptions {
  row?: number;
  col?: number;
  shape?: { width: number; height: number };
}
export class Grid extends Component {
  shape?: { width: number; height: number };
  row: number | undefined;
  col: number;
  constructor(options?: GridOptions) {
    super(options);
    this.col = options?.col ?? 3;
    this.row = options?.row ?? undefined;

    this.shape = options?.shape ?? undefined;
  }
  setup(stage: Stage) {
    super.setup(stage);
    this.row = this.row ?? Math.floor(this.children.length / this.col) + 1;
    if (!this.shape) {
      this.shape = {
        width: stage.canvas.width,
        height: stage.canvas.height,
      };
    }
    const height = this.shape.height / this.row;
    const width = this.shape.width / this.col;
    this.children.forEach((item, index) => {
      const col = index % this.col;
      const row = Math.floor(index / this.col);
      if (item instanceof Component) {
        item.position = { x: width * col + width / 2, y: height * row };
      } else {
        const getComp = item.getComponent;
        item.getComponent = (sec: number) => {
          const comp = getComp(sec);
          if (comp) {
            comp.position = { x: width * col + width / 2, y: height * row };
          }
          return comp;
        };
      }
    });
  }
}
