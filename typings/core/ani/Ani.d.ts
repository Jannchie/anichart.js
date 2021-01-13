import { Component } from "../component/Component";
import { Stage } from "../Stage";
export declare class Ani {
    stage?: Stage;
    component?: Component;
    getComponent(sec: number): Component;
    setup(stage: Stage): void;
    children?: (Ani | Component)[];
}
