import { Component } from "../component/Component";
import { Stage } from "../Stage";
export declare class Ani {
    stage: Stage | undefined;
    children: (Ani | Component)[];
    constructor(ani?: Ani);
    getComponent(sec: number): Component | null;
    setup(stage: Stage): void;
}
