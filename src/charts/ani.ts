import { Component } from "../components/index";

interface Ani {
  width: number;
  height: number;
  fps: number;
  sec: number;
  totalFrames: number;
  components: Component[];

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  output: boolean;

  setOptions(options: Ani): void;
  calOptions(): void;

  setCanvas(selector: string): void;

  ready(): void;
  draw(frame: number): void;
  play(): void;
}

export default Ani;
