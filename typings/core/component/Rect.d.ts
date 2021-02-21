import { BaseCompOptions, Component } from "./Component";
export interface RectOptions extends BaseCompOptions {
    shape?: {
        width: number;
        height: number;
    };
    radius?: number;
    clip?: boolean;
}
export declare class Rect extends Component {
    readonly type = "Rect";
    shape: {
        width: number;
        height: number;
    };
    radius: number;
    clip: boolean;
    constructor(rect?: RectOptions);
}
