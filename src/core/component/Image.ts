import { imageLoader } from "../../image-loader";
import { Component } from "./Component";

export class Image extends Component {
  type? = "Image";
  path?: string;
  src?: CanvasImageSource;
  slicePosition?: { x: number; y: number } = { x: 0, y: 0 };
  sliceShape?: { width: number; height: number };
  shape?: { width: number; height: number };
  constructor(image: Image) {
    super(image);
    if (image) {
      if (image.src) {
        this.src = image.src;
      } else {
        imageLoader.load(image.path).then((src) => {
          this.src = src;
        });
      }
      if (image.shape) this.shape = image.shape;
      if (image.sliceShape) this.sliceShape = image.sliceShape;
      if (image.slicePosition) this.slicePosition = image.slicePosition;
    }
  }
}
