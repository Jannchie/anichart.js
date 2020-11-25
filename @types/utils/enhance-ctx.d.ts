import { FontOptions } from "./../options/font-options";
interface EnhancedCanvasRenderingContext2D extends CanvasRenderingContext2D {
    drawClipedImg(img: CanvasImageSource, x: number, y: number, imgH: number, imgW: number, r: number): void;
    radiusArea(l: number, t: number, w: number, h: number, r: number): void;
    fillRadiusRect(l: number, t: number, w: number, h: number, r: number): void;
    fillCircle(x: number, y: number, r: number): void;
    setFontOptions(font: FontOptions): void;
}
export declare function enhanceCtx(ctx: any): EnhancedCanvasRenderingContext2D;
export { EnhancedCanvasRenderingContext2D };
