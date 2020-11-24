import { Hintable, Hinter } from "./../base/hint";
import { Renderer } from "../base/renderer";
import { Player } from "../base/player";
import { Shadowable } from "./../options/shadow-options";
import { Fontable } from "./../options/font-options";
import Pos from "../utils/position";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Scene } from "../base";
interface Component extends Fontable, Shadowable, Hintable {
    scene: Scene;
    ctx: EnhancedCanvasRenderingContext2D | CanvasRenderingContext2D;
    renderer: Renderer;
    player: Player;
    pos: Pos | ((n: number) => Pos);
    alpha: number | ((n: number) => number);
    update(options?: object): void;
    preRender(): void;
    render(): void;
    draw(): void;
    hinter: Hinter;
}
export { Component };
