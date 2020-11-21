import { FadeTextOptions } from "./fade-text-options";

export interface BlurTextOptions extends FadeTextOptions {
  // 模糊像素
  blur?: number;
}
