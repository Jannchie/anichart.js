export declare class Recourse {
    setup(): Promise<any[]>;
    private imagesPromise;
    images: Map<string, CanvasImageSource>;
    private dataPromise;
    data: Map<string, any>;
    loadImage(path: string, name?: string): Promise<CanvasImageSource>;
    loadCSV(path: string | any, name: string): Promise<import("d3-dsv").DSVRowArray<string>>;
    loadJSON(path: string | any, name: string): Promise<unknown>;
}
export declare const recourse: Recourse;
