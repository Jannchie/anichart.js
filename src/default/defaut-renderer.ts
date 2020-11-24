import { select } from "d3";
import { ColorPicker } from "../base/color-picker";
import { ComponentManager } from "../base/component-manager";
import { Hinter } from "../base/hint";
import { Renderer } from "../base/renderer";
import {
  enhanceCtx,
  EnhancedCanvasRenderingContext2D,
} from "../utils/enhance-ctx";
import { DefaultColorPicker } from "./default-color-picker";

export class DefaultRenderer implements Renderer {
  hinter: Hinter;
  componentManager: ComponentManager;
  shape = { width: 1366, height: 768 };
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  colorPicker: ColorPicker = new DefaultColorPicker();
  constructor(hinter: Hinter, componentManager?: ComponentManager) {
    this.hinter = hinter;
    if (componentManager) this.componentManager = componentManager;
  }
  draw(): void {
    if (this.componentManager) {
      this.componentManager.components.forEach((c) => {
        c.draw();
      });
    }
  }
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D {
    if (typeof window !== "undefined") {
      this.canvas = select(selector).node() as HTMLCanvasElement;
      if (!this.canvas || this.canvas.getContext === undefined) {
        this.initCanvas();
      }
    } else {
      const { createCanvas } = require("canvas");
      this.canvas = createCanvas(this.shape.width, this.shape.height);
    }
    this.ctx = enhanceCtx(this.canvas.getContext("2d"));
    this.hinter.ctx = this.ctx;
    return this.ctx;
  }

  private initCanvas(): void {
    this.canvas = select("body")
      .append("canvas")
      .attr("width", this.shape.width)
      .attr("height", this.shape.height)
      .node();
  }
}
