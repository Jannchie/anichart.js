export declare class Recourse {
    setup(): Promise<any[]>;
    private imagesPromise;
    images: Map<string, CanvasImageSource>;
    private dataPromise;
    data: Map<string, any>;
    loadImage(path: string, name?: string): void;
    loadCSV(path: string | any, name: string): void;
    loadJSON(path: string | any, name: string): void;
}
export declare const recourse: Recourse;
