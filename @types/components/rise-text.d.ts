import { FadeText } from "./fade-text";
import { RiseTextOptions } from "../options/rise-text-options";
declare class RiseText extends FadeText {
    offsetYFunc: Function;
    private offsetY;
    constructor(options: RiseTextOptions);
    update(options?: RiseTextOptions): void;
    preRender(): void;
    render(): void;
}
export { RiseText };
