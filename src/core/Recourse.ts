import { imageLoader } from "./imageLoader";
export class Recourse {
  images: Map<
    string,
    CanvasImageSource | Promise<CanvasImageSource>
  > = new Map();
  load(path: string, name?: string) {
    const src = imageLoader.load(path);
    if (name) {
      this.images.set(name, src);
    }
    this.images.set(path, src);
  }
}
export const recourse = new Recourse();
