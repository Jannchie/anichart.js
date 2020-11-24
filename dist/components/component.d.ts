import { Hintable, Hinter } from "./../base/hint";
import { Player, Renderer } from "./../base/base";
import { Shadowable } from "./../options/shadow-options";
import { Fontable } from "./../options/font-options";
import Ani from "../base/ani";
import Pos from "../utils/position";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
interface Component extends Fontable, Shadowable, Hintable {
    ctx: EnhancedCanvasRenderingContext2D | CanvasRenderingContext2D;
    renderer: Renderer;
    player: Player;
    ani: Ani;
    pos: Pos | Function;
    alpha: number | Function;
    update(options?: object): void;
    preRender(): void;
    render(): void;
    draw(): void;
    hinter: Hinter;
}
export { Component };
