import { BaseComponent } from "./base-component";
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
    update(options?: ImageComponentOptions): Promise<void>;
    render(): void;
}
