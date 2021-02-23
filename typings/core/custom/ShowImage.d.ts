import * as d3 from "d3";
import { Ani } from "../ani/Ani";
export declare function showImage({ src, position, shape, time, freezeTime, center, animation, animationTime, ease, }: {
    src?: string | undefined;
    position?: {
        x: number;
        y: number;
    } | undefined;
    shape?: {
        width: number;
        height: number;
    } | undefined;
    time?: number | undefined;
    freezeTime?: number | undefined;
    center?: null | undefined;
    animation?: "fade" | "scale" | undefined;
    animationTime?: number | undefined;
    ease?: d3.ElasticEasingFactory | undefined;
}): Ani;
