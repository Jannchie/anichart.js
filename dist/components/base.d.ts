import Ani from "../base/ani";
import Position from "../utils/position";
import { Component } from "./component";
export declare abstract class Base implements Component {
    alpha: number | Function;
    ani: Ani;
    pos: Position | Function;
    protected cAlpha: number;
    protected cPos: Position;
    constructor(options: any);
    reset(options: any): void;
    saveCtx(): void;
    preRender(n: number): void;
    abstract render(n: number): void;
    restoreCtx(): void;
    draw(n: number): void;
    protected getValue(obj: any, n: number): any;
}
