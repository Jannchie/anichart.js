import { BaseComponent } from "./base-component";

export class Background extends BaseComponent {
  backgroundColor: string;
  update() {
    this.pos = { x: 0, y: 0 };
    if (this.renderer) {
      this.backgroundColor = this.renderer.colorPicker.background;
    }
  }
  preRender() {
    this.ctx.fillStyle = this.backgroundColor;
  }
  render(): void {
    this.ctx.fillRect(
      0,
      0,
      this.renderer.shape.width,
      this.renderer.shape.height
    );
  }
}
