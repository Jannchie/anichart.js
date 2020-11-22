if (typeof window === "undefined") {
  global.CanvasRenderingContext2D = require("canvas").CanvasRenderingContext2D;
}

class EnhancedCanvasRenderingContext2D extends CanvasRenderingContext2D {
  drawClipedImg = (
    img: CanvasImageSource,
    x = 0,
    y = 0,
    imageHeight = 100,
    imageWidth = 100,
    r = 4
  ) => {
    if (img != undefined) {
      this.save();
      this.beginPath();
      this.radiusArea(x, y, imageWidth, imageHeight, r);
      this.clip(); //call the clip method so the next render is clipped in last path
      this.closePath();
      try {
        this.drawImage(
          img,
          0,
          0,
          <number>img.width,
          <number>img.height,
          x,
          y,
          imageWidth,
          imageHeight
        );
      } catch (error) {
        console.log(error);
      }
      this.stroke();
      this.restore();
    }
  };
  radiusArea = (left: any, top: any, w: any, h: any, r: number) => {
    this.lineWidth = 0;
    const pi = Math.PI;
    this.arc(left + r, top + r, r, -pi, -pi / 2);
    this.arc(left + w - r, top + r, r, -pi / 2, 0);
    this.arc(left + w - r, top + h - r, r, 0, pi / 2);
    this.arc(left + r, top + h - r, r, pi / 2, pi);
  };
  radiusRect = (left: any, top: any, w: any, h: any, r: any) => {
    this.beginPath();
    this.radiusArea(left, top, w, h, r);
    this.closePath();
    this.fill();
  };
}
export function enhanceCtx(ctx: any) {
  ctx = <EnhancedCanvasRenderingContext2D>ctx;
}
