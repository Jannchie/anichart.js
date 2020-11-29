import { Scene } from "../base";
import { Hintable, Hinter, Player, Renderer } from "../interface";
import { FontOptions } from "../options/font-options";
import { ShadowOptions } from "../options/shadow-options";
import Pos from "../types/position";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Component } from "./component";
export declare abstract class BaseComponent implements Component, Hintable {
    alpha: number | ((n: number) => number);
    pos: Pos | ((n: number) => Pos);
    protected cAlpha: number;
    protected cPos: Pos;
    hinter: Hinter;
    renderer: Renderer;
    player: Player;
    constructor(init?: Partial<BaseComponent>);
    scene: Scene;
    shadow: ShadowOptions;
    font: FontOptions;
    ctx: EnhancedCanvasRenderingContext2D;
    update(): void;
    saveCtx(): void;
    preRender(): void;
    abstract render(): void;
    restoreCtx(): void;
    draw(): void;
    protected getValue(obj: any, n: number): any;
}
