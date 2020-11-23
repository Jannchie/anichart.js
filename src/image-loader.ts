interface LoadImageFunc {
  (url: string): Promise<CanvasImageSource>;
}
export class ImageLoader {
  load: LoadImageFunc;
  constructor() {
    if (typeof window !== "undefined") {
      // Browser
      const { Image } = require("@canvas/image");
      this.load = function (url: string) {
        return new Promise((resolve) => {
          const image = new Image();
          image.onload = () => {
            resolve(image);
          };
          image.src = url;
        });
      };
    } else {
      // Node.js
      let { loadImage } = require("canvas");
      this.load = loadImage;
    }
  }
}
