import { BaseOptions } from "./base-options";
export interface ImageComponentOptions extends BaseOptions {
    imagePath?: string;
    shape?: {
        width: number;
        height: number;
    };
}
