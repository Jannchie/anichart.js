import { Component } from "./Component";
export declare class Rect extends Component {
    readonly type? = "Rect";
    shape?: {
        width: number;
        height: number;
    };
    radius?: number;
    clip?: boolean;
    constructor(rect?: Rect);
}
