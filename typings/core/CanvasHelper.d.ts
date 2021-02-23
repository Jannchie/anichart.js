import { CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
export declare class CanvasHelper {
    isPointInPath(area: Path2D | string, x: number, d: number): any;
    renderer: CanvasRenderer;
    constructor();
    measure<T extends Component>(c: T): TextMetrics;
    private measureText;
}
export declare const canvasHelper: CanvasHelper;
