import { imageLoader } from "./imageLoader";
import { csv } from "d3";
import { csvParse, DSVRowArray } from "d3-dsv";
export class Recourse {
  setup() {
    const promises = [] as Promise<any>[];
    for (const [key, promise] of this.imagesPromise) {
      promise.then((src: CanvasImageSource) => this.images.set(key, src));
      promises.push(promise);
    }
    for (const [key, promise] of this.dataPromise) {
      promise.then((data: DSVRowArray<string>) => this.data.set(key, data));
      promises.push(promise);
    }
    return Promise.all(promises);
  }
  private imagesPromise: Map<string, Promise<CanvasImageSource>> = new Map();
  images: Map<string, CanvasImageSource> = new Map();

  private dataPromise: Map<string, Promise<DSVRowArray<string>>> = new Map();
  data: Map<string, DSVRowArray<string>> = new Map();

  loadImage(path: string, name?: string) {
    const src = imageLoader.load(path);
    if (name) {
      this.imagesPromise.set(name, src);
    }
    this.imagesPromise.set(path, src);
  }

  loadData(path: string | any, name: string) {
    if (typeof path !== "string") {
      path = path.default;
    }
    if (typeof window === "undefined") {
      const fs = require("fs");
      this.data.set(name, csvParse(fs.readFileSync(path).toString()));
    } else {
      this.dataPromise.set(name, csv(path));
    }
  }
}
export const recourse = new Recourse();
