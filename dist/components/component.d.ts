import { Fontable } from "./../options/font-options";
import Ani from "../base/ani";
import Position from "../utils/position";
interface Component extends Fontable {
    ani: Ani;
    pos: Position | Function;
    alpha: number | Function;
    reset(options?: object): void;
    preRender(n: number): void;
    render(n: number): void;
    draw(n: number): void;
}
export { Component };
