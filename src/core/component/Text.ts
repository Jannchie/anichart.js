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
export class Text extends Component {
  readonly type? = "Text";
  constructor(text?: string) {
    super();
    this.text = text;
  }
  text?: string = "";
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  fontVariant?: FontVariant;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  fontSize?: number;
  font?: string;
  get fontStr() {
    return `${this.fontStyle ? this.fontStyle : ""} ${
      this.fontVariant ? this.fontVariant : ""
    } ${this.fontWeight ? this.fontWeight : ""} ${
      this.fontSize ? this.fontSize : 16
    }px ${this.font ? this.font : ""}`;
  }
}
