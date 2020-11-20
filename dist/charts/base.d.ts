import { BaseComponent } from "../components/BaseComponent";
declare class AniBaseChart {
    fps: number;
    sec: number;
    totalFrames: number;
    components: BaseComponent[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    constructor(options?: {});
    setOptions(options: object): void;
    calOptions(): void;
    setCanvas(selector: string): void;
    selectCanvas(selector?: string): void;
    initCanvas(parent?: string): void;
    preRender(): void;
    drawFrame(n: number): void;
}
export { AniBaseChart as Base };
