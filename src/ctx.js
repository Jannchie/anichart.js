export default function enhanceCtx(ctx) {
  ctx.drawClipedImg = (
    img,
    x = 0,
    y = 0,
    imageHeight = 100,
    imageWidth = 100,
    r = 4
  ) => {
    if (img != undefined) {
      ctx.save();
      ctx.beginPath();
      ctx.radiusArea(x, y, imageWidth, imageHeight, r);
      ctx.clip(); //call the clip method so the next render is clipped in last path
      ctx.closePath();
      try {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          x,
          y,
          imageWidth,
          imageHeight
        );
      } catch (error) {
        console.log(error);
      }
      // ctx.stroke();
      ctx.restore();
    }
  };

  ctx.radiusArea = (left, top, w, h, r) => {
    ctx.lineWidth = 0;
    const pi = Math.PI;
    ctx.arc(left + r, top + r, r, -pi, -pi / 2);
    ctx.arc(left + w - r, top + r, r, -pi / 2, 0);
    ctx.arc(left + w - r, top + h - r, r, 0, pi / 2);
    ctx.arc(left + r, top + h - r, r, pi / 2, pi);
  };
  ctx.radiusRect = (left, top, w, h, r) => {
    ctx.beginPath();
    ctx.radiusArea(left, top, w, h, r);
    ctx.closePath();
    ctx.fill();
  };
}
