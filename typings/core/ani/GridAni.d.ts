import { Ani, Component, Stage } from "../..";
export interface GridOptions {
    aniTime?: [number, number];
    col?: number;
    row?: number;
    shape?: {
        width: number;
        height: number;
    };
    position?: {
        x: number;
        y: number;
    };
    items?: Component[];
}
export declare class GridAni extends Ani {
    col: number;
    row: number;
    items: Component[];
    position: {
        x: number;
        y: number;
    };
    shape: {
        width: number;
        height: number;
    };
    constructor(options?: GridOptions);
    wrapper: Component;
    setup(stage: Stage): void;
    getComponent(sec: number): Component;
}
