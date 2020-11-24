import { Groupable } from "./../components/group";
import { Hintable } from "./hint";
import { Fontable, FontOptions } from "./../options/font-options";
import { Colorable, ColorPicker } from "./color";
import { Component } from "../components";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
interface Ani extends Fontable, Hintable, Groupable, Colorable {
    width: number;
    height: number;
    fps: number;
    sec: number;
    cFrame: number;
    totalFrames: number;
    components: Component[];
    color: ColorPicker;
    font: FontOptions;
    canvas: HTMLCanvasElement;
    ctx: EnhancedCanvasRenderingContext2D;
    output: boolean;
    setOptions(options: Ani): void;
    update(): void;
    setCanvas(selector: string): void;
    addComponent(c: Component): void;
    draw(frame: number): void;
    play(): void;
}
export default Ani;
