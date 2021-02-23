import { BaseCompOptions, Component } from "./Component";
export interface ArcOptions extends BaseCompOptions {
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    anticlockwise?: boolean;
}
export declare class Arc extends Component {
    readonly type = "Arc";
    radius: number;
    startAngle: number;
    endAngle: number;
    anticlockwise: boolean;
    constructor(options?: ArcOptions);
}
