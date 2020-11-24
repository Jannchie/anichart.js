import { Hintable, Hinter } from "./../base/hint";
import { Renderer } from "./../base/base";
import { Player } from "../base/player";
import { Shadowable } from "./../options/shadow-options";
import { Fontable } from "./../options/font-options";
import Pos from "../utils/position";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";

interface Component extends Fontable, Shadowable, Hintable {
  ctx: EnhancedCanvasRenderingContext2D | CanvasRenderingContext2D;
  renderer: Renderer;
  player: Player;
  // 位置
  pos: Pos | Function;
  // alpha
  alpha: number | Function;
  // 重新设置
  update(options?: object): void;
  // 预渲染，计算属性
  preRender(): void;
  // 渲染
  render(): void;
  // 绘制
  draw(): void;

  hinter: Hinter;
}
export { Component };
