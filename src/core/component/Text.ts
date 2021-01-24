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
      if (text.text) this.text = text.text;
      if (text.textAlign) this.textAlign = text.textAlign;
      if (text.textBaseline) this.textBaseline = text.textBaseline;
      if (text.fontVariant) this.fontVariant = text.fontVariant;
      if (text.fontWeight) this.fontWeight = text.fontWeight;
      if (text.font) this.font = text.font;
      if (text.fontStyle) this.fontStyle = text.fontStyle;
      if (text.fontSize) this.fontSize = text.fontSize;
    }
  }
  text?: string = "";
  textAlign?: TextAlign;
  textBaseline?: TextBaseline;
  fontVariant?: FontVariant;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  fontSize?: number = 24;
  font?: string = "sans-serif";
}
