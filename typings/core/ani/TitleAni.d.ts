import { Component } from "../component/Component";
import { Ani } from "./Ani";
export declare class TiTleAniAlpha extends Ani {
    getComponent(sec: number): Component;
}
export declare function getTitleAniStyle1({ txt, position, }: {
    txt?: string | undefined;
    position?: {
        x: number;
        y: number;
    } | undefined;
}): Ani;
