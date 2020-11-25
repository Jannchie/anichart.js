type LoadImageFunc = (url: string) => Promise<CanvasImageSource>;
export class ImageLoader {
  load: LoadImageFunc;
  constructor() {
    if (typeof window !== "undefined") {
      // Browser
      const { Image } = require("@canvas/image");
      this.load = (url: string) =>
        new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            resolve(image);
          };
          image.src = url;
        });
    } else {
      // Node.js
      const { loadImage } = require("canvas");
      this.load = loadImage;
    }
  }
}
