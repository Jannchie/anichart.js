import { BaseOptions } from "./base-options";
import { FontOptions } from "./font-options";

export interface TextLinesOptions extends BaseOptions {
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: FontOptions;
  // 行间距
  lineSpacing?: number;
}
