import { Scene } from "../base";
import { Hintable, Hinter, Player, Renderer } from "../interface";
import Pos from "../types/position";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Fontable } from "../options/FontOptions";
import { Shadowable } from "./../options/shadow-options";

interface Component extends Fontable, Shadowable, Hintable {
  scene: Scene;

  ctx: EnhancedCanvasRenderingContext2D | CanvasRenderingContext2D;
  renderer: Renderer;
  player: Player;
  // 位置
  pos: Pos | ((n: number) => Pos);
  // alpha
  alpha: number | ((n: number) => number);
  // 重新设置
  update(): void;
  // 预渲染，计算属性
  preRender(): void;
  // 渲染
  render(): void;
  // 绘制
  draw(): void;

  hinter: Hinter;
}
export { Component };
