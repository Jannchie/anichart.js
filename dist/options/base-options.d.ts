import { FontOptions } from "./font-options";
import { ShadowOptions } from "./shadow-options";
import Pos from "../utils/position";
export interface BaseOptions {
    pos?: Pos | ((n: number) => Pos);
    alpha?: number | ((n: number) => number);
    font?: FontOptions;
    shadow?: ShadowOptions;
}
