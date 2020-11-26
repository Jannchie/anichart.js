import { FontOptions } from "./font-options";
import { BaseOptions } from "./base-options";
export interface TextOptions extends BaseOptions {
    text?: string | ((n: number) => string);
    fillStyle?: string | CanvasGradient | CanvasPattern;
    font?: FontOptions;
}
//# sourceMappingURL=text-options.d.ts.map