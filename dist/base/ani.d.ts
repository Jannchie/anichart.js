import { Component } from "../components";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
interface Ani {
    width: number;
    height: number;
    fps: number;
    sec: number;
    cFrame: number;
    totalFrames: number;
    components: Component[];
    background: string;
    colorScheme: string[];
    data: any;
    meta: any;
    canvas: HTMLCanvasElement;
    ctx: EnhancedCanvasRenderingContext2D;
    output: boolean;
    hint: string;
    setOptions(options: Ani): void;
    calOptions(): void;
    setCanvas(selector: string): void;
    loadData(path: string): void;
    loadMeta(path: string): void;
    addComponent(c: Component): void;
    ready(): void;
    draw(frame: number): void;
    play(): void;
}
export default Ani;
