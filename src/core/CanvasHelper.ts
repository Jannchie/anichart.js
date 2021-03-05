import { canvasRenderer, CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
import { Text } from "./component/Text";
export class CanvasHelper {
  isPointInPath(area: Path2D | string, x: number, d: number): any {
    if (typeof area == "string") {
      area = new Path2D(area);
    }
    return this.renderer.canvas.getContext("2d")?.isPointInPath(area, x, d);
  }
  renderer: CanvasRenderer = canvasRenderer;
  constructor() {
    var canvas = document.querySelector("canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
    }
    this.renderer.canvas = canvas;
    this.renderer.ctx = canvas.getContext("2d")!;
  }

  measure<T extends Component>(c: T) {
    this.renderer.ctx.save();
    if (c.type === "Text") {
      return this.measureText((c as unknown) as Text);
    }
    this.renderer.ctx.restore();
    return { width: 0 } as TextMetrics;
  }
  private measureText(c: Text) {
    this.renderer.prerenderText(c);
    const res = this.renderer.canvas
      .getContext("2d")!
      .measureText(c.text ?? "");
    this.renderer.ctx.restore();
    return res;
  }
}
export const canvasHelper = new CanvasHelper();
