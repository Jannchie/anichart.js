import { FontOptions } from "./FontOptions";
import { ShadowOptions } from "./shadow-options";
import Pos from "../types/position";
export interface BaseOptions {
    pos?: Pos | ((sec: number) => Pos);
    alpha?: number | ((sec: number) => number);
    font?: FontOptions;
    shadow?: ShadowOptions;
}
