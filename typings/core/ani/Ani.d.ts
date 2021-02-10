import { Component } from "../component/Component";
import { Stage } from "../Stage";
export declare class Ani {
    stage?: Stage;
    children?: (Ani | Component)[];
    constructor(ani?: Ani);
    getComponent(sec: number): Component;
    setup(stage: Stage): void;
}
