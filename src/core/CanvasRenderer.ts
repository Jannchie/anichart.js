import { Component } from "./component/Component";
import { Rect } from "./component/Rect";
import { Text } from "./component/Text";
import { Image } from "./component/Image";
import { recourse } from "./Recourse";
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

    // render base component props
    this.renderBase(component);

    // render special component props
    if (component.type === "Text") {
      this.renderText(component as Text);
    } else if (component.type === "Rect") {
      this.renderRect(component as Rect);
    } else if (component.type === "Image") {
      this.renderImage(component as Image);
    }

    // render children components
    component.children.forEach((child) => {
      this.render(child);
    });
    this.ctx.restore();
  }
  renderImage(image: Image) {
    const src = recourse.images.get(image.path);
    if (!src) {
      return;
    }
    if (image.sliceShape) {
      this.ctx.drawImage(
        src,
        image.slicePosition.x,
        image.slicePosition.y,
        image.sliceShape.width,
        image.sliceShape.height,
        0,
        0,
        image.shape.width,
        image.shape.height
      );
    } else if (image.shape) {
      this.ctx.drawImage(src, 0, 0, image.shape.width, image.shape.height);
    } else {
      this.ctx.drawImage(src, 0, 0);
    }
  }
  private renderRect(component: Rect) {
    this.ctx.fillRect(
      component.position.x,
      component.position.y,
      component.shape.width,
      component.shape.height
    );
  }

  private renderBase(component: Component) {
    this.ctx.translate(component.position.x, component.position.y);
    if (component.filter) {
      this.ctx.filter = component.filter;
    }
    if (component.strokeStyle) {
      this.ctx.strokeStyle = component.strokeStyle;
    }
    if (component.fillStyle) {
      this.ctx.fillStyle = component.fillStyle;
    }
    if (component.alpha !== null) {
      this.ctx.globalAlpha = component.alpha;
    }
  }
  private renderText(component: Text) {
    if (component.textAlign) {
      this.ctx.textAlign = component.textAlign;
    }
    if (component.textBaseline) {
      this.ctx.textBaseline = component.textBaseline;
    }
    if (component.fontStr) {
      this.ctx.font = component.fontStr;
    }
    this.ctx.fillText(component.text, 0, 0);
    this.ctx.strokeText(component.text, 0, 0);
  }
}
