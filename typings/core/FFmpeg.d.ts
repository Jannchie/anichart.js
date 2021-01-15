export declare type Preset = "ultrafast" | "superfast" | "veryfast" | "faster" | "fast" | "medium" | "slow" | "slower" | "veryslow" | "placebo ";
export declare const ffmpeg: import("@ffmpeg/ffmpeg").FFmpeg;
export declare function addFrameToFFmpeg(canvas: HTMLCanvasElement, frame: number, name?: string, qulity?: number): Promise<void>;
export declare function removePNG(list: string[]): void;
export declare function outputMP4(fps: any, name?: string, preset?: Preset, tune?: string): Promise<void>;
