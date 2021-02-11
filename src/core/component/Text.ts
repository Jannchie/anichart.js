import { font } from "../..";
import { Component } from "./Component";
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
export class Text extends Component {
  readonly type? = "Text";
  constructor(text?: Text) {
    super(text);
    if (text) {
      this.text = text.text;
      this.textAlign = text.textAlign ?? "center";
      this.textBaseline = text.textBaseline ?? "middle";
      this.fontVariant = text.fontVariant;
      this.fontWeight = text.fontWeight;
      this.font = text.font;
      this.fontStyle = text.fontStyle;
      this.fontSize = text.fontSize;
    }
  }
  text?: string = "";
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
  fontVariant?: FontVariant;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  fontSize?: number = 24;
  font?: string = font;
}
