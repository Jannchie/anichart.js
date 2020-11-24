import { Hintable } from "./hint";
import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { Colorable } from "./colorable";
import { Combinable } from "./combinable";
import { Shape } from "./Shape";

export interface Renderer extends Colorable, Combinable, Hintable {
  shape: Shape;
  canvas: HTMLCanvasElement;
  ctx: EnhancedCanvasRenderingContext2D;
  draw(): void;
  setCanvas(selector?: string): EnhancedCanvasRenderingContext2D;
}
