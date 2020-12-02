export function addFrameToFFmpeg(ffmpeg: any, canvas: any, frame: any, name?: string, qulity?: number): Promise<void>;
export function outputMP4(ffmpeg: any, fps: any, name?: string): Promise<void>;
export function pngToMp4(pngPath: any, name: any, fps: any, thread?: number): Promise<void>;
export const ffmpeg: any;
