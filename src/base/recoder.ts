import { addFrameToFFmpeg, ffmpeg } from "../ffmpeg";
import { Player } from "../interface";
interface RecorderInterface {
  player: Player;
  addFrame(frame: number): void;
  addCurrentFrame(): void;
}
export class Recorder implements RecorderInterface {
  player: Player;
  ffmpeg: any;
  constructor(player: Player) {
    this.player = player;
    this.ffmpeg = ffmpeg;
  }
  addFrame(frame: number): void {
    addFrameToFFmpeg(ffmpeg, this.player.renderer.canvas);
  }
  addCurrentFrame(): void {
    throw new Error("Method not implemented.");
  }
}
