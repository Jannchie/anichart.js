export class BarChart extends BaseAniChart {
    constructor(options?: {});
    imagePath: string;
    language: string;
    width: number;
    height: number;
    frameRate: number;
    outerMargin: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
    freeze: number;
    colorThief: any;
    interval: number;
    barRedius: number;
    itemCount: number;
    labelPandding: number;
    axisTextSize: number;
    tickNumber: number;
    dateLabelSize: number;
    slogenSize: number;
    output: boolean;
    outputName: string;
    idField: string;
    keyFrameDeltaTime: any;
    colorData: any[];
    barInfo: (data: any, meta: any, self: any) => any;
    xDomain: (series: any) => any[];
    sort: number;
    valueFormat: (d: any) => string;
    tickFormat: (val: any) => string;
    dateFormat: string;
    listImageSrc: () => any[];
    imageData: {};
    colorScheme: {
        background: string;
        colors: string[];
    };
    colorGener: Generator<string, never, unknown>;
    numberKey: Set<any>;
    drawBarExt: (ctx: any, data: any, series: any, self: any) => void;
    drawExt: (ctx: any, data: any, series: any, self: any) => void;
    barHeight: number;
    loadMetaData(path: any): Promise<void>;
    readCsv(path: any): Promise<d3.DSVRowArray<string>>;
    loadCsv(path: any): Promise<void>;
    getCurrentDate: d3.ScaleLinear<number, number, never>;
    id: string;
    keyFramesCount: number;
    tsToFi: d3.ScaleLinear<number, number, never>;
    fiToTs: d3.ScaleLinear<number, number, never>;
    calculateFrameData(data: any): void;
    maxValue: number;
    minValue: number;
    dataScales: Map<any, any>;
    frameData: any[][];
    idSet: IterableIterator<any>;
    setKeyFramesInfo(): void;
    totalTrueFrames: number;
    keyFrames: number[];
    preRender(): Promise<void>;
    autoGetColorFromImage(key: any, src: any): Promise<void>;
    /**
     * Convolution 卷积
     *
     * @param {Set} idSet
     * @param {List} frameData
     */
    calPosition(idSet: Set<any>, frameData: any): void;
    getKeyFrame(i: any): number[];
    calScale(): void;
    tickArrays: number[][];
    drawAxis(n: any, cData: any): void;
    drawTick(xScale: any, val: any): void;
    drawWatermark(): void;
    drawDate(n: any): void;
    drawBackground(): void;
    downloadBlob(blob: any, name?: string): void;
    calRenderSort(): void;
    fixAlpha(): Promise<void>;
}
export default BarChart;
import { BaseAniChart } from "../anichart";
import * as d3 from "d3";
