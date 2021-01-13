import { Component } from "./Component";
export declare class Line extends Component {
    readonly type? = "Line";
    path: Path2D;
    constructor(options?: Line);
}
