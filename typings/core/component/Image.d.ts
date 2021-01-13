import { Component } from "./Component";
export declare class Image extends Component {
    readonly type? = "Image";
    path?: string;
    slicePosition?: {
        x: number;
        y: number;
    };
    sliceShape?: {
        width: number;
        height: number;
    };
    shape?: {
        width: number;
        height: number;
    };
    constructor(image?: Image);
}
