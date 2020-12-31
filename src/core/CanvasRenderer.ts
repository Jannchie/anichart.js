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
        -image.center.x,
        -image.center.y,
        image.shape.width,
        image.shape.height
      );
    } else if (image.shape) {
      this.ctx.drawImage(
        src,
        -image.center.x,
        -image.center.y,
        image.shape.width,
        image.shape.height
      );
    } else {
      this.ctx.drawImage(src, -image.center.x, -image.center.y);
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
    const fontStr = `${component.fontStyle ? component.fontStyle : ""} ${
      component.fontVariant ? component.fontVariant : ""
    } ${component.fontWeight ? component.fontWeight : ""} ${
      component.fontSize ? component.fontSize : 16
    }px ${component.font ? component.font : ""}`;
    if (
      component.font ||
      component.fontSize ||
      component.fontWeight ||
      component.fontStyle ||
      component.fontVariant
    ) {
      this.ctx.font = fontStr;
    }
    this.ctx.fillText(component.text, -component.center.x, -component.center.y);
    this.ctx.strokeText(
      component.text,
      -component.center.x,
      -component.center.y
    );
  }
}
