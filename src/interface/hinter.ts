import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { DrawHint } from "../default/DefaultHinter";

export interface Hinter {
  hint: string;
  ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
  drawHint: DrawHint;
}
