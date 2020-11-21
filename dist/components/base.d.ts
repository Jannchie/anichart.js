import Ani from "../charts/ani";
import Position from "../utils/position";
import { Component } from "./component";
export declare abstract class Base implements Component {
    alpha: number | Function;
    ani: Ani;
    pos: Position | Function;
    protected _alpha: number;
    protected _position: Position;
    constructor(options: any);
    reset(options: any): void;
    private saveCtx;
    preRender(n: number): void;
    abstract render(n: number): void;
    private restoreCtx;
    draw(n: number): void;
}
