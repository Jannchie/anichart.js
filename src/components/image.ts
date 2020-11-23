import { ImageLoader } from "../image-loader";
import { BaseOptions } from "./../options/base-options";
import { Base } from "./base";
export interface ImageComponentOptions extends BaseOptions {
  imagePath?: string;
  shape?: { width: number; height: number };
}
export class ImageComponent extends Base {
  image: CanvasImageSource;
  imagePath: string;
  private imageLoader = new ImageLoader();
  shape: { width: number; height: number };
  constructor(options: ImageComponentOptions) {
    super(options);
    this.reset(options);
  }

  async reset(options: ImageComponentOptions = {}) {
    super.reset(options);
    if (!this.image && this.imageLoader) {
      this.image = await this.imageLoader.load(this.imagePath);
      this.ani.hinter.drawHint(`Load Image: ${this.imagePath}`);
    }
  }
  render(n: number): void {
    if (this.image) {
      this.ani.ctx.drawImage(
        this.image,
        0,
        0,
        this.shape.width,
        this.shape.height
      );
    }
  }
}
