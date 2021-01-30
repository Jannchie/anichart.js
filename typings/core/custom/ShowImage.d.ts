import * as d3 from "d3";
import { Ani } from "../ani/Ani";
export declare function showImage({ path, position, shape, time, freezeTime, center, animation, animationTime, ease, }: {
    path?: string;
    position?: {
        x: number;
        y: number;
    };
    shape?: {
        width: number;
        height: number;
    };
    time?: number;
    freezeTime?: number;
    center?: any;
    animation?: "fade" | "scale";
    animationTime?: number;
    ease?: d3.ElasticEasingFactory;
}): Ani;
