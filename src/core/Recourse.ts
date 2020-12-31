import { imageLoader } from "./imageLoader";
export class Recourse {
  setup() {
    const promises = [];
    for (const [key, promise] of this.imagesPromise) {
      promise.then((src: CanvasImageSource) => this.images.set(key, src));
      promises.push(promise);
    }
    return Promise.all(promises);
  }
  imagesPromise: Map<string, Promise<CanvasImageSource>> = new Map();
  images: Map<string, CanvasImageSource> = new Map();
  load(path: string, name?: string) {
    const src = imageLoader.load(path);
    if (name) {
      this.imagesPromise.set(name, src);
    }
    this.imagesPromise.set(path, src);
  }
}
export const recourse = new Recourse();
