import { FadeText } from "./fade-text";
import { RiseTextOptions } from "../options/rise-text-options";
declare class RiseText extends FadeText {
    offsetYFunc: Function;
    private offsetY;
    constructor(options: RiseTextOptions);
    reset(options: RiseTextOptions): void;
    preRender(n: number): void;
    render(n: number): void;
}
export { RiseText };
