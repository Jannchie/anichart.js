import { DSVRowArray } from "d3-dsv";
export declare class Recourse {
    setup(): Promise<any[]>;
    private imagesPromise;
    images: Map<string, CanvasImageSource>;
    private dataPromise;
    data: Map<string, DSVRowArray<string>>;
    loadImage(path: string, name?: string): void;
    loadData(path: string | any, name: string): void;
}
export declare const recourse: Recourse;
