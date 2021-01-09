import { canvasRenderer, CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
import { Text } from "./component/Text";
export class CanvasHelper {
  isPointInPath(area: Path2D, x: number, d: number): any {
    return this.renderer.canvas.getContext("2d").isPointInPath(area, x, d);
  }
  renderer: CanvasRenderer = canvasRenderer;
  constructor() {
    this.renderer.canvas = document.querySelector("canvas");
  }
  measure<T extends Component>(c: T) {
    this.renderer.ctx.save();
    if (c.type === "Text") {
      return this.measureText(c as Text);
    }
    this.renderer.ctx.restore();
  }
  private measureText(c: Text) {
    this.renderer.prerenderText(c);
    const res = this.renderer.canvas.getContext("2d").measureText(c.text);
    this.renderer.ctx.restore();
    return res;
  }
}
export const canvasHelper = new CanvasHelper();
