import { Component } from "./Component";
export declare class Arc extends Component {
    readonly type? = "Arc";
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    anticlockwise?: boolean;
    constructor(options?: Arc);
}
