declare type LoadImageFunc = (url: string) => Promise<CanvasImageSource | null>;
export declare class ImageLoader {
    load: LoadImageFunc;
    constructor();
}
export declare const imageLoader: ImageLoader;
export {};
