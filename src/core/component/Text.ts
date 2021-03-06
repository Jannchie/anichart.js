import { fontSize, font } from "./../Constant";
import { BaseCompOptions, Component } from "./Component";
export type FontWeight =
  | "normal"
  | "bold"
  | "bolder"
  | "lighter"
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;
export type FontVariant = "normal" | "small-caps";
export type FontStyle = "normal" | "italic" | "oblique";
export type TextBaseline = CanvasTextBaseline;
export type TextAlign = CanvasTextAlign;
export interface TextOptions extends BaseCompOptions {
  text?: string;
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
  fontVariant?: FontVariant;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  fontSize?: number;
  font?: string;
}
export class Text extends Component {
  readonly type = "Text";
  constructor(options?: TextOptions) {
    super(options);
    if (options) {
      this.text = options.text ?? "";
      this.textAlign = options.textAlign ?? "center";
      this.textBaseline = options.textBaseline ?? "middle";
      this.fontVariant = options.fontVariant ?? "normal";
      this.fontWeight = options.fontWeight ?? "normal";
      this.font = options.font ?? font;
      this.fontStyle = options.fontStyle ?? "normal";
      this.fontSize = options.fontSize ?? fontSize;
      this.fillStyle = options.fillStyle ?? "#888";
    }
  }
  text: string = "";
  textAlign: TextAlign;
  textBaseline: TextBaseline;
  fontVariant: FontVariant;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  fontSize: number = 24;
  font: string = font;
}
