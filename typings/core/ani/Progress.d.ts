import { Component } from "../component/Component";
import { Ani } from "./Ani";
export interface ProgressOptions {
    position?: {
        x: number;
        y: number;
    };
    aniTime?: [number, number];
}
export declare class Progress extends Ani {
    ani: Ani;
    shape: {
        width: number;
        height: number;
    };
    radius: number;
    padding: number;
    color: string;
    lineWidth: number;
    aniTime: number[];
    position: {
        x: number;
        y: number;
    };
    center: {
        x: number;
        y: number;
    };
    constructor(options?: ProgressOptions);
    getComponent(sec: number): Component;
}
