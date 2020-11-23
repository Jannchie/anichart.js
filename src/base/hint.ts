import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";

interface DrawHint {
  (msg: string): void;
}
export interface Hinter {
  hint: string;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
  drawHint: DrawHint;
}

export class DefaultHinter implements Hinter {
  hint: string;
  ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
  width: number;
  height: number;
  public drawHint(msg: string) {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = "#1E1E1E";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.restore();
      this.ctx.save();
      this.ctx.font = `${18}px Sarasa Mono SC`;
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillText(msg, 20, 38);
      this.ctx.restore();
    }
    this.hint = msg;
    console.log(msg);
  }
}
export interface Hintable {
  hinter: Hinter;
}
