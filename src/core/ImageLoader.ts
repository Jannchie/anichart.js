type LoadImageFunc = (url: string) => Promise<CanvasImageSource>;
export class ImageLoader {
  load: LoadImageFunc;
  constructor() {
    this.load = (url: string) =>
      new Promise((resolve) => {
        const image = new Image();
        image.onload = () => {
          resolve(image);
        };
        image.src = url;
      });
  }
}

export const imageLoader = new ImageLoader();
