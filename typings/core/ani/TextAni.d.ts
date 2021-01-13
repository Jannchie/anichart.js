import { Ani } from "./Ani";
import { Text } from "../component/Text";
interface TextAniOptions {
    time?: number;
    last?: number;
    fade?: number;
    type: "rise" | "blur" | "fade";
    blur?: number;
    rise?: number;
}
export declare class TextAni extends Ani {
    component: Text;
    fade: number;
    last: number;
    time: number;
    type: string;
    blur: number;
    rise: number;
    constructor(options?: TextAniOptions);
    getComponent(sec: number): Text;
}
export {};
