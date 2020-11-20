import Ani from "../charts/ani";
import Position from "../utils/position";

export interface TextComponentOptions {
  // 图表对象
  anichart?: Ani;
  // 文字内容
  text?: string;
  // 展示时间
  time?: number;
  // 持续时间
  last?: number;
  // 淡入时间
  fade?: number;
  // 位置
  pos?: Position;

  // 颜色
  fillStyle?: string | CanvasGradient | CanvasPattern;

  font?: string;
}
