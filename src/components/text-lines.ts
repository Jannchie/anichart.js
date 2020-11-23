import { TextLinesOptions } from "../options/text-lines-options";
import { Group } from "./group";
import { Text } from "./Text";
export class TextLines extends Group {
  components: Text[] = [];
  lineSpacing: number;
  fontSize: number;
  font: string;
  fillStyle: string | CanvasGradient | CanvasPattern;
  constructor(options: TextLinesOptions) {
    super(options);
    this.reset(options);
  }
  reset(options: TextLinesOptions) {
    super.reset(options);
    if (options.lineSpacing) {
      this.lineSpacing = options.lineSpacing;
    }
    let offset = 0;
    if (this.components) {
      this.components.forEach((c) => {
        let fontSize = c.fontSize ? c.fontSize : this.fontSize;
        let font = c.font ? c.font : this.font;
        let fillStyle = c.fillStyle ? c.fillStyle : this.fillStyle;
        offset += this.lineSpacing + fontSize;
        c.pos = this.pos;
        c.font = font;
        c.fontSize = fontSize;
        c.fillStyle = fillStyle;
        c.offset = { x: 0, y: offset };
      });
    }
  }
}
