import { Ani } from "./Ani";
import { Rect } from "../component/Rect";
interface RectOptions {
    shape?: (sec: number) => {
        width: number;
        height: number;
    };
}
export declare class RectAni extends Ani {
    component: Rect;
    shape: (sec: number) => {
        width: number;
        height: number;
    };
    constructor(options?: RectOptions);
    getComponent(sec: number): Rect;
}
export {};
