import { Component } from "./Component";
export declare class Path extends Component {
    readonly type? = "Line";
    path: Path2D | string;
    constructor(options?: Path);
}
