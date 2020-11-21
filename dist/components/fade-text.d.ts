import { FadeTextOptions } from "../options/fade-text-options";
import { Text } from "./text";
declare class FadeText extends Text {
    constructor(options: FadeTextOptions);
    reset(options: FadeTextOptions): void;
}
export { FadeText };
