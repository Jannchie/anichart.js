import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Colorable } from "../interface/colorable";
import { Combinable } from "./combinable";
import { Shape } from "../types/shape";
import { Hintable } from "./hintable";

export interface Renderer extends Colorable, Combinable, Hintable {
  shape: Shape;
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  draw(): void;
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
}
