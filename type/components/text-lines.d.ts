import { Fontable } from "../options/font-options";
import { TextLinesOptions } from "../options/text-lines-options";
import { GroupComponent } from "./group";
import { Text } from "./Text";
export declare class TextLines extends GroupComponent implements Fontable {
  components: Text[];
  lineSpacing: number;
  fillStyle: string | CanvasGradient | CanvasPattern;
  constructor(options: TextLinesOptions);
  update(options?: TextLinesOptions): void;
}
