import { FontOptions } from "./FontOptions";
import { BaseOptions } from "./BaseOptions";

export interface TextOptions extends BaseOptions {
  // 文字内容
  text?: string | ((n: number) => string);
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: FontOptions;
}
