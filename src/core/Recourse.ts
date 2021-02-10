import { imageLoader } from "./ImageLoader";
import { csv, json } from "d3";
export class Recourse {
  setup() {
    const promises = [] as Promise<any>[];
    for (const [key, promise] of this.imagesPromise) {
      promise.then((src: CanvasImageSource) => this.images.set(key, src));
      promises.push(promise);
    }
    for (const [key, promise] of this.dataPromise) {
      promise.then((data: any) => this.data.set(key, data));
      promises.push(promise);
    }
    return Promise.all(promises.map((p) => p.catch((e) => e)));
  }
  private imagesPromise: Map<string, Promise<CanvasImageSource>> = new Map();
  images: Map<string, CanvasImageSource> = new Map();

  private dataPromise: Map<string, Promise<any>> = new Map();
  data: Map<string, any> = new Map();

  loadImage(path: string, name?: string) {
    const promise = imageLoader.load(path);
    if (name) {
      this.imagesPromise.set(name, promise);
    }
    this.imagesPromise.set(path, promise);
    return promise;
  }

  loadCSV(path: string | any, name: string) {
    if (typeof path !== "string") {
      path = path.default;
    }
    const promise = csv(path);
    this.dataPromise.set(name, promise);
    return promise;
  }
  loadJSON(path: string | any, name: string) {
    if (typeof path !== "string") {
      path = path.default;
    }
    const promise = json(path);
    this.dataPromise.set(name, promise);
    return promise;
  }
}
export const recourse = new Recourse();
