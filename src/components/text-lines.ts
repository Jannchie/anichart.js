import { DefaultFontOptions, Fontable } from "./../options/font-options";
import { TextLinesOptions } from "../options/text-lines-options";
import { GroupComponent } from "./group";
import { Text } from "./Text";
import * as _ from "lodash";
export class TextLines extends GroupComponent implements Fontable {
  components: Text[] = [];
  lineSpacing: number = 4;
  fillStyle: string | CanvasGradient | CanvasPattern;
  constructor(options: TextLinesOptions) {
    super(options);
    this.reset(options);
  }
  reset(options?: TextLinesOptions) {
    super.reset(options);
    let offset = 0;
    if (this.components) {
      this.components.forEach((c) => {
        let font = _.merge({}, new DefaultFontOptions(), this.font, c.font);
        let fontSize = font.fontSize ? font.fontSize : this.font.fontSize;
        let fillStyle = c.fillStyle ? c.fillStyle : this.fillStyle;
        offset += this.lineSpacing + fontSize;
        c.pos = this.pos;
        c.font = font;
        c.fillStyle = fillStyle;
        c.offset = { x: 0, y: offset };
      });
    }
  }
}
