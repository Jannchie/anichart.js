export interface ShadowOptions {
    enable?: boolean;
    color?: string;
    blur?: number;
    offset?: {
        x: number;
        y: number;
    };
    fillColor?: string | CanvasGradient | CanvasPattern;
    strokeColor?: string | CanvasGradient | CanvasPattern;
}
export interface BaseCompOptions {
    shadow?: ShadowOptions;
    center?: {
        x: number;
        y: number;
    };
    position?: {
        x: number;
        y: number;
    };
    offset?: {
        x: number;
        y: number;
    };
    scale?: {
        x: number;
        y: number;
    };
    children?: Component[];
    alpha?: number;
    filter?: string;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    lineWidth?: number;
}
export declare class Component {
    type: string;
    shadow: ShadowOptions;
    center: {
        x: number;
        y: number;
    };
    position: {
        x: number;
        y: number;
    };
    offset: {
        x: number;
        y: number;
    };
    scale: {
        x: number;
        y: number;
    };
    children: (Component | null)[];
    alpha: number;
    filter: string;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    setup(): void;
    addChild(comp: Component | null): void;
    constructor(options?: BaseCompOptions);
}
