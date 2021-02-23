import { Component } from "../component/Component";
import { Ani } from "./Ani";
export declare function easeInterpolate<T extends Component | number>(e: (i: number) => number): (a: T, b: T) => (t: number) => T;
declare class CustomAniNeedFrame {
    private keyFrames;
    private keyTimes;
    private eases;
    constructor(startSec?: number);
    keyFrame(c: Component): CustomAni;
}
declare class CustomAni extends Ani {
    private aniSeries;
    private keyTimes;
    private eases;
    private keyFrames;
    constructor(aniSeries: CustomAniNeedFrame, keyTimes: number[], keyFrames: Component[], eases: ((n: number) => number)[]);
    getComponent(sec: number): Component | null;
    duration(duration: number, ease?: (n: number) => number): CustomAniNeedFrame;
}
export declare function customAni(startSec?: number): CustomAniNeedFrame;
export declare function createAni<T extends Component>(keyFrames: T[], keyTimes?: number[], ease?: (n: number) => number): Ani;
export declare function getFadeAni(obj: Component | Ani, options?: {
    startSec?: number;
    durationSec?: number;
    fadeSec?: number;
}): Ani;
export {};
