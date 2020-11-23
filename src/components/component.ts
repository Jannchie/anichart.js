import { Fontable } from "./../options/font-options";
import Ani from "../base/ani";
import Position from "../utils/position";

interface Component extends Fontable {
  // 图表对象
  ani: Ani;
  // 位置
  pos: Position | Function;
  // alpha
  alpha: number | Function;
  // 重新设置
  reset(options: object): void;
  // 预渲染，计算属性
  preRender(n: number): void;
  // 渲染
  render(n: number): void;
  // 绘制
  draw(n: number): void;
}
export { Component };
