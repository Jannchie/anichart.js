import Ani from "../charts/ani";
import Position from "../utils/position";

export interface TextOptions {
  // 文字内容
  text?: string | Function;
  // 位置
  pos?: Position | Function;
  // 透明度
  alpha?: number | Function;
  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: string;
}
