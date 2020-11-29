import { FadeText } from "./fade-text";
import { RiseTextOptions } from "../options/rise-text-options";
declare class RiseText extends FadeText {
    offsetYFunc: (sec: number) => number;
    private offsetY;
    reverse: any;
    constructor(options: RiseTextOptions);
    update(): void;
    preRender(): void;
    render(): void;
}
export { RiseText };
