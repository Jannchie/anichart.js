import { Component } from "./component/Component";
import { Text } from "./component/Text";
export class CanvasRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }
  clean() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  render(component: Component) {
    this.ctx.save();

    // render itself
    this.ctx.translate(component.position.x, component.position.y);
    this.ctx.translate(component.offset.x, component.offset.y);
    if (component instanceof Text) {
      this.renderText(component);
    }

    this.ctx.restore();
    // render children components
    component.children.forEach((child) => {
      this.render(child);
    });
  }

  private renderText(component: Text) {
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
  }
}
