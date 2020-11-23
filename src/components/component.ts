import { Shadowable } from "./../options/shadow-options";
import { Fontable } from "./../options/font-options";
import Ani from "../base/ani";
import Pos from "../utils/position";

interface Component extends Fontable, Shadowable {
  // 图表对象
  ani: Ani;
  // 位置
  pos: Pos | Function;
  // alpha
  alpha: number | Function;
  // 重新设置
  reset(options?: object): void;
  // 预渲染，计算属性
  preRender(n: number): void;
  // 渲染
  render(n: number): void;
  // 绘制
  draw(n: number): void;
}
export { Component };
