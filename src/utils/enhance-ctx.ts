import { FontOptions } from "../options/FontOptions";

if (typeof window === "undefined") {
  // tslint:disable-next-line:no-var-requires
  global.CanvasRenderingContext2D = require("canvas").CanvasRenderingContext2D;
}

interface EnhancedCanvasRenderingContext2D extends CanvasRenderingContext2D {
  drawClipedImg(
    img: CanvasImageSource,
    x: number,
    y: number,
    imgH: number,
    imgW: number,
    r: number
  ): void;
  radiusArea(l: number, t: number, w: number, h: number, r: number): void;
  fillRadiusRect(l: number, t: number, w: number, h: number, r: number): void;
  fillCircle(x: number, y: number, r: number): void;
  setFontOptions(font: FontOptions): void;
}

export function enhanceCtx(ctx: any): EnhancedCanvasRenderingContext2D {
  ctx.setFontOptions = (font: FontOptions) => {
    ctx.font = `${font.fontStyle} ${font.fontVariant} ${font.fontWeight} ${font.fontSize}px ${font.font}`;
    ctx.textAlign = font.textAlign;
    ctx.textBaseline = font.textBaseline;
  };
  ctx.fillCircle = (x: number, y: number, r: number) => {
    return ctx.fillRadiusRect(x - r, y - r, r * 2, r * 2, r);
  };
  ctx.drawClipedImg = (
    img: CanvasImageSource,
    x = 0,
    y = 0,
    imgH = 100,
    imgW = 100,
    r = 4
  ) => {
    if (img !== undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.radiusArea(x, y, imgW, imgH, r);
      ctx.clip();
      ctx.closePath();
      try {
        ctx.drawImage(img, 0, 0, img.width, img.height, x, y, imgW, imgH);
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
      }
      ctx.stroke();
      ctx.restore();
    }
  };

  ctx.radiusArea = (
    left: number,
    top: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.lineWidth = 0;
    const pi = Math.PI;
    ctx.arc(left + r, top + r, r, -pi, -pi / 2);
    ctx.arc(left + w - r, top + r, r, -pi / 2, 0);
    ctx.arc(left + w - r, top + h - r, r, 0, pi / 2);
    ctx.arc(left + r, top + h - r, r, pi / 2, pi);
  };
  ctx.fillRadiusRect = (
    left: number,
    top: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.radiusArea(left, top, w, h, r);
    ctx.closePath();
    ctx.fill();
  };
  return ctx;
}
export { EnhancedCanvasRenderingContext2D };
