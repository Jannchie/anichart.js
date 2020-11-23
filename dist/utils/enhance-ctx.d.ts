interface EnhancedCanvasRenderingContext2D extends CanvasRenderingContext2D {
    drawClipedImg(img: CanvasImageSource, x: number, y: number, imageHeight: number, imageWidth: number, r: number): void;
    radiusArea(left: number, top: number, w: number, h: number, r: number): void;
    fillRadiusRect(left: number, top: number, w: number, h: number, r: number): void;
    fillCircle(x: number, y: number, r: number): void;
}
export declare function enhanceCtx(ctx: any): EnhancedCanvasRenderingContext2D;
export { EnhancedCanvasRenderingContext2D };
