interface LoadImageFunc {
    (url: string): Promise<CanvasImageSource>;
}
export declare class ImageLoader {
    load: LoadImageFunc;
    constructor();
}
export {};
