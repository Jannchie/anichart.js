import Ani from "../base/ani";
import { FontOptions } from "../options/font-options";
import { ShadowOptions } from "../options/shadow-options";
import Pos from "../utils/position";
import { Component } from "./component";
export declare abstract class Base implements Component {
    alpha: number | Function;
    ani: Ani;
    pos: Pos | Function;
    protected cAlpha: number;
    protected cPos: Pos;
    constructor(options: any);
    shadow: ShadowOptions;
    font: FontOptions;
    ctx: CanvasRenderingContext2D;
    reset(options?: any): void;
    saveCtx(): void;
    preRender(n: number): void;
    abstract render(n: number): void;
    restoreCtx(): void;
    draw(n: number): void;
    protected getValue(obj: any, n: number): any;
}
