import { Component } from "./component/Component";
import { Rect } from "./component/Rect";
import { Text } from "./component/Text";
import { Image } from "./component/Image";
import { recourse } from "./Recourse";
export class CanvasRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.setCanvas(canvas);
  }
  clean() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
  }
  render(component: Component) {
    this.ctx.save();
    // render itself

    // render base component props
    this.renderBase(component);

    // render special component props
    switch (component.type) {
      case "Text":
        this.renderText(component as Text);
        break;
      case "Rect":
        this.renderRect(component as Rect);
        break;
      case "Image":
        this.renderImage(component as Image);
        break;
    }

    // render children components
    component.children.forEach((child) => {
      this.render(child);
    });
    this.ctx.restore();
  }
  renderClipRect(component: Rect) {
    this.ctx.beginPath();
    this.radiusArea(
      component.position.x,
      component.position.y,
      component.shape.width,
      component.shape.height,
      component.radius
    );
    this.ctx.clip();
    this.ctx.closePath();
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
  renderRect(component: Rect) {
    if (component.clip) {
      this.renderClipRect(component);
    }
    if (!component.radius || component.radius <= 0) {
      this.ctx.fillRect(
        component.position.x,
        component.position.y,
        component.shape.width,
        component.shape.height
      );
    } else {
      this.fillRadiusRect(
        component.position.x,
        component.position.y,
        component.shape.width,
        component.shape.height,
        component.radius
      );
    }
  }

  renderBase(component: Component) {
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
    if (component.alpha !== undefined) {
      this.ctx.globalAlpha = component.alpha;
    }
  }
  renderText(component: Text) {
    this.prerenderText(component);
    this.ctx.fillText(component.text, -component.center.x, -component.center.y);
    this.ctx.strokeText(
      component.text,
      -component.center.x,
      -component.center.y
    );
  }
  prerenderText(component: Text) {
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
  }

  private fillRadiusRect(
    left: number,
    top: number,
    w: number,
    h: number,
    r: number
  ) {
    this.ctx.beginPath();
    this.radiusArea(left, top, w, h, r);
    this.ctx.closePath();
    this.ctx.fill();
  }
  private radiusArea(
    left: number,
    top: number,
    w: number,
    h: number,
    r: number
  ) {
    this.ctx.lineWidth = 0;
    const pi = Math.PI;
    this.ctx.arc(left + r, top + r, r, -pi, -pi / 2);
    this.ctx.arc(left + w - r, top + r, r, -pi / 2, 0);
    this.ctx.arc(left + w - r, top + h - r, r, 0, pi / 2);
    this.ctx.arc(left + r, top + h - r, r, pi / 2, pi);
  }
}
export const canvasRenderer = new CanvasRenderer();
