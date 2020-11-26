import Pos from "../types/position";
export interface ShadowOptions {
    enable?: boolean;
    color?: string;
    blur?: number;
    offset?: Pos;
}
export declare class DefaultShadowOptions implements ShadowOptions {
    enable: boolean;
    color: string;
    blur: number;
    offset: Pos;
}
export interface Shadowable {
    shadow: ShadowOptions;
}
//# sourceMappingURL=shadow-options.d.ts.map