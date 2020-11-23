import { FontOptions } from "./font-options";
import { ShadowOptions } from "./shadow-options";
import Pos from "../utils/position";
export interface BaseOptions {
  // 位置
  pos?: Pos | Function;
  // 透明度
  alpha?: number | Function;

  font?: FontOptions;
  shadow?: ShadowOptions;
}
