import { Text } from "./text";
import { FadeTextOptions } from "./fade-text-options";
declare class FadeText extends Text {
    constructor(options: FadeTextOptions);
    reset(options: FadeTextOptions): void;
}
export { FadeText };
