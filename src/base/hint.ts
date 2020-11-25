import * as d3 from "d3";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { ImageLoader } from "./../image-loader";

type DrawHint = (msg: string) => void;
export interface Hinter {
  hint: string;
  ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
  drawHint: DrawHint;
}

export class DefaultHinter implements Hinter {
  canvas: HTMLCanvasElement;
  imageLoader: ImageLoader;
  constructor(ctx?: EnhancedCanvasRenderingContext2D) {
    this.ctx = ctx;
    this.imageLoader = new ImageLoader();
  }
  hint: string;
  ctx: EnhancedCanvasRenderingContext2D;
  height: number;
  public async drawHint(msg: string) {
    if (!this.canvas) {
      this.canvas = d3.select("canvas").node() as HTMLCanvasElement;
    }
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = "#1E1E1E";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
      this.ctx.save();
      this.ctx.drawImage(
        await this.imageLoader.load(
          "https://github.com/Jannchie/anichart.js/blob/master/public/image/ANI.png?raw=true"
        ),
        this.canvas.width - 120,
        this.canvas.height - 100,
        100,
        100
      );
      this.ctx.font = `${18}px Sarasa Mono SC`;
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillText(msg, 20, 38);
      this.ctx.restore();
    }
    this.hint = msg;
    // tslint:disable-next-line:no-console
    console.log(msg);
  }
}
export interface Hintable {
  hinter: Hinter;
}
