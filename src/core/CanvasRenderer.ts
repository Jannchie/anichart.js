import { Component } from "./component/Component";
import { Rect } from "./component/Rect";
import { Text } from "./component/Text";
import { Image } from "./component/Image";
import { recourse } from "./Recourse";
import { Path } from "./component/Path";
import { Arc } from "./component/Arc";
import { Ani } from "./ani/Ani";
import { Stage } from "./Stage";
import { Scene } from "./ani/Series";
export class CanvasRenderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  stage: Stage;
  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.setCanvas(canvas);
  }
  clean() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
  }
  render(child: Component | Ani | null, offset: number = 0) {
    if (!child) return;
    offset += child.offsetSec;
    const sec = this.stage.sec;
    let comp: Component | Ani | null;
    if (child instanceof Ani) {
      comp = child?.getComponent(sec - offset);
    } else {
      comp = child;
    }
    if (!comp) return;
    this.ctx.save();
    // render special component props
    if (this.ctx.globalAlpha > 0) {
      // render itself
      // render base component props
      this.renderBase(comp);
      switch (comp.type) {
        case "Text":
          this.renderText(comp as Text);
          break;
        case "Rect":
          this.renderRect(comp as Rect);
          break;
        case "Image":
          this.renderImage(comp as Image);
          break;
        case "Arc":
          this.renderArc(comp as Arc);
          break;
        case "Line":
          this.renderPath(comp as Path);
          break;
      }
      // render children components
      comp.children.forEach((c) => {
        if (c) this.render(c, offset);
      });
    }
    this.ctx.restore();
  }
  renderArc(arc: Arc) {
    this.ctx.beginPath();
    this.ctx.arc(
      0,
      0,
      arc.radius,
      arc.startAngle,
      arc.endAngle,
      arc.anticlockwise
    );
    if (arc.strokeStyle) this.ctx.stroke();
    if (arc.fillStyle) this.ctx.fill();
  }
  renderPath(line: Path) {
    if (!line.path) {
      return;
    }
    let path: Path2D;
    if (typeof line.path === "string") {
      path = new Path2D(line.path);
    } else {
      path = line.path;
    }
    if (this.ctx.fillStyle) this.ctx.fill(path);
    if (this.ctx.strokeStyle) this.ctx.stroke(path);
  }
  renderClipRect(component: Rect) {
    this.ctx.beginPath();
    this.radiusArea(
      0,
      0,
      component.shape.width,
      component.shape.height,
      component.radius
    );
    this.ctx.clip();
    this.ctx.closePath();
  }

  renderImage(image: Image) {
    const src = recourse.images.get(image.src);
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
  renderRect(component: Rect) {
    if (component.clip) {
      this.renderClipRect(component);
    }
    if (!component.radius || component.radius <= 0) {
      this.ctx.fillRect(0, 0, component.shape.width, component.shape.height);
    } else {
      this.fillRadiusRect(
        0,
        0,
        component.shape.width,
        component.shape.height,
        component.radius
      );
    }
    if (component.strokeStyle) {
      if (!component.radius || component.radius <= 0) {
        this.ctx.strokeRect(
          0,
          0,
          component.shape.width,
          component.shape.height
        );
      } else {
        this.strokeRadiusRect(
          0,
          0,
          component.shape.width,
          component.shape.height,
          component.radius
        );
      }
    }
  }

  renderBase(component: Component) {
    let position: { x: number; y: number };
    if (!component.position) {
      if (component.type === "Text") {
        position = {
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
        };
      } else {
        position = {
          x: 0,
          y: 0,
        };
      }
    } else {
      position = component.position;
    }
    this.ctx.translate(
      position.x - component.center.x,
      position.y - component.center.y
    );
    if (component.filter) {
      this.ctx.filter = component.filter;
    }
    if (component.strokeStyle) {
      this.ctx.strokeStyle = component.strokeStyle;
    }
    if (component.fillStyle) {
      this.ctx.fillStyle = component.fillStyle;
    }
    if (component.lineWidth) {
      this.ctx.lineWidth = component.lineWidth;
    }
    if (component.alpha !== undefined) {
      this.ctx.globalAlpha *= component.alpha;
    }
    if (component.scale !== undefined) {
      this.ctx.scale(component.scale.x, component.scale.y);
    }
    if (component.shadow?.enable) {
      this.ctx.shadowBlur = component.shadow?.blur ?? 10;
      this.ctx.shadowColor = component.shadow?.color ?? "#000";
    }
  }
  renderText(component: Text) {
    this.prerenderText(component);
    if (component.strokeStyle) {
      this.ctx.strokeText(component.text, 0, 0);
    }
    if (component.fillStyle) {
      this.ctx.fillText(component.text, 0, 0);
    }
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
  private strokeRadiusRect(
    left: number,
    top: number,
    w: number,
    h: number,
    r: number
  ) {
    this.ctx.beginPath();
    this.radiusArea(left, top, w, h, r);
    this.ctx.closePath();
    this.ctx.stroke();
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
