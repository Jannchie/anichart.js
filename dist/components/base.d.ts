import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export declare abstract class Base implements Component {
    alpha: number | Function;
    ani: Ani;
    pos: Position | Function;
    constructor(options: object);
    reset(options: object): void;
    preRender(n: number): void;
    private saveCtx;
    abstract render(n: number): void;
    private restoreCtx;
    draw(n: number): void;
}
