import { BaseOptions } from "./BaseOptions";
export interface ImageComponentOptions extends BaseOptions {
    imagePath?: string;
    shape?: {
        width: number;
        height: number;
    };
}
