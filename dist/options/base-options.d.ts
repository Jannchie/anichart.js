import { FontOptions } from "./font-options";
import { ShadowOptions } from "./shadow-options";
import Pos from "../utils/position";
export interface BaseOptions {
    pos?: Pos | Function;
    alpha?: number | Function;
    font?: FontOptions;
    shadow?: ShadowOptions;
}
