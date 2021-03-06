import { Component } from "../component/Component";
import { Stage } from "../Stage";
import { Ani } from "./Ani";

export interface GridAniOptions {
  aniTime?: [number, number];
  col?: number;
  row?: number;
  shape?: { width: number; height: number };
  position?: { x: number; y: number };
  items?: Component[];
}

export class GridAni extends Ani {
  col: number;
  row: number;
  items: Component[];
  position: { x: number; y: number };
  shape: { width: number; height: number };
  constructor(options?: GridAniOptions) {
    super();
    if (options) {
      this.col = options.col ?? 3;
      this.row = options.row ?? 3;
      this.position = options.position ?? { x: 0, y: 0 };
      this.items = options.items ?? [];
      this.shape = options.shape ?? { width: 0, height: 0 };
    }
  }
  wrapper: Component;
  setup(stage: Stage) {
    super.setup(stage);
    if (!this.shape) {
      this.shape = {
        width: stage.canvas.width,
        height: stage.canvas.height,
      };
    }
    const height = this.shape.height / this.row;
    const width = this.shape.width / this.col;
    this.wrapper = new Component({
      position: this.position,
    });
    this.items.forEach((item, index) => {
      const col = index % this.col;
      const row = Math.floor(index / this.col);
      item.position = { x: width * col + width / 2, y: height * row };
      this.wrapper.addChild(item);
    });
  }
  getComponent(sec: number) {
    return this.wrapper;
  }
}
