import { FontOptions } from "./FontOptions";
import { ShadowOptions } from "./shadow-options";
import Pos from "../types/position";
export interface BaseOptions {
  // 位置
  pos?: Pos | ((sec: number) => Pos);
  // 透明度
  alpha?: number | ((sec: number) => number);

  font?: FontOptions;
  shadow?: ShadowOptions;
}
