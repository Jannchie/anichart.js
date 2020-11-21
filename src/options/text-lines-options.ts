import { BaseOptions } from "./base-options";

export interface TextLinesOptions extends BaseOptions {
  // 文字内容
  text?: string | Function;
  // 透明度
  alpha?: number | Function;
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: string;
  // 行间距
  lineHeight?: number;
}
