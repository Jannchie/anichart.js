import { ImageLoader } from "../image-loader";
import { BaseComponent } from "./base-component";
import { ImageComponentOptions } from "../options/image-component-options";
export class ImageComponent extends BaseComponent {
  image: CanvasImageSource;
  imagePath: string;
  private imageLoader = new ImageLoader();
  shape: { width: number; height: number };
  private loading: boolean;
  constructor(options: ImageComponentOptions) {
    super(options);
    this.loading = false;
    this.update();
  }

  async update() {
    super.update();
    if (!this.image && this.imageLoader && !this.loading) {
      this.loading = true;
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
