import { FadeTextOptions } from "./fade-text-options";

export interface RiseTextOptions extends FadeTextOptions {
  // 偏移
  offsetY?: number;
  // 反向
  reverse?: boolean;
}
