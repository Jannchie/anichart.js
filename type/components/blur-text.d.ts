import { BlurTextOptions } from "../options/blur-text-options";
import { FadeText } from "./fade-text";
export declare class BlurText extends FadeText {
    blur: number;
    constructor(options: BlurTextOptions);
    update(options?: BlurTextOptions): void;
    preRender(): void;
    render(): void;
}
