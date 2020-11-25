import { EnhancedCanvasRenderingContext2D } from "../utils/enhance-ctx";
import { DrawHint } from "../default/default-hinter";

export interface Hinter {
  hint: string;
  ctx: CanvasRenderingContext2D | EnhancedCanvasRenderingContext2D;
  drawHint: DrawHint;
}
