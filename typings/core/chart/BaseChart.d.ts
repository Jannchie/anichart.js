import * as d3 from "d3";
import { Ani } from "../ani/Ani";
import { Component } from "../component/Component";
import { Text } from "../component/Text";
import { Stage } from "../Stage";
export interface BaseChartOptions {
    aniTime?: [number, number];
    fadeTime?: [number, number];
    freezeTime?: [number, number];
    position?: {
        x: number;
        y: number;
    };
    shape?: {
        width: number;
        height: number;
    };
    margin?: {
        left: number;
        top: number;
        bottom: number;
        right: number;
    };
    idField?: string;
    colorField?: string | KeyGenerate;
    imageField?: string | KeyGenerate;
    dateField?: string;
    valueField?: string;
    valueKeys?: string[];
    valueFormat?: (cData: any) => string;
    labelFormat?: (id: string, meta: Map<string, any>, data: Map<string, any>) => string;
    dateFormat?: string;
    dataName?: string;
    metaName?: string;
}
export declare type KeyGenerate = ((id: string) => string) | ((id: string, meta: Map<string, any>) => string) | ((id: string, meta: Map<string, any>, data: Map<string, any>) => string);
export declare abstract class BaseChart extends Ani {
    constructor(options?: BaseChartOptions);
    dataScales: Map<string, any>;
    idField: string;
    colorField: string | KeyGenerate;
    imageField: string | KeyGenerate;
    dateField: string;
    valueField: string;
    valueKeys: string[];
    imageKey: string;
    shape: {
        width: number;
        height: number;
    };
    position: {
        x: number;
        y: number;
    };
    margin: {
        left: number;
        top: number;
        right: number;
        bottom: number;
    };
    aniTime: [number, number];
    freezeTime: [number, number];
    fadeTime: [number, number];
    data: any[];
    dataGroup: Map<string, any>;
    meta: Map<string, any>;
    dataName: string;
    metaName: string;
    alphaScale: d3.ScaleLinear<number, number, never>;
    secToDate: d3.ScaleLinear<any, any, never>;
    dateFormat: string;
    xTickFormat: (n: number | {
        valueOf(): number;
    }) => string;
    yTickFormat: (n: number | {
        valueOf(): number;
    }) => string;
    setup(stage: Stage): void;
    private setData;
    private setDataScales;
    setMeta(): void;
    valueFormat: (cData: any) => string;
    labelFormat: KeyGenerate;
    private setAlphaScale;
    private setDefaultAniTime;
    getCurrentData(sec: number, filter?: boolean): any[];
    protected getXAxisComponent(scale: d3.ScaleLinear<number, number, never>, x?: number, text?: Text, count?: number): Component;
    private getAxisComponent;
    protected getYAxisComponent(scale: d3.ScaleLinear<number, number, never>, y?: number, text?: Text, count?: number): Component;
}
