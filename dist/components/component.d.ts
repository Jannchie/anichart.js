import { Shadowable } from "./../options/shadow-options";
import { Fontable } from "./../options/font-options";
import Ani from "../base/ani";
import Pos from "../utils/position";
interface Component extends Fontable, Shadowable {
    ani: Ani;
    pos: Pos | Function;
    alpha: number | Function;
    reset(options?: object): void;
    preRender(n: number): void;
    render(n: number): void;
    draw(n: number): void;
}
export { Component };
