import { FadeTextOptions } from "../options/fade-text-options";
import { Text } from "./text";
declare class FadeText extends Text {
    time: number;
    fade: number;
    last: number;
    constructor(options: FadeTextOptions);
    update(options?: FadeTextOptions): void;
}
export { FadeText };
