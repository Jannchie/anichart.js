export class BaseAniChart {
    metaData: any[];
    data: any[];
    ffmpeg: any;
    pngToMp4: typeof pngToMp4;
    setOptions(options: any): void;
    innerMargin: {
        left: any;
        right: any;
        top: any;
        bottom: any;
    };
    loadImages(metaData: any, imgDict: any, imgData: any): Promise<void>;
    imageDict(): any;
    getColor(data: any): any;
    label(data: any): any;
    colorKey(data: any): any;
    selectCanvas(selector?: string): Promise<void>;
    canvas: Element | Window | Document | import("canvas").Canvas | import("d3-selection").EnterElement;
    ctx: any;
    initCanvas(parent?: string): Promise<void>;
    hintText(txt: any, self?: BaseAniChart): Promise<void>;
    play(): Promise<void>;
    player: boolean | import("d3-timer").Timer;
    readyToDraw(): Promise<void>;
    useCtl: boolean;
    ctl: Ctl;
    ready: boolean;
    drawFrame(n: any): Promise<void>;
    outputPngs(): Promise<void>;
    currentFrame: any;
    outputMp4(): Promise<void>;
    outputPng(n: any, name: any, fs: any, path: any): Promise<void>;
}
import { pngToMp4 } from "./ffmpeg";
import Ctl from "./ctl";
