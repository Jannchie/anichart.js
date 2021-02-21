import { BaseCompOptions, Component } from "./Component";

export interface ImageOptions extends BaseCompOptions {
  slicePosition?: { x: number; y: number };
  sliceShape?: { width: number; height: number };
  shape?: { width: number; height: number };
  src: string;
}

export class Image extends Component {
  readonly type = "Image";
  src: string;
  slicePosition: { x: number; y: number } = { x: 0, y: 0 };
  sliceShape: { width: number; height: number };
  shape: { width: number; height: number };
  constructor(options?: ImageOptions) {
    super(options);
    if (options) {
      if (options.src) this.src = options.src;
      if (options.shape) this.shape = options.shape;
      if (options.sliceShape) this.sliceShape = options.sliceShape;
      if (options.slicePosition) this.slicePosition = options.slicePosition;
    }
  }
}
