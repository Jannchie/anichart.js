import { Component } from "./component/Component";
import { Text } from "./component/Text";
export class CanvasRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }
  render(component: Component) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#FFF";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // render children components
    component.children.forEach((child) => this.render(child));
    // render itself
    if (component instanceof Text) {
      this.ctx.save();
      this.ctx.fillStyle = component.fillStyle;
      this.ctx.textAlign = component.textAlign;
      this.ctx.textBaseline = component.textBaseline;
      this.ctx.strokeStyle = component.strokeStyle;
      this.ctx.globalAlpha = component.alpha;
      this.ctx.font = component.fontStr;
      this.ctx.fillText(
        component.text,
        component.position.x,
        component.position.y
      );
      this.ctx.strokeText(
        component.text,
        component.position.x,
        component.position.y
      );
      this.ctx.restore();
    }
  }
}
