export declare const ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg;
export declare function addFrameToFFmpeg(canvas: HTMLCanvasElement, frame: number, name?: string, qulity?: number): Promise<void>;
export declare function outputMP4(fps: any, name?: string, thread?: number): Promise<void>;
export declare function pngToMp4(pngPath: any, name: any, fps: any, thread?: number): Promise<void>;
