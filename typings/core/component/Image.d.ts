import { BaseCompOptions, Component } from "./Component";
export interface ImageOptions extends BaseCompOptions {
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
    src: string;
}
export declare class Image extends Component {
    readonly type = "Image";
    src: string;
    slicePosition: {
        x: number;
        y: number;
    };
    sliceShape: {
        width: number;
        height: number;
    };
    shape: {
        width: number;
        height: number;
    };
    constructor(options?: ImageOptions);
}
