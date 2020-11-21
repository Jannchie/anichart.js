import Ani from "../charts/ani";
import Position from "../utils/position";

export interface BlurTextOptions {
  // 图表对象
  ani?: Ani;
  // 文字内容
  text?: string;
  // 展示时间
  time?: number;
  // 持续时间
  last?: number;
  // 淡入、淡出时间
  fade?: number;
  // 位置
  pos?: Position;
  // 透明度
  fillStyle?: string | CanvasGradient | CanvasPattern;
  // 字体
  font?: string;
  // 模糊像素
  blur?: number;
}
