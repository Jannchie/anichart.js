import { BaseOptions } from "./BaseOptions";
import { FontOptions } from "./FontOptions";

export interface TextLinesOptions extends BaseOptions {
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: FontOptions;
  // 行间距
  lineSpacing?: number;
}
