import * as d3 from "d3";
import { Ani } from "./ani/Ani";
import { CanvasRenderer } from "./CanvasRenderer";
import { Component } from "./component/Component";
export declare class Stage {
  aniRoot: Ani;
  compRoot: Component;
  renderer: CanvasRenderer;
  options: {
    sec: number;
    fps: number;
  };
  outputOptions: {
    fileName: string;
    splitSec: number;
  };
  interval: d3.Timer;
  output: boolean;
  outputConcurrency: number;
  mode: string;
  private cFrame;
  get frame(): number;
  set frame(val: number);
  get sec(): number;
  set sec(val: number);
  get totalFrames(): number;
  get canvas(): HTMLCanvasElement;
  constructor(canvas?: HTMLCanvasElement);
  addChild(child: Ani | Component): void;
  render(sec: number): void;
  loadRecourse(): Promise<any[]>;
  play(): void;
  private doPlay;
  setup(): void;
  private preRender;
  private setupChildren;
}
