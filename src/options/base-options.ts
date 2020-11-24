import { FontOptions } from "./font-options";
import { ShadowOptions } from "./shadow-options";
import Pos from "../utils/position";
export interface BaseOptions {
  // 位置
  pos?: Pos | ((n: number) => Pos);
  // 透明度
  alpha?: number | ((n: number) => number);

  font?: FontOptions;
  shadow?: ShadowOptions;
}
