import { TextOptions } from "./text-options";
export interface FadeTextOptions extends TextOptions {
    time?: number;
    last?: number;
    fade?: number;
}
