import { FontOptions } from "./font-options";
import { ShadowOptions } from "./shadow-options";
import Pos from "../utils/position";
export interface BaseOptions {
    pos?: Pos | ((sec: number) => Pos);
    alpha?: number | ((sec: number) => number);
    font?: FontOptions;
    shadow?: ShadowOptions;
}
