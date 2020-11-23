import { FontOptions } from "./font-options";
import { BaseOptions } from "./base-options";

export interface TextOptions extends BaseOptions {
  // 文字内容
  text?: string | Function;
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: FontOptions;
}
