import { FadeText } from "./fade-text";
import { RiseTextOptions } from "./rise-text-options";
declare class RiseText extends FadeText {
    offset: Function;
    private _offset;
    constructor(options: RiseTextOptions);
    reset(options: RiseTextOptions): void;
    preRender(n: number): void;
    render(n: number): void;
}
export { RiseText };
