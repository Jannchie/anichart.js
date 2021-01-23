import { Component } from "../component/Component";
import { Ani } from "./Ani";
export interface ProgressOptions {
    position?: {
        x: number;
        y: number;
    };
    shape?: {
        width: number;
        height: number;
    };
    aniTime?: [number, number];
    color?: string;
}
export declare class Progress extends Ani implements ProgressOptions {
    ani: Ani;
    shape: {
        width: number;
        height: number;
    };
    radius: number;
    padding: number;
    lineWidth: number;
    aniTime: [number, number];
    position: {
        x: number;
        y: number;
    };
    center: {
        x: number;
        y: number;
    };
    color: string;
    constructor(options?: ProgressOptions);
    getComponent(sec: number): Component;
}
