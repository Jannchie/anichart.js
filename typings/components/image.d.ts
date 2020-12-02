import { BaseComponent } from "./BaseComponent";
import { ImageComponentOptions } from "../options/image-component-options";
export declare class ImageComponent extends BaseComponent {
    image: CanvasImageSource;
    imagePath: string;
    private imageLoader;
    shape: {
        width: number;
        height: number;
    };
    private loading;
    constructor(options: ImageComponentOptions);
    update(): Promise<void>;
    render(): void;
}
