import { BaseCompOptions, Component } from "./Component";
export interface PathOptions extends BaseCompOptions {
    path?: Path2D | string | null | undefined;
}
export declare class Path extends Component {
    readonly type = "Line";
    path: Path2D | string | null | undefined;
    constructor(options?: PathOptions);
}
