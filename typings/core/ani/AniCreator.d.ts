import { Component } from "../component/Component";
import { Ani } from "./Ani";
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
    getComponent(sec: number): Component;
    duration(duration: number, ease?: (n: number) => number): CustomAniNeedFrame;
}
export declare function customAni(startSec?: number): CustomAniNeedFrame;
export declare function createAni<T extends Component>(keyFrames: T[], keyTimes?: number[], ease?: (n: number) => number): Ani;
export {};
