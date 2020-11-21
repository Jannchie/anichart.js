import { BaseOptions } from "./base-options";

export interface TextLinesOptions extends BaseOptions {
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: string;
  // 字号
  fontSize?: number;
  // 行间距
  lineSpacing?: number;
}
