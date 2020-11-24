import { BaseOptions } from "./../options/base-options";
import { Base } from "./base";
export interface ImageComponentOptions extends BaseOptions {
    imagePath?: string;
    shape?: {
        width: number;
        height: number;
    };
}
export declare class ImageComponent extends Base {
    image: CanvasImageSource;
    imagePath: string;
    private imageLoader;
    shape: {
        width: number;
        height: number;
    };
    constructor(options: ImageComponentOptions);
    update(options?: ImageComponentOptions): Promise<void>;
    render(): void;
}
