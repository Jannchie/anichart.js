import { Player } from "../interface";
interface RecorderInterface {
    player: Player;
    addFrame(frame: number): void;
    addCurrentFrame(): void;
}
export declare class Recorder implements RecorderInterface {
    player: Player;
    ffmpeg: any;
    constructor(player: Player);
    addFrame(frame: number): void;
    addCurrentFrame(): void;
}
export {};
