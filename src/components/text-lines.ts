import { TextLinesOptions } from "../options/text-lines-options";
import Position from "../utils/position";
import { Group } from "./group";
import { Text } from "./Text";
export class TextLines extends Group {
  components: Text[];
  lineHeight: number;
  constructor(options: TextLinesOptions) {
    super(options);
  }
  reset(options: TextLinesOptions) {
    super.reset(options);
    this.lineHeight = options.lineHeight;
  }
  preRender(n: number) {
    super.preRender(n);
    this.components.forEach((c, i) => {
      c._pos = <Position>this.getValue(this.pos, n);
      c._pos.y += this.lineHeight;
    });
  }
}
