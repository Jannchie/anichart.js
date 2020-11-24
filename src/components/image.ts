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
    this.update(options);
  }

  async update(options: ImageComponentOptions = {}) {
    super.update(options);
    if (!this.image && this.imageLoader) {
      this.image = await this.imageLoader.load(this.imagePath);
      this.hinter.drawHint(`Load Image: ${this.imagePath}`);
    }
  }
  render(): void {
    if (this.image) {
      this.player.renderer.ctx.drawImage(
        this.image,
        0,
        0,
        this.shape.width,
        this.shape.height
      );
    }
  }
}
